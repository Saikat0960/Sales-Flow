/**
 * Modern RightPane Controller.
 */
Ext.define('ABP.view.session.rightPane.RightPaneController', {
    extend: 'ABP.view.session.rightPane.RightPaneBaseController',
    alias: 'controller.rightpanecontroller',

    listen: {
        controller: {
            '*': {
                toolbar_updateBadge: '__updateBadge',
                toolbar_incrementBadge: '__incrementBadge',
                toolbar_decrementBadge: '__decrementBadge',
                toolbar_clearBadge: '__clearBadge',
            }
        }
    },

    // Array of possible badge priorities.
    __badgePriorityOrder: [
        'abp-badge-priority-info',
        'abp-badge-priority-success',
        'abp-badge-priority-warning',
        'abp-badge-priority-alert'
    ],

    init: function () {
        var me = this,
            sessionConfig = ABP.util.Config.getSessionConfig(),
            displayInitials = ABP.util.Config.getDisplayNameInitials(),
            profilePicture = ABP.util.Config.getProfilePicture(),
            notificationsEnabled = sessionConfig.settings.notifications.enabled,
            rightPaneTabs = [],
            settingsConfig;

        me.callParent();

        if (notificationsEnabled) {
            // Fire event so the notification container is created and waiting for events
            me.fireEvent('rightPane_initTab', 'rightPaneTab_abp-notifications', {
                name: 'abp-notifications',
                uniqueId: 'abp-notifications',
                xtype: 'abp-notifications',
                clearBadgeOnActivate: sessionConfig.settings.notifications.clearBadgeOnActivate,
                icon: 'icon-bell',
                automationCls: 'notifications-tab'
            });
        }

        rightPaneTabs = this.__getRightPaneTabs();

        if (rightPaneTabs.length > 0) {
            rightPaneTabs.forEach(function (tab, a) {
                me.fireEvent('rightPane_initTab', tab.uniqueId, {
                    name: tab.name,
                    uniqueId: tab.uniqueId,
                    xtype: tab.xtype,
                    icon: tab.icon,
                    automationCls: tab.automationCls
                });
            });
        }
        // Search Tab
        if (sessionConfig.settings.enableSearch) {
            me.fireEvent('rightPane_initTab', 'rightPaneTab_abp-search', {
                name: 'abp-search',
                uniqueId: 'abp-search',
                xtype: 'abp-searchpane',
                icon: 'icon-magnifying-glass',
                titleKey: 'sessionMenu_search',
                automationCls: 'search-tab'
            });
        }
        // Settings Tab
        settingsConfig = {
            name: 'abp-settings',
            uniqueId: 'abp-settings',
            xtype: 'settingscontainer',
            automationCls: 'settings-tab'
        };

        if (profilePicture) {
            settingsConfig.profilePicture = profilePicture;
        }
        else if (displayInitials) {
            settingsConfig.title = displayInitials;
        } else {
            settingsConfig.icon = 'icon-user';
        }

        me.fireEvent('rightPane_initTab', 'rightPaneTab_abp-settings', settingsConfig);
    },

    handleKeyPress: function() {
        // TODO:
        // This is left empty for compilation in modern. 
        // It is only for keyboard accessibility. 
        // Likely needs to be revisited.
    },

    /**
     * Toggles specified tab - Modern tabpanels have some major differences hence this function.
     */
    toggleTab: function (panelConfig, open) {
        var me = this,
            rightPaneOpen = me.getViewModel().get('rightPaneOpen');

        if (Ext.isBoolean(open) && rightPaneOpen !== open) {
            me.togglePane();
        }
        if (open === true) {
            panelIndex = me.__findBadgeTabIndex(panelConfig);
            me.getView().setActiveItem(panelIndex);
        }
    },

    /**
     * Gets the list of registered and enabled right pane tabs.
     */
    __getRightPaneTabs: function () {
        var me = this,
            sessionConfig = ABP.util.Config.getSessionConfig(),
            i, j,
            rightPaneTabs = [],
            enabledRightPaneTabs = sessionConfig.settings.rightPane,
            registeredRightPaneTabs = ABP.util.Config.config.rightPaneTabs;

        for (i = 0; i < enabledRightPaneTabs.length; i++) {
            for (j = 0; j < registeredRightPaneTabs.length; j++) {
                if (enabledRightPaneTabs[i].name === registeredRightPaneTabs[j].name) {
                    rightPaneTabs.push(registeredRightPaneTabs[j]);
                    break;
                }
            }
        }

        return rightPaneTabs;
    },

    /**
     * Finds a tab so that the badge config can be inspected.
     */
    __findBadgeTab: function (tabId) {
        var me = this,
            view = me.getView(),
            viewModel = view.getViewModel(),
            tabPrefix = viewModel.get('tabPrefix');

        var panel = view.items.items.filter(function (item) {
            return item.uniqueId === tabPrefix + tabId;
        })[0];

        if (!panel) {
            return false;
        }

        return panel.tab;
    },

    /**
     * Finds the tab index based on tab Id.
     */
    __findBadgeTabIndex: function (tabId) {
        var me = this,
            view = me.getView(),
            viewModel = view.getViewModel(),
            tabPrefix = viewModel.get('tabPrefix');
        var found = false;
        var i = 0;
        for (i; i < view.items.items.length; ++i) {
            if (view.items.items[i].uniqueId === tabPrefix + tabId) {
                // Subtract 1 for the tabbar (always first item (we want tabIndex not item index))
                found = i - 1;
                break;
            }
        }
        return found;
    },

    // Force creates the tab which initializes the panel's xtype.
    __initTab: function (uniqueId, tabConfig) {
        var me = this,
            view = me.getView(),
            viewModel = view.getViewModel(),
            tabPrefix = viewModel.get('tabPrefix');

        if (!tabConfig) {
            tabConfig = me.__getPanelConfig(uniqueId);
        }
        if (uniqueId.indexOf(tabPrefix) !== 0) {
            uniqueId = tabPrefix + uniqueId;
        }
        var newTab = me.__createTab(tabConfig, uniqueId);
        view.add(newTab);
    },

    /**
     * Creates a new tab.
     */
    __createTab: function (config, tabItemId) {
        var tabConfig = {
            uniqueId: tabItemId,
            titleKey: config.titleKey,
            layout: 'fit',
            scrollable: 'vertical',
            items: [{
                xtype: config.xtype
            }]
        };

        if (config.profilePicture) {
            tabConfig.iconCls = 'profile-picture';
            tabConfig.icon = config.profilePicture;
        }
        else if (config.icon) {
            // The usual case
            tabConfig.iconCls = config.icon;
        } else if (config.title) {
            // User Initials Case
            tabConfig.title = config.title;
        }

        if (config.automationCls) {
            // Because modern expects tab config to be a property of the tab object.
            tabConfig.tab = tabConfig.tab || {};
            tabConfig.tab.automationCls = config.automationCls;

            if (config.profilePicture) {
                tabConfig.tab.bind = {
                    icon: '{profilePhoto}',
                    iconCls: '{iconCls}'
                }
            }
        }

        return tabConfig;
    },

    __getTabBadges: function () {
        var me = this,
            view = me.getView(),
            viewModel = view.getViewModel(),
            tabPrefix = viewModel.get('tabPrefix'),
            tabs = view.items.items.reduce(function (a, item) {
                if (item.tab) {
                    a.push(item.tab)
                }
                return a;
            }, []);

        return tabs;
    },

    /**
     * Updates the badge config - badge count and/or priority.
     */
    __updateBadge: function (tabId, badgeConfig) {
        var tab = this.__findBadgeTab(tabId);

        if (tab && badgeConfig.value) {
            tab._badgeValue = badgeConfig.value;
            tab.setBadgeText(badgeConfig.value);
        }
        if (tab && badgeConfig.priority) {
            this.__setBadgePriority(tab, badgeConfig.priority)
        }
        this.__updateRPButtonBadge();
    },

    /**
     * Increase badge count by number or 1.
     */
    __incrementBadge: function (tabId, number) {
        if (!number) {
            number = 1;
        }

        var tab = this.__findBadgeTab(tabId);
        if (tab) {
            var previous = parseInt(tab._badgeValue, 10);
            if (!previous) previous = 0;
            previous += number;
            tab._badgeValue = previous;
            if (previous >= 100) {
                previous = "99+"
            }
            tab.setBadgeText(previous);
        }
        this.__updateRPButtonBadge();
    },

    __decrementBadge: function (tabId, number) {
        if (!number) {
            number = 1
        }
        var tab = this.__findBadgeTab(tabId);
        if (tab) {
            var previous = parseInt(tab._badgeValue, 10);
            if (!previous) previous = 0;
            if (previous - 1 < 0) previous = 1;
            previous -= number;
            tab._badgeValue = previous;
            if (previous >= 100) {
                previous = "99+"
            }
            tab.setBadgeText(previous);
        }

        this.__updateRPButtonBadge();
    },

    /**
     * Resets badge count and hides badge.
     */
    __clearBadge: function (tabId) {
        var tab = this.__findBadgeTab(tabId);
        if (tab) {
            tab._badgeValue = "";
            tab.setBadgeText("");
        }

        this.__updateRPButtonBadge();
    },

    __updateRPButtonBadge: function () {
        var me = this;
        var tabs = me.__getTabBadges();
        var priority;
        var badgeTotal = tabs.reduce(function (a, tab) {
            if (tab._badgeValue) {
                var tabValue = parseInt(tab._badgeValue, 10);
                var priorityValue = tab._badgePriority;
                priority = me.__determineHigherPriority(priorityValue, priority);
                if (tabValue) {
                    return a + tabValue;
                }
                return a;
            } else {
                return a;
            }
        }, 0);

        me.fireEvent('toolbar_updateRightPaneButtonBadge', badgeTotal, priority);
    },

    /**
     * Determines which of the currently showing badges has the highest priority.
     */
    __determineHigherPriority: function (newPriority, currentPriority) {
        var currentPriorityIndex = this.__badgePriorityOrder.indexOf(currentPriority);
        var newPriorityIndex = this.__badgePriorityOrder.indexOf(newPriority);
        if (newPriorityIndex > currentPriorityIndex) {
            currentPriorityIndex = newPriorityIndex;
        }
        return this.__badgePriorityOrder[currentPriorityIndex];
    },

    /**
     * Sets badge priority cls (changes color).
     */
    __setBadgePriority: function (tab, priority) {
        var newBadgePriorityCls;
        if (priority === ABP.util.Constants.badgePriority.Alert) {
            newBadgePriorityCls = 'abp-badge-priority-alert';
        } else if (priority === ABP.util.Constants.badgePriority.Warning) {
            newBadgePriorityCls = 'abp-badge-priority-warning';
        } else if (priority === ABP.util.Constants.badgePriority.Success) {
            newBadgePriorityCls = 'abp-badge-priority-success';
        } else if (priority === ABP.util.Constants.badgePriority.Info) {
            newBadgePriorityCls = 'abp-badge-priority-info';
        }
        tab._badgePriority = newBadgePriorityCls;
        tab.setCls(newBadgePriorityCls)
    }
});