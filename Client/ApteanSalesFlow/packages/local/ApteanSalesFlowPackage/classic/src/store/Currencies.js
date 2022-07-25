Ext.define('ApteanSalesFlowPackage.store.Currencies', {
    extend: 'Ext.data.Store',

    alias: 'store.currencies',
    storeId: 'currencyStore',
    model: 'ApteanSalesFlowPackage.model.Currencies',
    proxy: {                 
         type: 'ajax',                    
         withCredentials: true,
         method: 'GET',                    
         noCache: false,
         url:'http://localhost:50619/api/currencies',                    
         reader: {                        
             type: 'json'                    
            }
        },
        autoLoad:true
    });