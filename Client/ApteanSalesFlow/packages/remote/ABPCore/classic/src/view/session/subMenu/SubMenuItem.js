/////////////////////////////////////////////////////////////////////////////////////
//  Name:      app/view/session/subMenu/SubMenuItem.js
//  Purpose:   Basic structure for a Sub-Menu Item
//  Created:   7/9/2014 - Joe Blenis
//  Last Edit: 7/9/2014 - Joe Blenis - Created File
/////////////////////////////////////////////////////////////////////////////////////
Ext.define('ABP.view.session.subMenu.SubMenuItem', {
    extend: 'Ext.container.Container',
    alias: 'widget.submenubutton',
    requires: ['ABP.view.session.subMenu.SubMenuItemModel'],
    viewModel: {
        type: 'submenuitemmodel'
    },
    config: {
        title: '',
        labelKey: '', //probably just referenced when created... maybe
        labelVal: '',
        uniqueId: '',
        command: '',
        args: '',
        enabled: true,
        tooltip: '',
        tooltipKey: '',
        type: '',
        children: '',
        appId: '',
        place: '',
        parentUID: '',
        parentTitle: '',
        clas: ''
    },
    cls: 'sub-menu-item smi-Body',
    itmeId: 'smiBody',
    height: 40,
    layout: { type: 'hbox', align: 'stretch' },
    tabIndex: -1,

    afterRender: function () {
        var me = this;
        var vm;
        var ttString = "";
        var keyString;
        me.callParent();
        if (me.tooltip && me.tooltip !== "") {
            ttString = me.tooltip;
        }
        if (me.tooltipKey && me.tooltipKey !== "") {
            vm = Ext.ComponentQuery.query('app-main')[0].getViewModel();
            keyString = vm.checkI18n(me.tooltipKey);
            if (keyString !== me.tooltipKey) {
                ttString = keyString;
            }
        }
        if (ttString !== "") {
            Ext.tip.QuickTipManager.register({
                target: me.getId(),
                text: ttString,
                cls: 'tooltip-mm'
            });
        }
    },

    initComponent: function () {
        var me = this;
        var itemlist = [];
        this.labelVal = this.title;
        if (!this.labelKey) {
            me.cls = me.cls + " a-submenu-unsafe-" + me.title.replace(/[^A-Za-z]/g, '');
        } else {
            me.cls = me.cls + " a-submenu-" + me.labelKey.replace(/_/g, '-');
        }
        itemlist.push(
            { flex: 1 },
            {
                xtype: 'component',
                itemId: 'smiTitle',
                html: this.labelVal,
                cls: 'smi-title'
            });
        var secondClass = (this.children === undefined || this.children.length === 0) ? 'smi-filler' : 'smi-chevron';
        itemlist.push({
            xtype: 'component',
            cls: secondClass
        });
        //        this.items = [{
        //            xtype: 'container',
        //            layout: { type: 'hbox', align: 'stretch' },
        //            height: 40,
        //            itemId: 'smiBody',
        //            cls: 'smi-Body',
        //            items: itemlist,
        //            listeners: {
        //                el: {
        //                    click: function () {
        //                        this.clickItem();
        //                    },
        //                    scope: this
        //                }
        //            }
        //        }];
        this.items = itemlist;
        this.ariaRole = 'menuitem';
        this.ariaLabel = this.parentTitle + ' - ' + this.title;
        this.callParent(arguments);
        this.cls = this.cls + ' ' + this.clas;
    },

    listeners: {
        el: {
            keydown: function (f) {
                if (f.getKey() === f.ENTER /*|| f.getKey() === f.RIGHT*/) {
                    var x = Ext.get(f.currentTarget.id);
                    x.component.clickItem();
                }
            },
            click: function (clicked) {
                var x = Ext.get(clicked.currentTarget.id);
                x.component.clickItem();
            },
            scope: this
        }
    },

    clickItem: function () {
        this.fireEvent("smiItemClick", this);
    },
    setSelected: function (doHighlight) {
        //var body = this.down("#smiBody");
        if (doHighlight) {
            this.addCls("smi-body-selected");
        } else {
            this.removeCls("smi-body-selected");
        }
    },
    isSelected: function () {
        var body = this.down("#smiBody");
        return body.hasCls("smi-body-selected");
    },
    setLabelVal: function (newVal) {
        if (this.items && newVal !== "") {
            var len = ABP.util.Common.measureTextSingleLine(newVal, ABP.util.Constants.BASE_FONT).width + newVal.length + 40;
            var displayed;
            if (len > 300) {
                var diff = parseInt((len - 275) / 4, 10);
                var spacing = newVal.length - diff;
                displayed = newVal.slice(0, spacing) + "...";
            }
            if (displayed === undefined) {
                displayed = newVal;
            }
            this.labelVal = displayed;
            this.down('#smiTitle').setHtml(Ext.String.htmlEncode(displayed));
            this.fireEvent('subMenu_updatedLabel', displayed);
        } else if (this.items) {
            this.down('#smiTitle').setHtml(Ext.String.htmlEncode(this.title));
            this.fireEvent('subMenu_updatedLabel', this.title);
        }
    }
});