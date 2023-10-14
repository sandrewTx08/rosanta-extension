import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { resolve } from "path";
import manifest from "./manifest/manifest.json";
import manifestChrome from "./manifest/chrome.json";
import manifestFirefox from "./manifest/firefox.json";

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
					source: JSON.stringify({
						...manifest,
						...(String(process.env.BROWSER).toLocaleLowerCase() == "firefox"
							? manifestFirefox
							: manifestChrome),
					}),
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
