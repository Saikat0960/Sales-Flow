Ext.define('ApteanSalesFlowPackage.view.Tax.LoadTax', {
    extend: 'Ext.window.Window',
    alias: 'widget.LoadTax',
    autoShow: true,
    requires: [
        'ApteanSalesFlowPackage.store.Tax'
        //'MyApp.view.main.CustomerCreateView
    ],
    viewModel: {
        stores: {
            taxStore: {
                type: 'tax'
            }
        }
    },
    controller: 'Tax',
    title: 'Choose Tax',
    height: '50%',
    width: '50%',
    modal: true,
    layout: 'fit',
    items: [{  // Let's put an empty grid in just to illustrate fit layout
        xtype: 'grid',
        border: false,
        bind: {
            store: "{taxStore}"
        },
        // store: {
        //     type: 'forms'
        // },
        columns: [{
            xtype: 'gridcolumn',
            dataIndex: 'id',
            text: 'Tax ID',
            flex: 1
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'name',
            text: 'Tax Name',
            flex: 2
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'type',
            text: 'Tax Type',
            flex: 2
        },
        {
            xtype: 'gridcolumn',
            dataIndex: 'rate',
            text: 'Tax Rate',
            flex: 2
        }
        ],
        listeners: {
            itemclick: 'onSelectTax'
        }
    }]
})