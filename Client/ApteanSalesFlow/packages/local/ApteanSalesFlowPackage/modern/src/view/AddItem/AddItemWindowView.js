Ext.define('ApteanSalesFlowPackage.view.AddItem.AddItemWindowView', {
    extend: 'Ext.window.Window',
    height: '85%',
    width: '50%',
    autoShow: true,
    modal: true,
    controller: 'addQuoteItem',
    items: [{
        xtype: 'form',
        itemId: 'itemDetails',
        title: 'Quote Items',
        bodyPadding: 10,
        scrollable: true,
        width: '100%',
        items: [{
            extend: 'Ext.panel.Panel',
            layout: {
                type: 'table',
                columns: 2
            },
            items: [{
                xtype: 'button',
                text: 'Load Item',
                handler: 'loadPartWindow',
                style: 'border-radius: 5px',
                colspan: 2,
                margin: '10 10 10 10'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Part Id',
                name: 'part_Id',
                allowBlank: false,
                readOnly : true,
                margin: '10 10 10 10'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Part Name',
                name: 'part_Name',
                allowBlank: false,
                margin: '10 10 10 10'
            },
            {
                xtype: 'textareafield',
                fieldLabel: 'Description',
                name: 'description',
                allowBlank: false,
                margin: '10 10 10 10',
                colspan: 2,
                width: '95%'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Revision',
                name: 'revision',
                margin: '10 10 10 10'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'UOM',
                name: 'uom',
                allowBlank: false,
                margin: '10 10 10 10'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Product Group',
                name: 'product_Group',
                allowBlank: false,
                margin: '10 10 10 10'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Product Class',
                name: 'product_Class',
                allowBlank: false,
                margin: '10 10 10 10'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Quantity',
                name: 'quantity',
                allowBlank: false,
                margin: '10 10 10 10'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Price',
                name: 'price',
                allowBlank: false,
                margin: '10 10 10 10'
            }
            ]
        }
        ],
        buttons: [
            {
                text: 'Add Item',
                formBind: true,
                disabled: true,
                handler: 'addItemToQuoteGrid',
                style: 'border-radius: 5px'
            }
        ]
    }]
});
