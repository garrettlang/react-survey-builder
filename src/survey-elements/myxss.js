import xss from 'xss';

const myxss = new xss.FilterXSS({
	whiteList: {
		a: ['href', 'title', 'target'],
		u: [],
		br: [],
		b: [],
		i: [],
		ol: ['style'],
		ul: ['style'],
		li: [],
		p: ['style'],
		sub: [],
		sup: [],
		div: ['style'],
		em: [],
		strong: [],
		span: ['style'],
		ins: [],
	},
});

export const myContentXSS = new xss.FilterXSS({
	css: false,
	whiteList: {
		a: ['href', 'title', 'target', 'style', 'class'],
		abbr: ["title"],
		address: [],
		area: ["shape", "coords", "href", "alt"],
		article: [],
		aside: [],
		b: [],
		big: [],
		blockquote: ["cite"],
		br: [],
		button: ['href', 'title', 'target', 'style', 'class', 'type'],
		caption: [],
		center: [],
		cite: [],
		code: [],
		col: ["align", "valign", "span", "width"],
		colgroup: ["align", "valign", "span", "width"],
		dd: [],
		del: ["datetime"],
		details: ["open"],
		div: ['style', 'class', 'id'],
		dl: ['style', 'class'],
		dt: ['style', 'class'],
		em: [],
		figcaption: [],
		figure: [],
		font: ["color", "size", "face"],
		footer: [],
		h1: ['style', 'class', 'id'],
		h2: ['style', 'class', 'id'],
		h3: ['style', 'class', 'id'],
		h4: ['style', 'class', 'id'],
		h5: ['style', 'class', 'id'],
		h6: ['style', 'class', 'id'],
		header: [],
		hr: [],
		i: [],
		img: ["src", "alt", "title", "width", "height", "loading"],
		ins: ["datetime"],
		li: ['style', 'class'],
		mark: [],
		nav: [],
		ol: ['style', 'class'],
		p: ['style', 'class'],
		pre: [],
		s: [],
		section: [],
		small: [],
		span: ['style', 'class'],
		strike: [],
		strong: [],
		sub: [],
		summary: [],
		sup: [],
		table: ["width", "border", "align", "valign"],
		tbody: ["align", "valign"],
		td: ["width", "rowspan", "colspan", "align", "valign"],
		tfoot: ["align", "valign"],
		th: ["width", "rowspan", "colspan", "align", "valign"],
		thead: ["align", "valign"],
		tr: ["rowspan", "align", "valign"],
		tt: [],
		u: [],
		ul: ['style', 'class'],
	},
	onIgnoreTagAttr: function (tag, name, value, isWhiteAttr) {
		if (name.substr(0, 5) === "data-") {
			// escape its value using built-in escapeAttrValue function
			return name + '="' + xss.escapeAttrValue(value) + '"';
		}
		if (name.substr(0, 5) === "aria-") {
			// escape its value using built-in escapeAttrValue function
			return name + '="' + xss.escapeAttrValue(value) + '"';
		}
	},
});

export default myxss;