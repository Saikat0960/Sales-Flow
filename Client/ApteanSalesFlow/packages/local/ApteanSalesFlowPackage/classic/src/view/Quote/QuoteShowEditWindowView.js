Ext.define('ApteanSalesFlowPackage.view.Quote.QuoteShowEditWindowView', {
    extend: 'Ext.window.Window',
    height: '90%',
    width: '80%',
    requires: [
        'ApteanSalesFlowPackage.view.Features.DateVType'
    ],
    controller: 'showquote',
    scrollable: 'vertical',
    modal: true,
    resizable: false,
    items: [{
        xtype: 'form',
        itemId: 'quoteDetails',
        title: 'Quote Detail',
        bodyPadding: 10,
        defaultType: 'textfield',
        viewModel: {
            data: {
                quote: {},
                salesPerson: {},
                totalAmount: 0
            },
            stores: {
                _items: {
                    type: 'itemlist'
                }
            }
        },
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        scrollable: true,
        items: [{
            xtype: 'fieldcontainer',
            layout: {
                type: 'hbox'
            },
            items: [{
                xtype: 'displayfield',
                fieldLabel: 'Quote No.',
                bind: {
                    value: '{quote.quote_Number}'
                },
                margin: '15 20 10 15',
                labelWidth: 70,
                fieldStyle: 'font-size: 15px; font-weight: bold;',
                width: '15%'
            }, 
            {
                xtype: 'displayfield',
                fieldLabel: 'Company Name',
                bind: {
                    value: '{quote.customer1.company_Name}'
                },
                allowBlank: false,
                fieldStyle: 'font-size: 14px; font-weight: bold;',
                margin: '15 30 10 0',
                labelWidth: 120,
                width: '50%'
            },
            {
                xtype: 'combobox',
                fieldLabel: 'Status',
                bind: {
                    value: '{quote.status}'
                },
                queryMode: 'local',
                displayField: 'name',
                valueField: 'name',
                editable: false,
                margin: '15 20 10 15',
                labelWidth: 60,
                width: '30%',
                allowBlank: false,
                store: [{
                    name: 'STARTED'
                }, {
                    name: 'APPROVED'
                }]
            }
            ]
        },
        {
            xtype: 'fieldset',
            title: 'Customer Information',

            layout: {
                type: 'hbox'
            },
            fieldDefaults: {
                width: '100%',
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
                    fieldLabel: 'Id',
                    bind: {
                        value: '{quote.customer1.id}'
                    },
                    allowBlank: false,
                    readOnly: true,
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'First Name',
                    bind: {
                        value: '{quote.customer1.first_Name}'
                    },
                    allowBlank: false,
                    readOnly: true
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Last Name',
                    bind: {
                        value: '{quote.customer1.last_Name}'
                    },
                    allowBlank: false,
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
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'Sales Person',
                    bind: {
                        value: '{salesPerson}'
                    },
                    allowBlank: false,
                    readOnly: true
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Email',
                    bind: {
                        value: '{quote.customer1.email}'
                    },
                    allowBlank: false,
                    readOnly: true
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Phone',
                    bind: {
                        value: '{quote.customer1.phone}'
                    },
                    allowBlank: false,
                    readOnly: true
                }]
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
            title: 'Shipping Address Information',
            name: 'shippingAddressForm',
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
                    value: '{quote.shipping_Address}'
                },
                allowBlank: false
            },
            {
                xtype: 'fieldcontainer',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'fieldcontainer',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    width: '45%',
                    margin: '0 100 10 0',
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: 'City',
                        bind: {
                            value: '{quote.shipping_City}'
                        },
                        maskRe: /[a-zA-Z ]*$/,
                        allowBlank: false
                    },
                    {
                        xtype: 'combobox',
                        fieldLabel: 'Country',
                        bind: {
                            value: '{quote.shipping_Country_Id}'
                        },
                        queryMode: 'local',
                        editable: false,
                        allowBlank: false,
                        displayField: 'name',
                        valueField: 'id',
                        store: {
                            type: 'countries'
                        }
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
                        xtype: 'textfield',
                        fieldLabel: 'State',
                        bind: {
                            value: '{quote.shipping_State}'
                        },
                        maskRe: /[a-zA-Z ]*$/,
                        allowBlank: false
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Zip Code',
                        bind: {
                            value: '{quote.shipping_ZipCode}'
                        },
                        maskRe: /^[a-zA-Z0-9-]+$/,
                        allowBlank: false
                    }]
                }]
            }]
        },
        {
            xtype: 'grid',
            itemId: 'itemGrid',
            bind: {
                store: '{_items}'
            },
            width: '100%',
            margin: '20 10 0 10',
            autoLoad: true,
            frame: true,
            selModel: {
                type: 'cellmodel'
            },

            tbar: [{
                text: 'Add Item',
                handler: 'onAddClick',
                style: 'border-radius: 5px'
            }],

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
            },
            {
                dataIndex: 'part_Name',
                text: 'Part Name',
                flex: 2
            },
            {
                dataIndex: 'product_Class',
                text: 'Product Class',
                flex: 1
            },
            {
                dataIndex: 'product_Group',
                text: 'Product Group',
                flex: 1
            },
            {
                dataIndex: 'uom',
                text: 'Unit Of Measure',
                flex: 1.2
            },
            {
                dataIndex: 'quantity',
                text: 'Quantity',
                flex: 0.9,
                editable: true,
                editor: {
                    xtype: 'numberfield',
                    allowBlank: false,
                    minValue: 1,
                    maxValue: 100000,
                    listeners: {
                        specialkey: 'onQuantityEdit'
                    }
                }
            },
            {
                dataIndex: 'price',
                text: 'Unit Price',
                flex: 1.1
            },
            {
                xtype: 'actioncolumn',
                sortable: false,
                flex: 0.5,
                menuDisabled: true,
                align: 'center',
                items: [{
                    iconCls: 'x-fa fa-trash',
                    tooltip: 'Delete Item',
                    handler: 'onRemoveClick'
                }]
            }]
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
        }]
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
