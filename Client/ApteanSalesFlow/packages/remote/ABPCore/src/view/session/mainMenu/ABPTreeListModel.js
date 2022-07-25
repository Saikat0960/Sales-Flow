Ext.define('ABP.view.session.mainMenu.ABPTreeListModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.abptreelistmodel',

    stores: {
        navItems: {
            type: 'tree',
            root: {
                expanded: true,
            }
        }
    }
});