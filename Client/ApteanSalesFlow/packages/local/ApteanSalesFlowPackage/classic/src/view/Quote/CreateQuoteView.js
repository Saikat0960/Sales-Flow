Ext.define('ApteanSalesFlowPackage.view.Quote.CreateQuoteView', {
    extend: 'Ext.form.Panel',

    requires: [
        'ApteanSalesFlowPackage.store.Customer',
        'ApteanSalesFlowPackage.view.Features.DateVType'
    ],
    xtype: 'CreateQuoteView',
    controller: 'quote',
    scrollable: true,
    viewModel: {
        data: {
            customers: {},
            quote: {},
            totalAmount: 0
        },
        stores: {
            _items: {
                type: 'itemlist'
            }
        }
    },
    fullscreen: true,
    items: [{
        xtype: 'fieldcontainer',
        layout: {
            type: 'hbox'
        },
        fullscreen: 'true',
        items: [{
            xtype: 'button',
            text: 'Load Customer',
            handler: 'onCustomerLoadButton',
            width: '20%',
            margin: '15 50 10 15',
            style: {
                borderRadius: '5px'
            },
        }, {
            xtype: 'textfield',
            fieldLabel: 'Company Name',
            bind: {
                value: '{customers.company_Name}'
            },
            labelWidth: 120,
            allowBlank: false,
            readOnly: true,
            margin: '15 50 10 15',
            width: '50%'
        },
        {
            xtype: 'displayfield',
            fieldLabel: 'Status',
            value: 'STARTED',
            fieldStyle: 'font-size: 15px; font-weight: bold;',
            margin: '15 20 10 15',
            width: '30%',
            labelWidth: 70,
            allowBlank: false
        }
        ]
    },
    {
        xtype: 'tabpanel',
        itemId: 'tab',
        tabBarPosition: 'top',
        margin: 20,
        items: [
            {
                title: 'General Information',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
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
                                value: '{customers.id}'
                            },
                            allowBlank: false,
                            readOnly: true,
                            width: '100%'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'First Name',
                            bind: {
                                value: '{customers.first_Name}'
                            },
                            allowBlank: false,
                            readOnly: true,
                            width: '100%'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Last Name',
                            bind: {
                                value: '{customers.last_Name}'
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
                                fieldLabel: 'E-Mail',
                                bind: {
                                    value: '{customers.email}'
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
                                    value: '{customers.phone}'
                                },
                                allowBlank: false,
                                readOnly: true,
                                width: '100%'
                            },
                            {
                                xtype: 'textareafield',
                                fieldLabel: 'Description',
                                bind: {
                                    value: '{customers.description}'
                                },
                                readOnly: true,
                                width: '100%'
                            }
                        ]
                    }]
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
                        bind: {
                            value: '{quote.date_Requested}'
                        },
                        margin: '0 100 10 0',
                        itemId: 'startdt',
                        vtype: 'daterange',
                        endDateField: 'enddt',
                        dateFormat: 'Y-m-d',
                        width: '45%',
                        allowBlank: false
                    },
                    {
                        xtype: 'datefield',
                        fieldLabel: 'Required Date',
                        bind: {
                            value: '{quote.date_Required}'
                        },
                        itemId: 'enddt',
                        vtype: 'daterange',
                        startDateField: 'startdt',
                        dateFormat: 'Y-m-d',
                        width: '45%',
                        allowBlank: false
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
                            value: '{customers.shipping_Address}'
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
                                            value: '{customers.shipping_City}'
                                        },
                                        width: '100%',
                                        allowBlank: false,
                                        maskRe: /[a-zA-Z ]*$/
                                    },
                                    {
                                        xtype: 'combobox',
                                        fieldLabel: 'Country',
                                        bind: {
                                            value: '{customers.shipping_Country_Id}'
                                        },
                                        width: '100%',
                                        queryMode: 'local',
                                        editable: false,
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
                                        value: '{customers.shipping_State}'
                                    },
                                    maskRe: /[a-zA-Z ]*$/,
                                    allowBlank: false
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Zip Code',
                                    bind: {
                                        value: '{customers.shipping_ZipCode}'
                                    },
                                    maskRe: /^[a-zA-Z0-9-]+$/,
                                    width: '100%',
                                    allowBlank: false
                                }]

                            }]
                    }]

                }
                ]
            },
            {
                title: 'Item Details',
                layout: 'vbox',
                itemId: 'itemDetails',
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
                                    iconCls: 'icon-garbage-can',
                                    tooltip: 'Delete',
                                    handler: 'onItemDelete'
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
                            readOnly: true,
                            hidetrigger: true,
                            minValue: 1,
                            width: '45%',
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
                                            width: '100%',
                                            readOnly: true
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
                                                readOnly: true,
                                                width: '100%'
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
                                        xtype: 'numberfield',
                                        fieldLabel: 'Price',
                                        name: 'price',
                                        margin: '0 0 10 0',
                                        width: '40%',
                                        hideTrigger: true,
                                        value: 0,
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
    }],
    buttons: [{
        text: 'Reset',
        handler: 'onQuoteResetButton',
        width: 100,
        style: 'border-radius: 5px'
    },
    {
        text: 'Submit',
        handler: 'onQuoteSubmitButton',
        disabled: true,
        formBind: true,
        width: 100,
        style: 'border-radius: 5px'
    }]
});