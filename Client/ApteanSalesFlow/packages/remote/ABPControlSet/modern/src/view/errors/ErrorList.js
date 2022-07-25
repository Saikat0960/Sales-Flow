/**
 * ABPControlSet error list component.
 */
Ext.define("ABPControlSet.view.errors.ErrorList", {
    extend: "Ext.Component",
    xtype: "abperrors",
    alias: 'abperrorpanel',

    cls: 'abp-errors',
    ariaRole: 'alert',

    config: {
        /**
         * @cfg title
         * The main title for the error message panel. 
         * Ensure the message explains what the user was trying to do and why it failed i.e. 'Unable to save contact, the following fields are invalid'
         */
        title: 'What happened',

        /**
         * @cfg messageType
         * The type of message. 1 is error, 2 is warning, 3 is information
         */
        messageType: 1,

        /**
         * @cfg errors
         * An array of the error messages to show display. Can be an array of strings or an array of objects {text: 'xx', fieldId: 'yy'}
         */
        errors: []
    },

    element: {
        reference: 'element',
        cls: 'abp-errors',
        listeners: {
            click: 'onClick'
        },

        children: [
            {
                reference: 'iconContainer',
                cls: 'abp-errors-icon',
                children: [
                    {
                        reference: 'iconEl',
                        tag: 'span',
                    }
                ]
            },
            {
                reference: 'maintContainer',
                cls: 'errors-message-content',
                children: [
                    {
                        reference: 'titleEl',
                        cls: 'abp-errors-title'
                    },
                    {
                        reference: 'messagesEl',
                        tag: 'ul',
                        cls: 'abp-errors-list'
                    }
                ]
            },

        ]
    },

    applyMessageType: function (newType, oldType) {
        if (newType === 'error') {
            newType = 1;
        } else if (newType === 'warning') {
            newType = 2;
        } else if (newType === 'info') {
            newType = 3;
        }

        return newType;
    },

    updateMessageType: function (icon, oldIcon) {
        var me = this;
        if (me.rendered) {
            if (oldIcon) {
                me.iconEl.removeCls(me.getIconClass(oldIcon));
                me.el.removeCls(me.getElClass(oldIcon));
            }
            me.iconEl.addCls(me.getIconClass(icon));
            me.el.addCls(me.getElClass(icon));

            me.updateLayout();
        }
    },

    updateTitle: function (title) {
        var me = this;
        if (me.rendered) {
            me.titleEl.setHtml(title);
            me.updateLayout();
        }
    },

    updateErrors: function (errors) {
        var me = this;
        if (me.rendered) {

            var errorData = me.getMessagesData();

            var html = '';
            Ext.each(errorData, function (error, i) {
                html += '<li class="abp-errors-message" data-fieldid="' + error.fieldId + '">' + Ext.encode(error.text) + '</li>';
            });

            me.messagesEl.setHtml(html);
        }
    },

    privates: {
        getIconClass: function (type) {
            if (type === 1) {
                return 'icon-sign-warning';
            }

            if (type === 2) {
                return 'icon-information'
            }

            return 'icon-about'
        },

        getElClass: function (type) {
            if (type === 1) {
                return 'abp-errors-warning';
            }

            if (type === 2) {
                return 'abp-errors-information'
            }

            return 'abp-errors-error'
        },

        getMessagesData: function () {
            var me = this,
                messages = [];

            Ext.each(me.getErrors(), function (error, i) {
                var message = {};
                if (Ext.isString(error)) {
                    message.text = error;
                }
                else {
                    message.text = error.text;
                    message.fieldId = error.fieldId;
                }

                messages.push(message);
            });

            return messages;
        },

        /**
         * Hande the user clicking on the fied errors, raise the navigatefield event
         */
        onClick: function (e, target) {
            // If the user has not clicked on an anchor, don't relay the event
            if (e.target.tagName !== 'LI') {
                return;
            }

            var args = {
                fieldId: null
            }

            // If there is not field if
            if (e.target.dataset.fieldid) {
                args.fieldId = e.target.dataset.fieldid;
            }

            this.fireEvent('navigateField', args, e);
        }
    }
});