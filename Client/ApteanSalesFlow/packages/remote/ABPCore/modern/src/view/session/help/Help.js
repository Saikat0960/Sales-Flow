Ext.define('ABP.view.session.help.Help', {
    extend: 'ABP.view.components.panel.HeaderPanelBase',
    alias: 'widget.helpview',
    requires: [
        'ABP.view.session.help.HelpController',
        'ABP.view.session.help.HelpViewModel',
        'ABP.view.session.help.HelpTile'
    ],
    viewModel: {
        type: 'helpviewviewmodel'
    },
    controller: 'helpcontroller',
    layout: { type: 'vbox', align: 'stretch' },
    cls: 'x-unselectable about-container',
    height: '100%',
    width: '100%',
    scrollable: 'y',
    bind: {
        title: '{i18n.help_title}'
    },
    closable: true,
    items: [
        {
            xtype: 'container',
            cls: Ext.os.deviceType === "Phone" ? 'help_aptean_header help_aptean_header_phone' : 'help_aptean_header help_aptean_header_tablet',
            layout: { type: 'vbox', align: 'stretch' },
            items: [
                {
                    xtype: 'component',
                    itemId: "help-aptean-logo",
                    cls: Ext.os.deviceType === "Phone" ? "help_aptean_logo help_aptean_logo_phone" : "help_aptean_logo help_aptean_logo_tablet"
                },
                {
                    xtype: 'label',
                    cls: Ext.os.deviceType === "Phone" ? "help_aptean_text help_aptean_text_phone" : "help_aptean_text help_aptean_text_tablet",
                    bind: { html: '{i18n.help_text:htmlEncode}' }
                }
            ]
        },
        {
            xtype: 'container',
            reference: 'abp-help-tile-container',
            cls: Ext.os.deviceType === "Phone" ? "abp-help-tile-container abp-help-tile-container_phone" : "abp-help-tile-container abp-help-tile-container_tablet",
            innerCls: 'abp-help-tile-container-inner',
            width: '100%',
            defaultType: 'helptile'
        }
    ],
    initialize: function () {
        var me = this;
        me.callParent();
        me.getViewModel().LoadStoreData();
        me.fireEvent('helpview_intialLoad');
    }
});