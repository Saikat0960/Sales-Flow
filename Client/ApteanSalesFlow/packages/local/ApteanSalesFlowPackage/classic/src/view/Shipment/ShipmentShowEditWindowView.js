Ext.define('ApteanSalesFlowPackage.view.Shipment.ShipmentShowEditWindowView', {
    extend: 'Ext.window.Window',
    height: '90%',
    width: '80%',
    controller: 'showeditshipment',
    scrollable: 'vertical',
    modal: true,
    resizable: false,
    items: [{
        xtype: 'form',
        itemId: 'editShipment',
        title: 'Shipment Detail',
        bodyPadding: 10,
        scrollable: true,
        viewModel: {
            data: {
                shipments: {}
            }
        },
        defaults: {
            labelStyle: 'padding:10px; padding-left:20px; padding-bottom:20px;'
        },
        items: [
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                items: [{
                    xtype: 'displayfield',
                    fieldLabel: 'Shipment No.',
                    bind: {
                        value: '{shipments.shipment_Number}'
                    },
                    margin: '15 30 10 15',
                    labelWidth: 90,
                    fieldStyle: 'font-size: 15px; font-weight: bold;',
                    width: '15%'
                },
                {
                    xtype: 'displayfield',
                    fieldLabel: 'Company Name',
                    bind: {
                        value: '{shipments.customer1.company_Name}'
                    },
                    fieldStyle: 'font-size: 14px; font-weight: bold;',
                    margin: '15 30 10 0',
                    labelWidth: 120,
                    allowBlank: false,
                    width: '50%'
                },
                {
                    xtype: 'combobox',
                    fieldLabel: 'Status',
                    bind: {
                        value: '{shipments.status}'
                    },
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'name',
                    allowBlank: false,
                    editable: false,
                    margin: '15 20 10 15',
                    width: '30%',
                    labelWidth: 60,
                    store: [{
                        name: 'STARTED'
                    }, {
                        name: 'APPROVED'
                    }]
                }
                ]
            },
            {
                xtype: 'fieldcontainer',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                fieldDefaults: {
                    width: '100%'
                },
                items: [
                    {
                        xtype: 'fieldset',
                        title: 'Basic Information',
                        layout: {
                            type: 'hbox'
                        },
                        items: [{
                            margin: '0 100 10 0',
                            xtype: 'fieldcontainer',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            width: '45%',
                            items: [{
                                xtype: 'textfield',
                                fieldLabel: 'SO Number',
                                bind: {
                                    value: '{shipments.sO_Number}'
                                },
                                allowBlank: false,
                                readOnly: true
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Tracking No.',
                                bind: {
                                    value: '{shipments.tracking_Number}'
                                },
                                allowBlank: false,
                                maskRe: /^[0-9]+$/,
                            }]
                        },
                        {
                            xtype: 'fieldcontainer',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            width: '45%',
                            items: [{
                                xtype: 'datefield',
                                fieldLabel: 'Shipment Date',
                                allowBlank: false,
                                dateFormat: 'Y-m-d',
                                bind: {
                                    value: '{shipments.date}'
                                }
                            },
                            {
                                xtype: 'textareafield',
                                fieldLabel: 'Remark',
                                bind: {
                                    value: '{shipments.remark}'
                                }
                            }]
                        }]
                    },
                    {
                        xtype: 'fieldset',
                        title: 'Customer Details',
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
                                fieldLabel: 'Id',
                                bind: {
                                    value: '{shipments.customer1.id}'
                                },
                                allowBlank: false,
                                readOnly: true,
                                width: '100%'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'First Name',
                                bind: {
                                    value: '{shipments.customer1.first_Name}'
                                },
                                allowBlank: false,
                                readOnly: true,
                                width: '100%'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Last Name',
                                bind: {
                                    value: '{shipments.customer1.last_Name}'
                                },
                                allowBlank: false,
                                readOnly: true,
                                width: '100%'
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
                                    fieldLabel: 'Sales Person',
                                    allowBlank: false,
                                    bind: {
                                        value: '{shipments.customer1.sales_Person.name}'
                                    },
                                    readOnly: true,
                                    width: '100%'
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'E-Mail',
                                    bind: {
                                        value: '{shipments.customer1.email}'
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
                                    bind: {
                                        value: '{shipments.customer1.phone}'
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
                                value: '{shipments.shipping_Address}'
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
                                                value: '{shipments.shipping_City}'
                                            },
                                            width: '100%',
                                            allowBlank: false,
                                            maskRe: /[a-zA-Z ]*$/
                                        },
                                        {
                                            xtype: 'combobox',
                                            fieldLabel: 'Country',
                                            bind: {
                                                value: '{shipments.shipping_Country_Id}'
                                            },
                                            width: '100%',
                                            queryMode: 'local',
                                            displayField: 'name',
                                            editable: false,
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
                                            value: '{shipments.shipping_State}'
                                        },
                                        maskRe: /[a-zA-Z ]*$/,
                                        allowBlank: false
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Zip Code',
                                        bind: {
                                            value: '{shipments.shipping_ZipCode}'
                                        },
                                        width: '100%',
                                        maskRe: /^[a-zA-Z0-9-]+$/,
                                        allowBlank: false
                                    }]

                                }]
                        }]

                    },
                    {
                        xtype: 'fieldset',
                        title: 'Shipping Items',
                        items: [
                            {
                                xtype: 'grid',
                                itemId: 'itemGrid',
                                width: '100%',
                                margin: '20 10 0 10',
                                autoLoad: true,
                                frame: true,
                                selModel: {
                                    type: 'cellmodel'
                                },

                                plugins: {
                                    ptype: 'cellediting',
                                    clicksToEdit: 1
                                },
                                style: {
                                    'border': '1px solid'
                                },
                                columns: [{
                                    text: 'No.',
                                    xtype: 'rownumberer',
                                    align: 'left',
                                    flex: 0.5
                                },
                                {
                                    dataIndex: 'part_Id',
                                    text: 'Part No.',
                                    flex: 1
                                }, {
                                    dataIndex: 'part_Name',
                                    text: 'Part Name',
                                    flex: 2
                                },
                                {
                                    dataIndex: 'uom',
                                    text: 'Unit Of Measure',
                                    flex: 1
                                },
                                {
                                    dataIndex: 'price',
                                    text: 'Unit Price',
                                    flex: 1
                                },
                                {
                                    dataIndex: 'quantity',
                                    text: 'Quantity',
                                    flex: 1
                                }]
                            }]
                    }
                ]
            }
        ]
    }],
    buttons: [
        {
            text: 'Save & Update',
            handler: 'onUpdateData',
            formBind: true,
            margin: '0 15 0 0',
            style: 'border-radius: 5px'
        }
    ],
    listeners: {
        beforerender: 'loadingRecord'
    }
});