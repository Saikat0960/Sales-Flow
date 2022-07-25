Ext.define('ApteanSalesFlowPackage.store.SODashboard', {
    extend: 'Ext.data.Store',

    alias: 'store.sodashboard',

    model: 'ApteanSalesFlowPackage.model.SODashboard',
    proxy: {                 
         type: 'ajax',                    
         withCredentials: true,
         method: 'GET',                    
         noCache: false,
         
         url:'http://localhost:50619/api/Dashboard/GetSalesOrderData',                    
         reader: {                        
             type: 'json'                    
            },
        },
   autoLoad:true
});
