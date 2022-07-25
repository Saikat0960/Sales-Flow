/**
 *  Base field mixin class.
 */
Ext.define("ABPControlSet.mixin.RadioGroup", {
    override: "ABPControlSet.base.mixin.RadioGroup",
    config: {
        /**
         * @cfg {Boolean} readOnly
         *
         * `true` to prevent the user from changing the radio choice.
         */
        readOnly: null
    },

    updateReadOnly: function (readOnly) {
        var itemsCollection = this.getItems(),
            items = itemsCollection.getRange(),
            length = items.length;
        for (var i = 0; i < length; i++) {
            if (items[i].setReadOnly) {
                items[i].setReadOnly(readOnly);
            } else {
                items[i].readOnly = readOnly;
            }
        }
    },

    onStoreUpdate: function () {
        if (this.rendered) {
            this.updateRadioItems();
        } else {
            this.on('painted', this.updateRadioItems, this);
        }
    },

    updateForegroundColor: function (color) {
        var me = this;
        // For radiogroup, it is the children that are colored, but it is
        // sufficient to check if the parent container is rendered.
        if (me.rendered) {
            me.__renderedRadioGroupUpdateForegroundColor(color);
        } else {
            // Using the painted event for the Modern container is sufficient to
            // guarantee the child radiobuttons are rendered too.
            me.on("painted", function () {
                me.__renderedRadioGroupUpdateForegroundColor(color);
            }, me);
        }
    },

    __renderedRadioGroupUpdateForegroundColor: function (color) {
        var me = this;
        // For radiogroup, it is the children that are colored.
        // This can only happen once the radiogroup is rendered.
        var items = me.getItems && me.getItems().getRange ? me.getItems().getRange() : me.getItems() || [],
            length = items.length;
        var displayEls = Ext.Array.pluck(items, "iconElement");
        for (var i = 0; i < length; i++) {
            displayEls[i].setStyle("color", color);
        }
    },

    updateBackgroundColor: function (color) {
        var me = this;
        // For radiogroup, it is the children that are colored, but it is
        // sufficient to check if the parent container is rendered.
        if (me.rendered) {
            me.__renderedRagioGroupUpdateBackgroundColor(color);
        } else {
            // Using the painted event for the Modern container is sufficient to
            // guarantee the child radiobuttons are rendered too.
            me.on("painted", function () {
                me.__renderedRagioGroupUpdateBackgroundColor(color);
            }, me);
        }
    },

    __renderedRagioGroupUpdateBackgroundColor: function (color) {
        var me = this;
        // For radiogroup, it is the children that are colored.
        // This can only happen once the radiogroup is rendered.
        var items = me.getItems && me.getItems().getRange ? me.getItems().getRange() : me.getItems() || [],
            length = items.length;
        var displayEls = Ext.Array.pluck(items, "iconElement");
        for (var i = 0; i < length; i++) {
            displayEls[i].setStyle("background-color", color);
        }
    }

    // For getBackgroundColor and getForegroundColor, going to assume the value of the
    // associated config will be sufficient.
});