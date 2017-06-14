/**
 * Open link below mouse in sidebar.
 */

var url = FireGestures.getLinkURL();
if (url) {
    openWebPanel(url, url);
} else {
    toggleSidebar('viewWebPanelsSidebar');
}
