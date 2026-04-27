import DOMPurify from 'dompurify';

// export const sanitizeHtml = (html) => {
//   return DOMPurify.sanitize(html, {
//     USE_PROFILES: { html: true },
//     ALLOWED_TAGS: [
//       "p",
//       "br",
//       "b",
//       "strong",
//       "i",
//       "em",
//       "u",
//       "s",
//       "a",
//       "ul",
//       "ol",
//       "li",
//       "blockquote",
//       "code",
//       "pre",
//       "span",
//       "div",
//       "table",
//       "thead",
//       "tbody",
//       "tr",
//       "td",
//       "th",
//       "img",
//       "h1",
//       "h2",
//       "h3",
//       "h4",
//       "h5",
//       "h6",
//     ],
//     ALLOWED_ATTR: [
//       "href",
//       "target",
//       "rel",
//       "src",
//       "alt",
//       "style",
//       "colspan",
//       "rowspan",
//     ],
//   });
// };

export const sanitizeToDOMFragment = html => {
  const frag = DOMPurify.sanitize(html, {
    ALLOW_UNKNOWN_PROTOCOLS: true,
    WHOLE_DOCUMENT: false,
    RETURN_DOM: true,
    RETURN_DOM_FRAGMENT: true,
    FORCE_BODY: false,
  });

  return frag ? document.importNode(frag, true) : document.createDocumentFragment();
};
