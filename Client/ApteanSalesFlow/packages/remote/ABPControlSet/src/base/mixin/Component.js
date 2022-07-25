/**
 * @private
 *  Base component mixin.
 */
Ext.define("ABPControlSet.base.mixin.Component", {
    extend: "Ext.Mixin",
    requires: [
        "ABPControlSet.base.view.contextmenu.plugin.ContextMenu"
    ],

    config: {
        /**
         * @cfg {Boolean} contextMenu
         *
         * If true, the context menu will be initialized for this control and the related events will be fired.
         */

        /**
         * @cfg {Number/String} responsiveWidth
         *
         * This will be used in the responsive layout algorithm and taken into consideration when sizing the item in the layout.
         *
         *  - Only valid if the control is a child of a container which uses the {@link ABPControlSet.layout.CSSGrid CSSGrid} layout __with {@link ABPControlSet.layout.CSSGrid#responsive responsive} set to true__.
         */
        responsiveWidth: null,

        /**
         * @cfg {Boolean} fixedWidth
         *
         * Used in conjunction with the {@link #responsiveWidth} property. If true, the layout will keep this item at the set {@link #responsiveWidth} and not grow or shrink if possible.
         *
         *  - Only valid if the control is a child of a container which uses the {@link ABPControlSet.layout.CSSGrid CSSGrid} layout __with {@link ABPControlSet.layout.CSSGrid#responsive responsive} set to true__.
         */

        /**
         * @cfg {Number/String} responsiveMinWidth
         *
         * This will be used in the responsive layout algorithm and taken into consideration when sizing the item in the layout; helping determine the minimum width this item can be sized to.
         *
         *  - Only valid if the control is a child of a container which uses the {@link ABPControlSet.layout.CSSGrid CSSGrid} layout __with {@link ABPControlSet.layout.CSSGrid#responsive responsive} set to true__.
         */

        /**
         * @cfg {Number} responsiveCol
         *
         * The column at which this item resides in the css grid.
         *
         *  - Only valid if the control is a child of a container which uses the {@link ABPControlSet.layout.CSSGrid CSSGrid} layout.
         */

        /**
         * @cfg {Number} responsiveColSpan
         *
         * The column span for this item in the css grid.
         *
         * If {@link ABPControlSet.layout.CSSGrid#responsive} is set to true, this column span number is used to determine how much space is allocated for the item if {@link #responsiveWidth}'s are not used.
         *
         *  - Only valid if the control is a child of a container which uses the {@link ABPControlSet.layout.CSSGrid CSSGrid} layout.
         */

        /**
         * @cfg {Number} responsiveRow
         *
         * The row at which this item resides in the css grid.
         *
         *  - Only valid if the control is a child of a container which uses the {@link ABPControlSet.layout.CSSGrid CSSGrid} layout.
         */

        /**
         * @cfg {Number} responsiveRowSpan
         *
         * The row span for this item in the css grid.
         *
         *  - Only valid if the control is a child of a container which uses the {@link ABPControlSet.layout.CSSGrid CSSGrid} layout.
         */

        /**
         * @cfg {String} backgroundColor
         *
         * A valid color value in css to set as the background color.
         */
        backgroundColor: null,
        /**
         * @cfg {String} foregroundColor
         *
         * A valid color value in css to set as the foreground color.
         */
        foregroundColor: null
    },

    mixinConfig: {
        id: 'abpcomponent'
    },

    /**
     * @event contextmenuitemclick ABPControlSet.common.types.Events.ContextMenuItemClick
     *
     * Fires whenever an item in the context menu is clicked.
     *
     *     eventHandler: function (currentCmp, currentContext, item) {
     *          var store = currentCmp.getStore();
     *          store.remove(currentContext.record);
     *      }
     *
     * @param {Ext.Component} cmp The component which this context menu what shown for.
     * @param {Object} context Any extra contextual information the event might provide.
     * @param {Ext.data.Model} item The record of the item clicked.
     *
     */

    /**
     * @event contextmenu ABPControlSet.common.types.Events.ContextMenu
     *
     * Fires whenever the context menu is to be shown.
     *
     *     onContextShow: function (root, cmp, context, el, event) {
     *          // Listener for a grid.
     *          if (context && context.record) {
     *              root.appendChild([
     *                   {
     *                       text: 'Delete Row',
     *                       leaf: true,
     *                       handler: function (currentCmp, currentContext, item) {
     *                           var store = currentCmp.getStore();
     *                           store.remove(currentContext.record);
     *                       }
     *                   }
     *               ]);
     *          }
     *      }
     *
     * @param {Object} root The root node of an Ext.data.TreeStore. This can have its child items updated.
     * @param {Ext.Component} cmp The component which this context menu is fired for.
     * @param {Object} context Any extra contextual information the event might provide.
     * @param {Ext.dom.Element} element The element where the event originated.
     * @param {Ext.event.Event} event The original event.
     *
     */

    constructor: function (config) {
        config = config || {};
        // Add the context menu plugin.
        if (config.contextMenu) {
            this.addCSPlugin(config, "abpcontextmenu");
        }
        this.callParent([config]);
    },

    getContextMenuData: Ext.emptyFn,

    addCSPlugin: function (config, pluginType) {
        if (config) {
            config.plugins = config.plugins || {};
            if (Ext.isObject(config.plugins) && !config.plugins[pluginType]) {
                config.plugins[pluginType] = pluginType;
            } else if (Ext.isArray(config.plugins) && !config.plugins.indexOf(pluginType) > -1) {
                config.plugins.push(pluginType);
            }
        }
    },

    removeCSPlugin: function (config, pluginType) {
        if (config) {
            if (Ext.isObject(config.plugins) && config.plugins[pluginType]) {
                delete config.plugins[pluginType];
            } else if (Ext.isArray(config.plugins) && config.plugins.indexOf(pluginType) > -1) {
                config.plugins = Ext.Array.remove(config.plugins, pluginType);
            }
        }
    },

    /*
    * Background and foreground color setting/getting.
    * This describes the algorithm used, which is spread out
    * over the base, Classic and Modern mixins.
    *
    * Setting
    * =======
    * Firstly, calling setForegroundColor or setBackgroundColor (or providing the equivalent
    * config) will end up calling updateForegroundColor or updateBackgroundColor. Then
    * finally the color will be stored to the config's private variable by ExtJS.
    *
    * Inside updateForegroundColor and updateBackgroundColor, if the component is rendered then
    * 1. Setting the color is just a case calling the component's setStyle method.
    * 2. But fields are more complex because we want to color their input element
    *    (we don't want to color the field label, for instance).
    *    The Classic and Modern input elements are named differently,
    *    which is why the base field mixin wants the Classic and Modern overrides to
    *    implement a helper function getInputElement.
    *    This input element's setStyle is called.
    * 3. If the component is more complex than a simple field, like a checkbox, then
    *    the type's specific mixin gets an element special to the type
    *    and calls it's setStyle.
    *
    * If the component is not rendered then:
    * 1. In Classic components have a hidden protoEl property that provides element-like data prior to rendering.
    *    If that exists then its setStyle is called. Later when the component is rendered then it will use
    *    that style on the component.
    * 2. But fields are more complex. They have an input element that is a child of the main component's element.
    *    It is this input element that needs to have its color set. That is, we don't want the field label colored.
    *    Classic fields, have a config fieldStyle. This can be used to store the color styles needed when
    *    its input element is rendered.
    *    There is not the equivalentr "fieldStyle" for Modern fields, so the Modern field mixin uses the painted
    *    event to wait until rendering before calling setStyle on the input element.
    * 3. If the component is more complex than a simple field, like a checkbox, then
    *    the type's specific mixin waits for the main element to be rendered (Classic) or painted (Modern)
    *    and then gets an element special to the type and calls it's setStyle.
    *
    * Properties used in the algorithm:
    * style - Classic and Moderm. This is applied to the whole component when rendered.
    * fieldstyle - Classic only. This is applied to the whole component when rendered.
    *              Using the fieldStyle property directly is dirty - it is not a published property.
    *              But it is the best way to assign a series of styles to the unrendered Classic field.
    *              setFieldStyle is public, but it only supports setting all the styles at once.
    * protoEl - Classic only. Hidden ExtJS object property that provides element-like data prior to rendering.
    *           See Ext.util.ProtoElement. protoEl is destoyed once the component is rendered.
    *           Using this property is dirty - it is not a published property.
    *
    * Getting
    * =======
    * In theory, since the color config getter is always going to store the set color in the config's private variable,
    * then the default config getter will return that value.
    * But that misses the case where some code uses setStyle on the colored element directly, and does not set
    * using the ABPControlSet foregroundColor and backgroundColor.
    *
    * The basic approach is to follow the same logic as the setters, remembering that the factors are
    * rendered or not, Classic or Modern, simple component or field or special case.
    */

    updateBackgroundColor: function (color) {
        var me = this;
        var el = Ext.isClassic ? (me.el && me.rendered ? me.el : me.protoEl) : (me.element ? me.element : null); // el == Classic; elememnt == Modern; protoEl == Classic.
        if (el) {
            // Using the formula above, there should be an el
            // if using Classic (which supports protoEl) or
            // if using Modern and is rendered.
            el.setStyle("background-color", color);
        } else {
            // Otherwise store the background color in Ext.Component.style property.
            // This will get used later by ExtJS when the element is created.
            // style is available in Classic and Modern.
            me.style = me.style || {};
            me.style.backgroundColor = color;
        }
        // setBackgroundColor will store the color in the config's private variable.
    },

    updateForegroundColor: function (color) {
        var me = this;
        var el = Ext.isClassic ? (me.el && me.rendered ? me.el : me.protoEl) : (me.element ? me.element : null); // el == Classic; elememnt == Modern; protoEl == Classic.
        if (el) {
            // Using the formula above, there should be an el
            // if using Classic (which supports protoEl) or
            // if using Modern and is rendered.
            el.setStyle("color", color);
        } else {
            // Otherwise store the color in Ext.Component.style property.
            // This will get used later by ExtJS when the element is created.
            // style is available in Classic and Modern.
            me.style = me.style || {};
            me.style.color = color;
        }
        // setBackgroundColor will store the color in the config's private variable.
    },

    getBackgroundColor: function () {
        var me = this;
        var el = Ext.isClassic ? (me.el && me.rendered ? me.el : me.protoEl) : (me.element ? me.element : null); // el == Classic; elememnt == Modern; protoEl == Classic.
        if (el) {
            // There should be an el, using the formula above.
            // Either a rendered el or a not-yet-rendered protoEl.
            return el.getStyle("background-color");
        } else {
            // Fallback if no el.
            // style is available in Classic and Modern.
            if (Ext.isObject(me.style)) {
                return me.style.backgroundColor;
            } else {
                // Otherwise best we can do is return the backgroundColor's config value.
                return me.callParent();
            }
        }
    },

    getForegroundColor: function () {
        var me = this;
        var el = Ext.isClassic ? (me.el && me.rendered ? me.el : me.protoEl) : (me.element ? me.element : null); // el == Classic; elememnt == Modern; protoEl == Classic.
        if (el) {
            // There should be an el, using the formula above.
            // Either a rendered el or a not-yet-rendered protoEl.
            return el.getStyle("color");
        } else {
            // Fallback if no el.
            // style is available in Classic and Modern.
            if (Ext.isObject(me.style)) {
                return me.style.color;
            } else {
                // Otherwise best we can do is return the forewgroundColor's config value.
                return me.callParent();
            }
        }
    },

    __flushValueViewModel: function () {
        var me = this,
            bind = me.bind || {},
            valueBind = bind['value'],
            valueViewModel = valueBind ? valueBind.owner : null;
        if (valueViewModel) {
            valueViewModel.notify();
        }
    },

    /**
     * Sets the responsive width of this component. Will only result in layout changes if this component is a direct child of a CSS Grid layout.
     */
    updateResponsiveWidth: function (responsiveWidth) {
        this.responsiveWidth = responsiveWidth;
        if (this.rendered) {
            if (this.updateLayout) {
                // Update the layout so the layout can read and use the new responsiveWidth.
                this.updateLayout();
            } else {
                // Force an update of the width to ensure the responsiveWidth update is processed.
                this.setWidth(this.getWidth());
            }
        }
    },

    /**
     * @private
     * Automation API to set the value of the field programatically while still firing the user changed event.
     */
    userSetValue: function (value) {
        var me = this,
            focusValue = !Ext.isEmpty(me.focusValue) ? me.focusValue : Ext.isFunction(me.getValue) ? me.getValue() : me.value;
        if (Ext.isFunction(this.setValue)) {
            if ((Ext.isFunction(me.isEqual) && !me.isEqual(value, focusValue)) || value !== focusValue) {
                me.focusValue = focusValue;
                // Set the value.
                me.setValue(value);
            }
        }
    }
});