/**
 * @private
 * @ignore
 * Override the initialize to add a text, icon, and/or menu to button wrapper.
 */
Ext.define('Overrides.Button', {
    override: 'Ext.Button',

    initialize: function() {
        this.__configureClassNames();
        this.callParent();
    },

    privates: {
        /**
        * @private
        * Add a class name to the button wrapper to classify as
        * a text, icon, menu, or combination of all button.
        */
        __configureClassNames: function(config) {
            var hasIcon = this.iconCls && this.iconCls.length > 0 ? true : false;
            var hasText = this.text && this.text.length > 0 ? true: false;
            var hasMenu = this.menu ? true : false;

            if (hasIcon) {
                this.addCls('icon');
            }
            if (hasText) {
                this.addCls('text');
            }

            if (hasMenu) {
                this.addCls('menu');
            }
        }
    }
});
