Ext.define('ABP.view.session.mainMenu.MenuItem', {
    extend: 'Ext.Container',
    alias: 'widget.menubutton',
    requires: [
        'ABP.view.session.mainMenu.MenuItemModel'
    ],
    viewModel: {
        type: 'menuitemmodel'
    },
    config: {
        icon: '',
        uniqueId: '',
        title: '',
        labelKey: '',
        labelVal: '',
        tabId: '',
        command: '',
        args: '',
        enabled: true,
        tooltip: '',
        tooltipKey: '',
        type: '',
        children: '',
        place: '',
        appId: ''
    },
    cls: 'menu-item mi-Body',
    layout: '{micro}' ? { type: 'hbox', align: 'center' } : { type: 'vbox', align: 'center' },
    bind: {
        height: '{sessHeight}'
    },
    items: [
        {
            xtype: 'component',
            itemId: 'miIcon',
            html: 'icon', //'<i class="' + iconFont + '"></i>',
            cls: '{micro}' ? 'mi-icon-micro' : 'mi-icon'
        }, {
            xtype: 'component',
            itemId: 'miTitle',
            html: 'Label', //this.labelVal,
            cls: '{micro}' ? 'mi-title-micro' : 'mi-title'//,
            //            bind: {
            //                hidden: '{micro}'
            //            }
        }
    ],

    initialize: function () {
        var me = this;
        var iconFont = '';
        var icItem = me.down('#miIcon');
        var tiItem = me.down('#miTitle');
        var font = me.config.icon;
        me.el.dom.onclick = me.onMenuItemClick;
        font = font.split('-');
        iconFont = font[0] === 'fa' ? 'fa ' + me.config.icon : me.config.icon;
        if (icItem) {
            icItem.setHtml('<i class="' + iconFont + '"></i>');
        }
        if (!me.config.labelKey) {
            me.setCls(me.getCls()[0] + " a-menu-unsafe-" + me.config.title.replace(/[^A-Za-z]/g, ''));
            //me.cls = me.cls + " a-menu-unsafe-" + me.config.title.replace(/[^A-Za-z]/g, '');
            me.config.labelVal = me.config.title;
            if (tiItem) {
                if (me.config.labelVal) {
                    if (me.config.labelVal[0] === '{') {
                        tiItem.setBind({ html: me.config.labelVal });
                    } else {
                        tiItem.setHtml(Ext.String.htmlEncode(me.config.labelVal));
                    }
                }
            }
        } else {
            me.setCls(me.getCls()[0] + " a-menu-" + me.config.labelKey.replace(/_/g, '-'));
            //me.cls = me.cls + " a-menu-" + me.config.labelKey.replace(/_/g, '-');
            //me.config.labelVal = me.checkLabel(me.config.labelKey)
            //me.config.labelVal = me.config.title;
            if (tiItem) {
                tiItem.setBind({ html: '{i18n.' + me.config.labelKey + '}' });
            }
        }

    },

    onMenuItemClick: function () {
        var me = Ext.getCmp(this.id);
        me.fireEvent('miItemClick', me, true);
    },

    setSelected: function (doHighlight) {
        if (doHighlight) {
            this.addCls("mi-body-selected");
        } else {
            this.removeCls("mi-body-selected");
        }
    },
    isSelected: function () {
        return this.hasCls("mi-body-selected");
    },

    checkLabel: function (checkString) {
        var me = this;
        var myLength = ABP.util.Common.measureTextSingleLine(checkString, 'Arial').width * 1.25;
        var subString = [];
        var manString;
        var i;
        var lastThatFit = '';
        var ret = checkString;
        if (myLength > 140) {
            manString = checkString.split(' ');
            if (manString.length > 2) { //multiple seperations
                lastThatFit = manString[0];
                for (i = 1; i < manString.length; i++) {
                    if (ABP.util.Common.measureTextSingleLine(lastThatFit + manString[i] + ' ').width * 1.25 < 140) {
                        lastThatFit = lastThatFit + ' ' + manString[i];
                    } else {
                        break;
                    }
                }
                subString[0] = lastThatFit;
                subString[1] = manString[i];
                for (i++; i < manString.length; i++) {
                    subString[1] = subString[1] + ' ' + manString[i];
                }
                if (ABP.util.Common.measureTextSingleLine(subString[1], 'Arial').width * 1.25 < 140) {
                    ret = subString[0] + '<br>' + subString[1];
                    me.down('#miTitle').addCls('mi-double');
                    me.addCls('mi-double');
                } else {
                    lastThatFit = subString[1][0];
                    for (i = 1; i < subString[1].length; ++i) {
                        if (ABP.util.Common.measureTextSingleLine(lastThatFit + subString[1][i] + '...', 'Arial').width * 1.25 < 140) {
                            lastThatFit = lastThatFit + subString[1][i];
                        } else {
                            break;
                        }
                    }
                    ret = subString[0] + '<br>' + lastThatFit + '...';
                    me.down('#miTitle').addCls('mi-double');
                    me.addCls('mi-double');
                }
            } else if (manString.length === 2) { // one seperation
                if (ABP.util.Common.measureTextSingleLine(manString[0], 'Arial').width * 1.25 < 140) {
                    ret = manString[0] + '<br>' + manString[1];
                    me.down('#miTitle').addCls('mi-double');
                    me.addCls('mi-double');
                } else {
                    me.down('#miTitle').removeCls('mi-double');
                    me.removeCls('mi-double');
                }
            } else { //no seperations
                for (i = 0; i < checkString.length; i++) {
                    if (ABP.util.Common.measureTextSingleLine(lastThatFit + checkString[i], 'Arial').width * 1.25 < 140) {
                        lastThatFit = lastThatFit + checkString[i];
                    } else {
                        break;
                    }
                }
                manString[0] = checkString.slice(0, i - 1);
                manString[1] = checkString.slice(i - 1);
                if (ABP.util.Common.measureTextSingleLine(manString[1], 'Arial').width * 1.25 < 140) {
                    ret = manString[0] + '-<br>' + manString[1];
                    me.down('#miTitle').addCls('mi-double');
                    me.addCls('mi-double');
                } else {
                    lastThatFit = manString[1][0];
                    for (i = 1; i < manString[1].length; ++i) {
                        if (ABP.util.Common.measureTextSingleLine(lastThatFit + manString[1][i] + '...', 'Arial').width * 1.25 < 140) {
                            lastThatFit = lastThatFit + manString[1][i];
                        } else {
                            break;
                        }
                    }
                    ret = manString[0] + '-<br>' + lastThatFit + '...';
                    me.down('#miTitle').addCls('mi-double');
                    me.addCls('mi-double');
                }
            }
        } else {
            me.down('#miTitle').removeCls('mi-double');
            me.removeCls('mi-double');
        }
        return ret;
    }
});