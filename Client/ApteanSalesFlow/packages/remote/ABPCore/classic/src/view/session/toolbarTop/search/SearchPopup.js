Ext.define('ABP.view.session.toolbarTop.search.SearchPopup', {
    extend: 'Ext.container.Container',
    alias: 'widget.searchpopup',

    floating: true,
    hidden: true,
    tabIndex: 0,
    cls: 'abp-popup-list',

    items: [
        {
            xtype: 'dataview',
            itemId: 'searchPopupDataview',
            tabIndex: 0,
            overItemCls: 'abp-popup-item-highlight',
            bind: {
                store: '{suggestions}',
                selection: '{selectedSuggestion}',
            },
            tpl: [
                '<tpl for=".">',
                '<div class="abp-popup-list-outer">',
                '<div class="abp-popup-list-searched">{text:htmlEncode}</div>',
                '<div class="abp-popup-list-hierarchy">{hierarchy:htmlEncode}</div>',
                '</div>',
                '</tpl>'
            ],
            itemSelector: 'div.abp-popup-list-outer',
            listeners: {
                itemclick: 'onSuggestionClick',
            }
        }, {
            xtype: 'component',
            itemId: 'loading',
            html: '<div class="abp-loadmask loading-bars"><div class="bars slim"> <div class="rect1"></div> <div class="rect2"></div> <div class="rect3"></div> <div class="rect4"></div> <div class="rect5"></div> </div></div>'
        }, {
            xtype: 'label',
            cls: 'searchpopupmessage',
            itemId: 'message',
            hidden: true,
            html: null,
        }
    ],

    /**
     * Set whether the load indicator is hidden from the user
     */
    setLoading: function (loading) {
        if (loading) {
            this.down('#loading').show();
        }
        else {
            this.down('#loading').hide();
        }

    },

    /**
     * Sets a message in the popup. Can be used for information and errors.
     * @param {String} message The message to show. An empty value hides this component.
     */
    setMessage: function (message) {
        var messageCmp = this.down('#message');
        messageCmp.setHtml(message);
        if (Ext.isEmpty(message)) {
            messageCmp.hide();
        } else {
            messageCmp.show();
        }
    }
});