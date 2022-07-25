Ext.define('ABP.view.session.logger.LoggerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.loggerpagecontroller',

    requires: [
        'ABP.util.filters.Factory'
    ],

    listen: {
        controller: {
            '*': {
                logger_clearClickAnswer: '__clearClickAnswer'
            }
        }
    },

    init: function () {
    },
    exportClicked: function () {
        //need premium ext for Ext.exporter.File
    },
    closeClicked: function () {
        this.fireEvent('featureCanvas_hideSetting');
    },
    clearClicked: function () {
        ABP.view.base.popUp.PopUp.showYesNo('logger_clear_confirmation', 'logger_clear', 'logger_clearClickAnswer');
    },
    phoneFilterClick: function () {
        var me = this;
        var filterMenu = me.lookupReference('filterMenu');
        var data = filterMenu.floatParentNode.getData();

        // Remove old theme class and set to current
        filterMenu.setUserCls(ABP.util.Common.getCurrentTheme());

        // have to make the mask before sencha tries to preprocess the showby (otherwise it wont be transparent)
        if (!data.modalMask) {
            // Most of this was stolen from sencha source and altered to add an additional class to the parent mask
            var Widget = Ext.Widget;
            var floatRoot = Ext.getFloatRoot();
            var positionEl = filterMenu.getFloatWrap();
            data.modalMask = filterMenu.floatParentNode.createChild({
                cls: 'x-mask abp-modal-mask-transparent'
            }, positionEl);

            data.modalMask.on({
                tap: Widget.onModalMaskTap,
                scope: Widget
            });
            // A know issue with Safari Mobile causes a body with overflow: hidden
            // to be scrollable on iOS.
            // https://bugs.webkit.org/show_bug.cgi?id=153852
            if (Ext.isiOS && filterMenu.floatParentNode === floatRoot) {
                data.modalMask.on({
                    touchmove: function (e) {
                        e.preventDefault();
                    }
                });
            }
        }
        filterMenu.setWidth(me.getView().measure().width);
        filterMenu.showBy(me.getView().header, 'b');
    },

    __clearClickAnswer: function (answer) {
        var me = this;
        var store;
        var severity;
        if (answer) {
            store = Ext.data.StoreManager.lookup('ABPLoggingStore');
            severity = me.getView().down('#loggerSeverity');
            store.clearFilter();
            store.removeAll();
            severity.setValue('ALL');
        }
    },
    severityChanged: function (me, newVal) {
        var me = this;
        var store = Ext.data.StoreManager.lookup('ABPLoggingStore');
        if (newVal.data) {
            newVal = newVal.data.value;
        }
        if (newVal !== 'ALL') {
            store.filter('level', newVal);
        } else {
            store.clearFilter();
        }
    },
    onFilterChanged: function (control, newValue) {
        var store = Ext.data.StoreManager.lookup('ABPLoggingStore');
        store.removeFilter('TextFilter');
        if (!newValue || newValue.length < 2) {
            return;
        }

        // Get the text filter object based on the fields you want to filter the store against.
        var filterFunction = ABP.util.filters.Factory.createStringFilter(newValue,
            [
                { name: 'message', useSoundEx: true },
                { name: 'detail', useSoundEx: true }
            ],
            true
        );

        // filter the store passing the bound filter function
        store.filter({ id: 'TextFilter', filterFn: filterFunction });
    },
    __clearLogFilters: function () {
        var store = Ext.data.StoreManager.lookup('ABPLoggingStore');
        store.clearFilter();
    },
    destroy: function () {
        this.__clearLogFilters();
        this.callParent();
    }
});
