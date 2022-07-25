Ext.define('ApteanSalesFlowPackage.view.SalesOrder.SalesOrderShowEditWindowView', {
    extend: 'Ext.window.Window',
    height: '90%',
    width: '80%',
    controller: 'showeditsalesorder',
    scrollable: 'vertical',
    requires: [
        'ApteanSalesFlowPackage.view.Features.DateVType'
    ],
    modal: true,
    items: [{
        xtype: 'form',
        itemId: 'salesOrderDetails',
        title: 'Sales Order',
        bodyPadding: 10,
        defaultType: 'textfield',
        viewModel: {
            data: {
                salesOrder: {},
                customer: {},
                salesPerson: {},
                tax: {},
                total_Amount: 0
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
            layout: 'hbox',
            items: [
                {
                    xtype: 'displayfield',
                    fieldLabel: 'SO Number',
                    bind: {
                        value: '{salesOrder.sO_Number}'
                    },
                    margin: '15 20 10 15',
                    fieldStyle: 'font-size: 15px; font-weight: bold;',
                    width: '15%',
                },
                {
                    xtype: 'displayfield',
                    fieldLabel: 'Company Name',
                    bind: {
                        value: '{customer.company_Name}'
                    },
                    margin: '15 30 10 0',
                    fieldStyle: 'font-size: 14px; font-weight: bold;',
                    width: '50%',
                    labelWidth: 120,
                    allowBlank: false,
                    readOnly: true
                },
                {
                    xtype: 'combobox',
                    fieldLabel: 'Status',
                    bind: {
                        value: '{salesOrder.status}'
                    },
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'name',
                    margin: '15 20 10 15',
                    width: '30%',
                    store: [{
                        name: 'STARTED'
                    }, {
                        name: 'APPROVED'
                    }],
                    allowBlank: false,
                    labelWidth: 60
                },
            ]
        },
        {
            xtype: 'fieldset',
            title: 'Basic Information',
            layout: {
                type: 'hbox'
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: 'PO Number',
                bind: {
                    value: '{salesOrder.pO_Number}'
                },
                allowBlank: false,
                width: '45%',
                margin: '0 100 10 0',
                maskRe: /\d/
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Quote No.',
                bind: {
                    value: '{salesOrder.quote_Number}'
                },
                readOnly: true,
                width: '45%'
            }]
        },
        {
            xtype: 'fieldset',
            title: 'Customer Information',

            layout: {
                type: 'hbox'
            },
            fieldDefaults: {
                width: '100%'
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
                        value: '{customer.id}'
                    },
                    allowBlank: false,
                    readOnly: true,
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'First Name',
                    allowBlank: false,
                    readOnly: true,
                    bind: {
                        value: '{customer.first_Name}'
                    }
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Last Name',
                    allowBlank: false,
                    readOnly: true,
                    bind: {
                        value: '{customer.last_Name}'
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
                    fieldLabel: 'Salesperson',
                    allowBlank: false,
                    readOnly: true,
                    bind: {
                        value: '{ salesPerson.name}'
                    }
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'E-Mail',
                    vtype: 'email',
                    emptyText: 'abc123@xyz.com',
                    allowBlank: false,
                    readOnly: true,
                    bind: {
                        value: '{customer.email}'
                    }
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Phone',
                    name: 'Phone',
                    allowBlank: false,
                    readOnly: true,
                    bind: {
                        value: '{customer.phone}'
                    }
                }]
            }]
        },
        {
            xtype: 'fieldset',
            title: 'Date Requirements',
            layout: {
                type: 'hbox'
            },
            padding: '0 0 20 20',
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
                    value: '{salesOrder.date_Requested}'
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
                    value: '{salesOrder.date_Required}'
                }
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
                name: 'Shipping_Address',
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
                        maskRe: /[a-zA-Z ]*$/,
                        bind: {
                            value: '{salesOrder.shipping_City}'
                        },
                        allowBlank: false
                    },
                    {
                        xtype: 'combobox',
                        fieldLabel: 'Country',
                        bind: {
                            value: '{salesOrder.shipping_Country_Id}'
                        },
                        readOnly: true,
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'id',
                        allowBlank: false,
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
                        maskRe: /[a-zA-Z ]*$/,
                        allowBlank: false,
                        bind: {
                            value: '{salesOrder.shipping_State}'
                        }
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Zip Code',
                        allowBlank: false,
                        maskRe: /^[a-zA-Z0-9-]+$/,
                        bind: {
                            value: '{salesOrder.shipping_ZipCode}'
                        }
                    }]
                }]
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
                                value: '{customer.currency}'
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
                                    value: '{tax.name}'
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
                        value: '{customer.credit_Limit}'
                    }
                }
            ]
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
                    value: '{total_Amount}'
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