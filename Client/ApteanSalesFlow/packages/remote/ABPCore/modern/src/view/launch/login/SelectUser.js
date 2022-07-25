Ext.define('ABP.view.launch.selectuser.SelectUser', {
    extend: 'Ext.Container',
    requires: [
        'ABP.view.launch.selectuser.SelectUserController',
        'ABP.view.launch.selectuser.SelectUserModel',
        'ABP.view.base.popUp.PopUpFrame'
    ],

    alias: 'widget.selectuser',

    controller: 'selectusercontroller',

    viewModel: {
        type: 'selectusermodel'
    },

    cls: 'settings-modern main-content-wrapper',

    height: '100%',

    items: [{
        xtype: 'container',
        cls: 'main-content',
        items: [{
            xtype: 'component',
            cls: 'settings-title',
            bind: {
                html: '{i18n.login_selectUserTitle:htmlEncode}'
            }
        },
        {
            xtype: 'component',
            cls: 'settings-text',
            bind: {
                html: '{i18n.login_selectUserInstructions:htmlEncode}'
            }
        }, {
            // List of users.
            xtype: 'dataview',
            itemId: 'userList',
            cls: 'selectuser-userList a-selectuser-userList',
            //overItemCls: Ext.baseCSSPrefix + 'grid-item-over',
            //selectedItemCls: Ext.baseCSSPrefix + 'grid-item-selected',
            bind: {
                store: '{userStore}'
            },
            focusCls: Ext.baseCSSPrefix + 'focused ' + Ext.baseCSSPrefix + 'selected',
            scrollable: true,
            itemTpl: [
                '<div class="selectuser-item">',
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
                '</div>',
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
            keyMap: {
                'ENTER':
                    function (eventObj, dataview) {
                        this.__handleKeyEvent(eventObj, dataview, false);
                    },
                'SPACE':
                    function (eventObj, dataview) {
                        this.__handleKeyEvent(eventObj, dataview, false);
                    },
                'DELETE':
                    function (eventObj, dataview) {
                        this.__handleKeyEvent(eventObj, dataview, true);
                    },
                'BACKSPACE':
                    function (eventObj, dataview) {
                        this.__handleKeyEvent(eventObj, dataview, true);
                    },
            },
            // Common function for processing key events in server URL list.
            __handleKeyEvent: function (eventObj, dataview, deleteUser) {
                if (eventObj && eventObj.currentTarget && dataview) {
                    var currentTarget = eventObj.currentTarget;
                    var recordId = currentTarget.getAttribute('data-recordid');
                    if (recordId) {
                        var record = dataview.store.getByInternalId(recordId);
                        if (Ext.isObject(record)) {
                            if (deleteUser) {
                                if (!record.get('useAnotherUser')) { // Ignore if "Use another account".
                                    // Delete this user.
                                    dataview.fireEvent('selectuser_delete', record);
                                }
                            } else {
                                if (record.get('useAnotherUser')) {
                                    // New user.
                                    dataview.fireEvent('selectuser_new');
                                } else {
                                    // This user.
                                    dataview.fireEvent('selectuser_select', record);
                                }
                            }
                        }
                    }
                }
            },
            listeners: {
                // childTap for Modern. itemClick for Classic.
                childTap: function (dataview, location, eOpts) {
                    if (Ext.isObject(location) && Ext.isObject(location.record) && location.event) {
                        // Determine which part of the item line has been clicked, and if this is a new user or existing.
                        if (location.event.getTarget('.delete-item-icon')) {
                            // Remove a user from the list and locel storage.
                            dataview.fireEvent('selectuser_delete', location.record);
                        } else if (location.record) { // Should always be the case. Just defensive coding.
                            if (location.record.get('useAnotherUser')) {
                                // Use a new user.
                                dataview.fireEvent('selectuser_new');
                            } else {
                                // Select existing user.
                                dataview.fireEvent('selectuser_select', location.record);
                            }
                        }
                    }
                    return true;
                }
            }
        }]
    }]
});
