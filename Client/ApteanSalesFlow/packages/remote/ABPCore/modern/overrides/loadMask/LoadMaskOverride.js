Ext.define("Overrides.LoadMask", {
    override: "Ext.LoadMask",

    type: 3,
    extraMask: null,

    config: {
        extraMask: null
    },

    updateExtraMask: function (extraMask) {
        if (this.extraMaskEl) {
            this.extraMaskEl.setHtml(extraMask);
        }
    },

    getTemplate: function () {
        var prefix = Ext.baseCSSPrefix;
        return [
            {
                //it needs an inner so it can be centered within the mask, and have a background
                reference: 'innerElement',
                cls: prefix + 'mask-inner',
                children: [
                    {
                        reference: 'extraMaskEl',
                        cls: prefix + 'mask-extra'
                    },
                    //the element used to display the {@link #message}
                    {
                        reference: 'messageElement'
                    }
                ]
            }
        ];
    },

    constructor: function (config) {
        config = config || {};
        config.type = config.type || this.type;
        config.cls = config.cls || '';
        config.cls += " x-mask abp-loadmask";
        config.message = Ext.String.htmlEncode(config.message) || '';

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
        this.callParent([config]);
    }
});
