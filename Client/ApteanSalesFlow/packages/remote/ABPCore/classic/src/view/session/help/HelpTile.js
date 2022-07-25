Ext.define('ABP.view.session.help.HelpTile', {
    extend: 'Ext.container.Container',
    alias: 'widget.helptile',

    layout: {
        type: 'vbox',
        align: 'center'
    },

    config: {
        title: '',
        links: []
    },

    minHeight: 220,
    cls: 'abphelptile-tilebody',

    items: [
        {
            xtype: 'component',
            itemId: 'abp-helptile-title',
            cls: 'abphelptile-title',
            width: '90%'
        }, {
            xtype: 'container',
            width: '100%',
            layout: {
                type: 'vbox',
                align: 'center'
            },
            cls: 'abphelptile-links',
            itemId: 'abp-helptile-body'
        }
    ],

    constructor: function (args) {
        var me = this;
        var items = me.items;
        me.setTitle(args.title);
        me.setLinks(args.links);
        var linksToAdd = [];
        for (var i = 0; i < args.links.length; ++i) {
            linksToAdd.push({
                xtype: 'button',
                uiCls: 'abp-link',
                cls: 'link_link' + " a-help-link-" + args.links[i].product.replace(' ', '-') + '-' + args.links[i].type.replace(' ', '-'),
                text: args.links[i].name,
                url: args.links[i].link,
                handler: 'linkClick'
            });
        }
        items[1].items = linksToAdd;
        items[0].html = Ext.htmlEncode(args.title);
        me.callParent(args);
    }
});
