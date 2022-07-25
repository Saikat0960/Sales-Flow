/**
 *
 * Extended Header for ABP PopUps.
 *
 * Created so we can control the style of the header
 *
 */
Ext.define('ABP.view.base.popUp.PopUpHeader', {
    extend: 'Ext.Container',
    alias: 'widget.popupheader',

    cls: 'abp-popup-header',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [{
        xtype: 'panelheader',
        itemId: 'abpPanelHeader',
        cls: 'abp-popup-header-header',
        titleRotation: '0',
        defaultType: 'tool'
    }],
    /*setTitle: function (title) {
        this.down('#abpPanelHeader').setTitle(title);
    },*/
    // Needed for sencha to call, doesn't need to do anything
    setPosition: function (pos) {
        this.down('#abpPanelHeader').setPosition(pos);
    },
    getInnerHeader: function () {
        return this.down('#abpPanelHeader');
    }
});