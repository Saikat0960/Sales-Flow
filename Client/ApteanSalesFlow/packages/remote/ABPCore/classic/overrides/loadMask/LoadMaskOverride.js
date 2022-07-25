Ext.define("ABP.overrides.loadMask.LoadMask", {
    override: "Ext.LoadMask",

    type: 3,
    msg: '',

    renderTpl: [
        '<div id="{id}-msgWrapEl" data-ref="msgWrapEl" class="{[values.$comp.msgWrapCls]}" role="presentation">',
        '<div id="{id}-msgEl" data-ref="msgEl" class="{[values.$comp.msgCls]} ',
        Ext.baseCSSPrefix, 'mask-msg-inner {childElCls}" role="presentation">',

        '<tpl if="[values.$comp.extraMask]">',
        '<div id="{id}-extraEl" data-ref="extraEl" class="' + Ext.baseCSSPrefix + 'mask-extra" role="presentation">',
        '{[values.$comp.extraMask]}',
        '</div>',
        '</tpl>',

        '<tpl if="[values.$comp.msg]">',
        '<div id="{id}-msgTextEl" data-ref="msgTextEl" class="' + Ext.baseCSSPrefix + 'mask-msg-text {childElCls}" role="presentation">',
        '{msg}',
        '</div>',
        '</tpl>',
        '</div>',
        '</div>'
    ],

    constructor: function (config) {
        config = config || {};
        var msg = '';
        config.type = config.type || this.type;
        config.cls = config.cls || "";
        config.cls += " x-mask abp-loadmask";
        // Set msg manually, there is no setMsg function.
        // TODO: Decide functionality for the label
        //config.msg = config.msg || this.lookupViewModel().data.i18n.loading_mask_message;
        if (this.lookupViewModel()) {
            msg = this.lookupViewModel().data.i18n.loading_mask_message;
        }
        this.msg = Ext.String.htmlEncode(config.msg) || Ext.String.htmlEncode(msg);

        switch (config.type) {
            // Blue and white Spinner
            case 1:
                config.cls += " abp-spinner";
                config.extraMask = '<div class="abp-spinner-el"></div>';
                break;
            // Circles.
            case 2:
                config.cls += " loading-circles";
                config.extraMask = '<div class="circle"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>';
                break;
            // Bouncing Loading Bars |||||
            case 3:
                config.cls += " loading-bars";
                config.extraMask = '<div class="bars"> <div class="rect1"></div> <div class="rect2"></div> <div class="rect3"></div> <div class="rect4"></div> <div class="rect5"></div> </div>';
                break;
            default:
                break;
        }
        config.listeners = config.listeners || {};

        this.callParent([config]);
    }
});
