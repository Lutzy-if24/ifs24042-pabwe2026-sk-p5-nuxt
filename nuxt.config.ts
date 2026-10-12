import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import tailwindcss from "@tailwindcss/vite";

const customPort = Number(process.env.APP_PORT || process.env.PORT) || 3000;

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  telemetry: false,
  ssr: false,
  srcDir: "src/",
  pages: true,
  css: ["~/index.css"],
  modules: ["@pinia/nuxt"],
  vite: {
    plugins: [tailwindcss()],
    define: {
      DELCOM_BASEURL: JSON.stringify(process.env.VITE_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1"),
    },
    build: {
      chunkSizeWarningLimit: 1500,
    },
  },
  devServer: { port: customPort },
  nitro: {
    devPort: customPort,
    prerender: { routes: ["/auth/login", "/auth/register", "/200.html"], crawlLinks: false, failOnError: false },
  },
  hooks: {
    "nitro:init"(nitro) {
      nitro.hooks.hook("prerender:generate", (route) => {
        if (!route.fileName?.endsWith(".html") || !route.contents) return;
        const dir = join(nitro.options.buildDir, "dist", "client", "_nuxt");
        const css = new Map(readdirSync(dir).filter((f) => f.endsWith(".css")).map((f) => [f, readFileSync(join(dir, f), "utf8")]));
        route.contents = route.contents.replace(
          /<link rel="stylesheet" href="\/_nuxt\/([^"]+\.css)"[^>]*>/g,
          (m, file) => (css.has(file) ? `<style>${css.get(file)}</style>` : m),
        );
      });
    },
  },
  app: {
    head: {
      title: "Delcom Cash Flow - Catatan Arus Kas Pribadi",
      htmlAttrs: { lang: "id" },
      meta: [
        { name: "description", content: "Delcom Cash Flow: catat pemasukan dan pengeluaran, pantau saldo kas, tabungan, dan pinjaman dengan mudah." },
        { name: "theme-color", content: "#4338ca" },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/logo.svg" },
        { rel: "preload", as: "font", type: "font/woff2", href: "/fonts/plus-jakarta-sans-latin-wght-normal.woff2", crossorigin: "anonymous" },
      ],
      noscript: [{ innerHTML: "Aplikasi ini membutuhkan JavaScript untuk berjalan." }],
      bodyAttrs: { class: "bg-slate-50 text-slate-900 font-sans antialiased min-h-screen" },
    },
  },
});