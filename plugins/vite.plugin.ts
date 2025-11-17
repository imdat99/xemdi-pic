import { webToNodeHandler } from "@hiogawa/utils-node";
import assert from "node:assert";
import { pathToFileURL } from "node:url";
import path from "path";
import {
    PluginOption,
    RunnableDevEnvironment,
    type Manifest,
    type Plugin
} from "vite";
let browserManifest: Manifest;
let clientReferences: Record<string, string> = {}; // TODO: normalize id
export default function viteSSRPlugin(): PluginOption[] {
  return [
    {
      name: "ssr-middleware",
      configureServer(server) {
        const ssrRunner = (server.environments.ssr as RunnableDevEnvironment)
          .runner;
        return () => {
          server.middlewares.use(async (req, res, next) => {
            function handlerError(error: unknown) {
              console.error(error);
              res.write("Internal server error");
              res.statusCode = 500;
              res.end();
            }
            try {
              const mod: any = await ssrRunner.import("/src/index.ts");
              webToNodeHandler((mod as any).default.fetch)(
                req,
                res,
                handlerError
              );
            } catch (e) {
              next(e);
            }
          });
        };
      },
      async configurePreviewServer(server) {
        const mod = await import(
          pathToFileURL(path.resolve("./dist/ssr/index.js")).href
        );
        return () => {
          server.middlewares.use(async (req, res, next) => {
            try {
              webToNodeHandler((mod as any).default.fetch)(
                req,
                res,
                (error: unknown) => {
                  console.error(error);
                  res.write("Internal server error");
                  res.statusCode = 500;
                  res.end();
                }
              );
              // await mod.default(req, res);
            } catch (e) {
              next(e);
            }
          });
        };
      },
    },
    createVirtualPlugin("ssr-assets", function () {
      assert(this.environment.name === "ssr");
      let bootstrapModules: string[] = [];
      if (this.environment.mode === "dev") {
        bootstrapModules = ["/@id/__x00__virtual:browser-entry"];
      }
      if (this.environment.mode === "build") {
        bootstrapModules = [browserManifest["virtual:browser-entry"].file];
      }
      return `export const bootstrapModules = ${JSON.stringify(
        bootstrapModules
      )}`;
    }),
    createVirtualPlugin("browser-entry", function () {
      if (this.environment.mode === "dev") {
        return `
					import "/@vite/client";
					import RefreshRuntime from "/@react-refresh";
					RefreshRuntime.injectIntoGlobalHook(window);
					window.$RefreshReg$ = () => {};
					window.$RefreshSig$ = () => (type) => type;
					window.__vite_plugin_react_preamble_installed__ = true;
					await import("/src/entry.client.tsx");
				`;
      } else {
        return `import "/src/entry.client.tsx";`;
      }
    }),
    {
      name: "misc",
      hotUpdate(ctx) {
        if (this.environment.name === "rsc") {
          const ids = ctx.modules
            .map((mod) => mod.id)
            .filter((v) => v !== null);
          if (ids.length > 0) {
            // client reference id is also in react server module graph,
            // but we skip RSC HMR for this case since Client HMR handles it.
            if (!ids.some((id) => id in clientReferences)) {
              ctx.server.environments.client.hot.send({
                type: "custom",
                event: "react-server:update",
                data: {
                  file: ctx.file,
                },
              });
            }
          }
        }
      },
      writeBundle(_options, bundle) {
        if (this.environment.name === "client") {
          const output = bundle[".vite/manifest.json"];
          assert(output.type === "asset");
          assert(typeof output.source === "string");
          browserManifest = JSON.parse(output.source);
        }
      },
    },
    // {
    //     name: "update-config",
    //     config(config, env) {
    //         return {
    //             ...config,
    //             builder: {
    //                 ...config.builder,
    //                 sharedPlugins: true,
    //                 async buildApp(builder) {
    //                     await builder.build(builder.environments.client);
    //                     await builder.build(builder.environments.ssr);
    //                 }
    //             }
    //         }
    //     }
    // }
    {
      name: 'vite-plugin-check-css',
      apply: 'build',
      generateBundle(_, bundle) {
        for (const [fileName, chunk] of Object.entries(bundle)) {
        if (fileName.endsWith('.css')) {
          let css = (chunk as any).source.toString();
          css = css.replace(/--un-/g, '--eco-');
          (chunk as any).source = css;
        }
      }
      }
    }
  ];
}
function createVirtualPlugin(name: string, load: Plugin["load"]): PluginOption {
  name = "virtual:" + name;
  return {
    name: `virtual-${name}`,
    resolveId(source, _importer, _options) {
      return source === name ? "\0" + name : undefined;
    },
    load(id, options) {
      if (id === "\0" + name) {
        return (load as Function).apply(this, [id, options]);
      }
    },
  } satisfies Plugin;
}
