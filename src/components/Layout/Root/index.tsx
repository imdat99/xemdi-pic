import { defineComponent } from "vue";
import Header from "./Header.vue";
import { RouterView } from "vue-router";

export default defineComponent(() => {
  return () => (
    <>
      <Header />
      <main class="flex flex-1 overflow-hidden">
        <div class="flex-1 overflow-auto p-4 bg-white rounded-lg mr-2 mb-2 h-[calc(100vh-64px-16px)]">
          <RouterView />
        </div>
      </main>
    </>
  );
}, { name: "LayoutRoot" });
