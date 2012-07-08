// ==UserScript==
// @name        Only Show This User Posts
// @namespace   qixinglu.com
// @description 只看这个用户的帖子，通用型论坛脱水工具，带自动翻页
// @include     http://www.douban.com/group/topic/*
// @include     http://*.tianya.cn/*
// @include     http://tieba.baidu.com/p/*
// @include     http://topic.csdn.net/u/*
// ==/UserScript==

/* sites */

var sites = [
    {
        title: "豆瓣小组",
        url: "http://www.douban.com/group/topic/*",
        style: ".reply-doc:hover .operation_div { display: block };",
        post: "ul.topic-reply li",
        username: "div.reply-doc h4 a",
        positon: ".operation_div"
    },
    {
        title: "天涯论坛",
        url: "http://*.tianya.cn/*",
        post: ".l_post",
        username: "a.p_author_name",
        positon: ".p_author",
        container: "<li></li>",
    },
    {
        title: "百度贴吧",
        url: "http://tieba.baidu.com/p/*",
        style: "a.ostup { visibility: hidden; color: #AAAAAA; } .d_author:hover a.ostup { visibility: visible };",
        post: ".l_post",
        username: "a.p_author_name",
        positon: ".p_author",
        container: "<li></li>",
    },
    {
        title: "CSDN 论坛",
        url: "http://topic.csdn.net/u/*",
        style: ".fbarb a.ostup { border-right: 0 none; border-left: 1px solid #666666; }",
        post: "table.mframe",
        username: ".df li:nth-child(2) a",
        positon: ".fbarb ul",
        container: "<li></li>"
    }
]

/* tools function */

var convert2RegExp = function(pattern) {
    var firstChar = pattern.charAt(0);
    var lastChat = pattern.charAt(pattern.length - 1);
    if (firstChar + lastChat == '//') {
        return new RegExp(s.substr(1, -1));
    } else {
        pattern = '^' + pattern.replace(/\*/g, '.*') + '$';
        return new RegExp(pattern);
    }
}

var create_element_from_string = function(text) {
    var parent_element = document.createElement('div');
    parent_element.innerHTML = text;
    return parent_element.firstChild;
}

/* ostup core */

var ostup = function(site) {
    var username = null;

    var add_custom_style = function() {
        if (site.style !== undefined) {
            GM_addStyle(site.style);
        }
    }

    var do_filter = function() {

        var posts = document.querySelectorAll(site.post);
        var post_display = 'block';

        var show_only = function() {
            for (var i = 0; i < posts.length; i += 1) {
                var post = posts[i];
                var link = post.querySelector(site.username);
                if (link === null || link.textContent !== username) {
                    post.style.display = 'none';
                }
            }
        };

        var show_all = function() {
            for (var i = 0; i < posts.length; i += 1) {
                posts[i].style.display = post_display;
            }
        };

        if (posts.length > 0) {
            post_display = window.getComputedStyle(posts[0]).display;
        }

        if (username === null) {
            show_all(posts);
        } else {
            show_only(posts);
        }
    };

    var get_button_text = function() {
        return username === null ? '只看这个用户' : '显示全部用户';
    };

    var update_buttons = function() {
        var button_text = get_button_text();
        var buttons = document.querySelectorAll('a.ostup');
        for (var i = 0; i < buttons.length; i += 1) {
            buttons[i].textContent = button_text;
        }
    };

    var add_buttons = function() {

        var button_html = '<a class="ostup" href="javascript:void(0)"></a>';

        var create_click_callback = function(post) {
            return function() {
                if (username === null) {
                    username = post.querySelector(site.username).textContent;
                } else {
                    username = null;
                }
                unsafeWindow.console.log(username);
                update_buttons();
                do_filter();
            }
        }

        var posts = document.querySelectorAll(site.post);
        var i, post;
        for (i = 0; i < posts.length; i += 1) {
            post = posts[i];
            var positon = post.querySelector(site.positon);
            if (positon === null) {
                continue;
            }
            var button = positon.querySelector('a.ostup');
            if (button !== null) {
                continue;
            }
            button = create_element_from_string(button_html);
            button.textContent = get_button_text();
            button.addEventListener('click', create_click_callback(post));

            if (site.container !== undefined) {
                var container = create_element_from_string(site.container);
                container.appendChild(button);
                positon.appendChild(container);
            } else {
                positon.appendChild(button);
            }
        }
    };

    var control = {
        add_buttons: add_buttons,
        do_filter: do_filter
    };

    add_custom_style();
    add_buttons();
    return control;
}

/* rule setup functions */

var select_site = function(sites) {
    var url = location.href;
    for (var i = 0; i < sites.length; i += 1) {
        var site = sites[i];
        var reg = convert2RegExp(site.url);
        if (reg.test(url)) {
            return site;
        }
    }
    return null;
};

var site = select_site(sites);
if (site !== null) {
    var control = ostup(site);
    document.addEventListener("LightPagerAppended", function() {
        control.add_buttons();
        control.do_filter();
    });
}
