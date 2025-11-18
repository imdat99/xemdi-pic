import { useHead } from "@unhead/vue";
import { defineComponent } from "vue";
import { RouterView, useRoute } from "vue-router";
export default defineComponent(() => {
    const route = useRoute()
    useHead(route.meta);
    return () => <RouterView />;
})