import { createRouter, createWebHistory, type RouteRecordRaw, RouterView, createMemoryHistory } from "vue-router";
import { useHead, type ReactiveHead, type ResolvableValue } from "@unhead/vue";

type RouteData = RouteRecordRaw & {
    meta?: ResolvableValue<ReactiveHead>
    children?: RouteData[]
}
const routes: RouteData[] = [
        {
            path: "/",
            component: RouterView,
            meta: {
                title: "AnyWeb - support login with google, facebook, github",
                meta: [
                    {
                        name: "description",
                        content: "AnyWeb - support login with google, facebook, github"
                    }
                ]
            },
            children: [
                {
                    path: "",
                    name: "Dashboard",
                    beforeEnter: (to, from, next) => {
                        fetch('https://jsonplaceholder.typicode.com/todos/1').then(response => response.json())
                        .then(json => {
                            to.meta.fetchedData = json;
                            next();
                        })
                    },
                    // redirect: { name: "overview" },
                    component: () => import("./App.vue")
                    // meta: {
                    //     title: "Dashboard - AnyWeb",
                    //     meta: [
                    //         {
                    //             name: "description",
                    //             content: "Dashboard - AnyWeb - support login with google, facebook, github"
                    //         }
                    //     ]
                    // },
                    
                }
            ]
        },
        {
            path: "/:pathMatch(.*)*",
            name: "NotFound",
            meta: {
                title: "404 Not Found",
                meta: [
                    {
                        name: "description",
                        content: "The page you are looking for does not exist."
                    }
                ]
            },
            component: () => import("@/components/NotfoundPage.vue")
        }
    ];
const router = createRouter({
    history: import.meta.env.SSR
      ? createMemoryHistory()   // server
      : createWebHistory(),     // client
    routes
})
    router.afterEach((to) => {
//   const { t } = i18n
        console.log("to", to)
        useHead(to.meta)
    })
export default router;