Ext.define('ABP.view.components.ProfileImage', {
    extend: 'Ext.Container',
    alias: 'widget.abpprofileimage',

    config: {
        displayName: null,
        src: null,
        icon: 'icon-user'
    },

    baseCls: 'abp-profile-picture',

    layout: 'fit',
    referenceHolder: true,

    defaults: {
        top: 0,
        left: 0,
        height: '100%',
        width: '100%'
    },

    items: [
        {
            xtype: 'component',
            reference: 'initials',
            cls: 'abp-profile-picture-icon',
            html: ''
        },
        {
            xtype: 'image',
            reference: 'image',
            cls: 'abp-profile-picture-image',
            hidden: true,
            listeners: {
                error: {
                    fn: function () {
                        // Handle the image file not existing on the server
                        this.lookupReferenceHolder().showImage(false);
                    }
                }
            }
        }
    ],

    initialize: function () {
        var me = this;
        me.callParent();
        me.lookup('initials').addCls(me.getIcon());
    },

    updateSrc: function () {
        this.renderVisuals();
    },

    updateDisplayName: function () {
        this.renderVisuals();
    },

    renderVisuals: function () {
        var me = this;
        var image = me.lookup('image');
        var initials = me.lookup('initials');

        if (me.getSrc()) {
            image.setSrc(me.getSrc());
            me.showImage(true);
        }
        else {
            image.setSrc(null);
            me.showImage(false);
        }
    },

    showImage: function (show) {
        var me = this;
        me.lookup('image').setVisibility(show);
        me.lookup('initials').setVisibility(!show);
    }

});