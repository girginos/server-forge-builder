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
          "hardware-cto": path.resolve(__dirname, "hardware/cto-sunucular/index.html"),
          "hardware-disk": path.resolve(__dirname, "hardware/disk/index.html"),
          "hardware-cpu": path.resolve(__dirname, "hardware/cpu/index.html"),
          "hardware-ram": path.resolve(__dirname, "hardware/ram/index.html"),
          "hardware-ethernet": path.resolve(__dirname, "hardware/ethernet-kartlari/index.html"),
          "hardware-switch": path.resolve(__dirname, "hardware/switch-router/index.html"),
          "hardware-kablo": path.resolve(__dirname, "hardware/kablo/index.html"),
          "hardware-anakart": path.resolve(__dirname, "hardware/anakart/index.html"),
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
