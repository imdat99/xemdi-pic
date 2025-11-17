// import vi_VN from '@lethdat/semi-ui-vue/dist/locale/source/vi_VN'
import { createHead } from '@unhead/vue/client'
import 'uno.css'
import { createSSRApp } from 'vue'
import { RouterView } from 'vue-router'
// import { appComponents } from './components'
import { withErrorBoundary } from './lib/hoc/withErrorBoundary'
// const router from './router'
const head = createHead({
    init: [{
        titleTemplate: '%s | @anyweb.id',
    }]
  })
export async function createApp() {
    
    const router = await import('./routes').then((m) => m.default)
    const app = createSSRApp(withErrorBoundary(RouterView))
    app.use(head)
    app.use(router)
    // app.use(appComponents)
    // router.isReady().then(() => {
    //     app.mount('body')
    // })
    return { app, router }
}
// render().catch((error) => {
//     console.error('Error during app initialization:', error)
// })
