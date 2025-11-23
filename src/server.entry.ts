import type { HonoVarTypes } from "@/types";
import { createHead, renderSSRHead } from "@unhead/vue/server";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { contextStorage } from "hono/context-storage";
import { cors } from "hono/cors";
import { streamText } from "hono/streaming";
import { renderToWebStream } from "vue/server-renderer";
import { createApp } from "./main";
import { bootstrapModules } from "virtual:ssr-assets";
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
	await router.push(url.pathname);
	await router.isReady();
	// console.log(router.getMatchedComponents())
	return streamText(c, async (stream) => {
		c.header("Content-Type", "text/html; charset=UTF-8");
		c.header("Content-Encoding", "Identity");
		const ctx = {};
		const appStream = renderToWebStream(vueApp, ctx);
		await stream.write("<!DOCTYPE html><html lang='en'><head>");
		await stream.write("<base href='" + url.origin + "'/>");
		await renderSSRHead(head).then((headString) => stream.write(headString.headTags.replace(/\n/g, "")));
		await stream.write(`<link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"rel="stylesheet"></link>`);
		await stream.write(buildBootstrapScript());
		await stream.write("</head><body class='font-sans bg-[#f9fafd] text-gray-800 antialiased flex flex-col'>");
		await stream.pipe(appStream);
		let json = htmlEscape(JSON.stringify(JSON.stringify(ctx)));
		await stream.write(`<script>window.__SSR_STATE__ = JSON.parse(${json});</script>`);
		await stream.write("</body></html>");
		// console.log("ctx", ctx)
	});
});
console.log("app running");
// app.get('/', (c) => {
//   return c.render(<h1>Hello!</h1>)
// })

export default app;

const ESCAPE_LOOKUP: { [match: string]: string } = {
	"&": "\\u0026",
	">": "\\u003e",
	"<": "\\u003c",
	"\u2028": "\\u2028",
	"\u2029": "\\u2029",
};

const ESCAPE_REGEX = /[&><\u2028\u2029]/g;

function htmlEscape(str: string): string {
	return str.replace(ESCAPE_REGEX, (match) => ESCAPE_LOOKUP[match]);
}
/**
 * buildBootstrapScript, if isEntry is true, build script and link tags for bootstrap else is preload tags
 * @param chunks vite manifest chunks
 * @returns bootstrap script string <script>...</script>, <link>...</link> tags, preloaded as needed
 */
function buildBootstrapScript() {
	let script = "";
	let styles = "";
	bootstrapModules.forEach((chunk) => {
		if (chunk.isEntry) {
			script += `<script type="module" src="${chunk.file}"></script>`;
			(chunk.css || []).forEach((cssFile) => {
				styles += `<link rel="stylesheet" href="${cssFile}">`;
			});
		} else {
			script += `<link rel="modulepreload" href="${chunk.file}">`;
			(chunk.css || []).forEach((cssFile) => {
				styles += `<link rel="preload" as="style" href="${cssFile}">`;
			});
		}
	});
	return styles+script;
}