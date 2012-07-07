// ==UserScript==
// @name        Only Show This User Posts
// @namespace   qixinglu.com
// @description 只看这个用户的帖子，通用型论坛脱水工具，带自动翻页
// @include     http://www.douban.com/group/topic/*
// ==/UserScript==

var sites = [
    {
        title: "豆瓣小组",
        url: "http://www.douban.com/group/topic/",
        style: "div.reply-doc:hover .operation_div { display: block };",
        username: null,
        doFilter : function() {
            var showOnly = function(posts, username) {
                for (var i = 0; i < posts.length; i += 1) {
                    var post = posts[i];
                    var link = post.querySelector('div.reply-doc h4 a');
                    if (link.textContent != username) {
                        post.style.display = 'none';
                    }
                }
            };

            var showAll = function(posts) {
                for (var i = 0; i < posts.length; i += 1) {
                    posts[i].style.display = 'block';
                }
            };

            var username = this.username;
            var posts = document.querySelectorAll('ul.topic-reply li');
            if (username === null) {
                showAll(posts);
            } else {
                showOnly(posts, username);
            }
        },
        getButtonText: function() {
            return this.username === null ? '只看此用户' : '显示全部用户';
        },
        addButtons: function() {
            var $this = this;

            var click_button = function() {
                if ($this.username === null) {
                    $this.username = this.parentNode.parentNode.querySelector('h4 a').textContent;
                } else {
                    $this.username = null;
                }
                $this.updateButtons();
                $this.doFilter();
            }

            var create_button = function(titlebar) {
                var button = document.createElement('a');
                button.className = 'lnk-ostup';
                button.href = 'javascript:void(0)';
                button.addEventListener('click', click_button);
                button.textContent = $this.getButtonText();
                return button;
            }

            var operations = document.querySelectorAll('ul.topic-reply .operation_div');
            var i, operation;
            for (i = 0; i < operations.length; i += 1) {
                operation = operations[i];
                var button = operation.querySelector('a.lnk-ostup');
                if (button === null) {
                    button = create_button();
                    operation.appendChild(button);
                }
            }
        },
        updateButtons: function() {
            var button_text = this.getButtonText();
            var buttons = document.querySelectorAll('a.lnk-ostup');
            var i, buttons;
            for (i = 0; i < buttons.length; i += 1) {
                button = buttons[i];
                button.textContent = this.getButtonText();
            }
        }
    }
]

var select_site = function(sites) {
    var url = location.href;
    var i, site;
    for (i = 0; i < sites.length; i += 1) {
        site = sites[i];
        if (url.indexOf(site.url) === 0) {
            return site;
        }
    }
    return null;
};

var site = select_site(sites);
if (site !== null) {
    GM_addStyle(site.style);
    site.addButtons();
    document.addEventListener("LightPagerAppended", function() {
        site.addButtons();
        site.doFilter();
    });
}
