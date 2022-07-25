Ext.define('ABP.view.session.toolbarTop.search.SearchSelectorButton', {
    extend: 'Ext.Button',
    alias: 'widget.searchselectorbutton',

    iconCls: 'x-fa fa-hand-lizard-o',
    itemId: 'searchbarTypeButton',
    cls: 'searchbar-button a-searchdrop-typebutton',
    pressedCls: 'searchbar-button-press',
    config: {
        handler: function () {
            var picker;
            // TODO: the small screen picker does not appear to work ... get an error with the
            // viewModel binding, using the tablet picker until the UI to re-worked
            // if (ABP.util.Common.getSmallScreen()) {
            //     picker = this.getPicker();
            //     if (!picker.getParent()) {
            //         Ext.Viewport.add(picker);
            //     }
            //     picker.show();
            // } else {
            picker = this.getTabletPicker();
            if (!picker.getParent()) {
                Ext.Viewport.add(picker);
            }
            picker.showBy(this, null);
            //}
        },
        displayField: 'name',
        valueField: 'id',
        iconField: 'icon',
        value: 0,
        store: '{searchProviders}'
    },
    bind: {
        //menu: '{searchBar.menuOptions}',
        store: '{searchProviders}',
        iconCls: '{searchBar.selectedSearchCls}',
        text: '{selectedSearchTextLS}',
        hidden: '{showDropMenuButton}'
    },

    setStore: function (store) {
        this.config.store = store;
    },
    getStore: function () {
        return this.config.store;
    },
    getIconField: function () {
        return this.iconField;
    },

    getPicker: function () {
        var me = this,
            phonePicker = me.phonePicker,
            config;

        if (!phonePicker) {
            me.phonePicker = phonePicker = Ext.create('Ext.picker.Picker', {
                //viewModel: me.getViewModel(),
                slots: [{
                    align: 'center',
                    name: 'select',
                    valueField: me.getValueField(),
                    displayField: me.getDisplayField(),
                    iconField: me.getIconField(),
                    value: me.getValue(),
                    store: me.getStore(),
                    itemTpl: '<div class="' + Ext.baseCSSPrefix + 'picker-item {cls} <tpl if="extra">' + Ext.baseCSSPrefix + 'picker-invalid</tpl>"><div class="{' + this.config.iconField + '}"><span>&nbsp&nbsp&nbsp&nbsp{' + this.config.displayField + '}</span></div></div>'
                }],
                cancelButton: ABP.util.Common.geti18nString('error_cancel_btn'),
                doneButton: ABP.util.Common.geti18nString('selectfield_mobile_done'),
                listeners: {
                    change: me.onPickerChange,
                    scope: me
                }
            });
        }

        return phonePicker;
    },

    onPickerChange: function (picker, value) {
        // Get Store
        var me = this;
        var store = me.getStore();
        var record = store.getById(value.select);
        var search = {};
        if (record && record.data) {
            search.searchId = record.data.id;
            search.iconCls = me.__makeIconString(record.data.icon);
        }
        me.fireEvent('searchDrop_setSearch', search);
        me.fireEvent('searchDrop_focusSearch');
    },

    getTabletPicker: function () {
        var me = this,
            tabletPicker = me.tabletPicker,
            config;
        if (!tabletPicker) {
            me.tabletPicker = tabletPicker = Ext.create('Ext.Panel', Ext.apply({
                left: 0,
                top: 0,
                itemId: 'findMe',
                modal: true,
                cls: Ext.baseCSSPrefix + 'select-overlay',
                layout: 'fit',
                hideOnMaskTap: true,
                width: Ext.os.is.Phone ? '14em' : '18em',
                height: (Ext.os.is.BlackBerry && Ext.os.version.getMajor() === 10) ? '12em' : (Ext.os.is.Phone ? '12.5em' : '22em'),
                items: {
                    xtype: 'list',
                    store: me.getStore(),
                    itemTpl: '<span class="x-list-label {' + this.config.iconField + '}">&nbsp&nbsp&nbsp&nbsp{' + me.getDisplayField() + ':htmlEncode}</span>',
                    listeners: {
                        select: me.onListSelect,
                        itemtap: me.onListTap,
                        scope: me
                    }
                }
            }, null));
        }

        return tabletPicker;
    },
    onListSelect: function (item, record) {
        var me = this;
        var search = {};
        if (record && record.data) {
            search.searchId = record.data.id;
            search.iconCls = me.__makeIconString(record.data.icon);
        }
        me.fireEvent('searchDrop_setSearch', search);
        me.fireEvent('searchDrop_focusSearch');
    },
    onListTap: function (picker) {
        picker.up().hide({
            type: 'fade',
            out: true,
            scope: this
        });
    },
    __makeIconString: function (icon) {
        var ret = icon;
        var font = icon;
        font = font.split('-');
        ret = font[0] === 'fa' ? 'x-fa ' + icon : icon;
        return ret;
    }
});