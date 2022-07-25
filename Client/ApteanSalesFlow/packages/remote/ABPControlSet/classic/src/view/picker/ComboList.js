/**
 * This is the ABP Control Set combo list. It is the default picker list used for the abpcombobox. 
 * This list is configurable to use listActions, which are buttons/tools which can appear in the bottom of the drop down list.
 */
Ext.define('ABPControlSet.view.picker.ComboList', {
    extend: 'Ext.view.BoundList',
    requires: [
        'ABPControlSet.view.picker.layout.BoundList'
    ],
    xtype: 'abpcombolist',
    componentLayout: 'abpboundlist',

    /**
     * @cfg {Object[]} listActions
     *
     * An array of component configurations to display within the drop down list of the combo field. By default, the item will always show. 
     * However, if it is desired to only show the item when the list is empty, configure the item with onlyShowWhenEmpty set to true.
     */

    initComponent: function () {
        var me = this;
        if (me.listActions) {
            // Set an empty text if list actions are being used. This allows the list to appear when no items are shown in the list.
            me.emptyText = '&nbsp';
            me.actionToolbar = me.createActionToolbar();
        }
        me.callParent();
    },
    getRefItems: function () {
        var result = this.callParent() || [],
            actionToolbar = this.actionToolbar;

        if (actionToolbar) {
            result.push(actionToolbar);
        }
        return result;
    },

    onContainerClick: function (e) {
        var actionToolbar = this.actionToolbar;

        // Ext.view.View template method 
        // Do not continue to process the event as a container click if it is within the action toolbar 
        if (actionToolbar && actionToolbar.rendered && e.within(actionToolbar.el)) {
            return false;
        }
        return this.callParent(arguments);
    },

    doDestroy: function () {
        this.actionToolbar = Ext.destroy(this.actionToolbar);
        this.callParent();
    },

    createActionToolbar: function () {
        var me = this;
        return Ext.create('Ext.toolbar.Toolbar', {
            id: me.id + '-action-toolbar',
            itemId: 'actiontoolbar',
            padding: 4,
            defaults: {
                height: 30,
                onlyShowWhenEmpty: false,
                hidden: true
            },
            border: false,
            items: ['->'].concat(me.listActions),
            ownerCt: me,
            ownerLayout: me.getComponentLayout()
        });
    },

    renderTpl: [
        '<div id="{id}-listWrap" data-ref="listWrap"',
        ' class="{baseCls}-list-ct ', Ext.dom.Element.unselectableCls, '">',
        '<ul id="{id}-listEl" data-ref="listEl" class="', Ext.baseCSSPrefix, 'list-plain"',
        '<tpl foreach="ariaAttributes"> {$}="{.}"</tpl>',
        '>',
        '</ul>',
        '</div>',
        '{%',
        'var pagingToolbar=values.$comp.pagingToolbar;',
        'if (pagingToolbar) {',
        'Ext.DomHelper.generateMarkup(pagingToolbar.getRenderTree(), out);',
        '}',
        '%}',
        '{%',
        'var actionToolbar=values.$comp.actionToolbar;',
        'if (actionToolbar) {',
        'Ext.DomHelper.generateMarkup(actionToolbar.getRenderTree(), out);',
        '}',
        '%}',
        {
            disableFormats: true
        }
    ],
    privates: {
        // Do the job of a container layout at this point even though we are not a Container. 
        finishRenderChildren: function () {
            var toolbar = this.actionToolbar;

            this.callParent(arguments);

            if (toolbar) {
                toolbar.finishRender();
            }
        }
    }
});
