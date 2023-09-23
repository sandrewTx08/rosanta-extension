import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [preact()],
	build: {
		rollupOptions: {
			input: {
				popup: resolve(__dirname, "popup.html"),
				background: resolve(__dirname, "src", "background", "index.ts"),
			},
			output: {
				entryFileNames: "[name].js",
			},
		},
	},
});
