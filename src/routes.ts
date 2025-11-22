import { type ReactiveHead, type ResolvableValue } from "@unhead/vue";
import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

type RouteData = RouteRecordRaw & {
  meta?: ResolvableValue<ReactiveHead>;
  children?: RouteData[];
};
const routes: RouteData[] = [
  {
    path: "/",
    component: () => import("./components/Root"),
    meta: {
      title: "AnyWeb - support login with google, facebook, github",
      meta: [
        {
          name: "description",
          content: "AnyWeb - support login with google, facebook, github",
        },
        // `<script type="module" src="/@vite/client"></script><script type="module" src="/src/client.entry.ts"></script>`
      ],
    },
    children: [
      {
        path: "",
        name: "Dashboard",
        // redirect: { name: "overview" },
        component: () => import("./App.vue"),
        meta: {
            title: "Dashboard - AnyWeb",
            meta: [
                {
                    name: "description",
                    content: "Dashboard - AnyWeb - support login with google, facebook, github"
                }
            ]
        },
      },
      {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        meta: {
          title: "404 Not Found",
          meta: [
            {
              name: "description",
              content: "The page you are looking for does not exist.",
            },
          ],
        },
        component: () => import("@/components/NotfoundPage.vue"),
      },
    ],
  },
];
const router = createRouter({
  history: import.meta.env.SSR
    ? createMemoryHistory() // server
    : createWebHistory(), // client
  routes,
});
export default router;
