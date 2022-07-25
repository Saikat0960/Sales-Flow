/*
    NOTE: This file is added to include the Ext JS v6.6 Modern Time Field - remove duplicate code once updated to v6.6 or greater.
*/
Ext.define('Ext.panel.Time', {
    extend: 'Ext.Panel',
    xtype: 'timepanel',

    mixins: [
        'Ext.mixin.ConfigProxy'
    ],

    config: {
        view: {
            xtype: 'analogtime'
        }
    },

    proxyConfig: {
        view: {
            configs: [
                'value',
                'autoAdvance',
                'vertical',
                'confirmable',
                'confirmHandler',
                'declineHandler',
                'scope',
                'defaultButtons',
                'mode'
            ],

            methods: ['getHours', 'getMinutes', 'getMeridiem', 'updateField']
        }
    },

    autoSize: null,

    initialize: function () {
        var me = this;

        me.callParent();

        if (me.getFloated()) {
            me.el.dom.setAttribute('tabIndex', -1);
            me.el.on('mousedown', me.onMouseDown, me);
        }

        me.relayEvents(me.getView(), ['collapsePanel', 'select']);
    },

    applyView: function (config, view) {
        return Ext.updateWidget(view, config, this, 'createView');
    },

    createView: function (config) {
        return this.mergeProxiedConfigs('view', config);
    },

    updateView: function (view, oldView) {
        if (oldView) {
            Ext.destroy(oldView);
        }

        this.add(view);
    },

    updateButtonAlign: function (align) {
        this.getView().setButtonAlign(align);
    },

    onMouseDown: function (e) {
        // ABP - need to remove prevent default or else the Cancel/Ok buttons do not work.
        // e.preventDefault();
    }
});