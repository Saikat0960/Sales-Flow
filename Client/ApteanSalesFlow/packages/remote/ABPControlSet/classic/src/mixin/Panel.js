/**
 * Classic panel mixin.
 */
Ext.define("ABPControlSet.mixin.Panel", {
    override: "ABPControlSet.base.mixin.Panel",

    updateHeaderForegroundColor: function (color) {
        var me = this;

        if (me.rendered) {
            me.updateHeaderTitleColor(color);
        } else {
            me.on('render', function () {
                me.updateHeaderTitleColor(color);
            }, me);
        }
    },

    updateHeaderBackgroundColor: function (color) {
        var me = this;

        if (me.rendered) {
            me.updateHeaderBackColor(color);
        } else {
            me.on('render', function () {
                me.updateHeaderBackColor(color);
            }, me);
        }
    },

    updateBodyBackgroundColor: function (color) {
        var me = this;

        if (me.rendered) {
            me.updateBodyBackColor(color);
        } else {
            me.on('render', function () {
                me.updateBodyBackColor(color);
            }, me);
        }
    },

    getHeaderBackgroundColor: function () {
        var me = this;
        if (me.rendered) {
            var hd = me.getHeader();
            if (hd) {
                var el = hd.el;
                if (el && el.getStyle) {
                    return el.getStyle('background-color');
                }
            }
        } else {
            // Otherwise best we can do is return the hedaerBackgroundColor's config value.
            return this._headerBackgroundColor;
        }
    },

    getHeaderForegroundColor: function () {
        var me = this;
        if (me.rendered) {
            var hd = me.getHeader();
            if (hd) {
                var ti = hd.getTitle();
                if (ti) {
                    var el = ti.el;
                    if (el && el.getStyle) {
                        return el.getStyle('color');
                    }
                }
            }
        } else {
            // Otherwise best we can do is return the hedaerBackgroundColor's config value.
            return this._headerForegroundColor;
        }
    },

    getBodyBackgroundColor: function () {
        var me = this;
        if (me.rendered) {
            var el = me.body;
            if (el && el.getStyle) {
                return el.getStyle('background-color');
            }
        } else {
            // Otherwise best we can do is return the hedaerBackgroundColor's config value.
            return this._backgroundColor;
        }
    },

    privates: {
        updateHeaderBackColor: function (color) {
            me = this;
            var hd = me.getHeader();
            if (hd) {
                var el = hd.el;
                if (el) {
                    el.setStyle('background-color', color);
                }
            }
        },

        updateHeaderTitleColor: function (color) {
            me = this;
            var hd = me.getHeader();
            if (hd) {
                var ti = hd.getTitle();
                if (ti) {
                    var el = ti.el;
                    if (el && el.setStyle) {
                        el.setStyle('color', color);
                    }
                }
            }
        },

        updateBodyBackColor: function (color) {
            me = this;
            me.setBodyStyle('background-color', color);
        }
    }

});