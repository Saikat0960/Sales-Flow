Ext.define('ApteanSalesFlowPackage.view.LoadAllCustomers.LoadAllCustomers', {
    extend: 'Ext.window.Window',
    alias: 'widget.allCustomer',
    autoShow: true,
    requires: [
        'ApteanSalesFlowPackage.store.Customer',
        'ApteanSalesFlowPackage.view.LoadAllCustomers.LoadAllCustomerGrid'
    ],
    // viewModel: {
    //     stores: {
    //         customerStore: {
    //             type: 'customer'
    //         }
    //     }
    // },
    controller: 'loadallcustomers',
    title: 'Choose Customer',
    height: '60%',
    width: '60%',
    modal: true,
    layout:{
        type: 'fit',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'AllCustomerGrid'
        }
    ]
})