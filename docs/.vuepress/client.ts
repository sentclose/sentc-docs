import { defineClientConfig } from '@vuepress/client'

export default defineClientConfig({
	enhance() {
		//@ts-ignore
		if (__VUEPRESS_SSR__) return;
		plausible()
	}
});

function plausible() {
	const selfHostedUrl = "https://a.sentclose.com";
	const domain = "sentc.com";
	const local = false;
	const outboundLinkTracking = true;

	if (typeof window === undefined){
		return;
	}

	var d = document,
		g = d.createElement("script"),
		s = d.getElementsByTagName("script")[0];
	var h = selfHostedUrl + (
		local
			? "/js/script.local.js"
			: outboundLinkTracking
				? "/js/script.outbound-links.js"
				: "/js/script.js");

	console.log(h);

	g.setAttribute("data-domain", domain);
	g.async = true;
	g.defer = true;
	g.src = h;
	s.parentNode.insertBefore(g, s);
}