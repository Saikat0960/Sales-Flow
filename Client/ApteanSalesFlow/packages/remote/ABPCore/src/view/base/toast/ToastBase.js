/**
 * Toast popup used to display standard messages to the user before auto hiding.
 *
 * for example:
 *
 *      ABP.view.base.toast.ABPToast.show('Hello world!');
 *
 */
Ext.define('ABP.view.base.toast.ToastBase', {
    requires: [
        "ABPControlSet.util.Markdown"
    ],
    levelEnum: {
        "BLU": 0,
        "GRN": 1,
        "ORG": 2,
        "RED": 3,
        0: "BLU",
        1: "GRN",
        2: "ORG",
        3: "RED",
        'Alert': 3,
        'Warning': 2,
        'Success': 1,
        'Info': 0
    },
    ariaLiveMapping: {
        "BLU": 'polite',
        "GRN": 'polite',
        "ORG": 'polite',
        "RED": 'assertive',
    },
    defaultIconEnum: {
        0: "icon-information",
        1: "icon-check",
        2: "icon-sign-warning",
        3: "icon-about"
    },

    defaultIcons: {
        BLU: "icon-information",
        GRN: "icon-hand-thumb-up",
        ORG: "icon-sign-warning",
        RED: "icon-alert",
    },

    privates: {
        getParamConfig: function (message, level, iconCls, placement, handler, handlerArgs, isMarkdown) {
            var me = this;
            var config = message;
            if (Ext.isString(message)) {
                config = {
                    message: message.trim()
                };
                if (level) {
                    config.level = level;
                }
                if (iconCls) {
                    config.iconCls = iconCls;
                }
                if (placement) {
                    config.placement = placement;
                }
                if (handler) {
                    config.handler = handler;
                } else {
                    config.handler = null;
                }
                if (handlerArgs) {
                    config.handlerArgs = handlerArgs;
                } else {
                    config.handlerArgs = null;
                }
                if (isMarkdown) {
                    config.isMarkdown = isMarkdown
                } else {
                    config.isMarkdown = false;
                }
            }

            // Apply any missing defaults
            config = Ext.applyIf(config, {
                message: 'not set!',
                level: 0,
                placement: 'b',
                icon: true,
                iconCls: 'icon-information',
                duration: me.getDefaultDuration(config.message),
                isMarkdown: false
            });

            if (!config.iconCls) {
                config.iconCls = me.defaultIconEnum[level];
            }

            return config;
        },

        getLevel: function (level) {
            var me = this;
            // convert the string into a number
            if (Ext.isString(level)) {
                level = me.levelEnum[level];
            }

            // get the class postfix from the number
            if (Ext.isNumeric(level)) {
                level = me.levelEnum[level];
            }

            if (!level) {
                return me.levelEnum[0]; // Default to info / blue
            }

            return level;
        },

        makeHtml: function (config) {
            var messageText = config.isMarkdown ? ABPControlSet.util.Markdown.parseMarkdown(config.message) : Ext.htmlEncode(config.message);

            var ret = "<div style='display: flex;' class='abp-toast-inner-" + this.getLevel(config.level) + "'>" +
                "<div class='abp-toast-icon-block " + Ext.htmlEncode(config.iconCls) + "'></div>" +
                "<div class='abp-toast-message'>" + messageText + "</div>" +
                "</div>";
            return ret;
        },

        /**
         * Ensure the use has enough time to read the notification message.
         * Start with a minimum of 3 seconds and add 60 ms for each character.
         */
        getDefaultDuration: function (message) {
            return 3000 + (message.length * 60);
        },

        handleClick: function () {
            var me = Ext.getCmp(this.id);
            if (Ext.isFunction(me.handler)) {
                me.handler(me.handlerArgs);
            }
        }
    }
},

    function (Toast) {
        ABP.toast = function (message, level, iconCls, placement, handler, handlerArgs, isMarkdown) {
            return ABP.view.base.toast.ABPToast.show(message, level, iconCls, placement, handler, handlerArgs, isMarkdown);
        };
    });
