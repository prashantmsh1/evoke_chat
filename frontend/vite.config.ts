import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: "/", // Ensure proper asset paths in production
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        outDir: "dist",
        sourcemap: false, // Disable sourcemaps in production for smaller builds
        rollupOptions: {
            output: {
                manualChunks: undefined, // Let Vite handle chunking automatically
            },
        },
    },
    server: {
        port: 5173,
        host: true, // Listen on all addresses for Docker/VPS
    },
    preview: {
        port: 4173,
        host: true, // Listen on all addresses
    },
});
