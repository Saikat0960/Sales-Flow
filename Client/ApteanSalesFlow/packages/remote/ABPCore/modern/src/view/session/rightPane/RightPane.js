Ext.define('ABP.view.session.rightPane.RightPane', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.rightpanecanvas',
    itemId: 'rightPane',
    requires: [
        'ABP.view.session.rightPane.RightPaneController',
        'ABP.view.session.rightPane.RightPaneModel'
    ],
    controller: 'rightpanecontroller',
    viewModel: {
        type: 'rightpanemodel'
    },
    bind: {
        minWidth: '{menuWidth}',
    },
    height: '100%',
    cls: ['rightpane'],
    hidden: true,
    ui: 'transparent',
    hideAnimation: {
        type: 'slide',
        out: true,
        direction: 'right'
    },
    showAnimation: {
        type: 'slide',
        out: false,
        direction: 'left'
    }
});
