// import vi_VN from '@lethdat/semi-ui-vue/dist/locale/source/vi_VN'
import 'uno.css';
// import { appComponents } from './components'
import { createApp } from './app';
// const router from './router'

async function render() {
    
    const { app, router } = await createApp();
    // app.use(appComponents)
    router.isReady().then(() => {
        app.mount('body')
    })
}
render().catch((error) => {
    console.error('Error during app initialization:', error)
})
