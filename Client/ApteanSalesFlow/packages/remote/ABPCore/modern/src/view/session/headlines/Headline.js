/**
 * Headline component for ABP.
 */
Ext.define("ABP.view.session.headlines.Headline", {
    extend: "Ext.Toolbar",
    xtype: "headline",
    cls: "session-headline",
    ui: "headline",
    layout: {
        type: 'hbox',
        pack: 'right'
    },
    constructor: function (config) {
        config = config || {};
        var me = this,
            localizedActionText = config.actionTextKey ? ABP.util.Common.geti18nString(config.actionTextKey) : null,
            actionText = localizedActionText || config.actionText,
            priority = Ext.isEmpty(config.priority) ? 0 : config.priority,
            allowAction = Ext.isEmpty(actionText) ? false : true,
            localizedMessage = config.messageKey ? ABP.util.Common.geti18nString(config.messageKey) : null,
            message = localizedMessage || config.message,
            cls = "session-headline",
            extraCls;

        switch (priority) {
            case 0:
                extraCls = "headline-info";
                break;
            case 1:
                extraCls = "headline-warning";
                break;
            case 2:
                extraCls = "headline-alert";
                break;
            default:
                extraCls = "headline-info";
        }

        config.cls = cls + " " + extraCls;
        delete config.priority;
        delete config.actionText;
        delete config.message;

        config.items = [
            {
                xtype: "component",
                itemId: "headlineMessage",
                cls: "scrollable-overflow",
                html: message,
                flex: 1
            },
            {
                xtype: "abpbutton",
                cls: "headline-button",
                automationCls: "headline-close-button",
                hidden: !allowAction,
                text: actionText,
                handler: function () {
                    var headline = this.up("headline"),
                        sessionBanner = headline.up('sessionbanner');
                    headline.fireEvent("headline_action", headline);
                    sessionBanner.remove(headline);
                }
            },
            {
                xtype: "tool",
                type: "close",
                handler: function () {
                    var headline = this.up("headline"),
                        sessionBanner = headline.up('sessionbanner');
                    headline.fireEvent("headline_read", headline);
                    sessionBanner.remove(headline);
                }
            }
        ];

        me.callParent([config]);
    }
});