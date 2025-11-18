// import vi_VN from '@lethdat/semi-ui-vue/dist/locale/source/vi_VN'
import 'uno.css';
// import { appComponents } from './components'
import { createApp } from './main';
// const router from './router'
import { createHead } from '@unhead/vue/client'
const head = createHead()
async function render() {
    
    const { app, router } = createApp(head);
    // app.use(appComponents)
    app.provide('head', head)
    router.isReady().then(() => {
        app.mount('body', true)
    })
}
render().catch((error) => {
    console.error('Error during app initialization:', error)
})
