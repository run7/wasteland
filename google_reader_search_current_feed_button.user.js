// ==UserScript==
// @name           Google Reader Search Current Feed Button
// @namespace      http://qixinglu.com
// @description    Add a new button next search button, to search current feed.
// @include        http://www.google.com/reader/view/*
// @include        https://www.google.com/reader/view/*
// ==/UserScript==

var search_node, search_button_nodes, search_button_node, new_search_button_node;
search_node = document.getElementById("search")
search_button_nodes = search_node.getElementsByClassName('jfk-button');
search_button_node = search_button_nodes[search_button_nodes.length - 1];
new_search_button_node = search_button_node.cloneNode(true);

new_search_button_node.addEventListener("click", function() {
    var url, search_string, replace_string, reg;
    url = window.location.href;
    search_string = document.getElementById("search-input").value;
    if (search_string === "") {
        return;
    }
    replace_string = "#search/" + search_string + "/";
    if (url.indexOf("#stream") !== -1) {
        window.location.href = url.replace("#stream",replace_string);
    } else if (url.indexOf("#search") != -1) {
        reg = new RegExp("#search/[^/]\+/");
        window.location.href = url.replace(reg,replace_string);
    }
}, false);
new_search_button_node.addEventListener("mouseover", function() {
    this.classList.add('jfk-button-hover');
}, false);
new_search_button_node.addEventListener("mouseout", function() {
    this.classList.remove('jfk-button-hover');
}, false);

search_node.appendChild(new_search_button_node);
