// ==UserScript==
// @name        Google Cache Browser
// @namespace   qixinglu.com
// @description Continue browsing the page in Google cache
// @grant       none
// @include     http://webcache.googleusercontent.com/search?*
// @include     https://webcache.googleusercontent.com/search?*
// ==/UserScript==

var url = location.href.match(/q=cache:([^&+]+)/)[1];
var nodes = document.querySelectorAll('body > div[style="position:relative"] a');
var i, node;
for (i = 0; i < nodes.length; i += 1) {
    node = nodes[i];
    node.href = location.href.replace(url, encodeURIComponent(node.href));
}

