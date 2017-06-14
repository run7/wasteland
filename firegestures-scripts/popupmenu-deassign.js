/**
 * Firegestures popup menu deassign.
 */

FireGestures.generatePopup(event, [
    {
        label: '用 Chrome 打开',
        oncommand: 'FireGestures.runByName("用 Chrome 打开");'
    },
    {
        label: '显示历史侧边栏',
        oncommand: 'FireGestures.runByDirection("LR");'
    },
    {
        label: '显示历史侧边栏',
        oncommand: 'FireGestures.runByCommand("FireGestures:HistorySidebar");'
    }
]);

FireGestures.runByName = function(name) {
    var mappings = this._gestureMapping.getMappingArray();
    var matchMapping = null;
    var i, mapping;
    for (i = 0; i < mappings.length; i += 1) {
        mapping = mappings[i];
        if (mapping[1] === name) {
            matchMapping = mapping;
            break;
        }
    }
    if (matchMapping !== null) {
        (new Function('event', matchMapping[2]))(event);
    }
};

FireGestures.runByDirection = function(direction) {
    var command = this._gestureMapping.getCommandForDirection(direction);
    if (command.type === this._gestureMapping.TYPE_SCRIPT) {
        (new Function('event', command.value))(event);
    } else {
        this._performAction(event, command.value);
    }
};

FireGestures.runByCommand = function(command) {
    this._performAction(event, command);
};
