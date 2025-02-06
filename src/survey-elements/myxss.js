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
		address: ['style', 'class'],
		area: ["shape", "coords", "href", "alt"],
		article: ['style', 'class'],
		aside: ['style', 'class'],
		b: [],
		big: [],
		blockquote: ["cite"],
		br: [],
		button: ['href', 'title', 'target', 'style', 'class', 'type'],
		caption: ['style', 'class'],
		center: [],
		cite: ['style', 'class'],
		code: ['style', 'class'],
		col: ["align", "valign", "span", "width"],
		colgroup: ["align", "valign", "span", "width"],
		dd: ['style', 'class'],
		del: ["datetime"],
		details: ["open"],
		div: ['style', 'class', 'id'],
		dl: ['style', 'class'],
		dt: ['style', 'class'],
		em: ['style', 'class'],
		figcaption: ['style', 'class'],
		figure: ['style', 'class'],
		font: ["color", "size", "face"],
		footer: ['style', 'class'],
		h1: ['style', 'class', 'id'],
		h2: ['style', 'class', 'id'],
		h3: ['style', 'class', 'id'],
		h4: ['style', 'class', 'id'],
		h5: ['style', 'class', 'id'],
		h6: ['style', 'class', 'id'],
		header: ['style', 'class'],
		hr: ['style', 'class'],
		i: ['style', 'class'],
		img: ["src", "alt", "title", "width", "height", "loading", "class", "style"],
		ins: ["datetime"],
		li: ['style', 'class'],
		mark: [],
		nav: ['style', 'class'],
		ol: ['style', 'class'],
		p: ['style', 'class'],
		pre: [],
		s: [],
		section: ["class", "style"],
		small: ["class", "style"],
		span: ['style', 'class'],
		strike: [],
		strong: [],
		sub: [],
		summary: [],
		sup: [],
		table: ["width", "border", "align", "valign", "class", "style"],
		tbody: ["align", "valign", "class", "style"],
		td: ["width", "rowspan", "colspan", "align", "valign", "class", "style"],
		tfoot: ["align", "valign", "class", "style"],
		th: ["width", "rowspan", "colspan", "align", "valign", "class", "style"],
		thead: ["align", "valign", "class", "style"],
		tr: ["rowspan", "align", "valign", "class", "style"],
		tt: ['style', 'class'],
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