Ext.define('ABP.view.buttons.BadgeButton', {
    extend: 'Ext.button.Button',
    xtype: 'abpbadgebutton',

    config: {
        badgeValue: null,
        badgePriority: ABP.util.Constants.badgePriority.Info
    },
    __delayedTaskUpdateBadge: null,

    /*
    * Extended Methods and Properties.
    */
    // Specific the badgeEl to the childEls array.
    childEls: [
        'badgeEl'
    ],

    // listeners: {
    //     iconchange: function(me, oldvalue, newValue){
    //     },

    //     error: {
    //         element: 'btnIconEl',
    //         fn: function(){
    //             // Handle the image file not existing on the server
    //         }
    //     }
    // },

    // Adjust the temaplte arg values with the badge values needed for the renderTpl.
    getTemplateArgs: function () {
        var values = this.callParent(arguments);
        var me = this,
            badgeData = me.getBadgeData();

        // Setup render data for the badge if this toolbar item has one.
        Ext.apply(values, badgeData);

        // Call Parent.
        return values;
    },

    getBadgeData: function () {
        var me = this;
        return {
            badgeValue: me.getBadgeValue(),
            badgePriority: me.getBadgePriority(),
        };
    },

    /*
    * Overridden Methods and Properties.
    */
    renderTpl:
        '<span id="{id}-btnWrap" data-ref="btnWrap" role="presentation" unselectable="on" style="{btnWrapStyle}" ' +
        'class="{btnWrapCls} {btnWrapCls}-{ui} {splitCls}{childElCls}">' +
        '<span id="{id}-btnEl" data-ref="btnEl" role="presentation" unselectable="on" style="{btnElStyle}" ' +
        'class="{btnCls} {btnCls}-{ui} {textCls} {noTextCls} {hasIconCls} ' +
        '{iconAlignCls} {textAlignCls} {btnElAutoHeightCls}{childElCls}">' +

        /* Additional Span for the Badge */
        '<span id="{id}-badgeEl" data-ref="badgeEl" class="abp-badge"' +
        'style="<tpl if="Ext.isEmpty(badgeValue)">display: none;</tpl><tpl if="badgePriority != undefined">background-color: {badgePriority};</tpl>">' +
        '{badgeValue}' +
        '</span>' +

        '<tpl if="iconBeforeText">{[values.$comp.renderIcon(values)]}</tpl>' +
        '<span id="{id}-btnInnerEl" data-ref="btnInnerEl" unselectable="on" ' +
        'class="{innerCls} {innerCls}-{ui}{childElCls}">{text}</span>' +
        '<tpl if="!iconBeforeText">{[values.$comp.renderIcon(values)]}</tpl>' +
        '</span>' +
        '</span>' +
        '{[values.$comp.getAfterMarkup ? values.$comp.getAfterMarkup(values) : ""]}' +
        // if "closable" (tab) add a close element icon
        '<tpl if="closable">' +
        '<span id="{id}-closeEl" data-ref="closeEl" class="{baseCls}-close-btn">' +
        '<tpl if="closeText">' +
        ' {closeText}' +
        '</tpl>' +
        '</span>' +
        '</tpl>' +
        // Split buttons have additional tab stop for the arrow element
        '<tpl if="split">' +
        '<span id="{id}-arrowEl" class="{arrowElCls}" data-ref="arrowEl" ' +
        'role="button" hidefocus="on" unselectable="on"' +
        '<tpl if="tabIndex != null"> tabindex="{tabIndex}"</tpl>' +
        '<tpl foreach="arrowElAttributes"> {$}="{.}"</tpl>' +
        ' style="{arrowElStyle}"' +
        '>{arrowElText}</span>' +
        '</tpl>',

    updateBadgeValue: function (value, oldValue) {
        var animate = false; value > oldValue
        if (Ext.isNumber(value)) {
            value = parseInt(value);
            if (value < 0) {
                return;
            }
            this.badgeValue = value;

            animate = (value > oldValue);
        }
        else {
            this.badgeValue = null;
        }
        this.updateBadge(animate);
    },

    updateBadgePriority: function (color, oldColor) {
        var animate = oldColor && (color != oldColor);
        this.updateBadge(animate);
    },

    updateBadge: function (animate) {
        var me = this;
        me.removeCls('animate-notify');
        me.removeCls('animate-spin');
        me.removeCls('animate-grow');

        // Create new delayed task if it does not already exist.
        if (Ext.isEmpty(me.__delayedTaskUpdateBadge)) {
            me.__delayedTaskUpdateBadge = new Ext.util.DelayedTask(
                me.doUpdateBadge,
                me,
                [animate]);
        }
        // Combine multiple update requests with a delayed task.
        me.__delayedTaskUpdateBadge.delay(100, null, null, [animate]); // 100 ms delay.
    },

    incrementBadge: function (number) {
        var me = this;
        var badgeValue = me.getBadgeValue();
        if (badgeValue == null && !number) {
            me.setBadgeValue(1);
        }
        if (Ext.isNumber(number)) {
            // Make sure number is an integer.
            number = parseInt(number);
            if (number < 0) {
                return;
            }
            me.setBadgeValue(badgeValue + number);
        }
        else {
            me.setBadgeValue(++badgeValue);
        }
    },

    decrementBadge: function (number) {
        var me = this;
        var badgeValue = me.getBadgeValue();
        if (badgeValue == null) {
            return;
        }
        if (Ext.isNumber(number)) {
            number = parseInt(number);
            if (number < 0) {
                return;
            }
            else if (number >= badgeValue) {
                me.setBadgeValue(null);
            }
            else {
                me.setBadgeValue(badgeValue - number);
            }
        }
        else {
            if (badgeValue === 1) {
                me.setBadgeValue(null)
            } else {
                me.setBadgeValue(--badgeValue);
            }
        }
    },

    clearBadge: function () {
        var me = this;
        me.setBadgeValue(null);
    },

    doUpdateBadge: function (animate) {
        var me = this;
        // Since we are on a delayed task of 100ms, all color and text values will be updated to their properties since the updates have finished with the delay.
        // Update the badge text, color, and cls.
        var badgeData = me.getBadgeData(),
            badgeEl = me.badgeEl,
            badgeDom = badgeEl ? badgeEl.dom : null;

        // There is no badge, do not try to update.
        if (!badgeDom || Ext.isEmpty(badgeDom)) {
            return;
        }

        if (animate === true) {
            me.addCls('animate-notify');
        }
        else if (animate) {
            me.addCls('animate-' + animate);
        }

        if (!Ext.isNumber(badgeData.badgeValue)) {
            badgeData.badgeValue = parseInt(badgeData.badgeValue);
            if (isNaN(badgeData.badgeValue) === true) {
                badgeEl.hide();
                return;
            }
        }
        // Currently the display only supports two numerical characters and a plus.
        if (badgeData.badgeValue > 99) {
            badgeDom.innerHTML = '99+'
        }
        else {
            badgeDom.innerHTML = badgeData.badgeValue;
        }
        // If the badge is hidden and a value was supplied, show it, otherwise hide the badge.
        if (!Ext.isEmpty(badgeData.badgeValue)) {
            if (!badgeEl.isVisible()) {
                badgeEl.show();
            }
        } else {
            badgeEl.hide();
        }

        if (badgeData.badgePriority != undefined) {
            if (badgeData.badgePriority !== ABP.util.Constants.badgePriority.Alert &&
                badgeData.badgePriority !== ABP.util.Constants.badgePriority.Warning &&
                badgeData.badgePriority !== ABP.util.Constants.badgePriority.Success &&
                badgeData.badgePriority !== ABP.util.Constants.badgePriority.Info) {
                ABP.util.Logger.logWarn(badgeData.badgePriority + ' is an invalid badge priority, hiding badge. Please use one of the ABP.util.Constants.badgePriority values');
                badgeEl.hide();
            }
            badgeEl.setStyle({
                'background-color': badgeData.badgePriority
            });
        }
    }
});