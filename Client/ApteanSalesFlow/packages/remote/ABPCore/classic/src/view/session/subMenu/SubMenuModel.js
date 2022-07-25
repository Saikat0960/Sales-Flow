/////////////////////////////////////////////////////////////////////////////////////
//  Name:      app/view/session/subMenu/SubMenuModel.js
//  Purpose:   Secondary Navigation for application
//  Created:   7/9/2014 - Joe Blenis
//  Last Edit: 7/9/2014 - Joe Blenis - Created File
/////////////////////////////////////////////////////////////////////////////////////
Ext.define('ABP.view.session.subMenu.SubMenuModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.submenumodel',

    data: {
        allItems: [],
        shownItems: [],
        numShown: 0,
        numCounted: 0,
        numSubVis: 0,
        numTriVis: 0,
        longestTitle: 0,
        longestLabel: 0
    },

    shownSet: function (path, value) {
        var me = this;
        me.set(path, value);
        return me.resetShown();
    },
    resetShown: function () {
        var me = this;
        var navCt = 0;
        var i;

        for (i = 0; i < me.data.shownItems.length; ++i) {
            if (me.data.shownItems[i].xtype === 'submenubutton') {
                me.data.shownItems[i].place = navCt;
                navCt++;
            } else if (me.data.shownItems[i].xtype === 'trimenubutton' && me.data.shownItems[i].hidden === false) {
                me.data.shownItems[i].place = navCt;
                navCt++;
            } else {
                me.data.shownItems[i].place = me.data.shownItems.length + 1;
            }
        }
        return navCt - 1;
    }
});