// import vi_VN from '@lethdat/semi-ui-vue/dist/locale/source/vi_VN'
import { createSSRApp, type Plugin } from 'vue'
import { RouterView } from 'vue-router'
import { withErrorBoundary } from './lib/hoc/withErrorBoundary'
import router from './routes'
// import { appComponents } from './components'
export function createApp(...userOptions: Plugin[]) {
    
    const app = createSSRApp(withErrorBoundary(RouterView))
    userOptions.forEach((option) => {
        app.use(option)
    })
    app.use(router)
    return { app, router }
}
// render().catch((error) => {
//     console.error('Error during app initialization:', error)
// })
