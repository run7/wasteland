// ==UserScript==
// @name        KuaiChuan Display Full Filename
// @namespace   qixinglu.com
// @description 迅雷快传上的下载链接显完整文件名
// @include     http://kuai.xunlei.com/d/*
// ==/UserScript==

var nodes = document.querySelectorAll('.c_2 a.file_name');
var i, node;
for (i = 0; i < nodes.length; i += 1) {
    node = nodes[i];
    node.textContent = node.title;
}

GM_addStyle('.c_2 { width: 620px !important;');

