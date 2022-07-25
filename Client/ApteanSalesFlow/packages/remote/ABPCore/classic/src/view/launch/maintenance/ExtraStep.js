/*
  Additional Maintenance Screen for a custom 2 step Login.

  A Package will require an xtype in their intialize.js to be shown on this maintenance tab.

  We will provide a back and a login/continue/ok button.
    - back will send them back to login
    - login/continue/ok should send the login request again but with this additional information in the request
 */
Ext.define('ABP.view.launch.maintenance.ExtraStep', {
    extend: 'Ext.container.Container',
    requires: [
        'ABP.view.launch.settings.ExtraStepController'
    ],
    alias: 'widget.maintenanceextrastep',
    controller: 'extrastepcontroller',
    cls: 'main-content-wrapper',

    initItems: function () {
        // We have to add the imported xtype into the 'ABPExtraStepCustomContainer',
        // but at this point we can't get the item because it is just an object and not a sencha object.
        var extraStepCustomItems = this.items[0].items;
        if (extraStepCustomItems) {
            if (Ext.isArray(extraStepCustomItems) && extraStepCustomItems.length === 1) {
                extraStepCustomItems.pop();
            }
            extraStepCustomItems.push({ xtype: this.additionalInfo.xtype, additionalInfo: this.additionalInfo });
            this.items[0].items = extraStepCustomItems;
        }
        this.callParent();
    },

    items: [{
        xtype: 'container',
        cls: 'main-content',
        layout: {
            type: 'vbox',
            align: 'middle',
            pack: 'start'
        },
        width: '100%',
        defaults: {
            width: '100%'
        },
        items: [],
        itemId: 'ABPExtraStepCustomContainer'
    }, {
        xtype: 'container',
        cls: 'main-content-footer buttons',
        items: [{
            xtype: 'button',
            reference: 'backButton',
            componentCls: 'btn-login a-extrastep-back',
            width: '49%',
            handler: 'backButtonClick',
            bind: {
                text: '{i18n.login_back:htmlEncode}'
            }
        },
        {
            xtype: 'button',
            itemId: 'saveButton',
            width: '49%',
            componentCls: 'btn-login a-extrastep-save',
            handler: 'continueButtonClick',
            bind: {
                text: '{i18n.button_continue:htmlEncode}'
            }
        }]
    }]
});
