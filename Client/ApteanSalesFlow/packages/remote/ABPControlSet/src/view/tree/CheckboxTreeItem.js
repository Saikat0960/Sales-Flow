/**
 * Checkbox tree list item. Tree list items are common to both modern and classic toolkits from the core ext package.
 */
Ext.define('ABPControlSet.view.tree.CheckboxTreeItem', {
    extend: 'Ext.list.TreeItem',
    xtype: 'checkboxtreelistitem',

    checkedCls: Ext.baseCSSPrefix + 'treelist-item-checked',

    element: {
        reference: 'element',
        tag: 'li',
        cls: Ext.baseCSSPrefix + 'treelist-item',

        children: [{
            reference: 'rowElement',
            cls: Ext.baseCSSPrefix + 'treelist-row',

            children: [{
                reference: 'wrapElement',
                cls: Ext.baseCSSPrefix + 'treelist-item-wrap',
                children: [{
                    reference: 'iconElement',
                    cls: Ext.baseCSSPrefix + 'treelist-item-icon'
                }, {
                    reference: 'textElement',
                    cls: Ext.baseCSSPrefix + 'treelist-item-text'
                }, {
                    reference: 'expanderElement',
                    cls: Ext.baseCSSPrefix + 'treelist-item-expander'
                },
                {
                    reference: 'checkboxElement',
                    cls: Ext.baseCSSPrefix + 'treelist-item-checkbox'
                }]
            }]
        }, {
            reference: 'itemContainer',
            tag: 'ul',
            cls: Ext.baseCSSPrefix + 'treelist-container'
        }, {
            reference: 'toolElement',
            cls: Ext.baseCSSPrefix + 'treelist-item-tool'
        }]
    },

    onClick: function () {
        var me = this,
            node = me.getNode();

        if (node) {
            checked = !node.get("checked");
            node.set("checked", checked);
            me.doNodeUpdate(node);
        }

        me.callParent(arguments);
    },

    privates: {
        doNodeUpdate: function (node) {
            var me = this,
                checkedCls = me.checkedCls;

            me.callParent([node]);
            var checked = node.get("checked");

            var element = me.element;
            if (element) {
                element.toggleCls(checkedCls, checked);
            }
        }
    }
});