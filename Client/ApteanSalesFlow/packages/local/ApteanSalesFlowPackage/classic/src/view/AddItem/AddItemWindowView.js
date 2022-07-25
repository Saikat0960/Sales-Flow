Ext.define('ApteanSalesFlowPackage.view.AddItem.AddItemWindowView', {
    extend: 'Ext.window.Window',
    height: '85%',
    width: '60%',
    autoShow: true,
    modal: true,
    resizable: false,
    controller: 'addItem',
    items: [{
        xtype: 'form',
        itemId: 'itemDetails',
        title: 'Add Items',
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
                margin: '10 10 10 10',
                width: '90%'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Part Name',
                name: 'part_Name',
                allowBlank: false,
                readOnly : true,
                margin: '10 10 10 10',
                width: '90%'
            },
            {
                xtype: 'textareafield',
                fieldLabel: 'Description',
                name: 'description',
                allowBlank: false,
                readOnly : true,
                margin: '10 10 10 10',
                colspan: 2,
                width: '95%'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Revision',
                name: 'revision',
                readOnly : true,
                margin: '10 10 10 10',
                width: '90%'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'UOM',
                name: 'uom',
                allowBlank: false,
                readOnly : true,
                margin: '10 10 10 10',
                width: '90%'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Product Group',
                name: 'product_Group',
                allowBlank: false,
                readOnly : true,
                margin: '10 10 10 10',
                width: '90%'
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Product Class',
                name: 'product_Class',
                allowBlank: false,
                readOnly : true,
                margin: '10 10 10 10',
                width: '90%'
            },
            {
                xtype: 'numberfield',
                fieldLabel: 'Quantity',
                name: 'quantity',
                minValue: 1,
                allowBlank: false,
                margin: '10 10 10 10',
                width: '90%'
            },
            {
                xtype: 'numberfield',
                fieldLabel: 'Price',
                name: 'price',
                minValue: 1,
                hideTrigger: true,
                allowBlank: false,
                margin: '10 10 10 10',
                width: '90%'
            }
            ]
        }
        ],
        buttons: [
            {
                text: 'Add Item',
                formBind: true,
                disabled: true,
                handler: 'addItemToGrid',
                style: 'border-radius: 5px'
            }
        ]
    }]
});
