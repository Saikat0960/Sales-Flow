/**
 * This pugin is applied to ABP header panels that want to manage a subscribe / unsubscribe state and corresponding tool.
 * 
 *           xtype: 'toolbar',
 *           plugins: [
 *               'loadingline'
 *           ],
 *
 * To activate / deactive the animation you can set the busy flag i.e.
 * 
 *          toolbar.setBusy(true);
 *
 *           // Do some tasks
 *
 *           toolbar.setBusy(false);
 * 
 * or raise the event from the component hosting the plugin i.e
 * 
 *        cmp.fireEvent('isBusy', true);
 * 
 */
Ext.define('ABPCore.plugins.LoadingLine', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.loadingline',

    isBusy: false,

    init: function (cmp) {
        var me = this;
        // Add the tool to the header bar
        me.setCmp(cmp);
        me.isBusy = me.cmp.isBusy;
        me.cmp.on('afterrender', me.onAfterRender, me); // Classic Event
        me.cmp.on('painted', me.onAfterRender, me); // Modern Event
        me.cmp.on('isBusy', me.onUpdateIsBusy, me);
        me.cmp.on('toggleIsBusy', me.onToggleIsBusy, me);

        // Add a setBusy function on the parent component
        me.cmp.setBusy = me.cmpSetBusy;
        me.cmp.hasLoadingLine = true;
    },

    destroy: function () {
        if (this.cmp) {
            delete this.cmp.setBusy;
            delete this.cmp.hasLoadingLine;
            this.cmp.un('afterrender', this.onAfterRender, this);
            this.cmp.un('painted', this.onAfterRender, this);
            this.cmp.un('isBusy', this.onUpdateIsBusy, this);
            this.cmp.un('toggleIsBusy', this.onUpdateIsBusy, this);
        }
    },

    /**
     * Function to control whether the prorgessive line is shown or not
     * 
     * @param {Boolean} isBusy whether to show the progress line 
     */
    setBusy: function (isBusy) {
        var me = this;

        if (me.isBusy != isBusy) {
            me.updateIsBusy(isBusy);
        }
    },

    privates: {
        /**
         * @private
         * Function to handle the method injected into the component to as a shortcut to firing the event
         * 
         * @param {Boolean} isBusy whether to show the busy line 
         */
        cmpSetBusy: function(isBusy){
            this.fireEvent('isBusy', isBusy);
        },

        onToggleIsBusy: function() {
            this.setBusy(!this.isBusy);
        },
        onUpdateIsBusy: function(isBusy){
            this.setBusy(isBusy);
        },

        /**
         * @private
         * handle the after render / painted event so we can add the subscirption tool to the header bar
         */
        onAfterRender: function () {
            var me = this;
            var cmp = me.getCmp();

            cmp.add(me.loadingLine = Ext.widget({
                xtype: 'abploadingline',
                itemId: 'loadingLine',
                reference: 'loadingLine',
                floating: true,
                height: 2,
                padding: 0,
                hidden: !me.isBusy,
                width: cmp.getWidth()
            }));

            return;
        },

        /**
         * @private
         * 
         * @param {Boolean} isBusy the new value for the busy (animated) flag 
         */
        updateIsBusy: function (isBusy) {
            var me = this,
                cmp = me.getCmp(),
                line = me.loadingLine;

            if (cmp.header){
                cmp = cmp.getHeader();
            }

            if (isBusy) {
                line.setWidth(cmp.getWidth());
                line.showBy(cmp, 'bl-bl', [0, 0]);
            }
            else {
                line.setHidden(true);
            }
            me.isBusy = isBusy;
        }
    }
})
