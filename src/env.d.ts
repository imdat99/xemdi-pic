/// <reference types="vite/client" />
declare module 'virtual:ssr-assets' {
  export const bootstrapModules: import("vite").ManifestChunk[];
}