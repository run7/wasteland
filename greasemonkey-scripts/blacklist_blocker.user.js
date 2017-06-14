// ==UserScript==
// @name        Blacklist Blocker
// @namespace   qixinglu.com
// @description Block page content by blacklist
// @grant       none
// @include     http://nowhere/
// ==/UserScript==

'use strict';

window.BlacklistBlocker = function(rules) {

    let re = (p) => new RegExp(p);
    let mixin = function(target, mixinObject) {
        for (let [name, prop] of window.Iterator(mixinObject)) {
            target[name] = prop;
        }
    };

    let nodeMixin = {
        xcontains: function(selector, keywords) {
            if (!Array.isArray(keywords)) {
                keywords = [keywords];
            }
            for (let child of this.querySelectorAll(selector)) {
                let text = child.textContent;
                for (let keyword of keywords) {
                    if (text.contains(keyword)) {
                        return true;
                    }
                }
            }
            return false;
        },
    };

    let applyRule = function(rule) {
        for (let node of document.querySelectorAll(rule.node)) {
            mixin(node, nodeMixin);
            if (!rule.hide(node)) {
                continue;
            }
            if (rule.test) {
                node.style.boxShadow = '0 0 2px 2px #FF5555';
            } else {
                node.remove();
            }
        }
    };

    let watchDomChange = function(rule) {
        if (!rule.watch) {
            return;
        }

        let target = document.querySelector(rule.watch);
        let observer = new MutationObserver(() => {
            applyRule(rule);
        });

        let config = {childList: true};
        observer.observe(target, config);
    };

    let isMatchUrls = function(urls) {
        if (typeof(urls) === 'string') {
            urls = [urls];
        }
        for (let url of urls) {
            if (re(url).test(location.href)) {
                return true;
            }
        }
        return false;
    };

    let avaiableRules = rules.filter((e) => isMatchUrls(e.urls));
    avaiableRules.forEach(watchDomChange);

    let run = () => avaiableRules.forEach(applyRule);

    let exports = {
        run: run,
    };
    return exports;
};
