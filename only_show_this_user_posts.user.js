// ==UserScript==
// @name        Only Show This User Posts
// @namespace   qixinglu.com
// @description 只看这个用户的帖子，通用型论坛脱水工具，带自动翻页
// @require     https://github.com/muzuiget/greasemonkey-scripts/raw/master/light_pager.user.js
// @include     http://www.douban.com/group/topic/*
// ==/UserScript==

var sites = [
    {
        "urls": "http://www.douban.com/group/topic/",
        "next": "span.next a",
        "content": "div.article",
        "position": "#content .extra",
        "count": 0,
        "height": 0.9,
        "startFilter" : function(username) {
            var posts = document.querySelectorAll('ul.topic-reply li');
            var i, post;
            for (i = 0; i < posts.length; i += 1) {
                post = posts[i];
                if (post.querySelector('div.reply-doc h4 a').textContent != username) {
                    post.style.display = 'none';
                }
            }
        },
        "addButtons" : function() {
            GM_addStyle('span.ostup { cursor: pointer; float: right; margin-right: 10px; }');

            var show_button = function() {
                this.lastElementChild.style.display = 'block';
            }
            var hide_button = function() {
                this.lastElementChild.style.display = 'none';
            }

            var $this = this;
            var click_button = function() {
                var username =  this.previousElementSibling.textContent;
                $this.delButtons(show_button, hide_button);
                $this.startFilter(username);

                var control = light_pager($this);
                register_menus_cn(control);

                document.addEventListener("LightPagerAppended", function() {
                    $this.startFilter(username);
                });
            }

            var posts = document.querySelectorAll('ul.topic-reply li');
            var i, post;
            for (i = 0; i < posts.length; i += 1) {
                post = posts[i];
                var titlebar = post.querySelector('div.reply-doc h4');
                var button = document.createElement('span');

                button.textContent = '只看此用户';
                button.className = 'ostup';
                button.style.display = 'none';
                button.addEventListener('click', click_button);

                titlebar.appendChild(button);
                titlebar.addEventListener('mouseover', show_button);
                titlebar.addEventListener('mouseout', hide_button);
            }
        },
        "delButtons" : function(show_button, hide_button) {
            var buttons = document.querySelectorAll('span.ostup');
            var i, button;
            for (i = 0; i < buttons.length; i += 1) {
                var button = buttons[i];
                button.parentNode.removeEventListener('mouseover', show_button);
                button.parentNode.removeEventListener('mouseout', hide_button);
                button.parentNode.removeChild(button);
            }
        }
    }
]

var register_menus_cn = function(control) {
    GM_registerMenuCommand("开始翻页", control.start_paging, "s");
    GM_registerMenuCommand("继续翻页", control.continue_paging, "c");
    GM_registerMenuCommand("停止翻页", control.stop_paging, "t");
}

var site = select_site(sites);
if (site !== null) {
    site.addButtons();
}
