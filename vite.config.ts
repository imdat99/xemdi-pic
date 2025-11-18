import { defineConfig, type Manifest } from "vite";
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
	{
      name: "misc",
	  writeBundle(_options, bundle) {
        if (env.command === "build" && !env.isSsrBuild) {
          const output = bundle[".vite/manifest.json"];
          assert(output.type === "asset");
          assert(typeof output.source === "string");
          browserManifest = JSON.parse(output.source);
        }
		else {
			console.log("asset output.source:", browserManifest);
			
		}
      },
	},
  ],
  appType: "custom",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
	manifest: true,
    outDir: env.isSsrBuild ? "dist/server" : "dist/client",
  },
//   builder: {
//     sharedPlugins: true,
//   }
}));
