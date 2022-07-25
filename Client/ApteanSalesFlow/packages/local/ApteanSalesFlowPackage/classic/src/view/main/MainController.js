Ext.define('ApteanSalesFlowPackage.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',

    requires: [

        'ApteanSalesFlowPackage.view.customer.CustomerCreateView',
        'ApteanSalesFlowPackage.view.invoice.CreateInvoiceView',
        'ApteanSalesFlowPackage.view.invoice.SearchInvoice',
        'ApteanSalesFlowPackage.view.SalesOrder.CreateSalesOrderView'
    ],

    routes: {
        'Home': {
            action: 'showHomeScreen',
            before: 'BeforeLeaving'
        },
        'Customer': {
            action: 'CreateCustomerEntry',
            before: 'BeforeLeaving'
        },
        'CreateInvoice': {
            action: 'CreateInvoiceEntry',
            before: 'BeforeLeaving'
        },
        'SearchInvoice': {
            action: 'SearchInvoiceEntry',
            before: 'BeforeLeaving'
        },
        'SearchCustomer': {
            action: 'SearchCustomerEntry',
            before: 'BeforeLeaving'
        },
        'CreateQuote': {
            action: 'CreateQuoteEntry',
            before: 'BeforeLeaving'
        },
        'SearchQuote': {
            action: 'SearchQuoteEntry',
            before: 'BeforeLeaving'
        },
        'CreateShipment': {
            action: 'CreateShipmentEntry',
            before: 'BeforeLeaving'
        },
        'CreateSalesOrder': {
            action: 'CreateSalesOrderEntry',
            before: 'BeforeLeaving'
        },
        'SearchSalesOrder': {
            action: 'SearchSalesOrderEntry',
            before: 'BeforeLeaving'
        },
        'SearchShipment': {
            action: 'SearchShipmentEntry',
            before: 'BeforeLeaving'
        },
        'Logout': {
            action: 'LogoutScreen'
        }
    },

    listen: {
        controller: {
            '*': {
                'ApteanSalesFlowPackage_menuItem': 'onMenuItemClicked',
                'ApteanSalesFlowPackage_HomeScreen': 'showHome',
                'ApteanSalesFlowPackage_unload': 'unload',
                'ApteanSalesFlowPackage_shutdown': 'shutdown',
                'createInvoice': 'CreateInvoiceEntry',
                'createCustomer': 'CreateCustomerEntry',
                'createQuote': 'CreateQuoteEntry',
                'createSalesOrder': 'CreateSalesOrderEntry',
                'createShipment': 'CreateShipmentEntry',
                'showCustomer': 'SearchCustomerEntry',
                'showQuote': 'SearchQuoteEntry',
                'showSalesOrder': 'SearchSalesOrderEntry',
                'showShipment': 'SearchShipmentEntry'
            }
        }
    },
    onMenuItemClicked: function (navMenuItem) {
        var me = this;
        var v = me.getView();
        switch (navMenuItem[0]) {
            case 'CustomerCreateMenuItem':
                me.redirectTo('Customer', true);
                break;
            case 'InvoiceCreateMenuItem':
                me.redirectTo('CreateInvoice', true);
                break;
            case 'InvoiceShowMenuItem':
                me.redirectTo('SearchInvoice', true);
                break;
            case 'CustomerShowMenuItem':
                me.redirectTo('SearchCustomer', true);
                break;
            case 'QuoteCreateMenuItem':
                me.redirectTo('CreateQuote', true);
                break;
            case 'QuoteShowMenuItem':
                me.redirectTo('SearchQuote', true);
                break;
            case 'ShipmentCreateMenuItem':
                me.redirectTo('CreateShipment', true);
                break;
            case 'SalesOrderCreateMenuItem':
                me.redirectTo('CreateSalesOrder', true);
                break;
            case 'SalesOrderShowMenuItem':
                me.redirectTo('SearchSalesOrder', true);
                break;
            case 'ShipmentShowMenuItem':
                me.redirectTo('SearchShipment', true);
                break;
            case 'HomeMenuItem':
                me.redirectTo('Home', true);
                break;
            default:
                me.redirectTo('Home', true)
                break;
        }
    },
    showHome: function () {
        if (window.localStorage.URL != undefined) {
            this.onMenuItemClicked([window.localStorage.URL])
        }
        else {
            var me = this;
            var v = me.getView();
            v.removeAll();
            v.add(
                {
                    xtype: 'dashboard'
                }
            );
        }
    },
    showHomeScreen: function(){
        window.localStorage.setItem('URL', 'HomeMenuItem');
        var me = this;
        var v = me.getView();
        v.removeAll();
        v.add(
            {
                xtype: 'dashboard'
            }
        );
    },
    CreateCustomerEntry: function () {
        window.localStorage.setItem('URL', 'CustomerCreateMenuItem');
        let me = this;
        let v = me.getView();
        v.removeAll();
        v.add({ xtype: 'CustomerCreateView' });
    },
    CreateInvoiceEntry: function () {
        window.localStorage.setItem('URL', 'InvoiceCreateMenuItem');
        let me = this;
        let v = me.getView();
        v.removeAll();
        v.add({ xtype: 'CreateInvoiceView' });
    },
    SearchInvoiceEntry: function () {
        window.localStorage.setItem('URL', 'InvoiceShowMenuItem');
        let me = this;
        let v = me.getView();
        v.removeAll();
        v.add({ xtype: 'SearchInvoiceView' });
    },
    SearchCustomerEntry: function () {
        window.localStorage.setItem('URL', 'CustomerShowMenuItem');
        let me = this;
        let v = me.getView();
        v.removeAll();
        v.add({ xtype: 'CustomerSearchView' });
    },
    CreateQuoteEntry: function () {
        window.localStorage.setItem('URL', 'QuoteCreateMenuItem');
        let me = this;
        let v = me.getView();
        v.removeAll();
        v.add({ xtype: 'CreateQuoteView' });
    },
    SearchQuoteEntry: function () {
        window.localStorage.setItem('URL', 'QuoteShowMenuItem');
        let me = this;
        let v = me.getView();
        v.removeAll();
        v.add({ xtype: 'QuoteSearchView' });
    },
    CreateShipmentEntry: function () {
        window.localStorage.setItem('URL', 'ShipmentCreateMenuItem');
        let me = this;
        let v = me.getView();
        v.removeAll();
        v.add({ xtype: 'CreateShipmentView' });
    },
    CreateSalesOrderEntry: function () {
        window.localStorage.setItem('URL', 'SalesOrderCreateMenuItem');
        let me = this;
        let v = me.getView();
        v.removeAll();
        v.add({ xtype: 'CreateSalesOrderView' });
    },
    SearchSalesOrderEntry: function () {
        window.localStorage.setItem('URL', 'SalesOrderShowMenuItem');
        let me = this;
        let v = me.getView();
        v.removeAll();
        v.add({ xtype: 'SearchSalesOrderView' });
    },
    SearchShipmentEntry: function () {
        window.localStorage.setItem('URL', 'ShipmentShowMenuItem');
        let me = this;
        let v = me.getView();
        v.removeAll();
        v.add({ xtype: 'SearchShipmentView' });
    },
    BeforeLeaving: function (action) {
        taxCountryId = 0;
        var form = this.getView().down('form');
        if (form) {
            if (form.isDirty()) {
                Ext.MessageBox.confirm('Confirmation', 'Are you sure want to leave? All the entered data will be lost', confirmFunction);

                function confirmFunction(btn) {
                    if (btn == 'yes') {
                        action.resume();
                    }
                    else action.stop();
                }

            }
            else {
                action.resume();
            }
        }
        else {
            action.resume();
        }
    },
    LogoutScreen: function () {
        window.localStorage.removeItem('URL');
        Ext.Msg.show({
            title: 'Session Expired',
            message: "Your session has expired. Please login again.",
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING,
            scope: this,
            fn: function (btn) {
                if (btn === "ok") {
                    window.location.href = "";
                }
            }
        })
    },
    unload: function () {
        this.fireEvent("main_appUnloaded", "ApteanSalesFlowPackage");
    },

    shutdown: function () {
        this.fireEvent("main_appShutdown", "ApteanSalesFlowPackage");
    },
});