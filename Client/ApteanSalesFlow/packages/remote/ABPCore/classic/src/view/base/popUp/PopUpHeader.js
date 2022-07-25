/**
 *
 * Extended Header for ABP PopUps.
 *
 * Created so we can control the style of the header
 *
 */
Ext.define('ABP.view.base.popUp.PopUpHeader', {
    extend: 'Ext.container.Container',
    alias: 'widget.popupheader',

    cls: 'abp-popup-header',
    ui: 'popup',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [{
        // display component for top strip
        xtype: 'component',
        cls: 'abp-popup-header-topstrip'
    }, {
        xtype: 'header',
        itemId: 'abpPanelHeader',
        cls: 'abp-popup-header-header',
        defaultType: 'tool'
    }],
    initComponent: function () {
        // Only way to set the nested title
        if (this.title) {
            this.items[1].title = this.title;
        }
        this.callParent(arguments);
    },
    // Needed for sencha to call, doesn't need to do anything
    setPosition: function (pos) {
        this.down('#abpPanelHeader').setPosition(pos);
    },
    getInnerHeader: function () {
        return this.down('#abpPanelHeader');
    },
    setTitle: function (title) {
        this.down('#abpPanelHeader').setTitle(title);
    }
});
