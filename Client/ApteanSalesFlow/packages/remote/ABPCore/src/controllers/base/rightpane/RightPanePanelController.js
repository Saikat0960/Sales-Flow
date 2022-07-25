Ext.define('ABP.controllers.base.rightPane.RightPanePanelController', {
    extend: 'Ext.app.ViewController',

    listen: {
        controller: {
            '*': {
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

    /**
     * Create a new menu button in the view with the specified content items
     * 
     * @param {Object} items array of the items to include in the expanding menu  
     * @param {String} layout the type of layout to use either hbox, vbox or table, anything else will default to vbox
     */
    createButtonMenu: function (items, layout) {
        layout = this.configureButtonMenuLayout(layout);

        return Ext.create('Ext.menu.Menu', {
            xtype: 'menu',
            floated: false, // modern
            floating: false, // classic
            cls: 'settings-container-button-menu',
            layout: layout,
            ui: 'lightblue',
            hidden: true,
            height: 0,
            animCollapse: true,
            items: items
        });
    },

    /**
     * Creates and add a menu button into the view
     * 
     * @param {Object} items array of the items to include in the expanding menu  
     * @param {Object} settings the settings to use when the button is created
     */
    addMenuButton: function(items, settings) {
        if (!items || Ext.isEmpty(items)) {
            return null;
        }

        Ext.applyIf(settings, {
            cls: 'settings-container-button',
            automationCls: 'toolusermenu-unsafe-' + settings.titleKey || settings.title,
            handler: 'toggleMenuButton'
        });

        var me = this,
            view = me.getView(),
            menu = me.createButtonMenu(items, settings.layout);
        // Add the check button.
        view.add({
            text: settings.title,
            ariaLabel: settings.title,
            bind: settings.titleKey ? { 
                text: '{i18n.' + settings.titleKey + ':htmlEncode}',
                ariaLabel: '{i18n.' + settings.titleKey + ':ariaEncode}'
            } : {},
            buttonMenu: menu,
            cls: settings.cls,
            ui: 'menuitem',
            uiCls: 'light',
            textAlign: 'left',
            automationCls: settings.automationCls,
            handler: settings.handler,
            listeners: settings.listeners,
            keyMap: settings.keyMap || null,

            iconCls: 'icon-navigate-close',
            iconAlign: 'right'
        });
        view.add(menu);

        return menu;
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
        },

        configureButtonMenuLayout: function (layout) {
            if (layout === 'table') {
                return {
                    type: 'table',
                    columns: 6 // because classic hbox does not allow flex wrap
                };
            }

            if (layout === 'hbox') {
                return  {
                    type: 'hbox',
                    pack: 'start',
                    align: 'center',
                    wrap: true // only works on modern
                };
            }

            // Default to vbox
            return {
                type: 'vbox',
                pack: 'start',
                align: 'start'
            };
        },

        /**
         * Toggle a menu button. Close any active menu and active the new one.
         *  @param {Button} button the menu buton to toggle
         */ 
        toggleMenuButton: function (button) {
            var me = this;
            var view = me.getView();
            var activeBtn = view.activeMenuButton;
            var btnMenu;

            if (!activeBtn && !button) {
                return;
            }

            // If there was a previous active button, remove active state and hide that menu.
            if (activeBtn) {
                activeBtn.removeCls('x-btn-menu-active');
                btnMenu = activeBtn.buttonMenu;
                btnMenu.setHeight(0);
                btnMenu.hide();
                view.activeMenuButton = null;
                if (!button || (button && button.id === activeBtn.id)) {
                    return;
                }
            }

            // Set the active state for this menu button and show the menu.
            btnMenu = button.buttonMenu;
            if (!btnMenu) {
                return;
            }
            button.addCls('x-btn-menu-active');
            btnMenu.show();
            btnMenu.setHeight('auto');
            view.activeMenuButton = button;
        },
    }
});
