/**
 * Copy selected links url to clipboard.
 */

var FORMAT = '${href}';

var xpcomFactory = {
    clipboard: function() {
        return Cc['@mozilla.org/widget/clipboardhelper;1']
               .getService(Ci.nsIClipboardHelper);
    }
};

var xpcomUtil = {

    writeClipboard: function(text) {
        xpcomFactory.clipboard().copyString(text);
    }

};

/* This function motify from FireGestures source
 * /chrome/content/firegestures/browser.js:gatherLinkURLsInSelection
 * just replace one line:
 *     ret.push(node.href);
 * to
 *     ret.push(node);
 */
FireGestures.gatherLinksInSelection = function() {
    var win = this.focusedWindow;
    var sel = win.getSelection();
    if (!sel || sel.isCollapsed)
        return null;
    var doc = win.document;
    var ret = [];
    for (var i = 0; i < sel.rangeCount; i++) {
        var range = sel.getRangeAt(i);
        var fragment = range.cloneContents();
        var treeWalker = fragment.ownerDocument.createTreeWalker(fragment, NodeFilter.SHOW_ELEMENT, null, true);
        while (treeWalker.nextNode()) {
            var node = treeWalker.currentNode;
            if ((node instanceof HTMLAnchorElement || node instanceof HTMLAreaElement) && node.href) {
                try {
                    this.checkURL(node.href, doc, Ci.nsIScriptSecurityManager.DISALLOW_SCRIPT);
                    ret.push(node);
                }
                catch(ex) {
                    alert(ex);	// #debug
                }
            }
        }
    }
    return ret;
};

var createText = function(links) {
    var lines = [];
    var i, link, line;
    for (i = 0; i < links.length; i += 1) {
        link = links[i];
        line = FORMAT.replace('${href}', link.href);
        line = line.replace('${text}', link.text);
        lines.push(line);
    }
    return lines.join('\n');
};

var links = FireGestures.gatherLinksInSelection();
var text, clipboard;
if (links !== null && links.length > 0) {
    text = createText(links);
    xpcomUtil.writeClipboard(text);
    FireGestures.setStatusText(links.length +
                               ' links have copied to clipboard.');
} else {
    FireGestures.setStatusText('No valid links in selection.');
}
