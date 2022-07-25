Ext.define('ABP.view.session.toolbarTop.ToolbarTop', {
    extend: 'Ext.TitleBar',
    alias: 'widget.toolbartop',
    requires: ['ABP.view.session.toolbarTop.ToolbarTopController'],
    viewModel: {
        type: 'toolbartopmodel'
    },
    controller: 'toolbartopcontroller',
    docked: 'top',
    bind: {
        title: '{toolbarTitle:htmlEncode}',
        height: '{toolbarHeight}',
        cls: '{toolCls}'
    },
    titleAlign: 'Center',
    items: [
        {
            xtype: 'container',

            align: 'left',
            layout: {
                type: 'hbox',
                align: 'start',
                pack: 'start'
            },
            itemId: 'tool-buttons-left',
            docked: 'left',
            cls: 'left-cont',
            items: [
                {
                    xtype: 'button',
                    cls: 'tool-button-left toolbar-button a-toolbar-main-menu',
                    ariaLabel: '{i18n.toolbar_toggleNavigation:ariaEncode}',
                    iconCls: 'icon-menu toolbar-icon',
                    itemId: 'toolbar-button-menu',
                    handler: 'toggleMenu',
                    pressedCls: 'toolbar-button-pressed',
                    userCls: ['dark', 'medium']
                }
            ]
        }, {
            // Container for the tab panel buttons.
            xtype: 'segmentedbutton',
            docked: 'right',
            align: 'right',
            itemId: 'rightpaneButtons',
            bind: {
                height: '{toolbarHeight}'
            },
            items: [],
            allowMultiple: false,
            allowDepress: true,
            listeners: {
                // Wait until segmented buttons created before adding the right pane configurations
                initialize: 'constructRightPane'
            }
        }, {
            xtype: 'container',
            align: 'right',
            layout: {
                type: 'hbox',
                align: 'end',
                pack: 'end'
            },
            itemId: 'tool-buttons-right',
            docked: 'right',
            cls: 'right-cont',

            items: [],
            addButton: function (buttonToAdd) {
                var me = this;
                me.insert(0, buttonToAdd);
            }
        }
    ]
});
