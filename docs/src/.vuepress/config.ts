import { defineConfig } from "vuepress/config";
import * as path from "path";

const { description } = require('../../package')

export default defineConfig({
	/**
	 * Ref：https://v1.vuepress.vuejs.org/config/#title
	 */
	title: 'Sentc documentation',
	/**
	 * Ref：https://v1.vuepress.vuejs.org/config/#description
	 */
	description: description,

	/**
	 * Extra tags to be injected to the page HTML `<head>`
	 *
	 * ref：https://v1.vuepress.vuejs.org/config/#head
	 */
	head: [
		['link', { rel: 'icon', href: 'favicon.ico', type: 'image/x-icon' }],
		['meta', { name: 'theme-color', content: '#3eaf7c' }],
		['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
		['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
	],

	dest: path.resolve(__dirname, "../../../dist"),

	/**
	 * Theme configuration, here is the default theme configuration for VuePress.
	 *
	 * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
	 */
	themeConfig: {
		repo: '',
		editLinks: false,
		docsDir: '',
		editLinkText: '',
		lastUpdated: false,
		logo: "/Sentc.png",
		nav: [
			{
				text: 'Guide',
				link: '/guide/',
			},
			{
				text: "Integrations",
				items: [
					{text: "Javascript", link: "https://gitlab.com/sentclose/sentc/sdk-implementations/sentc-javascript"}
				]
			},
			{
				text: "Examples",
				items: [
					{text: "Nuxt 2", link: "https://gitlab.com/sentclose/sentc/sdk-examples/nuxt2"},
					{text: "Node js custom file storage", link: "https://gitlab.com/sentclose/sentc/sdk-examples/own-backend-storage"}
				]
			},
			{
				text: 'Code',
				link: 'https://gitlab.com/sentclose/sentc'
			},
			{
				text: "Homepage",
				link: "https://sentclose.com/"
			}
		],
		sidebar: {
			'/guide/': [
				{
					title: 'Guide',
					collapsable: false,
					children: [
						'',
						'create-app',
						'user',
						'group',
						'encrypt',
						'file',
						'backend-only',
						'module-bundler'
					]
				}
			],
		}
	},

	/**
	 * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
	 */
	plugins: [
		// @ts-ignore
		'@vuepress/plugin-back-to-top',
		// @ts-ignore
		'@vuepress/plugin-medium-zoom',
		// @ts-ignore
		'@bidoubiwa/vuepress-plugin-element-tabs',
	]
});
