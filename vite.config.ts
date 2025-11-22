import {
  defineConfig,
  type Manifest,
  type ManifestChunk,
  type Plugin,
  type PluginOption,
} from "vite";
import path from "node:path";
import assert from "node:assert";
import vue from "@vitejs/plugin-vue";
import {
  vitePluginLogger,
  vitePluginSsrMiddleware,
} from "./plugins/vite-plugin-ssr-middleware";
import vueJSX from "@vitejs/plugin-vue-jsx";
import unocss from "unocss/vite";

// https://vite.dev/config/
let browserManifest: Manifest;
export default defineConfig((env) => ({
  plugins: [
    vue(),
    vueJSX(),
    unocss(),
    vitePluginLogger(),
    vitePluginSsrMiddleware({
      entry: "src/server.entry.ts",
      preview: path.resolve("dist/server/index.js"),
    }),
    createVirtualPlugin("ssr-assets", async function () {
      const bootstrapModules: ManifestChunk[] = [];
      if (this.environment.mode === "dev") {
        bootstrapModules.push({
          file: "/@vite/client",
          isEntry: true,
          css: [],
          imports: [],
          dynamicImports: [],
          assets: [],
        },{
          file: "/src/client.entry.ts",
          isEntry: true,
          css: [],
        })
      }
      if (this.environment.mode === "build") {
        this.fs.unlink("dist/public/index.html")
        const bundleFile = await this.fs
          .readFile("dist/public/.vite/manifest.json")
          .then((json) => {
            const clientManifest: Manifest = JSON.parse(json.toString());
            return Object.values(clientManifest).find((c) => c.isEntry);
          });
          bootstrapModules.push(bundleFile!);
      }
      return `export const bootstrapModules = ${JSON.stringify(
        bootstrapModules
      )}`;
    }),
  ],
  appType: "custom",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    manifest: true,
    outDir: env.isSsrBuild ? "dist/server" : "dist/public",
    emptyOutDir: true,
    ssr: env.isSsrBuild
  },
  //   builder: {
  //     sharedPlugins: true,
  //   }
}));
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
