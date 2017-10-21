// ==UserScript==
// @name        JD Remai Redirect
// @namespace   qixinglu.com
// @include     https://re.jd.com/*
// @version     1
// @grant       none
// ==/UserScript==

let reg = new RegExp('/item/(.+)?.html');
let itemId = location.href.match(reg)[1];
location.href = `https://item.jd.com/${itemId}.html`;
