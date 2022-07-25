Ext.define('ABP.view.session.SessionBannerController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.sessionbannercontroller',

    listen: {
        controller: {
            '*': {
                abp_headlines_show: 'showHeadlines',
                abp_headlines_hide: 'hideHeadline'
            }
        },
        component: {
            'headline': {
                headline_action: 'actionHeadline',
                headline_read: 'readHeadline'
            }
        }
    },

    init: function () {
        var me = this;
        me.callParent(arguments);
        // Ensure all headlines are processed.
        var config = ABP.util.Config.getBootstrapConfig();
        if (config && config.headlines) {
            me.fireEvent('main_processHeadlines', config.headlines, true);
        }
    },

    showHeadlines: function (headlines) {
        var me = this,
            view = me.getView(),
            headline,
            headlineComps = [],
            length = headlines.length;

        for (var i = 0; i < length; i++) {
            headline = headlines[i];
            headlineComps.push({
                xtype: 'headline',
                single: !!headline.single,
                uniqueId: headline.uniqueId,
                message: headline.message,
                messageKey: headline.messageKey,
                priority: headline.priority,
                actionText: headline.actionText,
                actionTextKey: headline.actionTextKey
            });
        }
        if (length > 0) {
            // Insert at the start so new ones stack on top of older ones.
            view.insert(0, headlineComps);
        }
    },

    hideHeadline: function (uniqueId) {
        var me = this;
        var view = me.getView();
        if (view.items && view.items.length === 1) {
            var headline = view.items.getAt(0);
            if (headline.uniqueId === uniqueId) {
                view.remove(headline);
            }
        }
    },

    actionHeadline: function (headline) {
        var uniqueId = headline.uniqueId;
        this.fireEvent("headline_action", uniqueId);
    },

    readHeadline: function (headline) {
        var uniqueId = headline.uniqueId,
            single = headline.single;

        // If the headline is configured as single, do not do any local storage configuration - it is meant to just be a fire and forget type of headline.
        if (!single) {
            if (ABP.util.Config.getLoggedIn()) {
                // If a user is logged in, set for the logged in user.
                ABP.util.LocalStorage.setForLoggedInUser("hr-" + uniqueId, true);
            } else {
                // If not, use a general browser set.
                ABP.util.LocalStorage.set("hr-" + uniqueId, true);
            }
        }
        // Fire the read event.
        this.fireEvent("headline_read", uniqueId);
    }
});