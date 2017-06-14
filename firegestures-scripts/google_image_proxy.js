/**
 * Use Google as image proxy.
 */

var prefix = 'https://images2-focus-opensocial.googleusercontent.com/gadgets/proxy?url=';
var suffix = '&container=focus&gadget=a&no_expand=1&resize_h=0&rewriteMime=image%2F*';

var nodes = content.document.querySelectorAll('img');
var i, node, loaded, changed;
for (i = 0; i < nodes.length; i += 1) {
    node = nodes[i];
    loaded = node.naturalWidth !== 0 || node.naturalHeight !== 0;
    changed = node.src.indexOf(prefix) !== -1;
    if (loaded || changed) {
        continue;
    }
    node.src = prefix + encodeURIComponent(node.src) + suffix;
}
