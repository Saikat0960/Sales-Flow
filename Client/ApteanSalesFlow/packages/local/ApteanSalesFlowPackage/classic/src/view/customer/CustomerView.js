Ext.define('ApteanSalesFlowPackage.view.customer.CustomerView', {
    extend: 'Ext.tab.Panel',

    requires: [
        'ApteanSalesFlowPackage.view.customer.CustomerController',
        'ApteanSalesFlowPackage.view.Tax.LoadTax',
        'ApteanSalesFlowPackage.view.SalesPerson.LoadSalesPerson'

    ],
    alias: 'widget.CustomerView',
    scrollable: true,
    xtype: 'CustomerView',
    controller: 'customer',
    margin: '20',
    navigation: 'ui',
    viewModel:
    {
        stores: {
            countriesStore: {
                type: 'countries'
            },
            currenciesStore: {
                type: 'currencies'
            }
        }
    },
    items: [
        {
            xtype: 'form',
            itemId: "form1",
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            margin: '0 0 30 0',
            title: 'Customer Details',
            items: [{
                margin: '10 0 0 0',
                items: [{
                    xtype: 'fieldset',
                    title: 'Basic Information',
                    layout: {
                        type: 'hbox'
                    },
                    fieldDefaults: {
                        width: '100%',
                    },
                    items: [{
                        margin: '0 100 10 5',
                        xtype: 'fieldcontainer',
                        layout: {
                            type: 'vbox',
                            align: 'stretch'
                        },
                        width: '45%',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'First Name',
                                name: 'first_Name',
                                allowBlank: false,
                                maskRe: /^[A-Za-z]+$/,
                                width: '100%'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Last Name',
                                name: 'last_Name',
                                allowBlank: false,
                                maskRe: /^[A-Za-z]+$/,
                                width: '100%'
                            },
                            {
                                xtype: 'textareafield',
                                fieldLabel: 'Description',
                                name: 'description',
                                width: '100%'
                            }

                        ]

                    },
                    {
                        xtype: 'fieldcontainer',
                        width: '45%',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'E-Mail',
                                name: 'email',
                                vtype: 'email',
                                emptyText: 'abc123@xyz.com',
                                allowBlank: false
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Phone',
                                name: 'phone',
                                maskRe: /\d/,
                                regex: /^\d{3}\d{3}\d{4}$/,
                                allowBlank: false
                            }

                        ]
                    }

                    ]
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
                    reference: 'shippingAddress',
                    name: 'shippingAddress',
                    allowBlank: false,
                    listeners: {
                        change: 'onShippingAddrFieldChange'
                    }
                }, {
                    xtype: 'fieldcontainer',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'

                    },
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            width: '45%',
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            margin: '0 100 0 0',
                            items: [
                                {

                                    xtype: 'textfield',
                                    fieldLabel: 'City',
                                    reference: 'shippingCity',
                                    name: 'shippingCity',
                                    width: '100%',
                                    allowBlank: false,
                                    maskRe: /[a-zA-Z ]*$/,
                                    listeners: {
                                        change: 'onShippingAddrFieldChange'
                                    }
                                },
                                {
                                    xtype: 'combobox',
                                    fieldLabel: 'Country',
                                    name: 'shippingCountry',
                                    editable: false,
                                    reference: 'shippingCountry',
                                    width: '100%',
                                    queryMode: 'local',
                                    displayField: 'name',
                                    valueField: 'id',
                                    allowBlank: false,
                                    listeners: {
                                        change: 'onShippingAddrFieldChange'
                                    },
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
                                reference: 'shippingState',
                                fieldLabel: 'State',
                                width: '100%',
                                name: 'shippingState',
                                maskRe: /[a-zA-Z ]*$/,
                                //margin: '0 0 0 40',
                                allowBlank: false,
                                flex: 1,
                                listeners: {
                                    change: 'onShippingAddrFieldChange'
                                }
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Zip Code',
                                reference: 'shippingZipcode',
                                name: 'shippingZipcode',
                                width: '100%',
                                allowBlank: false,
                                listeners: {
                                    change: 'onShippingAddrFieldChange'
                                },
                                maskRe: /^[a-zA-Z0-9-]+$/
                            }]

                        }]
                }
                ]

            },
            {
                xtype: 'fieldset',
                title: 'Billing Address Information',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [
                    {
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'checkboxfield',
                                reference: 'billingSameAsShipping',
                                name: 'billingSameAsShipping',
                                handler: 'onSameAddressChange'
                            },
                            {
                                xtype: 'displayfield',
                                value: '<b>Billing address same as shipping address</b>',
                                margin: '0 0 0 5'
                            }
                        ]
                    },
                    {
                        width: '85%',
                        xtype: 'textareafield',
                        fieldLabel: 'Address',
                        reference: 'billingAddress',
                        name: 'billingAddress',
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
                                margin: '0 100 0 0',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'City',
                                        reference: 'billingCity',
                                        name: 'billingCity',
                                        maskRe: /[a-zA-Z ]*$/,
                                        width: '100%',
                                        allowBlank: false,
                                    },
                                    {
                                        xtype: 'combobox',
                                        fieldLabel: 'Country',
                                        reference: 'billingCountry',
                                        editable: false,
                                        name: 'billingCountry',
                                        width: '100%',
                                        itemId: 'countrycombobox',
                                        queryMode: 'local',
                                        displayField: 'name',
                                        valueField: 'id',
                                        allowBlank: false,
                                        //dataIndex: 'name',
                                        store: {
                                            type: 'countries'
                                        },
                                        listeners:{
                                            change: function(){
                                                taxCountryId = this.value;
                                                var vm = this.up().up().up().up().up().up().getViewModel();
                                                vm.set('tax',null);
                                            }
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
                                    reference: 'billingState',
                                    name: 'billingState',
                                    width: '40%',
                                    maskRe: /[a-zA-Z ]*$/,
                                    allowBlank: false

                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Zip Code',
                                    reference: 'billingZipcode',
                                    name: 'billingZipcode',
                                    width: '40%',
                                    allowBlank: false,
                                    maskRe: /^[a-zA-Z0-9-]+$/
                                }]

                            }]
                    }]
            },
            {
                xtype: 'fieldset',
                title: 'Sales Person Information',
                layout: 'hbox',
                items: [{
                    xtype: 'fieldcontainer',
                    margin: '0 100 0 0',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    width: '45%',
                    items: [{
                        xtype: 'fieldcontainer',
                        layout: 'hbox',
                        width: '100%',
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'ID',
                                allowBlank: false,
                                width: '80%',
                                bind: {
                                    value: '{salesperson.id}'
                                },
                                readOnly: true
                            },
                            {
                                xtype: 'button',
                                text: 'Load',
                                handler: 'onSalesPersonLoad',
                                scale: 'small',
                                style: 'border-radius: 5px',
                                margin: '0 0 0 15'
                            }
                        ]
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Name',
                        allowBlank: false,
                        bind: {
                            value: '{salesperson.name}'
                        },
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
                            xtype: 'numberfield',
                            fieldLabel: 'Commission(%)',
                            labelWidth: 100,
                            bind: {
                                value: '{salesperson.commission}'
                            },
                            width: '100%',
                            readOnly: true
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Territory',
                            bind: {
                                value: '{salesperson.territory}'
                            },
                            width: '100%',
                            readOnly: true
                        }
                    ]
                }
                ]
            },
            {
                xtype: 'fieldset',
                title: 'Financial Information',
                layout: {
                    type: 'hbox'
                },
                items: [{
                    xtype: 'fieldcontainer',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    margin: '0 100 10 0',
                    width: '45%',
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            layout: {
                                type: 'hbox',
                            },
                            width: '100%',
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: 'Tax Name',
                                    width: '80%',
                                    readOnly: true,
                                    allowBlank: false,
                                    bind:
                                    {
                                        value: '{tax.name}'+'({tax.rate}%)'
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: 'Load',
                                    margin: '0 0 0 15',
                                    handler: 'onTaxLoad',
                                    style: 'border-radius: 5px',
                                    readOnly: true
                                }
                            ]
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
                            fieldLabel: 'Credit Limit',
                            maskRe: /\d/,
                            regex: /^[0-9]*$/,
                            regexText: 'Should contain numbers only.',
                            width: '100%',
                            name: 'credit_Limit',
                            allowBlank: false,
                            maxLength: 8
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: 'Currency',
                            bind:{
                                value: '{tax.country_Id}' 
                            },
                            editable: false,
                            queryMode: 'local',
                            width: '100%',
                            displayField: 'name',
                            valueField: 'country_Id',
                            store: {
                                type: 'currencies'
                            },
                            readOnly: true,
                            allowBlank: false
                        }]
                }]
            }]

        }]

});