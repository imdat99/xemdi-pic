import type { HonoVarTypes } from "@/types";
import { createHead, renderSSRHead } from "@unhead/vue/server";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { contextStorage } from "hono/context-storage";
import { cors } from "hono/cors";
import { streamText } from "hono/streaming";
import { renderToWebStream } from "vue/server-renderer";
import { createApp } from "./main";
import { getCurrentInstance } from "vue";
type SessionDataTypes = {
  counter: number;
};
// import { renderer } from './renderer'
const app = new Hono<HonoVarTypes>();
// const client = new RedisClient("redis://");
// await client.connect().then(() => {
//   console.log("Connected to Redis");
// }).catch((err) => {
//   console.error("Failed to connect to Redis", err);
// });
app.use(
  cors(),
  async (c, next) => {
    c.set("fetch", app.request.bind(app));
    //   c.set("redis", client);
    // c.set("acmCampaignClient", acmCampaignClient);
    await next();
  },
  contextStorage()
);
app.use(serveStatic({ root: "./public" }));
// app.use(i18nHonoMiddleware, renderer)
app.get("*", async (c) => {
  const url = new URL(c.req.url);
  const head = createHead();
  const { app: vueApp, router } = createApp(head);
  
  await router.push(url);
  await router.isReady();
  
  const matched = router.resolve(url).matched;
  // console.log(router.getMatchedComponents())
  return streamText(c, async (stream) => {
    c.header("Content-Type", "text/html; charset=UTF-8");
    c.header("Content-Encoding", "Identity");
    const ctx = {};
    const appStream = renderToWebStream(vueApp, ctx);
    await stream.write("<!DOCTYPE html><html lang='en'><head>");
    await renderSSRHead(head).then((headString) => stream.write(headString.headTags.replace(/\n/g, "")));
    await stream.write("</head><body>");
    await stream.pipe(appStream);
    await stream.write(`<script>window.__SSR_STATE__ = "__STATE__";</script>`);
    await stream.write("</body></html>");
    console.log("ctx", ctx)
  });
});
console.log("app running");
// app.get('/', (c) => {
//   return c.render(<h1>Hello!</h1>)
// })

export default app;
