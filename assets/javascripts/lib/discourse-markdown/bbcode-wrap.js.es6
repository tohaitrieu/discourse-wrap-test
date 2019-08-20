import { registerOption } from "pretty-text/pretty-text";

registerOption((siteSettings, opts) => {
  opts.features["bbcode-hideto"] = !!siteSettings.hideto_enabled;
});

const CONTAINS_BLOCK_REGEX = /\n|<img|!\[[^\]]*\][(\[]/;

function insertHideto(_, hideto) {
  const element = CONTAINS_BLOCK_REGEX.test(hideto) ? "div" : "span";
  return `<${element} class='hideto guest'>${hideto}</${element}>`;
}

function replaceHidetos(text) {
  text = text || "";
  while (
    text !==
    (text = text.replace(
      /\[hideto\]((?:(?!\[hideto\]|\[\/hideto\])[\S\s])*)\[\/hideto\]/gi,
      insertHideto
    ))
  );
  return text;
}

function setupMarkdownIt(helper) {
  helper.registerOptions((opts, siteSettings) => {
    opts.features["bbcode-hideto"] = !!siteSettings.hideto_enabled;
  });

  helper.registerPlugin(md => {
    md.inline.bbcode.ruler.push("hideto", {
      tag: "hideto",
      wrap: "span.hideto"
    });

    md.block.bbcode.ruler.push("hideto", {
      tag: "hideto",
      wrap: "div.hideto"
    });
  });
}

export function setup(helper) {
  helper.whiteList(["span.hideto", "div.hideto"]);

  if (helper.markdownIt) {
    setupMarkdownIt(helper);
  } else {
    helper.addPreProcessor(replaceHidetos);
  }
}
