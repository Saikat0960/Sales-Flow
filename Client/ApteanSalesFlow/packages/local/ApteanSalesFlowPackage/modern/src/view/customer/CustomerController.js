Ext.define('ApteanSalesFlowPackage.view.customer.CustomerController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.customer',

    listen: {
        controller: {
            '*': {
                salesPersonSelection: 'onSelectSalesPerson',
                taxSelection: 'onSelectTax'
            }
        }
    },

    onSelectTax: function (record) {
        var me = this;
        var v = me.getView();
        var vm = v.getViewModel();
        vm.set('tax', record.data);
    },
    onSelectSalesPerson: function (record) {
        var me = this;
        var v = me.getView();
        var vm = v.getViewModel();
        vm.set('salesperson', record.data);
    },

    onTaxLoad: function () {
        Ext.create('ApteanSalesFlowPackage.view.Tax.LoadTax');
    },
    onSalesPersonLoad: function () {
        Ext.create('ApteanSalesFlowPackage.view.SalesPerson.LoadSalesPerson');
    },
    onCustomerResetButton: function () {
        var me = this;
        var v = me.getView();
        var form = v.getForm();
        var vm = v.getViewModel();
        vm.set('salesperson', null);
        vm.set('tax', null);
        form.reset();
    },

    isBillingSameAsShipping: function () {
        return this.lookup('billingSameAsShipping').getValue();
    },
    getOtherField: function (field) {
        var name = field.name;

        if (/^shipping/.test(name)) {
            name = name.replace('shipping', 'billing');
        }
        else {
            name = name.replace('billing', 'shipping');
        }

        return this.lookup(name);
    },
    onSameAddressChange: function (checkbox, isBillingSameAsShipping) {

        var me = this,
            fieldset = checkbox.ownerCt.up(),
            shipAddrForm = me.lookup('shippingAddressForm');

        Ext.each(shipAddrForm.query('textfield'), function (shippingField) {
            var billingField = me.getOtherField(shippingField);

            if (isBillingSameAsShipping) {
                billingField.setValue(shippingField.getValue());
            }
            else {
                billingField.clearInvalid();
            }
        });

        /*Ext.each(fieldset.query('textfield'), function(field) {
            debugger
            field.setDisabled(isBillingSameAsShipping);
            field.el.animate({
                opacity: isBillingSameAsShipping ? 0.5 : 1
            });
        });*/
    },
    onShippingAddrFieldChange: function (shippingField) {
        var billingField;

        if (this.isBillingSameAsShipping()) {
            billingField = this.getOtherField(shippingField);
            billingField.setValue(shippingField.getValue());
        }
    },

    onCustomerSubmitButton: function (sender, record) {
        //console.log(this.getView().down('CustomerView').down('form').getForm().getValues());
        var me = this;
        var v = this.getView();
        var form = v.getForm();
        var vm = v.getViewModel();
        salesperson = vm.get('salesperson');
        tax = vm.get('tax');
        var values = form.getValues();
        let Customer = {
            "company_Name": values.company_Name,
            "status": values.status,
            "description": values.description,
            "billing_Address": values.billingAddress,
            "shipping_Address": values.shippingAddress,
            "tax": tax.id,
            "credit_Limit": values.credit_Limit,
            "currency": values.currency,
            "phone": values.phone,
            "email": values.email,
            "sales_Person_Id": salesperson.id,
            "billing_Country_Id": values.billingCountry,
            "shipping_Country_Id": values.shippingCountry,
            "billing_City": values.billingCity,
            "shipping_City": values.shippingCity,
            "billing_State": values.billingState,
            "shipping_State": values.shippingState,
            "first_Name": values.first_Name,
            "last_Name": values.last_Name,
            "billing_Zipcode": values.billingZipcode,
            "shipping_Zipcode": values.shippingZipcode
        };
        debugger;
        Ext.Ajax.request({
            url: 'http://localhost:50619/api/Customers/PostCustomer',
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            jsonData: Customer,
            useDefaultXhrHeader: false,
            withCredentials: true,
            disableCaching: false,
            waitMsg: 'Saving..',
            success: function (response) {
                var Customer_Id = JSON.parse(response.responseText);
                Ext.Msg.show({
                    title: 'Customer created succesfully',
                    message: 'For your reference, the Customer ID is: ' + Customer_Id,
                    buttons: Ext.Msg.OK,
                    iconCls: 'icon-action'
                });
                vm.set('salesperson', null);
                vm.set('tax', null);
                form.reset();
                //this.onCustomerResetButton();
            },
            failure: function (response) {
                if(response.status == 401){
                    this.redirectTo('Logout')
                }
                else{
                    Ext.Msg.show({
                        title: 'Failed',
                        message: 'Failed while saving data. Try after sometime.',
                        buttons: Ext.Msg.OK,
                        iconCls: 'icon-error'
                    });
                }
            }
        })
    }
});