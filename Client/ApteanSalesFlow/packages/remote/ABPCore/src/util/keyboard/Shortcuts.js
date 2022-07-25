/**
 * Keyboard helper class used by ABP to manage the keyboard shortcut bindings
 *
 * @since ABP 3.0.0
 */
Ext.define('ABP.util.keyboard.Shortcuts', {
    requires: [
        'ABP.util.Keyboard'
    ],

    keyNav: null,
    routeMapping: [],
    config: {
        controller: null
    },

    constructor: function (config) {
        var me = this;

        Ext.apply(me, config);

        me.keyNav = new Ext.util.KeyNav({
            target: Ext.getBody(),
            scope: me,
            // Default action to apply, but only when teh handler returns true
            defaultEventAction: "stopEvent",
            ignoreInputFields: true,

            // Default Events
            F: {
                ctrl: true,
                shift: true,
                fn: function (e) {
                    me.controller.fireEvent('container_showMenu', true);
                    me.controller.fireEvent('container_menuFocusFavorites');
                },
                defaultEventAction: 'stopPropagation',
            },
            Z: {
                ctrl: true,
                shift: true,
                fn: function (e) {
                    ABP.view.base.automation.AutomationHintOverlay.toggle();
                },
                defaultEventAction: 'stopPropagation',
            },
            Home: {
                ctrl: true,
                fn: function (e) {
                    me.controller.fireEvent('container_showMenu', true);
                    ABP.util.Keyboard.focus('.nav-search-field');
                },
                defaultEventAction: 'stopPropagation',
            },
            Alt: {
                ctrl: false,
                fn: function (e) {
                    me.controller.fireEvent('container_toggleMenuShortcuts', true);
                    // util keyboard navigation tracking
                    ABP.util.Common.setKeyboardNavigation(true);
                },
                // defaultEventAction: 'stopPropagation',
            },
            // forward slash
            191: {
                fn: function (keyCode, e) {
                    if (keyCode.altKey) {
                        // ALT + / ... show the jump to menu
                        me.controller.fireEvent('abp_jumpto_show');
                    } else {
                        // / show the global search
                        me.controller.fireEvent('abp_searchBar_toggleKey');
                    }
                    
                    return true;
                },
                defaultEventAction: 'stopPropagation',
            },
            // Start util keyboard navigation tracking
            enter: {
                fn: this.KeyboardNavUpdate,
                defaultEventAction: false
            },
            tab: {
                fn: this.KeyboardNavUpdate,
                defaultEventAction: false
            },
            left: {
                fn: this.KeyboardNavUpdate,
                defaultEventAction: false
            },
            right: {
                fn: this.KeyboardNavUpdate,
                defaultEventAction: false
            },
            up: {
                fn: this.KeyboardNavUpdate,
                defaultEventAction: false
            },
            down: {
                fn: this.KeyboardNavUpdate,
                defaultEventAction: false
            }
            // End util keyboard 
        });

    },

    KeyboardNavUpdate: function () {
        ABP.util.Common.setKeyboardNavigation(true);
    },

    /**
     * Enable the keyboard shortcut keys
     */
    enable: function () {
        this.keyNav.enable();
    },

    /**
     * Enable the keyboard shortcut keys
     */
    disable: function () {
        this.keyNav.disable();
    },

    /**
     * Add a shortcut key binding to the event handling key map.requires
     *
     * Usage:
     *
     *      // Create a KeyMap
     *      var map = new Ext.util.KeyMap({
     *          target: Ext.getDoc(),
     *          key: Ext.event.Event.ENTER,
     *          handler: handleKey
     *      });
     *
     *      // Add a new binding to the existing KeyMap later
     *      map.addBinding({
     *          key: 'abc',
     *          shift: true,
     *          handler: handleKey
     *      });
     *
     * @param {Object/Object[]} shortcut A single KeyMap config or an array of configs.
     * The following config object properties are supported:
     *
     * @param {String/Array} shortcut.key A single keycode or an array of keycodes to handle,
     * or a RegExp which specifies characters to handle, eg `/[a-z]/`.
     * @param {Boolean} shortcut.shift `true` to handle key only when shift is pressed,
     * `false` to handle the key only when shift is not pressed (defaults to undefined).
     * @param {Boolean} shortcut.ctrl `true` to handle key only when ctrl is pressed,
     * `false` to handle the key only when ctrl is not pressed (defaults to undefined).
     * @param {Boolean} shortcut.alt `true` to handle key only when alt is pressed,
     * `false` to handle the key only when alt is not pressed (defaults to undefined).
     * @param {Function} shortcut.handler The function to call when KeyMap finds the
     * expected key combination.
     * @param {Object} shortcut.scope The scope (`this` context) in which the handler function
     * is executed.
     * @param {String} shortcut.defaultEventAction A default action to apply to the event
     * *when the handler returns `true`*. Possible values are: stopEvent, stopPropagation,
     * preventDefault. If no value is set no action is performed.
     *
     */
    addShortcuts: function (shortcuts) {
        var bindings = [];
        for (i = 0, len = shortcuts.length; i < len; i++) {
            var key = this.getKey(shortcuts[i].key);
            binding = {
                key: key,
                shift: shortcuts[i].key.indexOf('SHIFT+') >= 0,
                ctrl: shortcuts[i].key.indexOf('CTRL+') >= 0,
                alt: shortcuts[i].key.indexOf('ALT+') >= 0,
                handler: this.shortcutHandler,
                scope: this
            };
            bindings[key] = (binding);

            this.addRouteMap(binding, shortcuts[i]);
        }

        this.keyNav.addBindings(bindings);
    },
    getKey: function (keyCombo) {
        keyCombo = keyCombo.toUpperCase();
        return keyCombo.replace('SHIFT+', '').replace('CTRL+', '').replace('ALT+', '');
    },
    addRouteMap: function (binding, route) {
        var key = this.getRouteKey(binding);
        this.routeMapping[key] = route;
    },

    shortcutHandler: function (e) {
        var eventConfig = this.routeMapping[this.getRouteKey(e)]
        this.controller.fireAppEvent(eventConfig.appId, eventConfig.event, eventConfig.eventArgs, eventConfig.activateApp);
    },

    getRouteKey: function (e) {
        var key = '';
        if (e.ctrlKey || e.ctrl) {
            key += 'CTRL+';
        }
        if (e.shiftKey || e.shift) {
            key += 'SHIFT+';
        }
        if (e.altKey || e.alt) {
            key += 'ALT+';
        }

        if (Ext.isNumber(e.keyCode)) {
            key += e.keyCode
        }
        else {
            key += Ext.event.Event[e.key]
        }

        return key;
    }
});