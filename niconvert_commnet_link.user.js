// ==UserScript==
// @name           Niconvert Commnet Link
// @namespace      qixinglu.com
// @description    显示Acfun和Bilibili的弹幕评论地址
// @include        http://www.bilibili.tv/video/*
// @include        http://bilibili.kankanews.com/video/*
// @include        http://bilibili.smgbb.cn/video/*
// @include        http://www.acfun.tv/v/*
// ==/UserScript==

var create_link = function(commnet_url) {
    var link = document.createElement('a');
    link.href = commnet_url;
    link.text = '评论地址';
    return link;
}

var do_bilibili = function() {
    var innerHTML = document.documentElement.innerHTML;
    var matches = innerHTML.match(/flashvars="(.+?)"/i);
    if (matches === null) {
        matches = innerHTML.match(/\/secure,(.+?)"/i);
    }
    var info_args = matches[1].replace(/&amp;/g, '&');
    var info_url = 'http://interface.bilibili.tv/player?' + info_args;

    GM_xmlhttpRequest({
        method: "GET",
        url: info_url,
        onload: function(response) {
            var commnet_uid = response.responseText.match(/<chatid>(.+?)<\/chatid>/)[1];
            var commnet_url = "http://comment.bilibili.tv/" + commnet_uid + '.xml';
            var link = create_link(commnet_url);
            link.style.marginLeft = "5px";
            link.style.lineHeight = "20px";
            document.querySelector('.info').appendChild(link);
        }
    });
}

var do_acfun = function() {
    var innerHTML = document.documentElement.innerHTML;
    var matches = innerHTML.match(/\[Video\](.+?)\[\/Video\]/i);
    if (matches === null) {
        matches = innerHTML.match(/value="vid=(.+?)&/i);
    }
    var info_args = matches[1];
    var info_url = 'http://www.acfun.tv/api/player/vids/' + info_args + '.aspx';
    console.log(info_url);

    GM_xmlhttpRequest({
        method: "GET",
        url: info_url,
        onload: function(response) {
            var commnet_uid = JSON.parse(response.responseText).cid;
            var commnet_url = "http://comment.acfun.tv/" + commnet_uid + ".json";
            var link = create_link(commnet_url);
            link.style.marginLeft = "15px";
            document.querySelector('#subtitle-article').appendChild(link);
        }
    });

}

if (location.href.indexOf("http://www.acfun.tv") === 0) {
    window.addEventListener('load', do_acfun);
} else {
    do_bilibili();
}

