import { registerOption } from "pretty-text/pretty-text";

registerOption((siteSettings, opts) => {
  opts.features["bbcode-wbc"] = true;
});

function WrapContentBlock(text) {
  text = text || "";
  while (
    text !==
    (text = text.replace(
      /\[wcb=([^\]]+)\]((?:(?!\[wbc=[^\]]+\]|\[\/wbc\])[\S\s])*)\[\/wbc\]/gi,
      function(match, p1, p2) {
        return `<div class='donto ${p1}'>${p2}</span>`;
      }
    ))
  );
  return text;
}

export function setup(helper) {
  helper.whiteList(["div[class]"]);
  helper.whiteList({
    custom(tag, name, value) {
      if (tag === "div" && name === "class") {
        return /^donto ?[a-zA-Z0-9]+$/.exec(value);
      }
    }
  });

  if (helper.markdownIt) {
    helper.registerPlugin(md => {
      const ruler = md.inline.bbcode.ruler;

      ruler.push("wbc", {
        tag: "wbc",
        wrap: function(token, endToken, tagInfo) {
          token.type = "div_open";
          token.tag = "div";
          token.attrs = [
            ["class", "donto " + tagInfo.attrs._default.trim()]
          ];
          token.content = "";
          token.nesting = 1;

          endToken.type = "div_close";
          endToken.tag = "div";
          endToken.nesting = -1;
          endToken.content = "";
        }
      });
    });
  } else {
    helper.addPreProcessor(text => WrapContentBlock(text));
  }
}
