Ext.define('ABP.view.session.help.HelpView', {
    extend: 'ABP.view.components.panel.HeaderPanelBase',
    alias: 'widget.helpview',
    requires: [
        'ABP.view.session.help.HelpController',
        'ABP.view.session.help.HelpViewModel',
        'ABP.view.session.help.HelpTile'
    ],
    controller: 'helpcontroller',
    viewModel: {
        type: 'helpviewviewmodel'
    },
    bind: {
        title: '{i18n.help_title:htmlEncode}'
    },
    layout: { type: 'vbox', pack: 'start' },
    cls: 'x-unselectable help-container',
    closable: true,
    items: [
        {
            xtype: 'container',
            minHeight: 200,
            width: '100%',
            cls: 'help_aptean_header',
            layout: { type: 'vbox', align: 'middle', pack: 'center' },
            items: [
                {
                    xtype: 'component',
                    width: 250,
                    height: 40,
                    itemId: "help-aptean-logo",
                    cls: "help_aptean_logo"
                },
                {
                    xtype: 'label',
                    width: '50%',
                    cls: 'help_aptean_text',
                    bind: { text: '{i18n.help_text:htmlEncode}' },
                    flex: 1
                }
            ]
        },
        {
            xtype: 'container',
            reference: 'abp-help-tile-container',
            cls: 'abp-help-tile-container',
            width: '100%',
            defaultType: 'helptile'
        }
    ],
    initComponent: function () {
        var me = this;
        me.callParent();
        me.getViewModel().LoadStoreData();
        me.fireEvent('helpview_intialLoad');
    }
});