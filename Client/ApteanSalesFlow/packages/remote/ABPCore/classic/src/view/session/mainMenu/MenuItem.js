/////////////////////////////////////////////////////////////////////////////////////
//  Name:      app/view/session/mainMenu/MenuItem.js
//  Purpose:   Basic structure for a Menu item
//  Created:   7/8/2014 - Joe Blenis
//  Last Edit: 7/8/2014 - Joe Blenis - Created File
/////////////////////////////////////////////////////////////////////////////////////
Ext.define('ABP.view.session.mainMenu.MenuItem', {
    extend: 'Ext.container.Container',
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
        shorthand: '',
        type: '',
        children: '',
        place: '',
        appId: ''
    },
    cls: 'menu-item mi-Body',
    // overCls: 'mi-body-over',
    ui: 'menuitem',
    uiCls: 'dark',
    overCls: 'x-hover',
    layout: { type: 'hbox', align: 'center' },
    height: 41,
    bind: {
        width: '{menuWidth}'
    },

    afterRender: function () {
        var me = this;
        var ttString = "";
        var keyString;
        me.callParent();

        me.getEl().dom.onclick = me.onMenuItemClick;


        if (me.tooltip && me.tooltip !== "") {
            ttString = me.tooltip;
        }
        if (me.tooltipKey && me.tooltipKey !== "") {
            keyString = ABP.util.Common.geti18nString(me.tooltipKey);
            if (keyString !== me.tooltipKey) {
                ttString = keyString;
            }
        }
        if (ttString !== "") {
            me.tooltip = Ext.create('Ext.tip.ToolTip', {
                target: me.getId(),
                text: ttString,
                cls: 'tooltip-mm',
                listeners: {
                    beforeshow: function (scope, eOpts) {
                        var rowNode = scope.currentTarget;
                        var rowChildren = Array.from(rowNode.dom.children);
                        var totalWidth = rowChildren.reduce(function (accum, child) {
                            return accum + child.offsetWidth;
                        }, 0);
                        var hasEllipsis = totalWidth >= rowNode.getWidth();
                        return hasEllipsis;
                    }
                }
            });
        }
    },

    initComponent: function () {
        var me = this;
        var iconFont = '';
        var font = me.icon.split('-');

        var items = [];

        if ((me.icon && me.icon[0] !== '{') && (me.title && me.title[0] !== '{')) {
            iconFont = font[0] === 'fa' ? 'fa ' + me.icon : /*'oCol ' +*/ me.icon;
            if (!me.labelKey) {
                me.cls = me.cls + " a-menu-unsafe-" + me.title.replace(/[^A-Za-z]/g, '');
                me.labelVal = me.title;
            } else {
                me.cls = me.cls + " a-menu-" + me.labelKey.replace(/_/g, '-');
            }
            items.push({
                xtype: 'component',
                itemId: 'miIcon',
                html: '<i class="' + iconFont + '"></i>',
                cls: 'mi-icon-micro',
                bind: {
                    cls: '{classicMenuExpand}'
                },
                setCls: function (expand) {
                    if (expand) {
                        this.removeCls('icon-expanded');
                    } else {
                        this.addCls('icon-expanded');
                    }
                }
            });
        } else {
            items.push({
                xtype: 'component',
                itemId: 'miIcon',
                //html: '<i class="' + iconFont + '"></i>',
                cls: 'mi-icon-micro',
                bind: {
                    cls: '{classicMenuExpand}',
                    html: '<i class="' + me.icon + '"></i>'
                },
                setCls: function (expand) {
                    if (expand) {
                        this.removeCls('icon-expanded');
                    } else {
                        this.addCls('icon-expanded');
                    }
                }
            });
        }

        items.push({
            xtype: 'component',
            itemId: 'miTitle',
            bind: {
                hidden: '{!classicMenuExpand}',
                html: me.labelKey ? '{i18n.' + me.labelKey + '}' : me.title
            },
            cls: 'mi-title-micro'
        });

        if (me.shorthand) {
            items.push({
                xtype: 'component',
                itemId: 'miShorthand',
                html: me.shorthand,
                cls: 'mi-shorthand',
                ariaAttributes: {
                    'aria-hidden': 'true'
                }
            });
        }

        me.items = items;
        me.ariaRole = 'menuitem';
        me.ariaLabel = 'Main Menu ' + me.title;
        me.callParent(arguments);
    },

    listeners: {
        el: {
            keydown: function (f, e) {
                if (this.component.config.labelKey !== 'sessionMenu_signoff') {
                    if (f.getKey() === f.ENTER || f.getKey() === f.RIGHT) {
                        this.component.onMenuItemSelect();
                    }
                } else {
                    if (f.getKey() === f.ENTER) {
                        this.component.onMenuItemSelect();
                    }
                }
                scope: this
            }
        }
    },

    onMenuItemClick: function () {
        var me = Ext.getCmp(this.id);
        me.fireEvent('miItemClick', me, true);
    },

    onMenuItemSelect: function () {
        var me = this;
        me.fireEvent('miItemClick', me, false);
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
    setLabelVal: function (newVal) {
        if (this.items && newVal !== "") {
            var checked = this.checkLabel(newVal);
            this.labelVal = checked;
            this.down('#miTitle').setHtml(Ext.String.htmlEncode(checked));
        } else if (this.items) {
            this.down('#miTitle').setHtml(Ext.String.htmlEncode(this.title));
        } else {
            this.labelVal = this.title;
        }
    },
    checkLabel: function (checkString) {
        var me = this;
        var myLength = 70; //ABP.util.Common.measureTextSingleLine(checkString, 'Arial').width * 1.25;
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
