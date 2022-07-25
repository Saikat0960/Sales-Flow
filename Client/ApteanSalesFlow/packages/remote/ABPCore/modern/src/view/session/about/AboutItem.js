Ext.define('ABP.view.session.about.AboutItem', {
    extend: 'Ext.Container',
    alias: 'widget.aboutitem',
    layout: { type: 'vbox', pack: 'center', align: 'center' },
    cls: 'x-unselectable about-item-container',

    config: {
        showIcon: undefined,
        icon: undefined,
        name: undefined,
        version: undefined,
        build: undefined,
        detail: undefined,
        copyright: undefined
    },

    minHeight: Ext.os.deviceType === "Phone" ? 200 : 240,
    cls: Ext.os.deviceType === "Phone" ? "x-unselectable about-item-container about-item-container_phone" : "x-unselectable about-item-container about-item-container_tablet",

    initialize: function () {
        var me = this;
        var linkcls = '';
        var items = [];

        if (me.getShowIcon()) {
            if (me.getIcon()) {
                items.push({
                    xtype: 'component',
                    cls: "about-item-icon icon-" + me.getIcon(),
                });
            } else {
                items.push({
                    xtype: 'component',
                    cls: "about-item-icon icon-gearwheel",
                });
            }
        }

        items.push({
            xtype: 'component',
            cls: "about-item-title",
            html: me.getName()
        });
        if (me.getVersion()) {
            items.push({
                xtype: 'component',
                cls: "about-item-text",
                bind: {
                    html: '{i18n.about_version:htmlEncode} ' + me.getVersion()
                }
            });
        }
        if (me.getBuild()) {
            items.push({
                xtype: 'component',
                cls: "about-item-text",
                bind: {
                    html: '{i18n.about_build:htmlEncode} ' + me.getBuild()
                }
            });
        }
        if (me.getCopyright()) {
            items.push({
                xtype: 'component',
                cls: "about-item-text",
                html: me.getCopyright()
            });
        }
        if (me.getDetail()) {
            linkcls = 'a-about-' + me.getName().replace(' ', '-');
            items.push({
                xtype: 'component',
                cls: 'about-item-detail' + ' ' + linkcls,
                bind: {
                    html: '{i18n.about_detail:htmlEncode}'
                },
                listeners: {
                    click: {
                        element: 'element',
                        fn: function () {
                            ABP.view.base.popUp.PopUp.customPopup(me.getDetail(), me.getName());
                        }
                    }
                }
            });
        }
        me.setItems(items);
        me.callParent();
    }
});
