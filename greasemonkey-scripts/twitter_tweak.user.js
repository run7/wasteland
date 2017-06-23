// ==UserScript==
// @name        Twitter Tweak
// @namespace   qixinglu.com
// @include     https://twitter.com/*
// @version     1
// @grant       none
// ==/UserScript==

let useChinese = function() {
    let nodes = document.querySelectorAll('*[lang="ja"]');
    for (let node of nodes) {
        node.setAttribute('lang', 'zh');
    }
}

let prefetcheImage = function() {
    let nodes = document.querySelectorAll('.AdaptiveMedia-photoContainer img');
    let head = document.querySelector('head');
    for (let node of nodes) {
        if (node.getAttribute('prefetched') === 'true') {
            continue
        }
        let link = document.createElement('link');
        link.setAttribute('rel', 'prefetch');
        link.setAttribute('href', `${node.src}:large`);
        head.appendChild(link);
        node.getAttribute('prefetched', 'true');
    }
}

setInterval(function() {
    useChinese();
    prefetcheImage();
}, 1000);
