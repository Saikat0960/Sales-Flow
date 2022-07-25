Ext.define('ABP.view.overrides.ToastOverride', {
    override: 'Ext.Toast',

    showToast: function (config) {
        var me = this,
            message = config.message,
            timeout = config.timeout,
            cls = config.cls,
            alignment = config.alignment,
            messageContainer = me.getMessage(),
            msgAnimation = me.getMessageAnimation();
        // If the toast has already been rendered and is visible on the screen
        if (config.onclick) {
            me.el.dom.onclick = config.onclick;
            me.handler = config.handler;
            me.handlerArgs = config.handlerArgs ? config.handlerArgs : null;
        } else {
            me.el.dom.onclick = null;
            me.handler = me.handlerArgs = null;
        }
        if (me.isRendered() && me.isHidden() === false) {
            messageContainer.onAfter({
                // After the hide is complete
                hiddenchange: function () {
                    // Edit: Remove color classes
                    me.removeCls('abp-toast-GRN');
                    me.removeCls('abp-toast-BLU');
                    me.removeCls('abp-toast-ORG');
                    me.removeCls('abp-toast-RED');
                    // Edit: Add passed in cls
                    me.addCls(cls);
                    me.setMessage(message);
                    me.setTimeout(timeout);
                    messageContainer.onAfter({
                        scope: me,
                        // After the show is complete
                        hiddenchange: function () {
                            me.startTimer();
                        },
                        single: true
                    });
                    messageContainer.show(msgAnimation);
                    // Edit add this show update the alignment
                    me.show({
                        animation: null,
                        alignment: {
                            component: document.body,
                            alignment: alignment,
                            options: {
                                offset: [0, 20]
                            }
                        }
                    });
                },
                scope: me,
                single: true
            });

            messageContainer.hide(msgAnimation);
        } else {
            Ext.util.InputBlocker.blockInputs();

            //if it has not been added to a container, add it to the Viewport.
            if (!me.getParent() && Ext.Viewport) {
                Ext.Viewport.add(me);
            }

            me.setMessage(message);
            me.setTimeout(timeout);
            // Edit: use our class identifier on it
            me.setCls('abp-toast');
            // Edit: Remove color classes
            me.removeCls('abp-toast-GRN');
            me.removeCls('abp-toast-BLU');
            me.removeCls('abp-toast-ORG');
            me.removeCls('abp-toast-RED');
            // Edit: Add passed in cls
            me.addCls(cls);
            me.startTimer();
            me.show({
                animation: null,
                alignment: {
                    component: document.body,
                    // Edit: use passed in alignment (was hard coded to 't-t')
                    alignment: alignment,
                    options: {
                        offset: [0, 20]
                    }
                }
            });
        }
    }
});