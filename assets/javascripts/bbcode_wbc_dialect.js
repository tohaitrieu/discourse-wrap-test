(function() {

  function replaceWbcs (text) {
    while (text !== (text = text.replace(/\[wbc=([^\]]+)\]((?:(?!\[wbc=[^\]]+\]|\[\/wbc\])[\S\s])*)\[\/wbc\]/ig, function (match, p1, p2) {
      return "<div class='donto " + p1 + "'>" + p2 + "</div>";
    })));
    return text;
  }

  Discourse.Dialect.addPreProcessor(replaceWbcs);
  Discourse.Markdown.whiteListTag('div', 'class');

})();
