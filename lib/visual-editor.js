export default function VisualEditor() {
  return {
    bold: (text) => `<strong>${text}</strong>`,
    italic: (text) => `<em>${text}</em>`,
    h1: (text) => `<h1>${text}</h1>`,
    h2: (text) => `<h2>${text}</h2>`,
    h3: (text) => `<h3>${text}</h3>`,
    p: (text) => `<p>${text}</p>`,
    ul: (text) => `<ul><li>${text.split('\n').join('</li><li>')}</li></ul>`,
    ol: (text) => `<ol><li>${text.split('\n').join('</li><li>')}</li></ol>`,
    link: (text, url) => `<a href="${url}">${text}</a>`,
    img: (url, alt) => `<img src="${url}" alt="${alt}">`,
    hr: () => `<hr>`,
    br: () => `<br>`,
  };
}
