Ext.define('ABP.view.session.about.AboutItem', {
    extend: 'Ext.container.Container',
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
    minHeight: 120,

    initComponent: function () {
        var me = this;
        var linkcls = '';
        me.items = [];

        if (me.getShowIcon()) {
            if (me.getIcon()) {
                me.items.push({
                    xtype: 'component',
                    cls: "about-item-icon icon-" + me.getIcon(),
                });
            } else {
                me.items.push({
                    xtype: 'component',
                    cls: "about-item-icon icon-gearwheel",
                });
            }
        }

        me.items.push({
            xtype: 'component',
            cls: "about-item-title",
            html: me.getName()
        });
        if (me.getVersion()) {
            me.items.push({
                xtype: 'component',
                cls: "about-item-text",
                bind: {
                    html: '{i18n.about_version:htmlEncode} ' + me.getVersion()
                }
            });
        }
        if (me.getBuild()) {
            me.items.push({
                xtype: 'component',
                cls: "about-item-text",
                bind: {
                    html: '{i18n.about_build:htmlEncode} ' + me.getBuild()
                }
            });
        }
        if (me.getCopyright()) {
            me.items.push({
                xtype: 'component',
                cls: "about-item-text",
                html: me.getCopyright()
            });
        }
        if (me.getDetail()) {
            linkcls = 'a-about-' + me.getName().replace(' ', '-');
            me.items.push({
                xtype: 'component',
                cls: "about-item-detail" + " " + linkcls,
                bind: {
                    html: '{i18n.about_detail:htmlEncode}'
                },
                listeners: {
                    el: {
                        click: function () {
                            ABP.view.base.popUp.PopUp.customPopup(me.getDetail(), me.getName());
                        }
                    }
                }
            });
        }
        me.callParent();
    }
});