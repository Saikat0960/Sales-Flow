Ext.define("ABPControlSet.mixin.CardContainer", {
    override: "ABPControlSet.base.mixin.CardContainer",

    destroyNewer: function (currentIndex) {
        var me = this,
            itemCollection = me.items,
            item;
        // Modern overrides this method to account for the opposite order of the item collection.
        for (var i = itemCollection.length; i > currentIndex; i--) {
            item = itemCollection.getAt(i);
            if (item) {
                me.remove(item, {
                    destroy: true
                });
            }
        }
    }
});