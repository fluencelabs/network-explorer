import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import svgr from 'vite-plugin-svgr'

export function capitalizeFirstLetter(word?: string) {
  if (!word) return ''
  return word.charAt(0).toUpperCase() + word.slice(1)
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      react({
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),
      svgr(),
      nodePolyfills(),
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html.replace(
            /<title>(.*?)<\/title>/,
            `<title>Fluence ${capitalizeFirstLetter(env.VITE_CHAIN || 'local')} Explorer </title>`,
          )
        },
      },
    ],
  }
})
