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

    minHeight: Ext.os.deviceType === "Phone" ? 160 : 220,
    cls: Ext.os.deviceType === "Phone" ? "abphelptile-tilebody abphelptile-tilebody_phone" : "abphelptile-tilebody abphelptile-tilebody_tablet",
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
        me.callParent(args);
        var items = me.items;
        items = me.getInnerItems();
        me.setTitle(args.title);
        me.setLinks(args.links);
        var linksToAdd = [];
        for (var i = 0; i < args.links.length; ++i) {
            linksToAdd.push({
                xtype: 'button',
                cls: 'link_link' + " a-help-link-" + args.links[i].product.replace(' ', '-') + '-' + args.links[i].type.replace(' ', '-'),
                text: args.links[i].name,
                url: args.links[i].link,
                handler: 'linkClick'
            });
        }
        for (var i = 0; i < linksToAdd.length; ++i) {
            items[1].add(linksToAdd[i]);
        }
        items[0].setHtml(Ext.htmlEncode(args.title));
    }

});