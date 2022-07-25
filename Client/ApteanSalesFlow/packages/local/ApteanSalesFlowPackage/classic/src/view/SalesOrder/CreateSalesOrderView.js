Ext.define('ApteanSalesFlowPackage.view.SalesOrder.CreateSalesOrderView', {
    extend: 'Ext.form.Panel',
    //alias: 'widget.CreateSalesOrderView',
    xtype: 'CreateSalesOrderView',

    requires: [
        'ApteanSalesFlowPackage.view.Features.DateVType'
    ],

    controller: 'salesorder',

    viewModel: {
        data: {
            tax: {},
            customers: {},
            quotes: {},
            address: {},
            salesOrder: {},
            totalAmount: 0
        },
        stores: {
            _items: {
                type: 'itemlist'
            }
        }
    },

    scrollable: true,
    items: [
        {
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox'
            },
            items: [
                {
                    xtype: 'button',
                    text: 'Load Record',
                    menu: [
                        { text: 'Customer', handler: 'onCustomerLoadButton' },
                        { text: 'Quote', handler: 'onQuoteLoadButton' }
                    ],
                    style: {
                        borderRadius: '5px'
                    },
                    width: '20%',
                    margin: '15 50 10 15'
                },
                {
                    xtype: 'textfield',
                    name: 'company',
                    fieldLabel: 'Company Name',
                    bind: {
                        value: '{customers.company_Name}'
                    },
                    labelWidth: 120,
                    margin: '15 50 10 15',
                    width: '50%',
                    allowBlank: false,
                    readOnly: true
                },
                {
                    xtype: 'displayfield',
                    fieldLabel: 'Status',
                    value: 'STARTED',
                    fieldStyle: 'font-size: 15px; font-weight: bold;',
                    allowBlank: false,
                    margin: '15 20 10 15',
                    width: '30%',
                    labelWidth: 70
                },
            ]
        },
        {
            xtype: 'tabpanel',
            itemId: 'tab',
            fullscreen: true,
            tabBarPosition: 'top',
            margin: 20,
            items: [
                {
                    title: 'General Information',
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    items: [
                        {
                            xtype: 'fieldset',
                            title: 'Order Details',
                            layout: {
                                type: 'hbox'
                            },
                            items: [
                                {
                                    xtype: 'fieldcontainer',
                                    layout: {
                                        type: 'vbox',
                                        align: 'stretch'
                                    },
                                    margin: '0 100 0 0',
                                    width: '45%',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            bind: {
                                                value: '{salesOrder.pO_Number}'
                                            },
                                            fieldLabel: 'Customer PO Number',
                                            width: '100%',
                                            allowBlank: false,
                                            maskRe: /\d/
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'Customer Id',
                                            bind: {
                                                value: '{customers.id}'
                                            },
                                            allowBlank: false,
                                            readOnly: true,
                                            width: '100%'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Quote Number',
                                    width: '45%',
                                    bind: {
                                        value: '{ quotes.quote_Number }'
                                    },
                                    readOnly: true
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: 'Date Requirements',
                            layout: {
                                type: 'hbox'
                            },
                            items: [{
                                xtype: 'datefield',
                                fieldLabel: 'Requested Date',
                                margin: '0 100 10 0',
                                itemId: 'startdt',
                                vtype: 'daterange',
                                endDateField: 'enddt',
                                dateFormat: 'Y-m-d',
                                width: '45%',
                                allowBlank: false,
                                bind: {
                                    value: '{quotes.date_Requested}'
                                }
                            },
                            {
                                xtype: 'datefield',
                                fieldLabel: 'Required Date',
                                itemId: 'enddt',
                                vtype: 'daterange',
                                startDateField: 'startdt',
                                dateFormat: 'Y-m-d',
                                width: '45%',
                                allowBlank: false,
                                bind: {
                                    value: '{quotes.date_Required}'
                                }
                            }]
                        },
                        {
                            xtype: 'fieldset',
                            title: 'Primary Contact',
                            layout: {
                                type: 'hbox'
                            },
                            items: [
                                {
                                    xtype: 'fieldcontainer',
                                    layout: {
                                        type: 'vbox',
                                        align: 'stretch'
                                    },
                                    margin: '0 100 10 0',
                                    width: '45%',
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'FirstName',
                                            width: '100%',
                                            allowBlank: false,
                                            readOnly: true,
                                            bind: {
                                                value: '{customers.first_Name}'
                                            }
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'Last Name',
                                            width: '100%',
                                            allowBlank: false,
                                            readOnly: true,
                                            bind: {
                                                value: '{customers.last_Name}'
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
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'Phone',
                                            width: '100%',
                                            allowBlank: false,
                                            readOnly: true,
                                            bind: {
                                                value: '{customers.phone}'
                                            }
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'Email',
                                            width: '100%',
                                            allowBlank: false,
                                            readOnly: true,
                                            vtype: 'email',
                                            emptyText: 'abc123@xyz.com',
                                            bind: {
                                                value: '{customers.email}'
                                            }
                                        }
                                    ]
                                }
                            ]
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
                                    value: '{address.shipping_Address}'
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
                                                    value: '{address.shipping_City}'
                                                },
                                                width: '100%',
                                                allowBlank: false,
                                                maskRe: /[a-zA-Z ]*$/
                                            },
                                            {
                                                xtype: 'combobox',
                                                fieldLabel: 'Country',
                                                bind: {
                                                    value: '{address.shipping_Country_Id}'
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
                                                value: '{address.shipping_State}'
                                            },
                                            maskRe: /[a-zA-Z ]*$/,
                                            allowBlank: false
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'Zip Code',
                                            bind: {
                                                value: '{address.shipping_ZipCode}'
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
                            title: 'Sales Person Information',
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
                                        value: '{customers.sales_Person.name}'
                                    },
                                    readOnly: true,
                                    width: '100%'
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Territory',
                                    bind: {
                                        value: '{customers.sales_Person.territory}'
                                    },
                                    readOnly: true,
                                    width: '100%'
                                }]
                            },
                            {
                                xtype: 'numberfield',
                                fieldLabel: 'Commission(%)',
                                bind: {
                                    value: '{customers.sales_Person.commission}'
                                },
                                width: '45%',
                                readOnly: true
                            }]
                        },
                        {
                            xtype: 'fieldset',
                            title: 'Financial Information',
                            layout: {
                                type: 'hbox'
                            },

                            items: [
                                {
                                    xtype: 'fieldcontainer',
                                    layout: {
                                        type: 'vbox',
                                        align: 'stretch'
                                    },
                                    margin: '0 100 10 0',
                                    width: '45%',
                                    items: [
                                        {
                                            xtype: 'combobox',
                                            fieldLabel: 'Currency',
                                            queryMode: 'local',
                                            displayField: 'name',
                                            valueField: 'id',
                                            width: '100%',
                                            bind: {
                                                value: '{customers.currency}'
                                            },
                                            store: {
                                                type: 'currencies'
                                            },
                                            allowBlank: false,
                                            readOnly: true
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            layout: {
                                                type: 'hbox'
                                            },
                                            width: '100%',
                                            items: [{
                                                xtype: 'textfield',
                                                fieldLabel: 'Tax',
                                                bind: {
                                                    value: '{tax.name}'+'({tax.rate}%)'
                                                },
                                                width: '84%',
                                                allowBlank: false,
                                                readOnly: true
                                            },
                                            {
                                                xtype: 'button',
                                                text: 'Load',
                                                handler: 'onTaxLoad',
                                                scale: 'small',
                                                style: {
                                                    borderRadius: '5px',
                                                    height: '32px',
                                                },
                                                margin: '0 0 0 10'
                                            }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Credit Limit',
                                    width: '45%',
                                    allowBlank: false,
                                    readOnly: true,
                                    bind: {
                                        value: '{customers.credit_Limit}'
                                    }
                                }
                            ]
                        }
                    ],
                },
                {
                    title: 'Item Details',
                    itemId: 'itemDetails',
                    layout: 'vbox',
                    width: '100%',
                    items: [
                        {
                            xtype: 'grid',
                            itemId: 'itemGrid',
                            style: 'border: 1px solid black',
                            height: 200,
                            width: '100%',
                            bind: {
                                store: '{_items}'
                            },
                            margin: '20 10 0 10',
                            columns: [
                                {
                                    text: 'Item No.',
                                    xtype: 'rownumberer',
                                    align: 'left',
                                    flex: 0.5
                                },
                                {
                                    text: 'Part Number',
                                    dataIndex: 'part_Id',
                                    flex: 0.5
                                },
                                {
                                    text: 'Part Name',
                                    dataIndex: 'part_Name',
                                    flex: 1
                                },
                                {
                                    text: 'Unit Of Measure',
                                    dataIndex: 'uom',
                                    flex: 0.8
                                },
                                {
                                    text: 'Quantity',
                                    dataIndex: 'quantity',
                                    flex: 0.7,
                                    editor: {
                                        completeOnEnter: true,
                                        field: {
                                            xtype: 'numberfield',
                                            allowBlank: false,
                                            minValue: 1,
                                            maxValue: 100000,
                                            listeners: {
                                                specialkey: 'onQuantityEdit'
                                            }
                                        }
                                    }
                                },
                                {
                                    text: 'Unit Price',
                                    dataIndex: 'price',
                                    flex: 0.7
                                },
                                {
                                    xtype: 'actioncolumn',
                                    width: 40,
                                    tdCls: 'delete',
                                    items: [{
                                        iconCls: 'icon-garbage-can',  // Use a URL in the icon config
                                        tooltip: 'Delete',
                                        handler: 'onItemDelete',
                                    }
                                    ]
                                }
                            ],
                            selModel: 'cellmodel',
                            plugins: {
                                ptype: 'cellediting',
                                clicksToEdit: 1
                            }
                        },
                        {
                            xtype: 'fieldcontainer',
                            layout: {
                                type: 'hbox',
                                align: 'end',
                                pack: 'end'
                            },
                            width: '100%',
                            style: 'border: 1px solid black',
                            margin: '0 10 20 10',
                            items: [{
                                xtype: 'numberfield',
                                fieldLabel: 'Total Amount',
                                bind: {
                                    value: '{totalAmount}'
                                },
                                width: '45%',
                                readOnly: true,
                                hidetrigger: true,
                                minValue: 1,
                                padding: 10,
                                allowBlank: false
                            }]
                        },
                        {
                            xtype: 'form',
                            layout: 'vbox',
                            id: 'item-form',
                            width: '100%',
                            items: [
                                {
                                    xtype: 'fieldset',
                                    title: 'Item Details',
                                    width: '100%',
                                    items: [{
                                        xtype: 'fieldcontainer',
                                        layout: 'hbox',
                                        items: [{
                                            xtype: 'fieldcontainer',
                                            margin: '0 100 10 5',
                                            width: '40%',
                                            items: [{
                                                xtype: 'fieldcontainer',
                                                layout: 'hbox',
                                                items: [{
                                                    xtype: 'numberfield',
                                                    fieldLabel: 'Part No',
                                                    name: 'part_Id',
                                                    margin: '0 10 0 0',
                                                    width: 200,
                                                    hideTrigger: true,
                                                    value: 0,
                                                    readOnly: true,
                                                }, {
                                                    xtype: 'button',
                                                    text: 'Load Item',
                                                    handler: 'onItemLoadButton',
                                                    style: 'border-radius: 5px'
                                                }]
                                            },
                                            {
                                                xtype: 'textfield',
                                                fieldLabel: 'Part Name',
                                                name: 'part_Name',
                                                readOnly: true,
                                                width: '100%',
                                            },
                                            {
                                                xtype: 'textareafield',
                                                fieldLabel: 'Description',
                                                name: 'description',
                                                readOnly: true,
                                                width: '100%'
                                            }]
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            width: '40%',
                                            items: [
                                                {
                                                    xtype: 'textfield',
                                                    fieldLabel: 'Revision',
                                                    name: 'revision',
                                                    width: '100%',
                                                    readOnly: true
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    fieldLabel: 'UOM',
                                                    name: 'uom',
                                                    readOnly: true,
                                                    width: '100%'
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    fieldLabel: 'Product Class',
                                                    name: 'product_Class',
                                                    readOnly: true,
                                                    width: '100%'
                                                },
                                                {
                                                    xtype: 'textfield',
                                                    fieldLabel: 'Product Group',
                                                    name: 'product_Group',
                                                    readOnly: true,
                                                    width: '100%'
                                                }
                                            ]
                                        }]
                                    },
                                    {
                                        xtype: 'fieldcontainer',
                                        margin: '50 0 0 5',
                                        layout: 'hbox',
                                        width: '100%',
                                        items: [{
                                            xtype: 'numberfield',
                                            fieldLabel: 'Quantity',
                                            name: 'quantity',
                                            margin: '0 100 10 0',
                                            width: '40%',
                                            value: 0,
                                            allowBlank: false
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'Price',
                                            name: 'price',
                                            margin: '0 0 10 0',
                                            hideTrigger: true,
                                            value: 0,
                                            width: '40%',
                                            allowBlank: false
                                        },
                                        {
                                            xtype: 'button',
                                            text: 'Add Item to List',
                                            handler: 'onItemAddButton',
                                            style: 'border-radius: 5px',
                                            margin: '0 0 0 5',
                                            width: '15%'
                                        }]
                                    }
                                    ]
                                }]
                        }
                    ]
                }
            ]
        }
    ],
    buttons: [{
        text: 'Reset',
        handler: 'onSalesOrderResetButton',
        width: 100,
        style: 'border-radius: 5px'
    },
    {
        text: 'Submit',
        handler: 'onSalesOrderSubmitButton',
        disabled: true,
        formBind: true,
        width: 100,
        style: 'border-radius: 5px'
    }]
})