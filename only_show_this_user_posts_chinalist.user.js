// ==UserScript==
// @name        Only Show This User Posts Chinalist
// @namespace   qixinglu.com
// @description 内置中文网站的 Only Show This User Posts 规则
// @require     https://github.com/muzuiget/greasemonkey-scripts/raw/master/only_show_this_user_posts.user.js
// @include     https://localhost/*
// @include     http://www.douban.com/group/topic/*
// @include     http://tieba.baidu.com/p/*
// @include     http://topic.csdn.net/u/*
// @include     http://www.tianya.cn/publicforum/content/*
// @include     http://www.tianya.cn/techforum/content/*
// @include     http://bbs.city.tianya.cn/tianyacity/content/*
// ==/UserScript==

var SITES = [
{
    title: '豆瓣小组',
    url: 'http://www.douban.com/group/topic/*',
    style: 'div.reply-doc:hover div.operation_div { display: block };',
    post: 'ul.topic-reply li',
    positon: 'div.operation_div',
    username: 'div.reply-doc h4 a',
},
{
    title: '百度贴吧',
    url: 'http://tieba.baidu.com/p/*',
    style: 'a.ostup {' +
           '    color: #AAAAAA;' +
           '    maring-top: 10px;' +
           '}' +
           'li.ostup {' +
           '    list-style: none outside none;' +
           '}',
    post: 'div.l_post',
    positon: 'ul.p_author, div.d_author_anonym',
    username: 'a.p_author_name, div.d_author_anonym',
    container: '<li class="ostup"></li>',
},
{
    title: 'CSDN 论坛',
    url: 'http://topic.csdn.net/u/*',
    style: '.fbarb a.ostup {' +
           '    border-right: 0 none;' +
           '    border-left: 1px solid #666666;' +
           '}',
    post: 'table.mframe',
    positon: 'div.fbarb ul',
    username: 'div.df li:nth-child(2) a',
    container: '<li></li>',
},
{
    title: '天涯公共论坛',
    url: 'http://www.tianya.cn/publicforum/content/*',
    style: '#firstAuthor td[align=right] {' +
           '    width: 285px !important;' +
           '}' +
           'a.ostup {' +
           '    color: #999999;' +
           '    float: right;' +
           '    margin-right: 10px;' +
           '    text-decoration: none;' +
           '}',
    post: '#firstAuthor, #pContentDiv table, #pContentDiv div.post',
    positon: '#firstAuthor td:last-child, #pContentDiv table td:last-child',
    username: '#firstAuthor td[align=center] a[target], #pContentDiv table center a',
},
{
    title: '天涯技术论坛和城市',
    url: [
        'http://www.tianya.cn/techforum/content/*',
        'http://bbs.city.tianya.cn/tianyacity/content/*',
    ],
    style: 'a.ostup {' +
           '    color: #999999;' +
           '    float: right;' +
           '    margin-right: 10px;' +
           '}',
    post: '#pContentDiv div.vcard, #pContentDiv div.post',
    positon: '#pContentDiv div.vcard',
    username: '#pContentDiv div.vcard a[target]',
},
]

var site = select_site(SITES);
if (site !== null) {
    site.showOnlyLabel = '只看这个用户';
    site.showAllLabel = '显示全部用户';
    var control = ostup(site);
    document.addEventListener("LightPagerAppended", function() {
        control.add_buttons();
        control.do_filter();
    });
}
