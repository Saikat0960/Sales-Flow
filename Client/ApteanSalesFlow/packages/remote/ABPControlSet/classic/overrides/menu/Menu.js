/**
 * @private
 * @ignore
 * Override the beforeRender to add a no-icon class if no icon.
 */
Ext.define('Overrides.menu.Menu', {
    override: 'Ext.menu.Menu',

    beforeRender: function () {
        this.callParent(arguments);
        this.__addIconClass();
    },

    privates: {
        /**
         * @private
         * Loop over menu items.  If none of them have an icon, add a "no-icons" class to the menu.
         */
        __addIconClass: function () {
            var hasIcons = false,
                items = this.items.items,
                i = 0,
                l = items.length;

            for (i; i < l; i++) {
                var item = items[i];
                if (item.iconCls || item.hasOwnProperty('checked')) {
                    hasIcons = true;
                    i = l;
                }
            }

            if (!hasIcons) {
                this.addCls('no-icons');
            }
        }
    }
});