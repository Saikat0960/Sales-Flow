Ext.define('ApteanSalesFlowPackage.view.customer.CustomerCreateView', {
    extend: 'Ext.form.Panel',
    xtype: 'CustomerCreateView',
    alias: 'widget.CustomerCreateView',
    scrollable: true,
    fullscreen: true,
    requires: [
        'ApteanSalesFlowPackage.view.customer.CustomerView',
        'ApteanSalesFlowPackage.view.customer.CustomerController'
    ],
    viewModel: {
        data: {
            salesperson: {},
            tax: {}
        }

    },

    controller: 'customer',
    items: [
        //xtype: 'panel'
        {
            xtype: 'fieldcontainer',
            layout: {
                type: 'column'
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: 'Company Name',
                labelWidth: 150,
                name: 'company_Name',
                width: '55%',
                margin: '15 100 10 15',
                allowBlank: false
            },
            {
                xtype: 'combobox',
                fieldLabel: 'Status',
                queryMode: 'local',
                displayField: 'name',
                valueField: 'name',
                name: 'status',
                editable: false,
                store: [{
                    name: 'PROSPECT'
                }, {
                    name: 'CONFIRMED'
                }],
                margin: '15 20 10 15',
                width: '35%',
                allowBlank: false
            }]
        },
        {
            xtype: 'CustomerView'
        }
    ],
    buttons: [{
        text: 'Reset',
        handler: 'onCustomerResetButton',
        width: 100,
        style: 'border-radius: 5px'
    },
    {
        text: 'Submit',
        handler: 'onCustomerSubmitButton',
        disabled: true,
        formBind: true,
        width: 100,
        style: 'border-radius: 5px'
    }]

});