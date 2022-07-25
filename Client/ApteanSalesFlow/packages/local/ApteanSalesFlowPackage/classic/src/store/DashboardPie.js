Ext.define('ApteanSalesFlowPackage.store.DashboardPie', {
    extend: 'Ext.data.Store',

    alias: 'store.dashboardpie',

    model: 'ApteanSalesFlowPackage.model.Dashboard',
    proxy: {                 
         type: 'ajax',                    
         withCredentials: true,
         method: 'GET',                    
         noCache: false,
         
         url:'http://localhost:50619/api/Dashboard/GetDashBoardData',                    
         reader: {                        
             type: 'json'                    
            },
        },
  
   autoLoad:true
});
