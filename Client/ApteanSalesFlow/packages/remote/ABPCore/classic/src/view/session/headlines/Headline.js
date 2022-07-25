/**
 * Headline component for ABP.
 */
Ext.define("ABP.view.session.headlines.Headline", {
    extend: "Ext.toolbar.Toolbar",
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
                xtype: "tbtext",
                itemId: "headlineMessage",
                cls: "scrollable-overflow",
                html: message,
                flex: 1
            },
            {
                xtype: "abpbutton",
                cls: "headline-button",
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
                role: 'button',
                ariaLabel: "Close Headline",
                automationCls: 'headline-read',
                handler: function () {
                    var headline = this.up("headline"),
                        sessionBanner = headline.up('sessionbanner');
                    headline.fireEvent("headline_read", headline);
                    sessionBanner.remove(headline);
                }
            }
        ];

        me.callParent([config]);
    },

    // Register the after layout listener so the message can be centered.
    initComponent: function () {
        this.on("afterlayout", this.onAfterLayout)
        this.callParent(arguments);
    },

    onAfterLayout: function (view) {
        // Ensure the title label is center aligned
        var headlineMessage = view.down('#headlineMessage');
        var html = headlineMessage && headlineMessage.el && headlineMessage.el ? headlineMessage.el.getHtml() : null;
        if (!html) {
            return;
        }
        var headlineWidth = headlineMessage.getWidth();
        if (headlineWidth === 0) {
            // The label has not been rendered, lets measure the text to get an approximate
            // set of dimensions.
            headlineWidth = ABP.util.Common.measureTextSingleLine(html, ABP.util.Constants.BASE_FONT).width;
        }

        var left = ((Ext.getViewportWidth() - headlineWidth) / 2);
        var x = headlineMessage.getX();
        // Only set if needed
        if (x !== left) {
            headlineMessage.setX(left);
        }
    }
});