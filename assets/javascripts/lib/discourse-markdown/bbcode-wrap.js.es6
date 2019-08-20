import { registerOption } from "pretty-text/pretty-text";

registerOption((siteSettings, opts) => {
  opts.features["bbcode-wbc"] = !!siteSettings.wbc_enabled;
});

const CONTAINS_BLOCK_REGEX = /\n|<img|!\[[^\]]*\][(\[]/;

function insertWbc(_, wbc) {
  const element = CONTAINS_BLOCK_REGEX.test(wbc) ? "div" : "span";
  return `<${element} class='donto'>${wbc}</${element}>`;
}

function replaceWbcs(text) {
  text = text || "";
  while (
    text !==
    (text = text.replace(
      /\[wbc\]((?:(?!\[wbc\]|\[\/wbc\])[\S\s])*)\[\/wbc\]/gi,
      insertWbc
    ))
  );
  return text;
}

function setupMarkdownIt(helper) {
  helper.registerOptions((opts, siteSettings) => {
    opts.features["bbcode-hideto"] = !!siteSettings.wbc_enabled;
  });

  helper.registerPlugin(md => {
    md.inline.bbcode.ruler.push("wbc", {
      tag: "wbc",
      wrap: "span.wbc"
    });

    md.block.bbcode.ruler.push("wbc", {
      tag: "wbc",
      wrap: "div.wbc"
    });
  });
}

export function setup(helper) {
  helper.whiteList(["span.wbc", "div.wbc"]);

  if (helper.markdownIt) {
    setupMarkdownIt(helper);
  } else {
    helper.addPreProcessor(replaceWbcs);
  }
}
