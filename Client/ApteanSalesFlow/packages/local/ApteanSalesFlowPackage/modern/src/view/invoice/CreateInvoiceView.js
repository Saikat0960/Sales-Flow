Ext.define('ApteanSalesFlowPackage.view.invoice.CreateInvoiceView', {
    extend: 'Ext.form.Panel',
    xtype: 'CreateInvoiceView',
    requires: [
        'ApteanSalesFlowPackage.view.LoadShipment.LoadShipment'
    ],
    scrollable: true,
    controller: 'invoice',
    fullscreen: true,
    viewModel: {
        data: {
            shipment: {}
        }
    },
    items: [
        {
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox'
            },
            items: [{
                xtype: 'button',
                text: 'Load Shipment',
                handler: 'onShipmentLoadButton',
                width: '20%',
                margin: '15 70 10 15',
                style: 'border-radius: 5px'
            }, {
                xtype: 'textfield',
                fieldLabel: 'Company Name',
                bind: {
                    value: '{shipment.customer1.company_Name}'
                },
                allowBlank: false,
                readOnly: true,
                labelWidth: 120,
                width: '50%',
                margin: '15 70 10 15'
            },
            {
                xtype: 'displayfield',
                fieldLabel: 'Date',
                labelWidth: 50,
                margin: '15 10 10 15',
                width: '35%',
                value: Ext.Date.format(new Date(), 'Y-m-d'),
                fieldStyle: 'font-size: 15px; font-weight: bold;'
            }]
        }, {

            xtype: 'tabpanel',
            margin: '20',
            itemId: 'tab',
            tabBarPosition: 'top',
            items: [
                {
                    title: 'Invoice Information',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'fieldset',
                            title: 'Order Details',
                            layout: 'hbox',
                            items: [{
                                xtype: 'fieldcontainer',
                                margin: '0 100 10 0',
                                layout: {
                                    type: 'vbox',
                                    align: 'stretch'
                                },
                                width: '45%',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Customer ID',
                                        bind: {
                                            value: '{shipment.customer1.id}'
                                        },
                                        allowBlank: false,
                                        width: '100%',
                                        readOnly: true
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Sales Order No',
                                        bind: {
                                            value: '{shipment.sales_Order.sO_Number}'
                                        },
                                        allowBlank: false,
                                        width: '100%',
                                        readOnly: true
                                    }]
                            },
                            {
                                xtype: 'fieldcontainer',
                                layout: {
                                    type: 'vbox',
                                    align: 'stretch'
                                },
                                width: '45%',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Shipment No',
                                        bind: {
                                            value: '{shipment.shipment_Number}'
                                        },
                                        width: '100%',
                                        allowBlank: false,
                                        readOnly: true
                                    },
                                    {
                                        xtype: 'datefield',
                                        fieldLabel: 'Due Date',
                                        bind: {
                                            value: '{shipment.sales_Order.date_Required}'
                                        },
                                        width: '100%',
                                        dateFormat: 'Y-m-d',
                                        allowBlank: false,
                                        readOnly: true
                                    }]
                            }]
                        },
                        {
                            xtype: 'fieldset',
                            title: 'Customer Details',
                            collapsible: true,
                            collapsed: true,
                            layout: {
                                type: 'hbox',
                            },
                            items: [{
                                xtype: 'fieldcontainer',
                                margin: '0 100 10 0',
                                layout: {
                                    type: 'vbox',
                                    align: 'stretch'
                                },
                                width: '45%',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'First Name',
                                        allowBlank: false,
                                        readOnly: true,
                                        width: '100%',
                                        bind: {
                                            value: '{shipment.customer1.first_Name}'
                                        },
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Last Name',
                                        allowBlank: false,
                                        readOnly: true,
                                        width: '100%',
                                        bind: {
                                            value: '{shipment.customer1.last_Name}'
                                        },
                                    }]
                            },
                            {
                                xtype: 'fieldcontainer',
                                layout: {
                                    type: 'vbox',
                                    align: 'stretch'
                                },
                                width: '45%',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'E-Mail',
                                        bind: {
                                            value: '{shipment.customer1.email}'
                                        },
                                        vtype: 'email',
                                        emptyText: 'abc123@xyz.com',
                                        allowBlank: false,
                                        readOnly: true,
                                        width: '100%'
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Phone',
                                        readOnly: true,
                                        bind: {
                                            value: '{shipment.customer1.phone}'
                                        },
                                        allowBlank: false,
                                        readOnly: true,
                                        width: '100%'
                                    }
                                ]
                            }]
                        },
                        {
                            xtype: 'fieldset',
                            title: 'Sales Person Info',
                            collapsible: true,
                            collapsed: true,
                            layout: {
                                type: 'hbox'
                            },
                            items: [{
                                xtype: 'fieldcontainer',
                                margin: '0 100 10 0',
                                layout: {
                                    type: 'vbox',
                                    align: 'stretch'
                                },
                                width: '45%',
                                items: [{
                                    xtype: 'textfield',
                                    fieldLabel: 'Name',
                                    allowBlank: false,
                                    bind: {
                                        value: '{shipment.sales_Order.sales_Person1.name}'
                                    },
                                    readOnly: true,
                                    width: '100%'
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Territory',
                                    bind: {
                                        value: '{shipment.sales_Order.sales_Person1.territory}'
                                    },
                                    readOnly: true,
                                    width: '100%'
                                }]
                            },
                            {
                                xtype: 'numberfield',
                                fieldLabel: 'Commission(%)',
                                bind: {
                                    value: '{shipment.sales_Order.sales_Person1.commission}'
                                },
                                width: '45%',
                                readOnly: true
                            }]
                        },
                        {
                            xtype: 'fieldset',
                            title: 'Billing Address Information',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },

                            items: [{
                                width: '85%',
                                xtype: 'textareafield',
                                fieldLabel: 'Address',
                                bind: {
                                    value: '{shipment.customer1.billing_Address}'
                                },
                                allowBlank: false
                            },
                            {
                                xtype: 'fieldcontainer',
                                layout: {
                                    type: 'hbox',
                                    align: 'stretch'
                                },
                                items: [
                                    {
                                        xtype: 'fieldcontainer',
                                        layout: {
                                            type: 'vbox',
                                            align: 'stretch'
                                        },
                                        width: '45%',
                                        margin: '0 100 10 0',
                                        items: [
                                            {
                                                xtype: 'textfield',
                                                fieldLabel: 'City',
                                                bind: {
                                                    value: '{shipment.customer1.billing_City}'
                                                },
                                                width: '100%',
                                                allowBlank: false,
                                                maskRe: /[a-zA-Z ]*$/
                                            },
                                            {
                                                xtype: 'combobox',
                                                fieldLabel: 'Country',
                                                editable: false,
                                                bind: {
                                                    value: '{shipment.customer1.billing_Country_Id}'
                                                },
                                                width: '100%',
                                                queryMode: 'local',
                                                displayField: 'name',
                                                valueField: 'id',
                                                allowBlank: false,
                                                store: {
                                                    type: 'countries'
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        xtype: 'fieldcontainer',
                                        layout: {
                                            type: 'vbox',
                                            align: 'stretch'
                                        },
                                        width: '45%',
                                        items: [{
                                            xtype: 'textfield',
                                            fieldLabel: 'State',
                                            width: '100%',
                                            bind: {
                                                value: '{shipment.customer1.billing_State}'
                                            },
                                            allowBlank: false,
                                            maskRe: /[a-zA-Z ]*$/
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'Zip Code',
                                            bind: {
                                                value: '{shipment.customer1.billing_ZipCode}'
                                            },
                                            maskRe: /^[a-zA-Z0-9-]+$/,
                                            width: '100%',
                                            allowBlank: false
                                        }]

                                    }]
                            }]

                        }, {
                            xtype: 'fieldset',
                            width: '100%',
                            title: 'Item Details',
                            itemId: 'itemDetails',
                            layout: 'vbox',
                            items: [
                                {
                                    xtype: 'grid',
                                    itemId: 'itemGrid',
                                    style: 'border: 1px solid grey',
                                    width: "100%",
                                    cls: 'extra-alt',
                                    store: {
                                        type: 'itemlist'
                                    },
                                    margin: '20 10 0 10',
                                    columns: [
                                        {
                                            text: 'Item No.',
                                            xtype: 'rownumberer',
                                            align: 'left',
                                            flex: 1
                                        },
                                        {
                                            text: 'Part No.',
                                            dataIndex: 'part_Id',
                                            flex: 1
                                        },
                                        {
                                            text: 'Part Name',
                                            dataIndex: 'part_Name',
                                            flex: 2
                                        },
                                        {
                                            text: 'Unit Of Measure',
                                            dataIndex: 'uom',
                                            flex: 1
                                        },
                                        {
                                            text: 'Unit Price',
                                            dataIndex: 'price',
                                            flex: 1
                                        },
                                        {
                                            text: 'Quantity',
                                            dataIndex: 'quantity',
                                            flex: 1
                                        }
                                    ],
                                    selModel: 'cellmodel'
                                },
                                {
                                    xtype: 'fieldcontainer',
                                    width: '100%',
                                    margin: '10 0 0 0',
                                    layout: { type: 'hbox', pack: 'end', align: 'end' },
                                    items: [{
                                        xtype: 'textfield',
                                        fieldLabel: 'Total Amount',
                                        bind: {
                                            value: '{shipment.sales_Order.total_Value}',
                                        },
                                        name: 'amount',
                                        width: '45%',
                                        allowBlank: false,
                                        readOnly: true
                                    }]
                                }]
                        }]

                }]
        }],
    buttons: [{
        text: 'Reset',
        handler: 'onInvoiceResetButton',
        width: 100,
        style: 'border-radius: 5px'
    },
    {
        text: 'Create Invoice',
        handler: 'onInvoiceSubmitButton',
        disabled: true,
        formBind: true,
        width: 150,
        style: 'border-radius: 5px'
    }]
});
