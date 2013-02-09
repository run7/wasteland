// ==UserScript==
// @name        Niconvert Commnet Link
// @namespace   qixinglu.com
// @description 显示Acfun和Bilibili的弹幕评论地址
// @grant       GM_xmlhttpRequest
// @include     http://www.bilibili.tv/video/*
// @include     http://bilibili.kankanews.com/video/*
// @include     http://bilibili.smgbb.cn/video/*
// @include     http://www.acfun.tv/v/*
// ==/UserScript==

var createLink = function(commentUrl) {
    var link = document.createElement('a');
    link.href = commentUrl;
    link.text = '评论地址';
    return link;
};

var bilibili = function() {
    var innerHTML = document.documentElement.innerHTML;
    var matches = innerHTML.match(/flashvars="(.+?)"/i);
    if (matches === null) {
        matches = innerHTML.match(/\/secure,(.+?)"/i);
    }
    var infoArgs = matches[1].replace(/&amp;/g, '&');
    var infoUrl = 'http://interface.bilibili.tv/player?' + infoArgs;

    GM_xmlhttpRequest({
        method: 'GET',
        url: infoUrl,
        onload: function(response) {
            var prefix = 'http://comment.bilibili.tv/';
            var reg = /<chatid>(.+?)<\/chatid>/;
            var commentUid = response.responseText.match(reg)[1];
            var commentUrl = prefix + commentUid + '.xml';
            var link = createLink(commentUrl);
            link.style.marginLeft = '5px';
            link.style.lineHeight = '20px';
            document.querySelector('.info').appendChild(link);
        }
    });
};

var acfun = function() {
    var innerHTML = document.documentElement.innerHTML;
    var matches = innerHTML.match(/\[Video\](.+?)\[\/Video\]/i);
    if (matches === null) {
        matches = innerHTML.match(/value="vid=(.+?)&/i);
    }
    var infoArgs = matches[1];
    var infoUrl = 'http://www.acfun.tv/api/player/vids/' + infoArgs + '.aspx';

    GM_xmlhttpRequest({
        method: 'GET',
        url: infoUrl,
        onload: function(response) {
            var prefix = 'http://comment.acfun.tv/';
            var commentUid = JSON.parse(response.responseText).cid;
            var commentUrl = prefix + commentUid + '.json';
            var link = createLink(commentUrl);
            link.style.marginLeft = '15px';
            document.querySelector('#subtitle-article').appendChild(link);
        }
    });

};

if (location.href.indexOf('http://www.acfun.tv') === 0) {
    window.addEventListener('load', acfun);
} else {
    bilibili();
}

