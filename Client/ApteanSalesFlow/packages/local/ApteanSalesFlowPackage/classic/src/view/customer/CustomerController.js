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

    //Fetches the tax data and sets it to tax viewmodel
    onSelectTax: function (record) {
        var me = this;
        var v = me.getView();
        var vm = v.getViewModel();
        vm.set('tax', record.data);
    },

    //Fetches the salesperson data and sets it to salesperson viewmodel
    onSelectSalesPerson: function (record) {
        var me = this;
        var v = me.getView();
        var vm = v.getViewModel();
        vm.set('salesperson', record.data);
    },

    //displays the tax load window
    onTaxLoad: function () {
        if(taxCountryId != 0){
            Ext.create('ApteanSalesFlowPackage.view.Tax.LoadTax');
        }
        else{
            Ext.Msg.show({
                title: 'No Data',
                message: 'Billing country is not selected.',
                buttons: Ext.Msg.OK,
                iconCls: 'icon-error',
                icon: Ext.MessageBox.ERROR
            });
        }
    },

    //displays the salesperson load window
    onSalesPersonLoad: function () {
        Ext.create('ApteanSalesFlowPackage.view.SalesPerson.LoadSalesPerson');
    },

    //reset the create customer form
    onCustomerResetButton: function () {
        var me = this;
        var v = me.getView();
        var form = v.getForm();
        var vm = v.getViewModel();
        form.reset();
        vm.set('salesperson', null);
        vm.set('tax', null);
    },

    //checking shipping address same as billing address checkbox is marked or not
    isBillingSameAsShipping: function () {
        return this.lookup('billingSameAsShipping').getValue();
    },

    //Fetching all shipping and billing field values
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

    //copies the shipping address to the billing address when the checkbox is marked
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
    },

    //Sync up between shipping and billing on address change
    onShippingAddrFieldChange: function (shippingField) {
        var billingField;

        if (this.isBillingSameAsShipping()) {
            billingField = this.getOtherField(shippingField);
            billingField.setValue(shippingField.getValue());
        }
    },

    //submit customer details and stores it in database
    onCustomerSubmitButton: function (sender, record) {
        var me = this;
        var v = me.getView();
        var form = v.getForm();
        var vm = v.getViewModel();
        salesperson = vm.get('salesperson');
        tax = vm.get('tax');
        var items = Ext.data.StoreManager.lookup('currencyStore').getData().items;
        var currencyId;
        for (var i = 0; i < items.length; i++) {
            if(items[i].data.country_Id == tax.country_Id){
                currencyId = items[i].data.id;
            }
        };
        var values = form.getValues();
        let Customer = {
            "company_Name": values.company_Name,
            "status": values.status,
            "description": values.description,
            "billing_Address": values.billingAddress,
            "shipping_Address": values.shippingAddress,
            "tax": tax.id,
            "credit_Limit": values.credit_Limit,
            "currency": currencyId,
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
                    iconCls: 'icon-action',
                    icon: Ext.MessageBox.INFO
                });
                form.reset();
                vm.set('salesperson', null);
                vm.set('tax', null);
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
                        iconCls: 'icon-error',
                        icon: Ext.MessageBox.ERROR
                    });
                }
            }
        })
    }
});