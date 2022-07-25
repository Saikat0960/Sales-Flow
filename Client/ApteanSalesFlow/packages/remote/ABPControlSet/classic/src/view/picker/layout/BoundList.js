/**
 * Icon picker provides a view for choosing apteanico icons. The picker can be rendered to any container. The
 * available default to the apteanico-mini icon set; this can be customized with the {@link #iconPrefix} config.
 */
Ext.define('ABPControlSet.view.picker.layout.BoundList', {
    extend: 'Ext.layout.component.BoundList',
    alias: 'layout.abpboundlist',

    /*
     * In the below code, the action toolbar is accounted for when determining the height of the content in order to display the toolbar and the list together.
     * Each method is an extension to the Ext.layout.component.BoundList class methods.
     */


    beginLayout: function (ownerContext) {
        var me = this,
            owner = me.owner,
            toolbar = owner.actionToolbar;

        me.callParent(arguments);

        if (toolbar) {
            ownerContext.actionToolbarContext = ownerContext.context.getCmp(toolbar);
        }
    },
    getLayoutItems: function () {
        var result = this.callParent(arguments) || [];
        var toolbar = this.owner.actionToolbar;
        if (toolbar) {
            result.push(toolbar);
        }
        return result;
    },
    publishInnerHeight: function (ownerContext, height) {
        var pagingToolbar = ownerContext.toolbarContext,
            toolbar = ownerContext.actionToolbarContext,
            toolbarHeight = 0;

        if (toolbar && toolbar.target && toolbar.target.isVisible(true)) {
            var topToolbarHeight = toolbar.getProp("height");
            if (topToolbarHeight === undefined) {
                this.done = false;
                return;
            }
            toolbarHeight += topToolbarHeight;
        }

        if (pagingToolbar) {
            var pagingToolbarHeight = pagingToolbar.getProp("height");
            if (pagingToolbarHeight === undefined) {
                this.done = false;
                return;
            }
            toolbarHeight += pagingToolbarHeight;
        }
        ownerContext.listContext.setHeight(height - ownerContext.getFrameInfo().height - toolbarHeight);
    },

    calculateOwnerHeightFromContentHeight: function (ownerContext) {
        var height = this.callParent(arguments) || 0,
            toolbar = ownerContext.actionToolbarContext;

        if (toolbar && toolbar.target && toolbar.target.isVisible(true)) {
            height += toolbar.getProp('height');
        }
        return height;
    }
});
