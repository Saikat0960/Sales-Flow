Ext.define('ABP.view.overrides.DefaultLayoutOverride', {
    override: 'Ext.layout.Auto',

    removeBodyItem: function (item) {

        item.setZIndex(null);
        if (item.element) {
            item.element.detach();
        }
    },

    onItemFloatingChange: function (item, floating) {

        if (floating && item.element) {
            this.insertBodyItem(item);
        } else {
            this.removeBodyItem(item);
        }
    }
});