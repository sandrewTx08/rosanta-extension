import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { resolve } from "path";
import { readFileSync } from "fs";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		preact(),
		{
			name: "browser-manifest",
			buildStart() {
				this.emitFile({
					type: "asset",
					fileName: "manifest.json",
					source: readFileSync(
						resolve(
							__dirname,
							"manifest",
							`${String(process.env.BROWSER).toLocaleLowerCase()}.json`,
						),
						"utf8",
					),
				});
			},
		},
	],
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
