Ext.define('ABP.view.session.subMenu.TriMenuItem', {
    extend: 'Ext.container.Container',
    alias: 'widget.trimenubutton',
    requires: ['ABP.view.session.subMenu.TriMenuItemModel'],
    viewModel: {
        type: 'trimenuitemmodel'
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
    cls: 'tri-menu-item tri-Body',
    layout: { type: 'vbox', align: 'stretch' },
    height: 40,
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
        this.labelVal = this.title;
        if (!this.labelKey) {
            me.cls = me.cls + " a-trimenu-unsafe-" + me.title.replace(/[^A-Za-z]/g, '');
        } else {
            me.cls = me.cls + " a-trimenu-" + me.labelKey.replace(/_/g, '-');
        }
        this.items = [{
            xtype: 'component',
            itemId: 'triTitle',
            html: this.labelVal,
            cls: 'tri-title',
            listeners: {
                el: {
                    click: function () {
                        this.clickItem();
                    },
                    scope: this
                }
            }
        }];
        this.ariaRole = 'menuitem';
        this.ariaLabel = this.parentTitle + ' - ' + this.title;
        this.callParent(arguments);
        this.cls = this.cls + ' ' + this.clas;
    },

    listeners: {
        el: {
            keydown: function (f) {
                if (f.getKey() === f.ENTER || f.getKey() === f.RIGHT) {
                    var x = Ext.get(f.currentTarget.id);
                    x.component.clickItem();
                }
            }
        }
    },

    clickItem: function () {
        this.fireEvent("triItemClick", this);
    },
    setSelected: function (doHighlight) {
        if (doHighlight) {
            this.addCls("tri-body-selected");
        } else {
            this.removeCls("tri-body-selected");
        }
    },
    isSelected: function () {
        return this.hasCls("tri-body-selected");
    },
    setLabelVal: function (newVal) {
        if (this.items && newVal !== "" && !this.hidden) {
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
            this.down('#triTitle').setHtml(Ext.String.htmlEncode(displayed));
            this.fireEvent('subMenu_updatedLabel', displayed);
        } else if (this.items && !this.hidden) {
            this.down('#triTitle').setHtml(Ext.String.htmlEncode(this.title));
            this.fireEvent('subMenu_updatedLabel', this.title);
        }
    }
});