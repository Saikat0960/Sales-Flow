Ext.define('ABP.view.session.toolbarTop.search.SearchPopup', {
    extend: 'Ext.Container',
    alias: 'widget.searchpopup',

    floated: true,
    hidden: true,
    modal: true,
    hideOnMaskTap: true,
    tabIndex: 0,
    cls: 'abp-popup-list',
    hidden: true,

    items: [
        {
            xtype: 'dataview',
            tabIndex: 0,
            overItemCls: 'abp-popup-item-highlight',
            bind: {
                store: '{suggestions}',
                selection: '{selectedSuggestion}',
            },
            itemTpl: [
                '<div class="abp-popup-list-outer">',
                '<div class="abp-popup-list-searched">{text}</div>',
                '<div class="abp-popup-list-hierarchy">{hierarchy}</div>',
                '</div>'
            ],

            itemSelector: 'div.abp-popup-list-outer',
            listeners: {
                childtap: 'onSuggestionClick',
            }
        },
        {
            xtype: 'component',
            itemId: 'loading',
            html: '<div class="abp-loadmask loading-bars"><div class="bars slim"> <div class="rect1"></div> <div class="rect2"></div> <div class="rect3"></div> <div class="rect4"></div> <div class="rect5"></div> </div></div>'
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
    }
});