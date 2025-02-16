// vite.config.js
import { defineConfig } from "file:///C:/Users/Dercio/Desktop/DRONLINE/dronline/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Dercio/Desktop/DRONLINE/dronline/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import babel from "file:///C:/Users/Dercio/Desktop/DRONLINE/dronline/frontend/node_modules/@rollup/plugin-babel/dist/es/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    babel({
      babelHelpers: "bundled",
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      include: ["src/**/*"]
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxEZXJjaW9cXFxcRGVza3RvcFxcXFxEUk9OTElORVxcXFxkcm9ubGluZVxcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcRGVyY2lvXFxcXERlc2t0b3BcXFxcRFJPTkxJTkVcXFxcZHJvbmxpbmVcXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0RlcmNpby9EZXNrdG9wL0RST05MSU5FL2Ryb25saW5lL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBiYWJlbCBmcm9tIFwiQHJvbGx1cC9wbHVnaW4tYmFiZWxcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIGJhYmVsKHtcbiAgICAgIGJhYmVsSGVscGVyczogXCJidW5kbGVkXCIsXG4gICAgICBleHRlbnNpb25zOiBbXCIuanNcIiwgXCIuanN4XCIsIFwiLnRzXCIsIFwiLnRzeFwiXSxcbiAgICAgIGluY2x1ZGU6IFtcInNyYy8qKi8qXCJdLFxuICAgIH0pLFxuICBdLFxuICBidWlsZDoge1xuICAgIHRhcmdldDogW1wiZXMyMDE1XCJdLCAvLyBFbnN1cmUgY29tcGF0aWJpbGl0eSB3aXRoIG9sZGVyIGJyb3dzZXJzXG4gIH0sXG59KVxuXG5cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1YsU0FBUyxvQkFBb0I7QUFDblgsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sV0FBVztBQUdsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsTUFDSixjQUFjO0FBQUEsTUFDZCxZQUFZLENBQUMsT0FBTyxRQUFRLE9BQU8sTUFBTTtBQUFBLE1BQ3pDLFNBQVMsQ0FBQyxVQUFVO0FBQUEsSUFDdEIsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVEsQ0FBQyxRQUFRO0FBQUE7QUFBQSxFQUNuQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
