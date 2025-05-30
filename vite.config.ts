import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  build: {
    outDir: "dist", // 输出目录
    sourcemap: false, // 生成 sourcemap
    minify: "terser", // 使用 terser 进行压缩
  },
  publicDir: "public",
  base: "/react-vite-temp/", // 打包路径
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"), // 使用 @ 作为 src 的别名
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: '@import "@/styles/variables.less";', // 全局变量文件，需要创建此文件
      },
    },
  },
  plugins: [
    react(),
    checker({
      typescript: true,
    }),
  ],
});
