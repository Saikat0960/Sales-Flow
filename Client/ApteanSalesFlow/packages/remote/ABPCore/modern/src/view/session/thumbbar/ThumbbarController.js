Ext.define('ABP.view.session.thumbbar.ThumbbarController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.thumbbar',
    listen: {
        controller: {
            '*': {
                thumbbar_show: 'showThumbbar',
                thumbbar_hide: 'hideThumbbar',
                thumbbar_handleSwipe: 'handleSwipe',
                thumbbar_trayTriggerClick: 'trayTriggerClick',
                thumbbar_post_tray_close: 'postTrayClose'
            }
        }
    },
    // We only want to add the listener the first time we show the thumbbar
    hasAddedOrientationChangeEvent: false,
    // store last config so we can change view modes and have the information handy
    lastConfig: null,
    // ref to our tray
    tray: null,

    /*
    // showThumbbar - shows the thumbbar on the bottom of the screen
    // config components
    // buttons - array - array of other button objects to be shown on the thumbbar
    */
    showThumbbar: function (config) {
        var me = this;
        var vm = me.getViewModel();
        var portrait = ABP.util.Common.getPortrait();
        vm.set('portrait', portrait);
        if (Ext.os.deviceType === "Phone") {
            if (!me.hasAddedOrientationChangeEvent) {
                Ext.Viewport.on('orientationchange', '__thumbbarOnOrientationChange', me);
                me.hasAddedOrientationChangeEvent = true;
            }
            me.__closeTray();
            if (config) {
                me.lastConfig = config;
                // remove buttons to start fresh for the new config
                me.__clearBar();
                vm.set('thumbOpen', true)
                // buttons
                if (config.buttons && !Ext.isEmpty(config.buttons)) {
                    var capacities = me.__getButtonCapacity(config);
                    var productButtonLimit = capacities.bar;
                    var trayLimit = capacities.tray;

                    if (portrait) {
                        if (trayLimit > 0) {
                            me.__addTrayTrigger();
                            vm.set('overCapacity', true);
                            me.__addTrayButtons(config.buttons, productButtonLimit, trayLimit);
                        } else {
                            vm.set('overCapacity', false);
                        }
                        for (var i = 0; i < productButtonLimit; ++i) {
                            me.__addButton(config.buttons[i]);
                        }
                        me.getView().show(config.animation);
                    } else {
                        me.__addTrayButtons(config.buttons, productButtonLimit, trayLimit);
                        me.tray.show();
                        vm.set('overCapacity', false);
                    }
                }
            }
        }
    },
    /*
        Hides the thumbbar
    */
    hideThumbbar: function (internalHide) {
        var vm = this.getViewModel();
        if (!internalHide) {
            vm.set('thumbOpen', false);
        }
        if (vm.get('trayOpen')) {
            this.__closeTray();
        }
        this.getView().hide();
    },
    /*
        Fires button's event or changes route with button's hash
    */
    buttonHandler: function (button) {
        if (button) {
            if (button.type && button.type === 'event' && button.event) {
                this.fireEvent(button.appId + '_' + button.event, button.eventArgs);
            } else if (button.type && button.type === 'route' && button.hash) {
                this.redirectTo(button.hash);
            }
        }
    },

    privates: {
        /*
            clear all buttons from the thumbbar
        */
        __clearBar: function () {
            this.getView().removeAll(true, true);
            if (this.tray) {
                this.tray.getController().__clear();
            }
        },
        /*
            add a button to the thumbbar
        */
        __addButton: function (bConfig) {
            bConfig.cls = ['small'];
            if (!bConfig.handler) {
                bConfig.handler = 'buttonHandler';
            }
            if (bConfig.icon) {
                bConfig.iconCls = bConfig.icon;
                bConfig.icon = null;
            }
            if (!bConfig.text) {
                bConfig.text = " ";
                ABP.util.Logger.logWarn("Thumbbar button is not using text", "button using icon:" + bConfig.iconCls);
            }
            bConfig.iconAlign = 'top';
            bConfig.flex = 1;
            this.getView().add(bConfig);
        },
        __addTrayTrigger: function () {
            var button = this.getView().down('#openTrayButton');
            var session = this.getView().up('sessioncanvas');
            if (!button) {
                this.getView().add({
                    xtype: 'button',
                    iconCls: 'icon-navigate-up',
                    automationCls: 'thumbbartrayopen',
                    handler: '__openTray',
                    cls: 'thumbbar-trigger thumbbar-trigger-float',
                    itemId: 'openTrayButton',
                    renderTo: session,
                    bind: {
                        hidden: '{!triggerShow}'
                    },
                    height: 14,
                    width: 60
                });
            }
        },
        __addTrayButtons: function (buttons, productButtonLimit, trayLimit) {
            var me = this;
            var i = 0;
            var barButtons = [];
            var trayButtons = [];
            if (!me.tray) {
                me.tray = me.getView().up('featurecanvas').down('thumbbartray');
            }
            // by design no more than 4/6 buttons should be on the main bar, and if we are populating the tray,
            //  we can reasonably assume there are more than 4/6 buttons total.
            for (i = 0; i < productButtonLimit; ++i) {
                //add buttons to bar
                var thisButton = buttons[i];
                thisButton.cls = ['small'];
                if (!thisButton.handler) {
                    thisButton.handler = 'buttonHandler';
                }
                if (thisButton.icon) {
                    thisButton.iconCls = thisButton.icon;
                    thisButton.icon = null;
                }
                if (!thisButton.text) {
                    thisButton.text = " ";
                    ABP.util.Logger.logWarn("Thumbbar button is not using text", "button using icon:" + thisButton.iconCls);
                }
                thisButton.iconAlign = 'top';
                thisButton.flex = 1;
                barButtons.push(thisButton);
            }
            for (i; i < productButtonLimit + trayLimit; ++i) {
                // add buttons to the tray
                var thisButton = buttons[i];
                thisButton.cls = ['small'];
                if (!thisButton.handler) {
                    thisButton.handler = 'buttonHandler';
                }
                if (thisButton.icon) {
                    thisButton.iconCls = thisButton.icon;
                    thisButton.icon = null;
                }
                thisButton.iconAlign = 'top';
                thisButton.flex = 1;
                trayButtons.push(thisButton);
            }
            if (!Ext.isEmpty(barButtons)) {
                me.tray.getController().__addBarButtons(barButtons);
                // call even if there are no buttons - row quantity needs to be set for placement
                me.tray.getController().__addTrayButtons(trayButtons, productButtonLimit);
            }
        }
    },
    /*
        Calculates Custom Product Button Capacity and logs warnings if too many are provided
    */
    __getButtonCapacity: function (config) {
        // Current Design says only 4 buttons max should be present on bar (portrait) 6 for landscape
        var barCapacity = ABP.util.Common.getPortrait() ? 4 : 6;
        var trayCapacity = 12;
        var buttonCount = config.buttons.length;

        if (buttonCount > barCapacity) {
            if ((buttonCount - barCapacity) > trayCapacity) {
                var totalCapacity = barCapacity + trayCapacity;
                var detailString = buttonCount + " buttons provided, capacity for " + totalCapacity + ", first buttons provided will be shown";
                ABP.util.Logger.logWarn("Too many buttons provided by Thumbbar Config", detailString);
            } else {
                trayCapacity = buttonCount - barCapacity;
            }
        } else if (buttonCount <= barCapacity) {
            barCapacity = buttonCount;
            trayCapacity = 0;
        }
        return { bar: barCapacity, tray: trayCapacity };
    },
    __openTray: function () {
        var me = this;
        var vm = me.getViewModel();
        var view = me.getView();
        var portrait = ABP.util.Common.getPortrait();
        if (me.tray) {
            me.tray.getController().__openTray(portrait);
            if (portrait) {
                view.addCls('thumbbar-clear');
            }
        }
        vm.set('trayOpen', true);
    },
    __closeTray: function () {
        var me = this;
        var vm = me.getViewModel();
        if (me.tray) {
            me.tray.getController().__closeTray(ABP.util.Common.getPortrait());
        }
        vm.set('trayOpen', false);
    },
    postTrayClose: function () {
        var view = this.getView();
        view.removeCls('thumbbar-clear');
    },
    __thumbbarOnOrientationChange: function (viewport, newOrientation, width, height, options) {
        var me = this;
        var view = me.getView();
        var vm = me.getViewModel();
        if (view && vm.get('thumbOpen')) {
            vm.set('trayOpen', false);
            if (me.tray) {
                me.tray.hide();
                me.__closeTray();
            }
            if (newOrientation === "landscape") {
                // send true to tell the function we are switching to the tray/landscape format and not hiding the bar altogether 
                me.hideThumbbar(true);

            }
            me.showThumbbar(me.lastConfig);
        }
    },
    trayTriggerClick: function () {
        var me = this;
        var vm = me.getViewModel();
        if (vm.get('trayOpen')) {
            me.__closeTray();
        } else {
            me.__openTray();
        }
    },
    handleSwipe: function (event, component, eOpts) {
        var me = this;
        var vm = me.getViewModel();
        var thumbOpen = vm.get('thumbOpen');
        if (thumbOpen) {
            if (event.direction === 'up') {
                if (!vm.get('trayOpen') && (vm.get('overCapacity') || !vm.get('portrait'))) {
                    var endY = event.touch.pageY;
                    var distance = event.distance;
                    var screenHeight = ABP.util.Common.getWindowHeight();
                    var barHeight = 55; // should be fine for either landscape or portrait //roughly touch within the bar area
                    var initialTouchY = endY + distance;
                    if (initialTouchY > (screenHeight - barHeight - 40)) {
                        me.__openTray()
                    }
                }
            } else if (event.direction === 'down') {
                if (vm.get('trayOpen')) {
                    var endY = event.touch.pageY;
                    var distance = event.distance;
                    var screenHeight = ABP.util.Common.getWindowHeight();
                    var trayHeight = me.tray.element.getHeight();
                    var initialTouchY = endY - distance;
                    if (initialTouchY > (screenHeight - trayHeight - 40)) {
                        me.__closeTray();
                    }
                }
            }
        }
    }
});
