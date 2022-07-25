Ext.define('ApteanSalesFlowPackage.view.Shipment.CreateShipmentView', {
    extend: 'Ext.form.Panel',
    xtype: 'CreateShipmentView',
    requires: [
        'ApteanSalesFlowPackage.store.SalesOrder',
        'ApteanSalesFlowPackage.view.LoadSalesOrder.LoadSalesOrder'
    ],
    controller: 'shipment',
    scrollable: true,
    viewModel: {
        data: {
            salesOrder: {},
            shipment: {}
        }
    },
    items: [
        {
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox'
            },
            items: [
                {
                    xtype: 'button',
                    text: 'Load Sales Orders',
                    margin: '15 50 10 15',
                    width: '20%',
                    style: 'border-radius: 5px',
                    handler: 'onSalesOrderLoadButton'
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Company Name',
                    allowBlank: false,
                    readOnly: true,
                    width: '50%',
                    labelWidth: 120,
                    margin: '15 50 10 15',
                    bind: {
                        value: '{salesOrder.customer1.company_Name}'
                    },
                },
                {
                    xtype: 'combobox',
                    fieldLabel: 'Status',
                    itemId: 'Confirmedcombobox',
                    queryMode: 'local',
                    allowBlank: false,
                    margin: '15 20 10 15',
                    width: '30%',
                    labelWidth: 70,
                    displayField: 'name',
                    valueField: 'name',
                    editable: false,
                    bind: {
                        value: '{shipment.status}'
                    },
                    id: "status",
                    store: [{
                        name: 'STARTED'
                    }, {
                        name: 'APPROVED'
                    }]
                }
            ]
        },
        {
            xtype: 'tabpanel',
            itemId: 'tab',
            margin: '20',
            tabBarPosition: 'top',
            items: [
                {
                    title: 'Shipping Information',

                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },

                    items: [
                        {
                            xtype: 'fieldset',
                            title: 'Order Details',
                            layout: 'hbox',
                            items: [
                                {
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
                                            fieldLabel: 'SO Number',
                                            bind: {
                                                value: '{salesOrder.sO_Number}'
                                            },
                                            allowBlank: false,
                                            readOnly: true,
                                            width: '100%'
                                        },

                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'Customer Id',
                                            bind: {
                                                value: '{salesOrder.customer}'
                                            },
                                            allowBlank: false,
                                            readOnly: true,
                                            width: '100%'
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'Tracking No.',
                                            bind: {
                                                value: '{shipment.tracking_No}'
                                            },
                                            maskRe: /^[0-9]+$/,
                                            allowBlank: false,
                                            width: '100%'
                                        },
                                    ]
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
                                            xtype: 'datefield',
                                            fieldLabel: 'Shipment Date',
                                            bind: {
                                                value: '{shipment.date}'
                                            },
                                            allowBlank: false,
                                            width: '100%'
                                        },
                                        {

                                            xtype: 'textareafield',
                                            fieldLabel: 'Remark',
                                            width: '100%',
                                            bind: {
                                                value: '{shipment.remark}'
                                            }
                                        },

                                    ]
                                }

                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: 'Primary Contact',
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
                                            value: '{salesOrder.customer1.first_Name}'
                                        },
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Last Name',
                                        allowBlank: false,
                                        readOnly: true,
                                        width: '100%',
                                        bind: {
                                            value: '{salesOrder.customer1.last_Name}'
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
                                            value: '{salesOrder.customer1.email}'
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
                                            value: '{salesOrder.customer1.phone}'
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
                            title: 'Sales Person Information',
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
                                        value: '{salesOrder.sales_Person1.name}'
                                    },
                                    readOnly: true,
                                    width: '100%'
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Territory',
                                    bind: {
                                        value: '{salesOrder.sales_Person1.territory}'
                                    },
                                    readOnly: true,
                                    width: '100%'
                                }]
                            },
                            {
                                xtype: 'numberfield',
                                fieldLabel: 'Commission(%)',
                                bind: {
                                    value: '{salesOrder.sales_Person1.commission}'
                                },
                                width: '45%',
                                readOnly: true
                            }]
                        },
                        {
                            xtype: 'fieldset',
                            title: 'Shipping Address Information',
                            reference: 'shippingAddressForm',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },

                            items: [{
                                width: '85%',
                                xtype: 'textareafield',
                                fieldLabel: 'Address',
                                bind: {
                                    value: '{salesOrder.shipping_Address}'
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
                                                    value: '{salesOrder.shipping_City}'
                                                },
                                                width: '100%',
                                                allowBlank: false,
                                                maskRe: /[a-zA-Z ]*$/
                                            },
                                            {
                                                xtype: 'combobox',
                                                fieldLabel: 'Country',
                                                bind: {
                                                    value: '{salesOrder.shipping_Country_Id}'
                                                },
                                                width: '100%',
                                                editable: false,
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
                                                value: '{salesOrder.shipping_State}'
                                            },
                                            maskRe: /[a-zA-Z ]*$/,
                                            allowBlank: false
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'Zip Code',
                                            bind: {
                                                value: '{salesOrder.shipping_ZipCode}'
                                            },
                                            maskRe: /^[a-zA-Z0-9-]+$/,
                                            width: '100%',
                                            allowBlank: false
                                        }]

                                    }]
                            }]

                        },
                        {
                            xtype: 'fieldset',
                            title: 'Item Details',
                            itemId: 'itemDetails',
                            reference: 'ItemForm',
                            layout: {
                                type: 'vbox'
                            },
                            width: '100%',
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
                                    layout: {
                                        type: 'hbox',
                                        align: 'end',
                                        pack: 'end'
                                    },
                                    width: '100%',
                                    margin: '10 0 0 0',
                                    items: [{
                                        xtype: 'textfield',
                                        fieldLabel: 'Total Amount',
                                        bind: {
                                            value: '{salesOrder.total_Value}'
                                        },
                                        width: '45%',
                                        allowBlank: false,
                                        readOnly: true
                                    }]
                                }
                            ]
                        }
                    ],

                }

            ]
        }],
    buttons: [{
        text: 'Reset',
        handler: 'onShipmentResetButton',
        width: 100,
        style: 'border-radius: 5px'
    },
    {
        text: 'Submit',
        handler: 'onShipmentSubmitButton',
        disabled: true,
        formBind: true,
        width: 100,
        style: 'border-radius: 5px'
    }]

});
