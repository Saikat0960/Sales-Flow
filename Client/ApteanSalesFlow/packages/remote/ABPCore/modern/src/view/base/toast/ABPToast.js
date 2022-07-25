/**
 * Toast popup used to display standard messages to the user before auto hiding.
 *
 * for example:
 *
 *      ABP.view.base.toast.ABPToast.show('Hello world!');
 *
 *      ABP.view.base.toast.ABPToast.show({
 *          message: 'Hello world!'
 *          level: 3,
 *          icon: 'icon-hand'
 *      });
 *
 * or shorthand:
 *
 *      ABP.toast("Hello World");
 *
 */
Ext.define('ABP.view.base.toast.ABPToast', {
    extend: 'ABP.view.base.toast.ToastBase',

    requires: [
        'Ext.Toast',
        'ABPControlSet.util.Markdown'
    ],
    singleton: true,

    modernAlignmentEnum: {
        'b': 'b-b',
        'br': 'br',
        'bl': 'bl',
        't': 't-t',
        'tr': 'tr',
        'tl': 'tl',
        'l': 'l-l',
        'r': 'r-r'
    },

    /**
    * Show an information popup message to the user
    * @param {String/Object} [config] The message to show to the user, or the toast configuration
    * @param {String} [config.level] The severity level of the toast that indicates the color of the border*
    *
    *   - `Valid levels:`
    *       - `BLU / 0 / Info` - (default) vivid blue border
    *       - `GRN / 1 / Success` - green border
    *       - `ORG / 2 / Warning` - orange border
    *       - `RED / 3 / Alert` - red border
    * @param {String} [config.iconCls] the icon to use on the left side of the toast
    *
    *   - `Defaults:` (based off level)
    *       - `0` - 'icon-information'
    *       - `1` - 'icon-check'
    *       - `2` - 'icon-sign-warning'
    *       - `3` - 'icon-about'
    * @param {String} [config.placement] where the toast should be displayed on-screen
    *
    *   - `Possible values:`
    *       - `b`  - (default) bottom
    *       - `br` - bottom-right
    *       - `bl` - bottom-left
    *       - `t`  - top
    *       - `tr` - top-right
    *       - `tl` - top-left
    *       - `l`  - left  (not recomended but included due to sencha support)
    *       - `r`  - right (not recomended but included due to sencha support)
    * @param {Function} [config.handler] (optional) a click handler function for the toast.
    *
    *      Example usage:
    *       ABP.view.base.toast.ABPToast.show({
    *           message: 'Hello world!'
    *           level: 3,
    *           icon: 'icon-hand',
    *           placement: 'b',
    *           handler: function() {
    *               alert("Toast has been clicked");
    *           }
    *       });
    *
    * @param {Array/String} [config.handlerArgs] (optional) arguments/additional details to pass with an event or to be used as arguments when invoking the handler function
    *
    *      Example toast handling:
    *       // ABPToast handling a function with handlerArgs:
    *           toast.handler(toast.handlerArgs);
    *
    * @param {Boolean} [config.isMarkdown=false] (optional) boolean determining if toast should render with markdown formatting
    *
    */

    show: function (message, level, iconCls, placement, handler, handlerArgs, isMarkdown) {
        var me = this;
        var config = me.getParamConfig(message, level, iconCls, placement, handler, handlerArgs, isMarkdown);

        if (Ext.isString(config.placement)) {
            config.placement = me.modernAlignmentEnum[config.placement];
        }

        var levelMap = me.getLevel(config.level);
        var ariaLive = me.ariaLiveMapping[levelMap];

        var onclick = config.handler ? me.handleClick : null;

        var toast = Ext.toast({
            ariaRole: 'alert',
            ariaAttributes: {
                'aria-live': ariaLive,
            },
            message: me.makeHtml(config),
            timeout: config.duration,
            alignment: config.placement,
            shadow: true,
            onclick: onclick,
            handler: config.handler,
            handlerArgs: config.handlerArgs,
            cls: ['abp-toast', 'abp-toast-' + levelMap]
        });

        return toast;
    },

    privates: {
        makeHtml: function (config) {
            var messageText = config.isMarkdown ? ABPControlSet.util.Markdown.parseMarkdown(config.message) : Ext.htmlEncode(config.message);

            var ret = "<div style='display: flex;' class='abp-toast-inner-" + this.getLevel(config.level) + "'>" +
                "<div class='abp-toast-icon-block " + Ext.htmlEncode(config.iconCls) + "'></div>" +
                "<div class='abp-toast-message'>" + messageText + "</div>" +
                "</div>";
            return ret;
        }
    }
},

    function (ABPToast) {
        ABP.toast = function (message, level, iconCls, placement, handler, handlerArgs, isMarkdown) {
            return ABP.view.base.toast.ABPToast.show(message, level, iconCls, placement, handler, handlerArgs, isMarkdown);
        };
    });
