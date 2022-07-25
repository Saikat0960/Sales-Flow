Ext.define('ABP.view.session.thumbbar.ThumbbarTrayController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.thumbbartray',


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

    __triggerClick: function () {
        //fire Event for Thumbbar
        this.fireEvent('thumbbar_trayTriggerClick');
    },

    __addBarButtons: function (buttons) {
        var view = this.getView();
        var buttonBar = view.down('#abpThumbbarTrayBar');
        if (buttonBar) {
            buttonBar.add(buttons);
        }
    },

    __addTrayButtons: function (buttons, rowLength) {
        var view = this.getView();
        var tray = view.down('#abpThumbbarTrayBottom');
        var rowCounter = 1;
        var currentRow = {
            xtype: 'container',
            cls: 'abp-thumbbar-lower-tray-row',
            width: '100%',
            height: 55,
            layout: {
                type: 'hbox',
                pack: 'space-around'
            },
            defaults: {
                xtype: 'button'
            }
        };
        if (tray) {
            for (var i = 0; i < buttons.length; i) {
                currentRow.items = [];
                var enoughForFullRow = i + rowLength;
                if (enoughForFullRow <= buttons.length) {
                    for (var buttonItter = 0; buttonItter < rowLength; ++buttonItter) {
                        currentRow.items.push(buttons[i]);
                        ++i;
                    }
                    tray.add(currentRow);
                    rowCounter++;
                } else {
                    var loopLength = i !== 0 ? buttons.length%rowLength : buttons.length;
                    var difference = rowLength - loopLength;
                    for (var buttonItter = 0; buttonItter < loopLength; ++buttonItter) {
                        currentRow.items.push(buttons[i]);
                        ++i;
                    }
                    currentRow.items.push({flex: difference});
                    tray.add(currentRow);
                    rowCounter++;
                } 
            }
            view.addCls('thumbbartray-rows-'+rowCounter);
        }

    },

    __clear: function () {
        var view = this.getView();
        var buttonBar = view.down('#abpThumbbarTrayBar');
        var tray = view.down('#abpThumbbarTrayBottom');
        if (buttonBar) {
            buttonBar.removeAll(true,true);
        }
        if (tray) {
            tray.removeAll(true,true);
        }
        view.removeCls('thumbbartray-rows-1');
        view.removeCls('thumbbartray-rows-2');
        view.removeCls('thumbbartray-rows-3');
    },

    __openTray: function (portrait) {
        var view = this.getView();
        var trigger = view.down('#closeTrayButton');
        if (portrait) {
            //show at thumbbar height then animate up to full
            var task = new Ext.util.DelayedTask(this.__portraitAfterShow, this);
            view.addCls('preopen');
            view.show();
            // delay slightly to allow the tray to show over the thumbbar before transitioning upwards 
            task.delay(50);
        } else {
            //animate up to full
            view.addCls('tray-open');            
        }
        if (trigger) {
            trigger.setIconCls('icon-navigate-down');
        }
    },

    __portraitAfterShow: function () {
        var view = this.getView();
        view.addCls('tray-open');
        view.removeCls('preopen');
    },

    __closeTray: function (portrait) {
        var view = this.getView();
        var trigger = view.down('#closeTrayButton');
        if (portrait) {
            //show at thumbbar height then animate up to full
            var task = new Ext.util.DelayedTask(this.__portraitAfterClose, this);
            view.addCls('preopen');
            view.removeCls('tray-open'); 
            task.delay(250);
        } else {
            //animate up to full
            view.removeCls('tray-open');
        }
        
        if (trigger) {
            trigger.setIconCls('icon-navigate-up');
        }
    },

    __portraitAfterClose: function () {
        var view = this.getView();
        this.fireEvent('thumbbar_post_tray_close');
        view.hide();
        view.removeCls('preopen');
    }
});