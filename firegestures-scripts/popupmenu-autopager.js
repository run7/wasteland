/**
 * Firegestures popup menu for AutoPager.
 */

FireGestures.generatePopup(event, [
    {
        label: '切换自动翻页',
        oncommand: 'autopagerMain.onEnable();'
    },
    {
        label: '一翻到底',
        oncommand: 'autopagerMain.loadPages(content.document, 10000);'
    },
    {
        label: '自动翻 3 页',
        oncommand: 'autopagerMain.loadPages(content.document, 3);'
    },
    {
        label: '自动翻 5 页',
        oncommand: 'autopagerMain.loadPages(content.document, 5);'
    },
    {
        label: '自动翻 10 页',
        oncommand: 'autopagerMain.loadPages(content.document, 10);'
    },
    {
        label: '自动翻页工作室',
        oncommand: 'toggleSidebar("viewautopagerSidebar");'
    }
]);
