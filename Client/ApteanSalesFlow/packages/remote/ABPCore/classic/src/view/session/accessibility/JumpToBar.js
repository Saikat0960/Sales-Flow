Ext.define('ABP.view.session.accessibility.JumpToBar', {
    extend: 'Ext.Container',
    requires: [
        'ABP.view.session.accessibility.JumpToBarController',
        'ABP.view.session.accessibility.JumpToBarViewModel'
    ],
    dock: 'top',
    alias: 'widget.jumptobar',
    xtype: 'jumptobar',
    controller: 'jumptobar',
    viewModel: 'jumptobar',

    layout: {
        type: 'hbox',
        align: 'stretch',
        pack: 'center'
    },
    
    cls: 'jump-to-bar',
    padding: 4,
    height: 40,
    
    hideMode: 'offsets',
    hidden: true,
    tabIndex: 0,

    listeners: {
        focusenter: 'onFocusEnter',
        focusleave: 'onFocusLeave',
        show: 'onShow'
    },

    items:[
        {
            xtype: 'combobox',
            itemId: 'JumpToCombo',
            bind: {
                store: '{targets}',
                fieldLabel: '{i18n.toolbar_jumpTo:htmlEncode}',
                emptyText: '{i18n.toolbar_placeinapplication:htmlEncode}'
            },
            queryMode: 'local',
            displayField: 'text',
            labelWidth: 245,
            labelAlign: 'right',
            //valueField: 'region',
            forceSelection: true,
            flex: 1,
            maxWidth: 500,
            listeners: {
                select: 'onSelection'
            }
        },

        {
            xtype: 'component',
            cls: 'jump-to-help',
            //width: '100%',
            componentCls: 'x-unselectable',
            html: 'press <span>ALT</span>+<span>/</span> to show this menu',
            // bind: {
            //     html: '{i18n.login_settingsTitle:htmlEncode}'
            // },
            tabIndex: -1,
            flex: 1
        },
    ]
});