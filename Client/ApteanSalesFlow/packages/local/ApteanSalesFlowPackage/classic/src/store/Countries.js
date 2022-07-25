Ext.define('ApteanSalesFlowPackage.store.Countries', {
    extend: 'Ext.data.Store',

    alias: 'store.countries',

    model: 'ApteanSalesFlowPackage.model.Countries',
    proxy: {                 
         type: 'ajax',                    
         withCredentials: true,
         method: 'GET',                    
         noCache: false,
         url:'http://localhost:50619/api/countries',                    
         reader: {                        
             type: 'json'                    
            }
        },
        autoLoad:true
    });