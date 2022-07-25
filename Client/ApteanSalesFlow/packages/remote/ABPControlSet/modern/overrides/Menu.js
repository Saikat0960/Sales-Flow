/**
 * @private
 * @ignore
 * Override the initialize to add a no-icon class if no icon.
 */
Ext.define('Overrides.menu.Menu', {
    override: 'Ext.menu.Menu',

    initialize: function () {
        this.callParent();
        this.mon(this, 'show', this.__addIconClass);
    },

    privates: {
        /**
         * @private
         * Loop over menu items.  If none of them have an icon, add a "no-icons" class to the menu.
         */
        __addIconClass: function () {
            var hasIcons = false,
                items = this.getInnerItems(),
                i = 0,
                l = items.length;

            for (i; i < l; i++) {
                var item = items[i];
                if ((item.baseCls === "x-menuitem" && item.getIconCls()) || (item.baseCls === "x-menucheckitem" && item.hasOwnProperty('checkboxElement'))) {
                    i = l;
                    hasIcons = true;
                }
            }

            if (!hasIcons) {
                this.addCls('no-icons');
            }
        }
    }
});