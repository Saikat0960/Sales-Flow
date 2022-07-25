Ext.define('ABP.view.launch.selectuser.SelectUser', {
    extend: 'Ext.container.Container',
    requires: [
        'ABP.view.launch.selectuser.SelectUserController',
        'ABP.view.launch.selectuser.SelectUserModel',
        'ABP.view.base.popUp.PopUpFrame',
        'Ext.panel.Panel',
        'Ext.form.field.ComboBox'
    ],

    alias: 'widget.selectuser',

    controller: "selectusercontroller",

    viewModel: {
        type: "selectusermodel"
    },

    height: '100%',

    layout: {
        type: 'vbox',
        align: 'middle'
    },
    defaultFocus: 'userList',

    initFocus: function() {
        var me = this,
            vm = me.getViewModel(),
            user = vm.get('selectedUser');

        if (user){
            var userList = me.down('#userList'); 
            userList.focus();
           // userList.focusNode(user);

            var i = vm.storeInfo.userStore.indexOf(user);
            var navModel = userList.getNavigationModel();
            navModel.setPosition(i);
        }
    },

    items: [
        {
            xtype: 'abpheadercomponent',
            cls: 'settings-title',
            reference: 'login-selectuser-title',
            width: 250,
            componentCls: 'x-unselectable',
            bind: {
                html: '{i18n.login_selectUserTitle:htmlEncode}'
            },
            tabIndex: -1
        },
        {
            xtype: 'component',
            itemId: 'selectUserGuide',
            reference: 'login-selectuser-desc',
            width: 250,
            componentCls: 'settings-text x-unselectable',
            bind: {
                html: '{i18n.login_selectUserInstructions:htmlEncode}'
            },
            tabIndex: -1
        },
        {
            // List of users.
            layout: 'fit',
            width: 250,
            height: 280,
            xtype: 'dataview',
            itemId: 'userList',
            reference: 'userList',
            cls: 'selectuser-userList a-selectuser-userList',
            overItemCls: Ext.baseCSSPrefix + 'grid-item-over',
            selectedItemCls: Ext.baseCSSPrefix + 'grid-item-selected',
            bind: {
                store: '{userStore}',
                selection: '{selectedUser}'
            },
            scrollable: true,
            
            // Add the accessibility label and descriptions
            ariaLabelledBy: 'login-selectuser-title',
            ariaDescribedBy: 'login-selectuser-desc',

            itemSelector: 'li.selectuser-item',
            tpl: [
                '<ul class="selectuser-items" role="list">',
                    '<tpl for=".">',
                    '<li class="selectuser-item" role="listitem">',
                        '<div class="selectuser-image"><span class="selectuser-image-icon {useAnotherUser:this.getClass(values.data)}" style="{data:this.getPhoto()}"></span></div>',
                        '<div style="display: inline-block" class="user-info">',
                        '<tpl if="useAnotherUser">',
                            '<div class="user-info-name a-selectuser-newuser">{username:htmlEncode}</div>',
                        '<tpl else>',
                            '<div class="user-info-name a-selectuser-user">{username:htmlEncode}</div>',
                            '<div class="user-info-env a-selectuser-env">{envName:htmlEncode}</div>',
                        '</tpl>',
                            '</div>',
                        '<tpl if="useAnotherUser">',
                        '<tpl else>',
                            '<div class="delete-item"><span class="delete-item-icon icon-garbage-can a-delete-item-icon"></span></div>',
                        '</tpl>',
                    '</li>',
                    '</tpl>',
                '</ul>',
                {
                    getClass: function (useAnotherUser, data) {
                        if (useAnotherUser) {
                            return 'icon-businessperson2 a-selectuser-newicon';
                        }
                        if (data.Photo) {
                            return 'user-photo a-selectuser-icon';
                        }

                        return 'icon-user a-selectuser-icon';
                    },

                    getPhoto: function (data) {
                        if (!data || !data.Photo) {
                            return '';
                        }

                        return 'background-image:url(' + data.Photo + ')';
                    }
                }
            ],
            listeners: {
                itemadd: function(){
                    console.log('item added');
                },
                // childTap for Modern. itemClick for Classic.
                itemClick: function (view, record, item, index, e, eOpts) {
                    if (Ext.isObject(e)) {
                        // Determine which part of the item line has been clicked, and if this is a new user or existing.
                        if (e.getTarget('.delete-item-icon')) {
                            // Remove a user from the list and locel storage.
                            view.fireEvent('selectuser_delete', record);
                        } else if (record) { // Should always be the case. Just defensive coding.
                            if (record.get('useAnotherUser')) {
                                // Use a new user.
                                view.fireEvent('selectuser_new');
                            } else {
                                // Select existing user.
                                view.fireEvent('selectuser_select', record);
                            }
                        }
                    }
                    return true;
                },
                itemkeydown: function (view, record, item, index, e, eOpts) {
                    if (Ext.isObject(e)) {
                        // Determine which key was pressed.
                        if (e.getKeyName() == 'ENTER' || e.getKeyName() == 'SPACE') {
                            if (record && record.get('useAnotherUser')) {
                                // New user.
                                view.fireEvent('selectuser_new');
                            } else {
                                // This user.
                                view.fireEvent('selectuser_select', record);
                            }
                        } else if (e.getKeyName() == 'DELETE') {
                            if (record && !record.get('useAnotherUser')) { // Ignore if "Use another account".
                                // Delete this user.
                                view.fireEvent('selectuser_delete', record);
                            }
                        } else if (e.getKeyName() == 'ESC') {
                            // Pressing ESC should in effect cancel the user selection and show the normal login page
                            view.fireEvent('selectuser_new');
                        }
                    }
                }
            }
        }
    ]
});