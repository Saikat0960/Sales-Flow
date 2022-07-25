/**
 * Favorite Manager - Favorite tree can be manipulated and saved from here.
 */
Ext.define('ABP.view.session.headlines.HeadlinesManagerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.headlinesManager',

    listen: {
        component: {
            '*': {
                headlinesManager_onCancelClick: 'onCancelClick',
            }
        }
    },

    init: function () {
        var me = this,
            headlinesGrid = me.lookup('headlinesGrid'),
            headlinesStore = Ext.getStore('ABPHeadlines');

        headlinesGrid.setStore(headlinesStore);
    },

    /**
     * New headline clicked
     */
    newHeadline: function () {
        // Add record to the store.
        var me = this,
            headlinesGrid = me.lookup('headlinesGrid'),
            headlinesStore = headlinesGrid.getStore(),
            newModel = headlinesStore.getModel().create(),
            rowWidgetPlugin = headlinesGrid.getPlugin('rowwidget');

        headlinesStore.add(newModel);
        var index = headlinesStore.indexOf(newModel);
        rowWidgetPlugin.toggleRow(index, newModel);
    },

    /**
     * Cancel was clicked - check for unsaved records and prompt.
     */
    onCancelClick: function () {
        var me = this,
            headlinesGrid = me.lookup('headlinesGrid'),
            headlinesStore = headlinesGrid.getStore(),
            newRecords = headlinesStore.getNewRecords(),
            modifiedRecords = headlinesStore.getModifiedRecords();
        if (newRecords.length > 0 || modifiedRecords.length > 0) {
            // Alert user that headlines, new or unsaved, exist.
            ABP.view.base.popUp.PopUp.showOkCancel(
                ABP.util.Common.geti18nString('headlines_unsaved_changes'),
                ABP.util.Common.geti18nString('headlines_title'),
                function (result) {
                    if (result) {
                        headlinesStore.rejectChanges();
                        // If continue is clicked, discard any outstanding changes and hide the manager.
                        me.fireEvent('featureCanvas_hideSetting');
                    }
                });
        } else {
            this.fireEvent('featureCanvas_hideSetting');
        }
    },

    removeItemClicked: function (grid, rowIndex, colIndex, col, event, record) {
        var me = this;
        // Prompt for deletion of a headline.
        ABP.view.base.popUp.PopUp.showOkCancel(
            ABP.util.Common.geti18nString('headlines_delete'),
            ABP.util.Common.geti18nString('headlines_title'),
            function (result) {
                if (result) {
                    var headlinesGrid = me.lookup('headlinesGrid'),
                        headlinesStore = headlinesGrid.getStore();


                    me.fireEvent("headline_delete", record);
                    headlinesStore.remove(record);
                    headlinesStore.commitChanges();
                }
            });
    }
});
