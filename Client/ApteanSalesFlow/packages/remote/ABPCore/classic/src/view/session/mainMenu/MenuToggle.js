//////////////////////////////////////////////////////////////////////
// MenuToggle.js
// extends MenuItem to add another object into the button.  The object
//   is an additional icon dependant on which menu is currently shown.
//////////////////////////////////////////////////////////////////////
Ext.define('ABP.view.session.mainMenu.MenuToggle', {
    extend: 'ABP.view.session.mainMenu.MenuItem',
    alias: 'widget.menutoggle',

    initComponent: function () {
        var me = this;
        var iconFont = '';
        var font = me.icon;
        font = font.split('-');
        me.items = [{
            xtype: 'component',
            itemId: 'miIcon',
            cls: 'mi-icon-micro',
            bind: {
                cls: '{classicMenuExpand}',
                html: '<i class="' + me.icon + '"></i>'
            },
            setCls: function (expand) {
                if (expand) {
                    this.removeCls('icon-expanded');
                } else {
                    this.addCls('icon-expanded');
                }
            }
        }, {
            xtype: 'component',
            itemId: 'miTitle',
            bind: {
                hidden: '{!classicMenuExpand}',
                html: me.labelKey ? '{i18n.' + me.labelKey + ':htmlEncode}' : Ext.String.htmlEncode(me.title)
            },
            cls: 'mi-title-micro'
        }, {
            xtype: 'component',
            itemId: 'miToggle',
            cls: 'mi-icon-micro mi-icon-toggle',
            bind: {
                html: '<div class="icon-wrapper"><i class="' + 'icon-elements-tree' + '"></i><i class="' + '{navIcon}' + '"></i></div>'
            }
        }];
        me.ariaRole = 'menuitem';
        me.ariaLabel = 'Main Menu ' + me.title;
        // skip the menuIem version of this function and instead call it's parent's version
        me.superclass.superclass.initComponent.apply(me, arguments);
    },

    setCls: function (cls) {
        var me = this;
        var vm = me.getViewModel();
        me.removeCls(vm.get('navAfterCls') + vm.get('navIcon'));
        me.removeCls(vm.get('navAfterCls') + vm.get('treeIcon'));
        me.addCls(cls);
    }

});
