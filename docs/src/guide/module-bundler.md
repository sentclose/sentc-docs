# Using with a module bundler

For Javascript we are using wasm for the core. If you are using the CDN you don't need this step.

For the installed version a bundler like webpack must be used in order to use the sdk.

## Webpack 5

For webpack 5 the installation is easy. Just let webpack pack your wasm file:

````javascript
module.exports = {
	//your other configs
    module: {
		rules: [
			{
				test: /\.wasm$/,
				type: "asset/resource"
			}
		]
	}
}
````

Sometimes webpack uses the commonjs file and this could cause errors when loading the wasm file in the browser.
To avoid this set the module specific. Make sure you are setting module before main:

````javascript
module.exports = {
	//your other configs
    module: {
		rules: [
			{
				test: /\.wasm$/,
				type: "asset/resource"
			}
		]
	},
	resolve: {
		mainFields: ["module", "main"],
	}
}
````

## Webpack 4

Webpack 4 can't use the normal import and fetch of the wasm file.

You must set in the sdk options the path to your wasm file from a browser perspective (normally your public directory) 
so the browser can fetch the wasm file:

````javascript
import Sentc from "@sentclose/sentc";

await Sentc.init({
    app_token: "your_app_token",
    wasm_path: "/sentc_wasm_bg.wasm" // <- your wasm path, in this case in the root of your project when it is build
});
````

The following example shows the use in webpack 4 when packing it in node with another framework like vue, react, etc., 
where the build process and transpiling is happened.

- Install the webpack copy to copy the wasm file to your public directory during build time:
````bash
npm install copy-webpack-plugin
````
- set the path to your wasm file (normally in node modules folder)
- set under resolve the mainFields to main, to not use the wrong javascript file.
- then the framework bundler will transpile your code

````javascript
//set here the path to 
const path = require("path");
const wasmOutDir = path.resolve(__dirname, "node_modules/sentc_wasm");

const copyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
	//your other configs
	plugins: [
		new copyWebpackPlugin({
			patterns: [
				{from: wasmOutDir + "/sentc_wasm_bg.wasm"}
			]
		})
	],
	resolve: {
		mainFields: ["main"],
	}
}
````

### Using webpack 4 with a framework

When your framework is using two different build process for server and client (like next or nuxt for ssr), 
then use the copy plugin in a build module which is only used during build time and not during runtime.

Here with nuxt 2, see the full example [here in git](https://gitlab.com/sentclose/sentc/sdk-examples/nuxt2):

````javascript
//in file: nuxt.build.js

const path = require("path");
const wasmOutDir = path.resolve(__dirname, "node_modules/sentc_wasm");

const copyWebpackPlugin = require("copy-webpack-plugin");

export default function() {
	this.extendBuild(({plugins}) => {
		// eslint-disable-next-line new-cap
		plugins.push(new copyWebpackPlugin({
			patterns: [
				{
					from: wasmOutDir + "/sentc_wasm_bg.wasm",
					to: path.resolve(__dirname, "static")
				}
			]
		}));
	});
}

//in file nuxt.config.js (the main config file for nuxt)
const config = {
	buildModules: [
		"~/nuxt.build.ts"
	]
}

export default config;
````

### Using webpack 4 alone

When not using a framework you can use the browser implementation for webpack. 
The above example won't work because you need to transpile the output.

- install the copy plugin to copy the wasm file to your public directory during build times

````bash
npm install copy-webpack-plugin
````

- install babel to transpile the javascript file which fetches the wasm file. Make sure you are using babel core version 7 for webpack 4:
````json
{
	"devDependencies": {
		"babel-loader": "^8.2.5",
		"@babel/preset-env": "^7.18.10",
		"@babel/core": "^7.18.10",

		"babel-plugin-bundled-import-meta": "^0.3.2"
	} 
}
````

Set your wasm output directory as bundleDir in the babel-plugin-bundled-import-meta options. Do not forget to set browser as main filed at first.

````javascript
//set here the path to 
const path = require("path");
const wasmOutDir = path.resolve(__dirname, "node_modules/sentc_wasm");

const copyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
	//your other configs
	module: {
		rules: [
			{
				test: /\.m?js$/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
						plugins: [
							[
								"babel-plugin-bundled-import-meta",
								{
									"bundleDir": wasmOutDir,
									"importStyle": "cjs"
								}
							]
						]
					}
                }
			}
		]
	},
	plugins: [
		new copyWebpackPlugin({
			patterns: [
				{from: wasmOutDir + "/sentc_wasm_bg.wasm"}
			]
		})
	],
	resolve: {
		mainFields: ["browser", "main"],
	}
}
````