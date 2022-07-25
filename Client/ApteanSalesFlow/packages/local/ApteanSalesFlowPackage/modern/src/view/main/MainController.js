Ext.define('ApteanSalesFlowPackage.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',

    requires: [
        'ApteanSalesFlowPackage.view.customer.CustomerCreateView',
        'ApteanSalesFlowPackage.view.invoice.CreateInvoiceView',
        'ApteanSalesFlowPackage.view.invoice.SearchInvoice'
    ],

    routes: {
        'Home': {
            action: 'showHomeScreen'
        },
        'CreateCustomer': {
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
        },
    },

    listen: {
        controller: {
            '*': {
                'ApteanSalesFlowPackage_menuItem': 'onMenuItemClicked',
                'ApteanSalesFlowPackage_HomeScreen': 'showHomeScreen',
                'ApteanSalesFlowPackage_unload': 'unload',
                'ApteanSalesFlowPackage_shutdown': 'shutdown'
        }
    }
    },
    showHomeScreen: function () {
        var me = this;
        var v = me.getView();
        v.removeAll();
        v.add(
            {
                xtype: 'dashboard'
                // layout: {
                //     type: 'vbox',
                //     align: 'center',
                // },
                // items: [
                //     {
                //         xtype: 'image',
                //         width: '70%',
                //         height: '100%',
                //         src: 'https://www.aptean.com/assets/client_files/images/default_og.jpg'
                //     }
                // ]
            }
        );
    },
    onMenuItemClicked: function (navMenuItem) {
        var me = this;
        var v = me.getView();
        switch (navMenuItem[0]) {
            case 'CustomerCreateMenuItem':
                me.redirectTo('CreateCustomer',true);
                break;
            case 'InvoiceCreateMenuItem':
                me.redirectTo('CreateInvoice',true);
                break;
            case 'InvoiceShowMenuItem':
                me.redirectTo('SearchInvoice',true);
                break;
            case 'CustomerShowMenuItem':
                me.redirectTo('SearchCustomer',true);
                break;
            case 'QuoteCreateMenuItem':
                me.redirectTo('CreateQuote',true);
                break;
            case 'QuoteShowMenuItem':
                me.redirectTo('SearchQuote',true);
                break;
            case 'ShipmentCreateMenuItem':
                me.redirectTo('CreateShipment',true);
                break;
            case 'SalesOrderCreateMenuItem':
                me.redirectTo('CreateSalesOrder',true);
                break;
            case 'SalesOrderShowMenuItem':
                me.redirectTo('SearchSalesOrder',true);
                break;
            case 'ShipmentShowMenuItem':
                me.redirectTo('SearchShipment',true);
                break;
            default:
                me.redirectTo('Home')
                break;
        }
    },
    CreateCustomerEntry: function () {
        let me = this;
        let v = me.getView();
        v.removeAll();
        v.add({ xtype: 'CustomerCreateView' });
    },
    CreateInvoiceEntry: function () {
        let me = this;
        let v = me.getView();
        v.removeAll();
        v.add({ xtype: 'CreateInvoiceView' });
    },
    SearchInvoiceEntry: function () {
        let me = this;
        let v = me.getView();
        v.removeAll();
        v.add({ xtype: 'SearchInvoiceView' });
    },
    SearchCustomerEntry: function () {
        let me = this;
        let v = me.getView();
        v.removeAll();
        v.add({ xtype: 'CustomerSearchView' });
    },
    CreateQuoteEntry: function () {
        let me = this;
        let v = me.getView();
        v.removeAll();
        v.add({ xtype: 'CreateQuoteView' });
    },
    SearchQuoteEntry: function () {
        let me = this;
        let v = me.getView();
        v.removeAll();
        v.add({ xtype: 'QuoteSearchView' });
    },
    CreateShipmentEntry: function () {
        let me = this;
        let v = me.getView();
        v.removeAll();
        v.add({ xtype: 'CreateShipmentView' });
    },
    CreateSalesOrderEntry: function () {
        let me = this;
        let v = me.getView();
        v.removeAll();
        v.add({ xtype: 'CreateSalesOrderView' });
    },
    SearchSalesOrderEntry: function () {
        let me = this;
        let v = me.getView();
        v.removeAll();
        v.add({ xtype: 'SearchSalesOrderView' });
    },
    SearchShipmentEntry: function () {
        let me = this;
        let v = me.getView();
        v.removeAll();
        v.add({ xtype: 'SearchShipmentView' });
    },
    BeforeLeaving: function(action){
        var form = this.getView().down('form')
        //action.stop();
        if(form){
            if(form.isDirty()){
                debugger
                Ext.MessageBox.confirm('Confirmation', 'Are you sure want to leave? All the entered data will be lost', confirmFunction);

                function confirmFunction (btn)
                {
                    if (btn == 'yes')
                    {
                        action.resume();
                    }
                    else action.stop();
                }
            
            }
            else
            action.resume();
        }
        else{
            action.resume();
        }
    },
    LogoutScreen: function(){
        Ext.Msg.alert('Session Expired', 'Your session has expired. Please login again',function(btn){
            if(btn==="ok"){
                window.location.href = "";
            }
        }
        )},
        unload: function () {
            this.fireEvent("main_appUnloaded", "ApteanSalesFlowPackage");
        },
     
        shutdown: function () {
            this.fireEvent("main_appShutdown", "ApteanSalesFlowPackage");
        },
});