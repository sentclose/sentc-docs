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
					text: "Guide",
					collapsible: false,
					children: [
						"/guide/README.md",
						"/guide/create-app.md",
						"/guide/user.md",
						"/guide/group.md",
						"/guide/encrypt.md",
						"/guide/file.md",
						"/guide/backend-only.md",
						"/guide/module-bundler.md",
						"/guide/content.md",
						"/guide/searchable-encryption.md",
						"/guide/sortable.md",
						"/guide/self-hosted.md"
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