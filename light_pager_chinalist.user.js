// ==UserScript==
// @name        Light Pager Chinalist
// @namespace   qixinglu.com
// @description 内置中文网站的 Light Pager 自动翻页规则
// @require     https://github.com/muzuiget/greasemonkey-scripts/raw/master/light_pager.user.js
// @include     http://localhost/*
// @exclude     http://*.douban.com/*
// @exclude     http://tieba.baidu.com/p/*
// @exclude     http://topic.csdn.net/u/*
// @exclude     http://*.tianya.cn/*
// ==/UserScript==

var GLOBAL = {
    separate: true,
    separateHTML: '页数：<a href="${url}">${current} / ${total}<a/>',
    count: 9,
    height: 0.9
};
var SITES = [
{
    title: '豆瓣',
    url: 'http://*.douban.com/*',
    next: 'span.next a',
    content: 'div.article',
    position: '#content div.extra',
    hidden: 'div.article:not(.lp-first) table.infobox, ' +
            'div.article:not(.lp-first) div.block5, ' +
            'div.article:not(.lp-last) div.paginator ~ *',
    style: 'div.lp-sep { margin: 0 0 20px 0; }'
},
{
    title: '百度贴吧',
    url: 'http://tieba.baidu.com/p/*',
    next: 'li.l_pager a:contains("下一页")',
    content: 'div.l_core',
    style: 'div.lp-sep { margin: 0 1px; }'
},
{
    title: 'CSDN 论坛',
    url: 'http://topic.csdn.net/u/*',
    next: 'ul.plist a[onclick]:contains("下一页")',
    content: 'table.mframe, table.mframe ~ div.fm',
    style: 'div.lp-sep { border: 1px solid #A9CBEE; margin: 0; }',
    separateInside: false
},
{
    title: '天涯',
    url: 'http://*.tianya.cn/*',
    next: 'a:contains("下一页")',
    content: '#firstAuthor, #pContentDiv, #pContentDiv ~ div.function'
},
];

var register_menus_cn = function(control) {
    GM_registerMenuCommand("开始翻页", control.start_paging, "s");
    GM_registerMenuCommand("继续翻页", control.continue_paging, "c");
    GM_registerMenuCommand("停止翻页", control.stop_paging, "t");
}

var site = select_site(SITES);
if (site !== null) {
    setup_site_global(site, GLOBAL);
    var control = light_pager(site);
    register_menus_cn(control);
}
