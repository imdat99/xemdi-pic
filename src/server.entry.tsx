import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { cors } from "hono/cors";
import { RedisClient } from "bun";
import type { JwtVariables } from 'hono/jwt'
import { contextStorage } from 'hono/context-storage';
import type { HonoVarTypes } from '@/types';
import { renderToWebStream } from 'vue/server-renderer'
import { createSSRApp } from 'vue'
import App from './App.vue';
import Root from './Root.vue';
import { streamText } from 'hono/streaming';
import { PassThrough } from 'stream';
import { createApp } from './app';
type SessionDataTypes = {
  'counter': number
}
// import { renderer } from './renderer'
const app = new Hono<HonoVarTypes>();
// const client = new RedisClient("redis://");
// await client.connect().then(() => {
//   console.log("Connected to Redis");
// }).catch((err) => {
//   console.error("Failed to connect to Redis", err);
// });
app.use(cors(), async (c, next) => {
  c.set("fetch", app.request.bind(app));
//   c.set("redis", client);
  // c.set("acmCampaignClient", acmCampaignClient);
  await next();
}, contextStorage());
const { app: vueApp, router } = await createApp();
app.use(serveStatic({ root: './public' }))
// app.use(i18nHonoMiddleware, renderer)
app.get('*', async (c) => {
  const url = new URL(c.req.url);
  console.log("Request URL:", url);
  await router.push(url);
  await router.isReady();
  return streamText(c, async (stream) => {
    c.header("Content-Type", "text/html; charset=UTF-8")
    c.header("Content-Encoding", "Identity")
	const appStream = renderToWebStream(vueApp);
    await stream.write("<!DOCTYPE html>");
	if(import.meta.env.DEV) {
		const decoder = new TextDecoder(); // tạo decoder 1 lần
		await stream.pipe(appStream.pipeThrough(new TransformStream({
			transform(chunk, controller) {
        	// decode liên tục (streaming)
				const text = decoder.decode(chunk, { stream: true });
				const modifiedText = text.replace(/<\/head>/g, `<script type="module" src="/@vite/client"></script><script type="module" src="/src/main.ts"></script></head>`);
				controller.enqueue(new TextEncoder().encode(modifiedText));
			},
		})));
	} 
	if (import.meta.env.PROD) {
		await stream.pipe(appStream);
	}
  })
});
console.log("app running");
// app.get('/', (c) => {
//   return c.render(<h1>Hello!</h1>)
// })

export default app