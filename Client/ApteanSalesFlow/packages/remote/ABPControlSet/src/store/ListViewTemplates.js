Ext.define('ABPControlSet.store.ListViewTemplates', {
    extend: 'Ext.data.Store',
    data: [
        {
            display: 'Tri Image', // TODO: Localize.
            value: 'triImage'
        },
        {
            display: 'Tri Data',// TODO: Localize.
            value: 'triData'
        },
        {
            display: 'Duo Image',// TODO: Localize.
            value: 'duoImage'
        },
        {
            display: 'Phone Number Display',// TODO: Localize.
            value: 'phoneNumberDisplay'
        },
        {
            display: 'Phone Number Display In Form',// TODO: Localize.
            value: 'phoneNumberDisplayInForm'
        },
        {
            display: 'Email Display',// TODO: Localize.
            value: 'emailDisplay'
        },

        // Mockups found at https://xd.adobe.com/view/76c6430e-9536-4b90-60a7-e1590b0b1d0d-00f7
        {
            display: 'Single Line Item',
            value: 'singleLineItem'
        },
        {
            display: 'Single Line Item with Trigger',
            value: 'singleLineItemWithTrigger'
        },
        {
            display: 'Two Line Item',
            value: 'twoLineItem'
        },
        {
            display: 'Two Line Item With Trigger',
            value: 'twoLineItemWithTrigger'
        },
        {
            display: 'Three Line Item',
            value: 'threeLineItem'
        },
        {
            display: 'Three Line Item With Trigger',
            value: 'threeLineItemWithTrigger'
        },
        {
            display: 'Header Line Item With Three Fields',
            value: 'headerLineItemWithThreeFields'
        },
        {
            display: 'Two Line Phone or Email',
            value: 'twoLineItemWithPhoneOrEmail'
        }
    ]
});
