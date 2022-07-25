Ext.define('ABP.view.session.toolbarTop.ToolbarTopController', {
    extend: 'ABP.view.session.toolbarTop.ToolbarTopBaseController',
    alias: 'controller.toolbartopcontroller',

    init: function () {
        this.callParent();

        this.checkMenuButton();
        this.constructRightPane();
    },

    checkMenuButton: function () {
        var me = this,
            view = me.getView(),
            sessionConfig = ABP.util.Config.getSessionConfig();

        if (!sessionConfig.settings.startMenuHidden) {
            var menuButton = view.down('#toolbar-button-menu');
            if (menuButton) {
                menuButton.addCls('toolbar-toggled');
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
            displayInitials = ABP.util.Config.getDisplayNameInitials(),
            profilePicture = ABP.util.Config.getProfilePicture(),
            notificationsEnabled = sessionConfig.settings.notifications.enabled,
            notificationPanelConfig = null,
            enabledRightPaneTabs = sessionConfig.settings.rightPane,
            registeredRightPaneTabs = ABP.util.Config.config.rightPaneTabs,
            btnCls = '';
        // btnCls = 'tool-button-right toolbar-button toolbar-menu-button toolbar-rpsegment-button';

        // Build the list of enabled tabs.
        for (i = 0; i < enabledRightPaneTabs.length; i++) {
            for (j = 0; j < registeredRightPaneTabs.length; j++) {
                // Configured tab names may come back as a list of names, rather than full config
                var configTabName = enabledRightPaneTabs[i];
                if (Ext.isObject(enabledRightPaneTabs[i])){
                    configTabName = enabledRightPaneTabs[i].name;
                }
                
                if (configTabName === registeredRightPaneTabs[j].name) {
                    rightPaneTabs.push(registeredRightPaneTabs[j]);
                    break;
                }
            }
        }

        if (!segmentedButtons) {
            segmentedButtons = view.down('#rightpaneButtons');
        }
        if (sessionVm) {
            sessionVm.set('rightPaneTabs', rightPaneTabs);
        }
        if (Ext.isArray(rightPaneTabs) && rightPaneTabs.length > 0) {
            for (i = 0; i < rightPaneTabs.length; i++) {
                var rightPaneItem = rightPaneTabs[i];
                var button = {
                    xtype: 'abpbadgebutton',
                    itemId: rightPaneItem.uniqueId,
                    ariaRole: 'menu',
                    ariaAttributes: {
                        'aria-expanded': false
                    },
                    iconCls: rightPaneItem.icon + ' toolbar-icon',
                    cls: btnCls + ' a-toolbar-rpsegment-' + rightPaneItem.uniqueId,
                    uiCls: ['dark'],
                    scale: 'large',
                    hidden: (rightPaneItem.invisible === true) ? true : rightPaneItem.hidden,
                    invisible: rightPaneItem.invisible,
                    panelConfig: rightPaneItem,
                    handler: 'toggleRightPaneButton',
                    keyMapEnabled: true,
                    keyMap: {
                        DOWN: 'handleRightPaneKeyPress'
                    }
                };
                if (rightPaneItem.tooltipKey) {
                    button.bind = {
                        tooltip: '{i18n.' + rightPaneItem.tooltipKey + ':htmlEncode}',
                        ariaLabel: '{i18n.' + rightPaneItem.tooltipKey + ':ariaEncode}'
                    };
                } else if (rightPaneItem.tooltip) {
                    button.tooltip = rightPaneItem.tooltip;
                    button.ariaLabel = rightPaneItem.tooltip;
                }
                segmentedButtons.add(button);

                me.fireEvent('rightpane_tabadded', rightPaneItem.uniqueId, rightPaneItem);
            }
        }

        // Add the alerts button / pane
        if (notificationsEnabled) {
            notificationPanelConfig = {
                name: 'abp-notifications',
                uniqueId: 'abp-notifications',
                xtype: 'abp-notifications',
                clearBadgeOnActivate: sessionConfig.settings.notifications.clearBadgeOnActivate
            };

            segmentedButtons.add({
                xtype: 'abpbadgebutton',
                itemId: 'abp-notifications',
                ariaRole: 'menu',
                ariaAttributes: {
                    'aria-expanded': false
                },
                iconCls: 'icon-bell toolbar-icon',
                cls: btnCls + ' a-toolbar-rpsegment-abp-notifications',
                uiCls: ['dark'],
                scale: 'large',
                // bind: {
                //     tooltip: '{i18n.abp_notifications_button_tooltip:htmlEncode}'
                // },
                panelConfig: notificationPanelConfig,
                handler: 'toggleRightPaneButton',
                bind: {
                    tooltip: '{i18n.abp_notifications_rightpane_title:htmlEncode}',
                    ariaLabel: '{i18n.abp_notifications_rightpane_title:ariaEncode}'
                },
                keyMapEnabled: true,
                keyMap: {
                    DOWN: 'handleRightPaneKeyPress'
                }
            });

            // Fire event so the notification container is created and waiting for events
            me.fireEvent('rightPane_initTab', 'abp-notifications', notificationPanelConfig);
        }

        // Add the settings button / pane.
        var button = {
            xtype: 'abpbadgebutton',
            ariaRole: 'menu',
            ariaAttributes: {
                'aria-expanded': false
            },
            itemId: 'abp-settings',
            ariaRole: 'menu',
            iconCls: '',
            cls: btnCls + ' a-toolbar-rpsegment-abp-settings',
            uiCls: ['dark'],
            scale: 'large',
            tabIndex: 0,
            panelConfig: {
                name: 'abp-settings',
                uniqueId: 'abp-settings',
                xtype: 'settingscontainer',
            },
            handler: 'toggleRightPaneButton',

            icon: profilePicture,
            bind: {
                icon: '{profilePhoto}',
                tooltip: '{i18n.sessionMenu_settings:htmlEncode}',
                ariaLabel: '{i18n.sessionMenu_settings:ariaEncode}'
            },
            keyMapEnabled: true,
            keyMap: {
                DOWN: 'handleRightPaneKeyPress'
            }
        };

        if (profilePicture) {
            button.cls += ' toolbar-initials-button';
        }
        else if (displayInitials) {
            // We have a displayName, so use it for the initials
            button.text = displayInitials;
            button.cls += ' toolbar-initials-button';
        } else {
            // Show the default user icon
            button.iconCls = 'icon-user toolbar-icon';
        }

        segmentedButtons.add(button);
    },

    setVisibilityRightPaneButton: function (btnItemId, show) {
        var me = this,
            view = me.getView(),
            segmentedButtons = view.down('#rightpaneButtons'),
            button;

        if (segmentedButtons) {
            button = segmentedButtons.down('#' + btnItemId);
            if (button) {
                if (show === true) {
                    // Invisible buttons are meant to stay hidden.
                    if (button.config && !button.config.invisible) {
                        button.show();
                    }
                }
                else if (show === false) {
                    button.hide();
                }
            }
        }
    },

    __removePressedCls: function () {
        var me = this,
            view = me.getView(),
            segmentedButtons = view.down('#rightpaneButtons');

        if (segmentedButtons) {
            // Remove the x-btn-pressed class on each child component (the buttons).
            segmentedButtons.cascade(function (component) {
                if (component.xtype === 'segmentedbutton') {
                    return;
                }
                component.setPressed(false);
            });
        }
    },

    __addPressedCls: function (btnUniqueId) {
        var me = this;
        me.__removePressedCls()
        var btn = me.__findRightPaneButton(btnUniqueId);
        if (btn) {
            btn.setPressed(true);
        }
    },

    // Find a right pane (segmented) button.
    __findRightPaneButton: function (btnUniqueId) {
        var me = this,
            view = me.getView(),
            segmentedButtons = view.down('#rightpaneButtons'),
            button;

        if (segmentedButtons) {
            button = segmentedButtons.down('#' + btnUniqueId);
        }
        if (!button) {
            ABP.util.Logger.logWarn('Could not find right pane button ' + btnUniqueId);
        }
        return button;
    },

    privates: {
        __updateBadge: function (btnUniqueId, badgeConfig) {
            var me = this;
            var button = me.__findRightPaneButton(btnUniqueId);

            // A number can be passed as the config, ensure its converted into an object
            if (Ext.isNumber(badgeConfig)) {
                badgeConfig = { value: badgeConfig };
            }

            if (button) {
                if (badgeConfig.value) {
                    button.setBadgeValue(badgeConfig.value);
                }
                if (badgeConfig.priority) {
                    button.setBadgePriority(badgeConfig.priority);
                }
                if (badgeConfig.icon) {
                    button.setIconCls(badgeConfig.icon + ' toolbar-icon');
                    if (badgeConfig.animate) {
                        button.updateBadge(badgeConfig.animate);
                    }
                }
            }
        },

        __incrementBadge: function (btnUniqueId, number) {
            var me = this;
            var button = me.__findRightPaneButton(btnUniqueId);
            if (button) {
                button.incrementBadge(number);
            }
        },

        __decrementBadge: function (btnUniqueId, number) {
            var me = this;
            var button = me.__findRightPaneButton(btnUniqueId);
            if (button) {
                button.decrementBadge(number);
            }
        },

        // Hide the badge.
        __clearBadge: function (btnUniqueId) {
            var me = this;
            var button = me.__findRightPaneButton(btnUniqueId);
            if (button) {
                button.clearBadge();
            }
        }
    }
});
