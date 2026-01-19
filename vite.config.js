import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Yeni sürüm gelince otomatik güncelle
      includeAssets: ['icon.svg', 'manifest.json'], // Bu dosyaları kesinlikle sakla
      manifest: false, // Manifest'i biz elle (public klasöründe) oluşturduğumuz için burayı false yapıyoruz
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,txt}'], // Neleri önbelleğe alayım?
        runtimeCaching: [
          {
            // Google Fontları gibi dış kaynakları da önbellekle
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 1 Yıl sakla
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
})