Ext.define('ApteanSalesFlowPackage.view.LoadQuote.LoadQuote', {
    extend: 'Ext.window.Window',
    autoShow: true,
    requires: [
        'ApteanSalesFlowPackage.store.Quote',
    ],
    controller: 'loadquote',
    title: 'Choose Quote',
    height: '60%',
    width: '60%',
    modal: true,
    resizable: false,
    layout: 'fit',
    items: {
        xtype: 'QuoteGrid'
    }
})