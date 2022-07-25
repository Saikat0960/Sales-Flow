/**
 * 
 *   Mixin for the abpseparator xtype, which is just a horizontal line.
 * 
 */
 Ext.define("ABPControlSet.base.mixin.Separator", {
    extend: "ABPControlSet.base.mixin.Component",

    // ExtJs component has minWidth and maxWidth configs, but they don't work
    // so apply after render.
    afterRender: function () {
        if (this.getWidth() > this.getMaxWidth()) {
            this.setWidth(this.getMaxWidth());
        } else if (this.getWidth() < this.getMinWidth()) {
            this.setWidth(this.getMinWidth());
        }

        // Needs margin as well as padding.
        if(this.spacing) {
            this.setMargin(this.spacing);
        }
    }
});