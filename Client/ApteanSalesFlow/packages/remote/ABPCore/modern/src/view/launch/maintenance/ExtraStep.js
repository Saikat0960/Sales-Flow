/*
  Additional Maintenance Screen for a custom 2 step Login.

  A Package will require an xtype in their intialize.js to be shown on this maintenance tab.

  We will provide a back and a login/continue/ok button.
    - back will send them back to login
    - login/continue/ok should send the login request again but with this additional information in the request
 */
Ext.define('ABP.view.launch.maintenance.ExtraStep', {
    extend: 'Ext.Container',
    requires: [
        'ABP.view.launch.settings.ExtraStepController'
    ],
    alias: 'widget.maintenanceextrastep',
    controller: 'extrastepcontroller',
    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'start'
    },
    cls: 'maintenance-modern main-content-wrapper',
    height: '100%',
    initialize: function () {
        // We have to add the imported xtype into the 'ABPExtraStepCustomContainer',
        // but at this point we can't get the item bc it is just an object and not a sencha object.
        this.items.items[0].add({ xtype: this.additionalInfo.xtype, additionalInfo: this.additionalInfo });
        this.callParent();
    },

    items: [{
        xtype: 'container',
        cls: 'main-content',
        itemId: 'ABPExtraStepCustomContainer',
        items: []
    }, {
        xtype: 'container',
        cls: 'main-content-footer buttons',
        items: [{
            xtype: 'button',
            reference: 'backButton',
            cls: ['btn-login', 'a-extrastep-back', 'login-form'],
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
            cls: ['btn-login', 'a-extrastep-save', 'login-form'],
            handler: 'continueButtonClick',
            bind: {
                text: '{i18n.button_continue:htmlEncode}'
            }
        }]
    }]
});
