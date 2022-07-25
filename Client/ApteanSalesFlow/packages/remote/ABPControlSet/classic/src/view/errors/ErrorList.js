/**
 * ABPControlSet Error List component.
 * 
 * for exmaple, to add errors onto a form
 *      var errorPanel = Ext.create({
 *           xtype: 'abperrors',
 *           closable: false,
 *           bind: {
 *               title: '{title}',
 *               messageType: '{messageType}',
 *               errors: '{errorMessages}'
 *           },
 *           listeners:{
 *               navigateField: function(args){
 *                   console.log('navigate to: ' + args.fieldId);
 *               }
 *           }
 *       });
 *       v.insert(0, errorPanel);
 */
Ext.define("ABPControlSet.view.errors.ErrorList", {
    extend: "Ext.Component",
    xtype: "abperrors",

    cls: 'abp-errors x-unselectable',

    ariaRole: 'alert',
    ariaAttributes: {
        'aria-atomic': "true" 
    },
    liquidLayout: true,

    config: {
        /**
         * @cfg title
         * The main title for the error message panel. 
         * Ensure the message explains what the user was trying to do and why it failed i.e. 'Unable to save contact, the following fields are invalid'
         */
        title: '',

        /**
         * @cfg messageType
         * The type of message. 1 is error, 2 is warning, 3 is information
         */
        messageType: 1,

        /**
         * @cfg errors
         * An array of the error messages to show display. Can be an array of strings or an array of objects {text: 'xx', fieldId: 'yy'}
         */
        errors: [],

        /**
         * @cfg {Boolean} collapsible 
         * True to display the 'collapse' tool button and allow the user to collapse the list of messages, false to hide the button and
         * disallow error list to be collapsed.
         */
        collapsible: false,

        /**
         * @cfg {Boolean} closable 
         * True to display the 'close' tool button and allow the user to close the window, false to hide the button and
         * disallow closing the window.
         *
         * By default, when close is requested by clicking the close button, the {@link #method-close} method will be
         * called. This will _{@link Ext.Component#method-destroy destroy}_ the Panel and its content meaning that it may not be
         * reused.
         *
         * To make closing a Panel _hide_ the Panel so that it may be reused, set {@link #closeAction} to 'hide'.
         * @accessor
         */
        closable: false,

        /**
         * @cfg {String} closeAction 
         * The action to take when the close header tool is clicked:
         *
         * - **`'{@link #method-destroy}'`** :
         *
         *   {@link #method-remove remove} the window from the DOM and {@link Ext.Component#method-destroy destroy} it and all descendant
         *   Components. The window will **not** be available to be redisplayed via the {@link #method-show} method.
         *
         * - **`'{@link #method-hide}'`** :
         *
         *   {@link #method-hide} the window by setting visibility to hidden and applying negative offsets. The window will be
         *   available to be redisplayed via the {@link #method-show} method.
         *
         * **Note:** This behavior has changed! setting *does* affect the {@link #method-close} method which will invoke the
         * appropriate closeAction.
         */
        closeAction: 'destroy',
    },

    constructor: function (config) {
        config = config || {};
        this.callParent([config]);
    },

    /**
     * @cfg childEls
     * @inheritdoc
     */
    childEls: [
        'iconEl',
        'titleEl',
        'messagesEl',
        'collapseToolEl',
        'closeToolEl',
        'countEl'
    ],

    renderTpl: [
        '<div class="abp-errors-outer">',
        '<div class="abp-errors-icon">',
        '<span id="{id}-iconEl" data-ref="iconEl" class="{icon}"></span>',
        '</div>',
        '<div class="errors-message-content">',
        '<div class="abp-errors-header-container">',
        '<div id="{id}-titleEl" data-ref="titleEl" class="abp-errors-title">{title:htmlEncode}</div>',
        '<div class="abp-errors-tools">',
        '<span id="{id}-countEl" data-ref="countEl" class="abp-errors-badge"></span>',
        '<tpl if="collapsible">',
        '<span id="{id}-collapseToolEl" data-ref="collapseToolEl" role="button" tabindex="-1" class="x-tool-tool-el x-tool-img icon-navigate-up"></span>',
        '</tpl>',
        '<span id="{id}-closeToolEl" data-ref="closeToolEl" role="button" tabindex="-1" class="x-tool-tool-el x-tool-img x-tool-close"></span>',
        '</div>',
        '</div>',
        '<ul id="{id}-messagesEl" data-ref="messagesEl" class="abp-errors-list {.:this.getStyle(values)}">',
        '<tpl for="messages">',
        '<li class="abp-errors-message">',
        '<tpl if="fieldId">',
        '<span role="link" tabindex="-1" data-fieldid="{fieldId}">{text}</span>',
        '<tpl else>',
        '{text}',
        '</tpl>',
        '</li>',
        '</tpl>',
        '</ul>',
        '</div>',
        '</div>',
        {
            getStyle: function (e, values) {
                if (!values.messages.length) {
                    return 'x-hidden';
                }
                return ''
            }
        }
    ],

    messagesTpl: [
        '<tpl for="messages">',
        '<li class="abp-errors-message">',
        '<tpl if="fieldId">',
        '<span role="link" tabindex="-1" data-fieldid="{fieldId}">{text}</span>',
        '<tpl else>',
        '{text}',
        '</tpl>',
        '</li>',
        '</tpl>',
    ],

    initRenderData: function () {
        var me = this,
            renderData,
            messages = me.getMessagesData();

        renderData = Ext.apply({
            title: me.title,
            icon: me.getIconClass(me.messageType),
            messages: messages,
            collapsible: me.collapsible
        },
            me.callParent()
        );

        return renderData;
    },

    afterRender: function () {
        var me = this;
        if (me.el) {
            me.el.addCls(me.getElClass(me.getMessageType()));
            me.el.dom.setAttribute('aria-expanded', true);

            me.el.on({
                click: me.onClick,
                // FUTURE ENHANCEMENTS...
                // mousedown: me.onMouseDown,
                // mouseover: me.onMouseOver,
                // mouseout: me.onMouseOut,
                scope: me
            });
        }

        if (me.closeToolEl) {
            if (!me.closable) {
                me.closeToolEl.addCls('x-hidden');;
            }

            me.closeToolEl.on({
                click: me.close,
                scope: me
            })
        }

        if (me.collapseToolEl) {
            me.collapseToolEl.on({
                click: me.toggleExpand,
                scope: me
            })
        }

        me.updateExpandable();
    },

    applyMessageType: function (newType) {
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
            var data = me.initRenderData();
            var tpl = new Ext.XTemplate(me.messagesTpl);
            tpl.overwrite(me.messagesEl, data);

            if (data.messages.length) {
                me.messagesEl.removeCls('x-hidden');
                if (me.expanded) {
                    me.countEl.removeCls('x-hidden');
                }
            }
            else {
                me.messagesEl.addCls('x-hidden');
                me.countEl.addCls('x-hidden');
            }

            me.updateExpandable();
            me.updateLayout({ isRoot: true });
        }
    },

    updateClosable: function (closable) {
        var me = this;
        if (me.rendered) {
            if (closable) {
                me.closeToolEl.removeCls('x-hidden');;
            }
            else {
                me.closeToolEl.addCls('x-hidden');;
            }
        }
    },

    /**
     * Closes the Panel. By default, this method, removes it from the DOM, {@link Ext.Component#method-destroy destroy}s the
     * Panel object and all its descendant Components. The {@link #beforeclose beforeclose} event is fired before the
     * close happens and will cancel the close action if it returns false.
     *
     * **Note:** This method is also affected by the {@link #closeAction} setting. For more explicit control use
     * {@link #method-destroy} and {@link #method-hide} methods.
     */
    close: function () {
        if (this.fireEvent('beforeclose', this) !== false) {
            this.doClose();
        }
    },

    privates: {
        expanded: true,

        toggleExpand: function () {
            var me = this;
            me.expanded = !me.expanded;

            if (!me.messagesEl) {
                return;
            }

            if (me.expanded) {
                me.beginExpand();
            }
            else {
                me.beginCollapse();
            }
        },

        /**
         * @private
         * Start the collapse animations
         */
        beginCollapse: function () {
            var me = this;
            if (!me.messagesEl) {
                return;
            }

            me.expandedHeight = me.getHeight();

            me.el.dom.setAttribute('aria-expanded', false);

            me.el.animate({
                duration: 200,
                dynamic: true,
                to: {
                    height: 53
                },
                listeners: {
                    afteranimate: function () {
                        me.countEl.removeCls('x-hidden');
                        me.updateLayout();
                    },
                    scope: me
                }
            })
        },

        /**
         * @private
         * Start the expand animations
         */
        beginExpand: function () {
            var me = this;
            if (!me.messagesEl) {
                return;
            }

            me.countEl.addCls('x-hidden');
            me.el.dom.setAttribute('aria-expanded', true);

            var height = me.expandedHeight;

            me.el.animate({
                duration: 200,
                dynamic: false,
                to: {
                    height: height
                },
                listeners: {
                    afteranimate: function () {
                        delete me.expandedHeight

                        me.updateLayout();

                        // me.setHeight(me.containerHeight);
                    },
                    scope: me
                }
            })
        },

        /**
         * @private
         * Invoke the correct close action
         */
        doClose: function () {
            this.fireEvent('close', this);
            this[this.closeAction]();
        },

        /**
         * @private
         * Handle additional clean up code
         */
        doDestroy: function () {
            var me = this;

            // Ext.destroy(
            //     //me.placeholder,
            // );

            me.callParent();
        },

        getIconClass: function (type) {
            if (type === 1) {
                return 'icon-sign-warning';
            }

            if (type === 2) {
                return 'icon-about';
            }

            return 'icon-information';
        },

        getElClass: function (type) {
            if (type === 1) {
                return 'abp-errors-error';
            }

            if (type === 2) {
                return 'abp-errors-warning';
            }

            return 'abp-errors-information';
        },

        getMessagesData: function () {
            var me = this,
                messages = [];

            Ext.each(me.errors, function (error, i) {
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
            if (e.target.tagName !== 'SPAN') {
                return;
            }

            // Only fire the navigate to field event if a field id has been specified
            if (e.target.dataset.fieldid) {
                var args = { fieldId: e.target.dataset.fieldid };
                this.fireEvent('navigateField', args, e);
            }
        },

        updateExpandable: function () {
            var me = this,
                errors = me.getErrors();

            if (!me.rendered) {
                return;
            }

            me.countEl.addCls('x-hidden');

            if (me.collapseToolEl) {
                if (errors && errors.length > 0) {
                    me.countEl.setHtml(errors.length);
                    me.collapseToolEl.removeCls('x-hidden');
                    me.expanded = true;
                }
                else {
                    // Hide the expanded icons and reset flags
                    me.collapseToolEl.addCls('x-hidden');
                    me.expanded = false;
                    me.countEl.setHtml('');
                }
            }
        }
    }
});