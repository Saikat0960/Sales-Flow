Ext.define('ABP.view.session.toolbarTop.ToolbarItem', {
    extend: 'Ext.button.Button',
    alias: 'widget.toolbarbutton',
    config: {
        ico: '',
        uniqueId: '',
        command: '',
        args: '',
        enabled: true,
        tooltip: '',
        tooltipKey: '',
        type: '',
        appId: '',
        button: 'default'
    },
    //cls: 'toolbar-menu-btn',
    //layout: { type: 'vbox', align: 'stretch' },
    //itemId: this.button,
    cls: 'toolbar-menu-btn ',
    overCls: 'toolbar-menu-btn-over',
    //    click: function () {
    //        this.clickItem();
    //    },
    handler: function (f, e) {
        if (e.type === "click") {
            this.clickItem();
        } else {
            this.enterItem();
        }
    },
    initComponent: function () {
        var me = this;
        var hide = me.enabled ? '' : ' toolbar-menu-disabled';
        var font = me.ico;
        font = font.split('-');
        var iconFont = font[0] === 'fa' ? font[0] + ' ' + me.ico : 'oCol' + ' ' + me.ico;
        me.cls = me.cls + iconFont + hide;
        me.tooltip = null;
        me.tooltipKey = null;
        me.callParent(arguments);
    },
    clickItem: function () {
        if (this.enabled) {
            this.fireEvent("toolbar_click", this, true);
        }
    },
    enterItem: function () {
        if (this.enabled) {
            this.fireEvent("toolbar_click", this, false);
        }
    },
    enableButton: function () {
        var me = this;
        me.enabled = true;
        me.removeCls('toolbar-menu-disabled');
        var font = me.ico;
        font = font.split('-');
        var iconFont = font[0] === 'fa' ? font[0] + ' ' + me.ico : 'oCol' + ' ' + me.ico;
        me.setHtml('<i class="' + iconFont + '"></i>');
        me.focusable = true;
    },
    disableButton: function () {
        var me = this;
        me.enabled = false;
        me.addCls('toolbar-menu-disabled');
        me.focusable = false;
    }
});