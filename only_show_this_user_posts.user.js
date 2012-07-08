// ==UserScript==
// @name        Only Show This User Posts
// @namespace   qixinglu.com
// @description Only show the user posts you just want to read
// @include     http:///localhost/*
// ==/UserScript==

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
    var runtime = {
        username: null,
        post_display: 'block'
    }

    var add_custom_style = function() {
        if (site.style !== undefined) {
            GM_addStyle(site.style);
        }
    }

    var setup_post_display = function() {
        post = document.querySelector(site.post);
        if (post !==  null) {
            runtime.post_display = window.getComputedStyle(post).display;
        }

    }

    var do_filter = function() {

        var posts = document.querySelectorAll(site.post);

        var show_only = function() {
            for (var i = 0; i < posts.length; i += 1) {
                var post = posts[i];
                var link = post.querySelector(site.username);
                if (link === null || link.textContent !== runtime.username) {
                    post.style.display = 'none';
                }
            }
        };

        var show_all = function() {
            for (var i = 0; i < posts.length; i += 1) {
                posts[i].style.display = runtime.post_display;
            }
        };

        if (runtime.username === null) {
            show_all(posts);
        } else {
            show_only(posts);
        }
    };

    var get_button_text = function() {
        return runtime.username === null ? '只看这个用户' : '显示全部用户';
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
                if (runtime.username === null) {
                    runtime.username = post.querySelector(site.username).textContent;
                } else {
                    runtime.username = null;
                }
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
    setup_post_display();
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

// only run as main file
if (GM_info.script.name === 'Only Show This User Posts') {
    var site = select_site(SITES);
    if (site !== null) {
        var control = ostup(site);
        document.addEventListener("LightPagerAppended", function() {
            control.add_buttons();
            control.do_filter();
        });
    }
}
