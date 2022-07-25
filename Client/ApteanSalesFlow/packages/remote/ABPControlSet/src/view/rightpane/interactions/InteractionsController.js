/**
 *
 */
Ext.define('ABPControlSet.view.rightpane.interactions.InteractionsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.interactionspane',
    listen: {
        controller: {
            '*': {
                interactions_populate: 'populateContainer',
                rightPane_toggleTab: 'handleToggleTab'
            }
        }
    },

    /**
     * @abstract
     * Provide override to handle the panel being toggled
     */
    onToggle: function () {

    },

    populateContainer: function (content) {
        var me = this;
        var view = me.getView();
        // Remove all previous content.
        view.removeAll();
        // Add the new content.
        view.add(content);
    },

    privates: {
        handleToggleTab: function (activeTab) {
            var me = this,
                view = me.getView();

            if (activeTab.xtype === view.xtype) {
                me.onToggle();
            }
        },

        baseRightPanePanel_toggleRightPane: function () {
            this.fireEvent('session_toggleRightPane');
        }
    }
});