import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { seoPrerender } from "./plugins/seo-prerender";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  Object.assign(process.env, env);

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      seoPrerender(),
    ].filter(Boolean),
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "index.html"),
          hardware: path.resolve(__dirname, "hardware/index.html"),
          "hazir-paketler": path.resolve(__dirname, "hazir-paketler/index.html"),
          yapilandirici: path.resolve(__dirname, "yapilandirici/index.html"),
          colocation: path.resolve(__dirname, "colocation/index.html"),
          cloud: path.resolve(__dirname, "cloud/index.html"),
          leasing: path.resolve(__dirname, "leasing/index.html"),
          hakkimizda: path.resolve(__dirname, "hakkimizda/index.html"),
          iletisim: path.resolve(__dirname, "iletisim/index.html"),
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
