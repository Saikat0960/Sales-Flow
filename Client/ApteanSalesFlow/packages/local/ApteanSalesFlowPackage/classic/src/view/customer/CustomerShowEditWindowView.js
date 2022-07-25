Ext.define('ApteanSalesFlowPackage.view.customer.CustomerShowEditWindowView', {
    extend: 'Ext.window.Window',
    height: '90%',
    width: '80%',
    controller: 'showedit',
    scrollable: 'vertical',
    resizable: false,
    modal: true,
    items: [{
        xtype: 'form',
        itemId: 'editUser',
        title: 'Customer Detail',
        bodyPadding: 10,
        viewModel: {
            data: {
                salesperson: {},
                tax: {},
                customers: {}
            }
        },
        defaultType: 'textfield',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        scrollable: true,
        items: [{
            xtype: 'fieldcontainer',
            layout: 'hbox',
            width: '100%',
            items: [
                {
                    xtype: 'displayfield',
                    fieldLabel: 'Customer ID',
                    bind: {
                        value: '{customers.id}'
                    },
                    margin: '10 20 10 15',
                    labelWidth: 85,
                    fieldStyle: 'font-size: 15px; font-weight: bold;',
                    width: '15%'
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Company Name',
                    bind: {
                        value: '{customers.company_Name}'
                    },
                    margin: '10 20 10 0',
                    width: '55%',
                    labelWidth: 120,
                    allowBlank: false
                },
                {
                    xtype: 'combobox',
                    fieldLabel: 'Status',
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'name',
                    bind: {
                        value: '{customers.status}'
                    },
                    store: [{
                        name: 'PROSPECT'
                    }, {
                        name: 'CONFIRMED'
                    }],
                    margin: '10 20 10 15',
                    width: '25%',
                    labelWidth: 60,
                    allowBlank: false,
                    editable: false
                }
            ]
        },
        {
            xtype: 'fieldset',
            title: 'Basic Information',

            layout: {
                type: 'hbox'
            },
            fieldDefaults: {
                width: '100%'
            },
            items: [{
                margin: '0 100 10 5',
                xtype: 'fieldcontainer',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                width: '45%',
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'First Name',
                    bind: {
                        value: '{customers.first_Name}'
                    },
                    allowBlank: false,
                    maskRe: /^[A-Za-z]+$/
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Last Name',
                    bind: {
                        value: '{customers.last_Name}'
                    },
                    allowBlank: false,
                    maskRe: /^[A-Za-z]+$/
                },
                {
                    xtype: 'textareafield',
                    fieldLabel: 'Description',
                    bind: {
                        value: '{customers.description}'
                    }
                }]
            },
            {
                xtype: 'fieldcontainer',
                width: '45%',
                items: [{
                    xtype: 'textfield',
                    fieldLabel: 'E-Mail',
                    bind: {
                        value: '{customers.email}'
                    },
                    vtype: 'email',
                    emptyText: 'abc123@xyz.com',
                    allowBlank: false
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Phone',
                    bind: {
                        value: '{customers.phone}'
                    },
                    maskRe: /\d/,
                    regex: /^\d{3}\d{3}\d{4}$/,
                    allowBlank: false
                }]
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
                    value: '{customers.billing_Address}'
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
                        margin: '0 100 0 0',
                        items: [{
                            xtype: 'textfield',
                            fieldLabel: 'City',
                            bind: {
                                value: '{customers.billing_City}'
                            },
                            maskRe: /[a-zA-Z ]*$/,
                            allowBlank: false
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: 'Country',
                            bind: {
                                value: '{customers.billing_Country_Id}'
                            },
                            itemId: 'countrycombobox',
                            queryMode: 'local',  //Should use view model to bind to get name of country
                            displayField: 'name',
                            valueField: 'id',
                            allowBlank: false,
                            editable: false,
                            store: {
                                type: 'countries'
                            },
                            listeners:{
                                change: function(){
                                    var vm = this.up().up().up().up().getViewModel();
                                    if(taxCountryId !=0){
                                        vm.set('tax',null);
                                    }
                                    taxCountryId = this.value;
                                }
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
                                value: '{customers.billing_State}'
                            },
                            maskRe: /[a-zA-Z ]*$/,
                            allowBlank: false
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Zip Code',
                            bind: {
                                value: '{customers.billing_ZipCode}'
                            },
                            allowBlank: false,
                            maskRe: /^[a-zA-Z0-9-]+$/
                        }]

                    }]
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
                        margin: '0 100 0 0',
                        items: [{
                            xtype: 'textfield',
                            fieldLabel: 'City',
                            bind: {
                                value: '{customers.shipping_City}'
                            },
                            allowBlank: false,
                            maskRe: /[a-zA-Z ]*$/
                        },
                        {
                            xtype: 'combobox',
                            fieldLabel: 'Country',
                            bind: {
                                value: '{customers.shipping_Country_Id}'
                            },
                            queryMode: 'local',
                            displayField: 'name',
                            valueField: 'id',
                            allowBlank: false,
                            editable: false,
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
                items: [{
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
                    fieldLabel: 'Credit Limit',
                    regex: /^[0-9]*$/,
                    regexText: 'Should contain numbers only.',
                    bind: {
                        value: '{customers.credit_Limit}'
                    },
                    allowBlank: false,
                    maxLength: 8
                },
                {
                    xtype: 'combobox',
                    fieldLabel: 'Currency',
                    bind:{
                        value: '{tax.country_Id}' 
                    },
                    queryMode: 'local',
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
    }],
    buttons: [
        {
            text: 'Save & Update',
            handler: 'onUpdateData',
            //disabled: true,
            formBind: true,
            margin: '0 15 0 0',
            style: 'border-radius: 5px',
        }
    ],
    listeners: {
        beforerender: 'loadingRecord'
    }
});