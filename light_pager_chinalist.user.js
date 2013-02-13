// ==UserScript==
// @name        Light Pager Chinalist
// @namespace   qixinglu.com
// @description 内置中文网站的 Light Pager 自动翻页规则
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_info
// @require     https://raw.github.com/muzuiget/greasemonkey-scripts/4531270c3f8fe04cce9981251d1f925df0f93168/light_pager.user.js
// @include     http://localhost/*
// @exclude     http://*.douban.com/*
// @exclude     http://tieba.baidu.com/p/*
// @exclude     http://topic.csdn.net/u/*
// @exclude     http://www.tianya.cn/publicforum/content/*
// @exclude     http://www.tianya.cn/techforum/content/*
// @exclude     http://bbs.city.tianya.cn/tianyacity/content/*
// @exclude     http://club.kdnet.net/dispbbs.asp?*
// @exclude     http://dzh.mop.com/whbm/*
// ==/UserScript==

var GLOBAL = {
    separate: true,
    loadingHTML: '正在加载：<a href="${url}">${current} / ${total}<a/>',
    loadedHTML: '页数：<a href="${url}">${current} / ${total}<a/>',
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
    title: 'CSDN 社区',
    url: 'http://topic.csdn.net/u/*',
    next: 'ul.plist a[onclick]:contains("下一页")',
    content: 'table.mframe, table.mframe ~ div.fm',
    style: 'div.lp-sep { border: 1px solid #A9CBEE; margin: 0; }',
    separateInside: false
},
{
    title: '天涯公共论坛',
    url: 'http://www.tianya.cn/publicforum/content/*',
    next: 'a:contains("下一页")',
    content: '#firstAuthor, #pContentDiv, #pContentDiv ~ div.function',
    separateInside: false
},
{
    title: '天涯技术论坛和城市',
    url: [
        'http://www.tianya.cn/techforum/content/*',
        'http://bbs.city.tianya.cn/tianyacity/content/*'
    ],
    next: 'a:contains("下一页")',
    content: '#pContentDiv, #pContentDiv ~ div.post-bar',
    separateInside: false
},
{
    title: '凯迪论坛',
    url: 'http://club.kdnet.net/dispbbs.asp?*',
    next: 'a:contains("下一页")',
    content: 'div.posted-box-add, div.reply-box, div.reply-box ~ div.operating',
    separateInside: false
},
{
    title: '猫扑大杂烩',
    url: 'http://dzh.mop.com/whbm/*',
    next: 'a:contains("下一页")',
    content: 'div.nrarea',
    separateInside: false
}
];

var register_menus_cn = function(control) {
    GM_registerMenuCommand("开始翻页", control.start_paging, "s");
    GM_registerMenuCommand("继续翻页", control.continue_paging, "c");
    GM_registerMenuCommand("停止翻页", control.stop_paging, "t");
};

var site = select_site(SITES);
if (site !== null) {
    setup_site_global(site, GLOBAL);
    var control = light_pager(site);
    register_menus_cn(control);
}
