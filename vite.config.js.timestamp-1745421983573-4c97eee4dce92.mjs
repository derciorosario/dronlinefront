// vite.config.js
import { defineConfig } from "file:///C:/Users/Dercio/Desktop/DRONLINE/dronline/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Dercio/Desktop/DRONLINE/dronline/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import babel from "file:///C:/Users/Dercio/Desktop/DRONLINE/dronline/frontend/node_modules/@rollup/plugin-babel/dist/es/index.js";
import { VitePWA } from "file:///C:/Users/Dercio/Desktop/DRONLINE/dronline/frontend/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    babel({
      babelHelpers: "bundled",
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      include: ["src/**/*"]
    }),
    VitePWA({
      workbox: {
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024
        // 10 MB
      },
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Dr. Online",
        short_name: "Dr. Online",
        description: "Dr. Online",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ],
  build: {
    target: ["es2015"]
    // Ensure compatibility with older browsers
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxEZXJjaW9cXFxcRGVza3RvcFxcXFxEUk9OTElORVxcXFxkcm9ubGluZVxcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcRGVyY2lvXFxcXERlc2t0b3BcXFxcRFJPTkxJTkVcXFxcZHJvbmxpbmVcXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0RlcmNpby9EZXNrdG9wL0RST05MSU5FL2Ryb25saW5lL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBiYWJlbCBmcm9tIFwiQHJvbGx1cC9wbHVnaW4tYmFiZWxcIjtcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnXG5cblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIGJhYmVsKHtcbiAgICAgIGJhYmVsSGVscGVyczogXCJidW5kbGVkXCIsXG4gICAgICBleHRlbnNpb25zOiBbXCIuanNcIiwgXCIuanN4XCIsIFwiLnRzXCIsIFwiLnRzeFwiXSxcbiAgICAgIGluY2x1ZGU6IFtcInNyYy8qKi8qXCJdLFxuICAgIH0pLFxuICAgIFZpdGVQV0Eoe1xuICAgICAgd29ya2JveDoge1xuICAgICAgICBtYXhpbXVtRmlsZVNpemVUb0NhY2hlSW5CeXRlczogMTAgKiAxMDI0ICogMTAyNCAvLyAxMCBNQlxuICAgICAgfSxcbiAgICAgIHJlZ2lzdGVyVHlwZTogJ2F1dG9VcGRhdGUnLFxuICAgICAgaW5jbHVkZUFzc2V0czogWydmYXZpY29uLnN2ZycsICdmYXZpY29uLmljbycsICdyb2JvdHMudHh0JywgJ2FwcGxlLXRvdWNoLWljb24ucG5nJ10sXG4gICAgICBtYW5pZmVzdDoge1xuICAgICAgICBuYW1lOiAnRHIuIE9ubGluZScsXG4gICAgICAgIHNob3J0X25hbWU6ICdEci4gT25saW5lJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdEci4gT25saW5lJyxcbiAgICAgICAgdGhlbWVfY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICBkaXNwbGF5OiAnc3RhbmRhbG9uZScsXG4gICAgICAgIHN0YXJ0X3VybDogJy8nLFxuICAgICAgICBpY29uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogJ3B3YS0xOTJ4MTkyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzE5MngxOTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6ICdwd2EtNTEyeDUxMi5wbmcnLFxuICAgICAgICAgICAgc2l6ZXM6ICc1MTJ4NTEyJyxcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgdGFyZ2V0OiBbXCJlczIwMTVcIl0sIC8vIEVuc3VyZSBjb21wYXRpYmlsaXR5IHdpdGggb2xkZXIgYnJvd3NlcnNcbiAgfSxcbn0pXG5cblxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzVixTQUFTLG9CQUFvQjtBQUNuWCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQUl4QixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsTUFDSixjQUFjO0FBQUEsTUFDZCxZQUFZLENBQUMsT0FBTyxRQUFRLE9BQU8sTUFBTTtBQUFBLE1BQ3pDLFNBQVMsQ0FBQyxVQUFVO0FBQUEsSUFDdEIsQ0FBQztBQUFBLElBQ0QsUUFBUTtBQUFBLE1BQ04sU0FBUztBQUFBLFFBQ1AsK0JBQStCLEtBQUssT0FBTztBQUFBO0FBQUEsTUFDN0M7QUFBQSxNQUNBLGNBQWM7QUFBQSxNQUNkLGVBQWUsQ0FBQyxlQUFlLGVBQWUsY0FBYyxzQkFBc0I7QUFBQSxNQUNsRixVQUFVO0FBQUEsUUFDUixNQUFNO0FBQUEsUUFDTixZQUFZO0FBQUEsUUFDWixhQUFhO0FBQUEsUUFDYixhQUFhO0FBQUEsUUFDYixrQkFBa0I7QUFBQSxRQUNsQixTQUFTO0FBQUEsUUFDVCxXQUFXO0FBQUEsUUFDWCxPQUFPO0FBQUEsVUFDTDtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUSxDQUFDLFFBQVE7QUFBQTtBQUFBLEVBQ25CO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
