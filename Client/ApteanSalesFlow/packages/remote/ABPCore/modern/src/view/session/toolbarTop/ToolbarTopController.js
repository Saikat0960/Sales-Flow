Ext.define('ABP.view.session.toolbarTop.ToolbarTopController', {
    extend: 'ABP.view.session.toolbarTop.ToolbarTopBaseController',
    alias: 'controller.toolbartopcontroller',

    listen: {
        controller: {
            '*': {
                toolbar_updateRightPaneButtonBadge: '__updateRightPaneButtonBadge',
            }
        }
    },

    constructRightPane: function (segmentedButtons) {
        var me = this,
            view = me.getView(),
            sessionVm = view.up('sessioncanvas').getViewModel(),
            i, j,
            rightPaneTabs = [],
            sessionConfig = ABP.util.Config.getSessionConfig(),
            notificationsEnabled = sessionConfig.settings.notifications.enabled,
            enabledRightPaneTabs = sessionConfig.settings.rightPane,
            registeredRightPaneTabs = ABP.util.Config.config.rightPaneTabs,
            btnCls = ['toolbar-button', 'toolbar-menu-button', 'toolbar-rpsegment-button'];

        // Build the list of enabled tabs.
        for (i = 0; i < enabledRightPaneTabs.length; i++) {
            for (j = 0; j < registeredRightPaneTabs.length; j++) {
                // Configured tab names may come back as a list of names, rather than full config√
                var configTabName = enabledRightPaneTabs[i];
                if (Ext.isObject(enabledRightPaneTabs[i])) {
                    configTabName = enabledRightPaneTabs[i].name;
                }

                if (configTabName === registeredRightPaneTabs[j].name) {
                    rightPaneTabs.push(registeredRightPaneTabs[j]);
                    break;
                }
            }
        }

        if (!segmentedButtons) {
            segmentedButtons = me.getView().down('rightpaneButtons');
        }
        if (sessionVm) {
            sessionVm.set('rightPaneTabs', rightPaneTabs);
        }

        if (rightPaneTabs.length > 0 || notificationsEnabled) {
            segmentedButtons.add({
                xtype: 'abpbadgebutton',
                itemId: 'rpButton',
                iconCls: 'icon-all toolbar-icon',
                cls: btnCls.concat(['a-toolbar-rpsegment-abp-rightpane-all']),
                userCls: ['dark', 'medium'],
                pressedCls: 'toolbar-button-pressed',
                handler: 'toggleRightPane'
            });
        } else {
            segmentedButtons.add({
                itemId: 'rpButton',
                iconCls: 'icon-user toolbar-icon',
                cls: btnCls,
                userCls: ['dark', 'medium'],
                pressedCls: 'toolbar-button-pressed',
                handler: 'toggleRightPane'
            });
        }
    },

    setVisibilityRightPaneButton: function (btnItemId, show) {
        var me = this,
            view = me.getView(),
            tabs = view.up().down('#rightPane').innerItems;

        if (btnItemId.indexOf('rightPaneTab_') === -1) {
            btnItemId = 'rightPaneTab_' + btnItemId;
        }

        var tab = tabs.filter(function (item) {
            return item.uniqueId === btnItemId
        });
        tab = (tab && tab.length > 0) ? tab[0] : null;

        if (tab) {
            if (show === true) {
                tab.show();
            } else if (show == false) {
                tab.hide();
            }
        }
    },

    __addPressedCls: function (btnUniqueId) {
        var me = this,
            view = me.getView(),
            segmentedButtons = view.down('rightpaneButtons'),
            btn = me.__findRightPaneButton(btnUniqueId);

        // With allowMultiple false, segmented will remove pressed class from other buttons
        if (btn) {
            segmentedButtons.setPressedButtons([btn]);
        }
    },

    __removePressedCls: function () {
        var me = this,
            view = me.getView(),
            segmentedButtons = view.up('rightpaneButtons');
        // This deselects all buttons
        segmentedButtons.setPressedButtons([]);
    },

    __updateRightPaneButtonBadge: function (value, priority) {
        var me = this,
            view = me.getView(),
            segmentedButtons = view.down('#rightpaneButtons');

        var button = segmentedButtons.down('#rpButton');
        if (value >= 100) {
            value = "99+"
        }
        button.setBadgeText(value);
        if (priority) {
            this.__updateRightPaneButtonPriority(button, priority);
        }
    },

    __updateRightPaneButtonPriority: function (button, priority) {
        var buttonClasses = button.getCls();
        if (buttonClasses) {
            buttonClasses = buttonClasses.filter(function (className, i) {
                return className.indexOf('abp-badge-priority') === -1
            });
            buttonClasses.push(priority)
            button.setCls(buttonClasses);
        }
    },

    __findRightPaneButton: function (btnUniqueId) {
        var me = this,
            view = me.getView(),
            segmentedButtons = view.down('#rightpaneButtons'),
            button;

        if (segmentedButtons) {
            button = segmentedButtons.down('#rpButton');
        }
        if (!button) {
            ABP.util.Logger.logWarn('Could not find right pane button ' + btnUniqueId);
        }

        return button;
    },

    privates: {
        __updateBadge: function () { }, //found in modern rightPaneController
        __incrementBadge: function () { }, // found in modern rightPaneController
        __decrementBadge: function () { }, //found in modern rightPaneController
        __clearBadge: function () { }, //found in modern rightPaneController
    }

});
