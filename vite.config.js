import fs from 'node:fs'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {VitePWA} from 'vite-plugin-pwa'

const version = fs.readFileSync('./VERSION', 'utf-8').trim()

export default defineConfig({
    define: {
        __APP_VERSION__: JSON.stringify(version)
    },
    plugins: [
        vue(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: false
        })
    ]
})