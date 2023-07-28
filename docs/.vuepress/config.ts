import {defaultTheme, defineUserConfig} from "vuepress";
import {mdEnhancePlugin} from "vuepress-plugin-md-enhance";
import * as path from "path";
import {copyCodePlugin} from "vuepress-plugin-copy-code2";
import {searchProPlugin} from "vuepress-plugin-search-pro";
import {seoPlugin} from "vuepress-plugin-seo2";
import {registerComponentsPlugin} from "@vuepress/plugin-register-components";
import { getDirname, path as vuepress_path } from '@vuepress/utils'

// @ts-ignore
const _dirname = getDirname(import.meta.url)

export default defineUserConfig({
	lang: "en-US",
	title: "Sentc documentation",
	description: "End-to-end encryption sdk for developer.",

	plugins: [
		mdEnhancePlugin({
			tabs: true
		}),
		copyCodePlugin({}),
		searchProPlugin({
			// your options
		}),
		seoPlugin({
			hostname: "sentc.com",
			twitterID: "sentclose",
			autoDescription: false
		}),
		registerComponentsPlugin({
			componentsDir: vuepress_path.resolve(_dirname, "../../components")
		})
	],

	dest: path.resolve(__dirname, "../../dist"),

	theme: defaultTheme({
		logo: "/Sentc.png",
		repo: "https://github.com/sentclose",
		editLink: false,
		editLinkText: "",
		contributors: false,
		navbar: [
			{
				text: "Guide",
				link: "/guide/"
			},
			{
				text: "Protocol",
				link: "/protocol/"
			},
			{
				text: "Playground",
				link: "/playground/"
			},
			{
				text: "Integrations",
				children: [
					{text: "Javascript / Web", link: "https://github.com/sentclose/sentc-javascript"},
					{text: "Dart / Flutter", link: "https://github.com/sentclose/sentc-flutter"}
				]
			},
			{
				text: "Examples",
				children: [
					{text: "Nuxt 2", link: "https://github.com/sentclose/sentc-nuxt2-example"},
					{text: "Node js custom file storage", link: "https://github.com/sentclose/sentc-example-storage-nodejs"}
				]
			},
			{
				text: "Dashboard",
				link: "https://api.sentc.com/dashboard/"
			}
		],
		sidebar: {
			"/guide/": [
				{
					text: "Getting Started",
					//collapsible: true,
					children: [
						"/guide/README.md",
						"/guide/create-app.md",
					]
				},
				{
					text: "End-to-end encryption SDK",
					//collapsible: true,
					children: [
						"/guide/e2ee/user.md",
						"/guide/e2ee/group.md",
						"/guide/e2ee/encrypt.md",
						"/guide/e2ee/file.md",
						"/guide/e2ee/searchable.md",
						"/guide/e2ee/sortable.md",
					]
				},
				{
					text: "SDK light",
					children: [
						"/guide/light/README.md",
						"/guide/light/user.md",
						"/guide/light/group.md"
					]
				},
				{
					text: "Advanced",
					children:[
						"/guide/advanced/end-to-end-encrypted-database.md",
						"/guide/advanced/backend-only.md",
						"/guide/advanced/self-hosted.md",
						"/guide/advanced/module-bundler.md",
					]
				}
			],
			"/protocol": [
				{
					text: "Sentc protocol",
					collapsible: false,
					children: [
						"/protocol/README.md"
					]
				}
			]
		}
	})
});