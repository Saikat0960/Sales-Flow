Ext.define('ABP.view.session.toolbarTop.ToolbarTopBaseController', {
    extend: 'Ext.app.ViewController',

    requires: [
        'ABP.view.base.popUp.ShowByPopUp'
    ],

    listen: {
        controller: {
            '*': {
                toolbar_addbutton: 'addButton',
                toolbar_addRPButton: 'addRPButton',
                toolbar_addSearchButton: 'addSearchButton',
                toolbar_openSearch: 'openSearchBar',
                toolbar_removeButton: 'removeButton',
                toolbar_removeMenuButton: 'removeMenuButton',
                toolbar_setTitle: 'setTitle',
                toolbar_showBranding: 'showBranding',
                toolbar_setupConfig: '__processConfiguration',
                toolbar_setOverrideTitle: 'setOverrideTitle',
                toolbar_updateButtonIcon: 'updateButtonIcon',
                toolbar_setVisibilityRightPaneButton: 'setVisibilityRightPaneButton',
                toolbar_removePressedCls: '__removePressedCls',
                toolbar_addPressedCls: '__addPressedCls',
                toolbar_updateBadge: '__updateBadge',
                toolbar_incrementBadge: '__incrementBadge',
                toolbar_decrementBadge: '__decrementBadge',
                toolbar_clearBadge: '__clearBadge',
                toolbar_findRightPaneButton: '__findRightPaneButton',
            }
        }
    },

    // constructRightPane() found in classic/modern specific extension

    // setVisibilityRightPaneButton() found in classic/modern specific extension

    // Toggle Section
    toggleMenu: function () {
        this.fireEvent('session_toggleMenu');
    },
    toggleRightPane: function () {
        this.fireEvent('session_toggleRightPane');
    },

    toggleRightPaneButton: function (button) {
        this.fireEvent('rightPane_toggleTab', button.panelConfig, button.pressed);
    },

    handleRightPaneKeyPress: function(event, button){
        this.fireEvent('rightPane_handleKeyPress', event, button);
    },

    openSearchBar: function () {
        var me = this;
        var vm = me.getViewModel();
        vm.set('searchBar.open', true);
        if (Ext.toolkit === 'modern') {
            this.fireEvent('session_closeMenu');
        }
    },

    // Toolbar button section
    __processConfiguration: function (buttons) {
        var me = this;
        var i = 0;
        var func;
        for (i = 0; i < buttons.length; ++i) {
            var func = function () {
                this.fireEvent(buttons[i].event, buttons[i].eventArgs);
            }
            if (buttons[i].side === '' || buttons[i].side === undefined || buttons[i].side === null) {
                buttons[i].side = 'right';
            }
            me.addButton(buttons[i]);
        }
    },
    buttonId: 0,
    addButton: function (button, icon, func, uniqueId) {
        // Legacy for Saratoga we have to determine what is being passed 4 items or a single object
        var me = this;
        var found = null;
        if (button.uniqueId) {
            found = me.getButton(button.uniqueId);
        }
        if (uniqueId) {
            found = me.getButton(uniqueId);
        }
        if (!found) {
            if (button.appId) {
                me.addProperButton(button);
            } else {
                // 'button' in this case is the 'side' property
                me.addLegacyButton(button, icon, func, uniqueId);
            }
        }
    },
    addProperButton: function (button) {
        var me = this;
        var view = me.getView();
        var iconString = me.makeIconString(button.icon);
        var unId = (button.uniqueId === null || button.uniqueId === undefined) ? ABP.util.IdCreator.getId(button) : button.uniqueId;
        var toolSide;
        var toAdd;
        if (!button.side) {
            button.side = 'right';
        }
        if (button.side === 'left') {
            toolSide = view.down('#tool-buttons-left');
            toAdd = {
                xtype: 'button',
                cls: 'tool-button-right toolbar-button a-toolbar-' + button.icon,
                bind: {
                    height: '{toolbarHeight}'
                },
                command: button.event,
                uiCls: ['dark'],
                eventArgs: button.eventArgs,
                uniqueId: unId,
                iconCls: iconString,
                focusCls: '',
                overCls: 'toolbar-button-over',
                handler: button.type === 'event' ? me.buttonEventHandler : me.makeHandler(button.eventArgs),
                pressedCls: 'toolbar-button-pressed'
            };
            toolSide.add(toAdd);
        } else if (button.side === 'right' || button.side === 'right-right') {
            toolSide = view.down('#tool-buttons-right');
            toAdd = {
                xtype: 'button',
                cls: 'tool-button-right toolbar-button a-toolbar-' + button.icon,
                bind: {
                    height: '{toolbarHeight}'
                },
                command: button.event,
                eventArgs: button.eventArgs,
                uiCls: ['dark'],
                uniqueId: unId,
                iconCls: iconString,
                focusCls: '',
                overCls: 'toolbar-button-over',
                handler: button.type === 'event' ? me.buttonEventHandler : me.makeHandler(button.eventArgs),
                pressedCls: 'toolbar-button-pressed'
            };
            if (button.side === 'right') {
                toolSide.addButton(toAdd);
            } else {
                toolSide.add(toAdd);
            }
        }
    },
    addLegacyButton: function (side, icon, func, uniqueId) {
        var me = this;
        var toolSide;
        var button;
        var view = me.getView();
        var iconString = me.makeIconString(icon);
        var unId = uniqueId ? uniqueId : this.buttonId++;
        var myHandler;
        if (func === 'toggleRightPane') {
            myHandler = func;
        } else {
            myHandler = Ext.isFunction(func) ? func : me.makeHandler(func);
        }
        if (side === 'right') {
            toolSide = view.down('#tool-buttons-right');
            button = {
                xtype: 'button',
                cls: 'tool-button-right toolbar-button a-toolbar-' + icon,
                bind: {
                    height: '{toolbarHeight}'
                },
                uiCls: ['dark'],
                uniqueId: uniqueId,
                iconCls: iconString,
                focusCls: '',
                overCls: 'searchbar-button-over',
                handler: myHandler,
                pressedCls: 'toolbar-button-pressed'
            }
            if (unId === 'rpButton') {
                button.itemId = unId;
            } else {
                button.bind = {
                    hidden: '{nonControlButtonsHidden}'
                }
            }
            toolSide.addButton(button);
        }
        else if (side === 'right-right') {
            toolSide = view.down('#tool-buttons-right');
            button = {
                xtype: 'button',
                cls: 'tool-button-right toolbar-button a-toolbar-' + icon,
                bind: {
                    height: '{toolbarHeight}'
                },
                uniqueId: uniqueId,
                iconCls: iconString,
                focusCls: '',
                overCls: 'searchbar-button-over',
                handler: myHandler,
                bind: {
                    hidden: '{nonControlButtonsHidden}'
                },
                pressedCls: 'toolbar-button-pressed'
            }
            toolSide.add(button);
        }
        else if (side === 'left') {
            toolSide = view.down('#tool-buttons-left');
            button = {
                xtype: 'button',
                cls: 'tool-button-left toolbar-button a-toolbar-' + icon,
                bind: {
                    height: '{toolbarHeight}'
                },
                uniqueId: uniqueId,
                iconCls: iconString,
                handler: myHandler,
                bind: {
                    hidden: '{nonControlButtonsHidden}'
                },
                pressedCls: 'toolbar-button-pressed'
            }
            toolSide.add(button);
        }
    },
    addSearchButton: function () {
        var me = this;
        var view = me.getView();
        var toolSide = view.down('#tool-buttons-right');
        if (ABP.util.Common.getModern()) {
            toolSide.add({
                xtype: 'button',
                cls: 'tool-button-right toolbar-button a-toolbar-searchButton',
                uniqueId: 'tbSearchButton',
                iconCls: 'icon-magnifying-glass toolbar-icon',
                enableToggle: true,
                bind: {
                    pressed: '{searchBar.open}'
                },
                pressedCls: 'toolbar-button-pressed'
            });
        }
        else {
            toolSide.addButton({
                xtype: 'searchbar',
                flex: 1
            })
        }


    },
    addRPButton: function (info) {
        if (info && info.icon) {
            this.addButton('right', info.icon, 'toggleRightPane', 'rpButton');
        }
    },
    getButton: function (uniqueId) {
        var me = this;
        var view = me.getView();
        var LButtonGroup = view.down('#tool-buttons-left');
        var RButtonGroup = view.down('#tool-buttons-right');
        var ret = null;
        var button = RButtonGroup.down('[uniqueId=' + uniqueId + ']');
        if (button) {
            // Find the side!!!!!
            ret = button;
        } else {
            button = LButtonGroup.down('[uniqueId=' + uniqueId + ']');
            if (button) {
                // Find the side!!!!!
                ret = button;
            }
        }
        return ret;
    },
    removeButton: function (uniqueId) {
        var me = this;
        var view = me.getView();
        var LButtonGroup = view.down('#tool-buttons-left');
        var RButtonGroup = view.down('#tool-buttons-right');
        var button = RButtonGroup.down('[uniqueId=' + uniqueId + ']');
        if (button) {
            // Find the side!!!!!
            RButtonGroup.remove(button);
        } else {
            button = LButtonGroup.down('[uniqueId=' + uniqueId + ']');
            if (button) {
                // Find the side!!!!!
                LButtonGroup.remove(button);
            }
        }
    },
    removeMenuButton: function () {
        var me = this;
        var view = me.getView();
        var LButtonGroup = view.down('#tool-buttons-left');
        var menubutton = view.down('#toolbar-button-menu');
        if (menubutton && LButtonGroup) {
            LButtonGroup.remove(menubutton);
        }
    },
    updateButtonIcon: function (uniqueId, newIcon) {
        var me = this;
        var view = me.getView();
        var iconString = me.makeIconString(newIcon);
        var LButtonGroup = view.down('#tool-buttons-left');
        var RButtonGroup = view.down('#tool-buttons-right');
        var button = RButtonGroup.down('[uniqueId=' + uniqueId + ']');
        if (button) {
            // Find the side!!!!!
            button.setIconCls(iconString);
        } else {
            button = LButtonGroup.down('[uniqueId=' + uniqueId + ']');
            if (button) {
                // Find the side!!!!!
                button.setIconCls(iconString);
            }
        }
    },
    makeIconString: function (icon) {
        var ret = icon;
        var font = icon;
        font = font.split('-');
        ret = font[0] === 'fa' ? 'x-fa ' + icon : icon;
        return ret + ' toolbar-icon';
    },
    buttonEventHandler: function () {
        var me = this;
        me.up('toolbartop').getController().fireEvent(me.command, me.eventArgs);
    },
    makeHandler: function (type) {
        var ret = function (btn) {
            var pan = Ext.Viewport.add({
                xtype: 'abpshowbypopup',
                items: [
                    {
                        xtype: type
                    }
                ]
            });
            pan.showBy(btn);
        }
        return ret;
    },
    // Title logic section
    setTitle: function (newTitle) {
        var me = this;
        me.__setSpecificTitle(newTitle, 'toolbarTitle');
    },
    // Whether the branding area is shown or hidden.
    showBranding: function (show) {
        var me = this,
            vm = me.getViewModel();

        vm.set('conf.settings.toolbarTitleShowBranding', show);
    },

    setOverrideTitle: function (newTitle) {
        var me = this;

        me.__setSpecificTitle(newTitle, 'overrideTitle');
    },

    __setSpecificTitle: function (newTitle, formulaKey) {
        var me = this,
            vm = me.getViewModel(),
            formulas = vm.getFormulas();

        newTitle = newTitle || "";

        // If this is a token, bind to it so language changes are automatically picked up
        if (vm.get('i18n.' + newTitle)) {
            formulas[formulaKey] = {
                bind: '{i18n.' + newTitle + '}',

                get: function (title) {
                    return title;
                }
            };
            vm.setFormulas(formulas);
            vm.notify();
        } else {
            // Replace the old formula, if it exists and set the string as the title
            formulas[formulaKey] = {
                get: function (get) {
                    return newTitle;
                }
            };
            vm.setFormulas(formulas);
            vm.notify();

            vm.set(formulaKey, newTitle);
        }

        this.centerLabel(this.getView());
    },

    onResizeToolbar: function (view, width) {
        var me = this;
        var vm = me.getViewModel();

        this.centerLabel(view, width)
    },

    onAfterLayout: function (view, width, height) {
        this.centerLabel(view)
    },

    toolbarTitleImageClick: function (event, element) {
        var me = this;
        me.fireEvent("toolbartop_logoclick", element);
    },

    toolbarTitleImageContainerBeforeRender: function (container) {
        var me = this,
            vm = me.getViewModel(),
            toolbarTitleImageUrl = vm.get('conf.toolbarTitleImageUrl')

        if (toolbarTitleImageUrl) {
            container.setHtml('<img class="toolbar-title-image" src="' + Ext.String.htmlEncode(Ext.resolveResource(toolbarTitleImageUrl)) + '" alt="">');
        }
        // Otherwise, don't bother
    },

    privates: {
        centerLabel: function (view) {
            var me = this;

            // Ensure the title label is center aligned.

            var label = view.down('#toolbarTitle');
            if (!label || !label.text) {
                return;
            }

            var vm = me.getViewModel(),
                currentX = label.getX(),
                showBranding = vm.get('conf.settings.toolbarTitleShowBranding'),
                left;

            // Adjust the left of the title label if branding is showing, otherwise place it don't interfere with its x.
            if (!showBranding) {
                var labelContainer = view.down('#toolbarTitleContainer'),
                    containerX;
                if (labelContainer) {
                    // Use the same x position as the parent container, which is constrained between the left nav button and the right buttons.
                    containerX = labelContainer.getX();
                } else {
                    containerX = 0;
                }
                // Only set if needed
                if (currentX !== containerX) {
                    label.setX(containerX);
                }
            } else {
                var labelWidth = label.getWidth();
                if (labelWidth === 0) {
                    // The label has not been rendered, lets measure the text to get an approximate
                    // set of dimensions.
                    labelWidth = ABP.util.Common.measureTextSingleLine(label.text, ABP.util.Constants.BASE_FONT).width;
                }

                left = ((Ext.getViewportWidth() - labelWidth) / 2);
                // Only set if needed
                if (currentX !== left) {
                    label.setX(left);
                }
            }
        }

        //__removePressedCls() found in classic/modern specific extension

        // __addPressedCls() found in classic/modern specific extension

        // __updateBadge() found in classic/modern specific extension

        // __incrementBadge() found in classic/modern specific extension

        // __decrementBadge() found in classic/modern specific extension

        // __clearBadge() found in classic/modern specific extension

        // __findRightPaneButton() found in classic/modern specific extension
    }
});
