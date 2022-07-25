Ext.define('ABP.view.session.mainMenu.ABPTreeList', {
    extend: 'Ext.list.Tree',
    alias: 'widget.treelistmenu',
    requires: [
        'ABP.view.session.mainMenu.ABPTreeListModel',
        'ABP.view.session.mainMenu.ABPTreeListController',
        'ABP.view.session.mainMenu.ABPTreeListItem',
        'Ext.list.Tree'
    ],
    viewModel: {
        type: 'abptreelistmodel'
    },
    controller: 'abptreelistcontroller',
    itemId: 'treelistmenu',
    cls: 'mainnav-treelist',
    automationCls: 'mainnav-treelist',
    ui: 'dark',
    docked: 'left',
    width: 175,
    expanderFirst: false,
    expanderOnly: false,
    focusable: true,
    tabIndex: 0,
    //onFocus: 'treeListFocus',
    bind: {
        singleExpand: '{mainMenuSingleExpand}'
    },
    defaults: {
        xtype: 'abptreelistitem'
    },
    listeners: {
        focus: 'treeListFocus'
    },

    keyMap: {
        DOWN: 'navigateDownPress',
        UP: 'navigateUpPress',
        LEFT: 'navigateLeftPress',
        RIGHT: 'navigateRightPress',
        ENTER: 'navigateSelect',
        SPACE: 'navigateSelect',
        "ALT+ENTER": 'navigateSelectSpecial',
        "ALT+SPACE": 'navigateSelectSpecial',
        "SHIFT+TAB": 'navigateSelectShiftTab'
    },

    indent: 12,
    getIndent: function () {
        return 12;
    }
});
