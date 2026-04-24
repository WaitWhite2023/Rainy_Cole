import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const apiProxyTarget =
  process.env.VITE_API_PROXY_TARGET || "http://localhost:3000";

export default defineConfig({
  plugins: [vue()],
  base: "/admin/",
  server: {
    host: "0.0.0.0",
    port: 5174,
    strictPort: true,
    proxy: {
      "/api": {
        target: apiProxyTarget,
        changeOrigin: true,
      },
      "/uploads": {
        target: apiProxyTarget,
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 5174,
    strictPort: true,
    allowedHosts: true,
  },
});
