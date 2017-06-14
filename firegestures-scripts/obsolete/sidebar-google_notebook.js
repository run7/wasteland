var sidebarBox = document.getElementById("sidebar-box");
if (sidebarBox.hidden) {
    openWebPanel("Google Notebook", "http://www.google.com/notebook/ig");
} else {
    toggleSidebar("viewWebPanelsSidebar");
}
