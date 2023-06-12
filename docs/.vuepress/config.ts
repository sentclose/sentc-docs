import {defaultTheme, defineUserConfig} from 'vuepress'
import {mdEnhancePlugin} from "vuepress-plugin-md-enhance";
import * as path from "path";

export default defineUserConfig({
  lang: 'en-US',
  title: 'Sentc documentation',
  description: 'End-to-end encryption sdk',

  plugins:[
      mdEnhancePlugin({
        tabs: true
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
                text: 'Guide',
                link: '/guide/',
            },
            {
                text: "Protocol",
                link: "/protocol/"
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
            },
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
                        "/guide/module-bundler.md"
                    ]
                },
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
    }),
})