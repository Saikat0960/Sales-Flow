Ext.define('ApteanSalesFlowPackage.view.invoice.ShowInvoice', {
    extend: 'Ext.window.Window',
    height: '90%',
    width: '80%',
    controller: 'showinvoice',
    modal: true,
    resizable: false,
    scrollable: 'vertical',
    requires: [
        'ApteanSalesFlowPackage.view.invoice.SearchInvoiceController'
    ],
    items: [{
        xtype: 'form',
        itemId: 'showInvoice',
        title: 'Invoice',
        bodyPadding: 10,
        scrollable: true,
        viewModel: {
            data: {
                invoice: {}
            }
        },
        items: [
            {
                xtype: 'fieldcontainer',
                layout: 'column',
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: 'Company Name',
                        //labelWidth: 100,
                        name: 'companyname',
                        bind: {
                            value: '<b>{invoice.customer.company_Name}</b>'
                        },
                        //allowBlank: false,
                        readOnly: true,
                        width: 400,
                        margin: '10 100 10 15',
                    },
                    {
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'displayfield',
                                //name: 'date',
                                value: '<b>Date:</b>',
                                margin: '10 0 0 0',
                                //readOnly: true
                            },
                            {
                                xtype: 'displayfield',
                                width: 100,
                                value: '<b>' + Ext.Date.format(new Date(), 'Y-m-d') + '</b>',
                                name: 'date',
                                readOnly: true,
                                //disabled: true,
                                margin: '10 0 0 15'
                            }
                        ]
                    }]
            },
            {
                xtype: 'fieldcontainer',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'fieldset',
                    title: 'Basic Information',
                    layout: 'hbox',
                    items: [{
                        xtype: 'fieldcontainer',
                        margin: '0 100 10 5',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Customer ID',
                                name: 'customer_Id',
                                bind: {
                                    value: '{invoice.customer.id}'
                                },
                                // allowBlank: false,
                                width: 400,
                                readOnly: true
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Sales Order No',
                                bind: {
                                    value: '{invoice.sO_Number}'
                                },
                                name: 'sO_Number',
                                //allowBlank: false,
                                width: 400,
                                readOnly: true
                            }]
                    },
                    {
                        xtype: 'fieldcontainer',
                        margin: '0 100 10 5',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Shipment No',
                                name: 'shipment_Number',
                                bind: {
                                    value: '{invoice.shipment_Number}'
                                },
                                width: 400,
                                //allowBlank: false,
                                readOnly: true
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Due Date',
                                name: 'due_date',
                                bind: {
                                    value: '{invoice.sales_Order.date_Required}'
                                },
                                width: 400,
                                //allowBlank: false,
                                readOnly: true
                            }]
                    }]
                }, {
                    xtype: 'fieldset',
                    title: 'Customer Details',
                    collapsible: true,
                    collapsed: true,
                    layout: 'hbox',
                    items: [{
                        xtype: 'fieldcontainer',
                        margin: '0 100 10 5',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'First Name',
                                name: 'firstname',
                                bind: {
                                    value: '{invoice.customer.first_Name}'
                                },
                                width: 400,
                                //allowBlank: false,
                                readOnly: true
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Last Name',
                                name: 'lastname',
                                bind: {
                                    value: '{invoice.customer.last_Name}'
                                },
                                width: 400,
                                //allowBlank: false,
                                readOnly: true
                            }]
                    },
                    {
                        xtype: 'fieldcontainer',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Sales Person',
                                bind: {
                                    value: '{invoice.customer.sales_Person.name}'
                                },
                                name: 'sales_Person_Name',
                                width: 400,
                                //allowBlank: false,
                                readOnly: true
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'E-Mail',
                                bind: {
                                    value: '{invoice.customer.email}'
                                },
                                name: 'email',
                                //allowBlank: false,
                                width: 400,
                                readOnly: true
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Phone',
                                name: 'phone',
                                bind: {
                                    value: '{invoice.customer.phone}'
                                },
                                width: 400,
                                // allowBlank: false,
                                readOnly: true
                            }
                        ]
                    }]
                }, {
                    xtype: 'fieldset',
                    title: 'Billing Address Information',
                    collapsible: true,
                    collapsed: true,
                    layout: {
                        type: 'vbox',
                        //align: 'stretch'
                    },

                    items: [{
                        width: '100%',
                        xtype: 'textareafield',
                        fieldLabel: 'Address',
                        name: 'billing_Address',
                        bind: {
                            value: '{invoice.billing_Address}'
                        },
                        readOnly: true,
                        margin: '0 0 10 5'
                    },
                    {
                        xtype: 'fieldcontainer',
                        layout: {
                            type: 'hbox',
                            //align: 'stretch'
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'City',
                                name: 'billing_City',
                                bind: {
                                    value: '{invoice.billing_City}'
                                },
                                width: 400,
                                margin: '0 100 10 5',
                                readOnly: true
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'State',
                                width: 400,
                                bind: {
                                    value: '{invoice.billing_State}'
                                },
                                name: 'billing_State',

                                readOnly: true
                            }
                        ]
                    },
                    {
                        xtype: 'fieldcontainer',
                        layout: {
                            type: 'hbox',
                            //align: 'stretch'
                        },
                        items: [{
                            xtype: 'textfield',
                            fieldLabel: 'Country',
                            name: 'billing_Country',
                            margin: '0 100 10 5',
                            bind: {
                                value: '{invoice.country.name}'
                            },
                            width: 400,
                            readOnly: true
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Zip Code',
                            name: 'billing_Zipcode',
                            bind: {
                                value: '{invoice.billing_ZipCode}'
                            },
                            width: 400,
                            readOnly: true
                        }]

                    }]

                }, {
                    xtype: 'fieldset',
                    width: '100%',
                    title: 'Item Details',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'grid',
                            style: 'border: 1px solid black',
                            height: 100,
                            width: '100%',
                            margin: '20 10 20 10',
                            columns: [
                                { text: 'Item Name', dataIndex: 'part_name', flex: 3 },
                                { text: 'Quantity', dataIndex: 'quantity', flex: 1 },
                                { text: 'Price', dataIndex: 'price', flex: 1 }
                            ],
                        }, {
                            xtype: 'fieldcontainer',
                            width: '100%',
                            layout: { type: 'hbox', pack: 'end', align: 'end' },
                            items: [{
                                xtype: 'textfield',
                                bind: {
                                    fieldLabel: 'Total Amount' + '{totalAmout}',
                                },
                                name: 'amount',
                                anchor: '-400 -50',
                                readOnly: true
                            }]
                        }]
                }]
            }]

    }],
    listeners: {
        beforerender: 'loadingRecord'
    }
});