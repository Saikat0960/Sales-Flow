/**
 * Popup panel used to display standard messages to the user.
 *
 * example usage:
 *
 *      ABP.Popup.showError('Your transaction can not be completed at this time.','Network Error');
 *
 *      ABP.Popup.showHyperlink('click here', 'https://www.aptean.com/', '_blank', 'Aptean Portal', 'aptean');
 *
 *      ABP.Popup.showInfo('You have logged in as admin','Login Successful');
 *
 *      ABP.Popup.showOkCancel('This action will erase all unsaved data!', 'Confirm Action', function(confirmed){
 *          if (confirmed){
 *              // The user has pressed OK
 *          } else {
 *              // The user has pressed Cancel
 *          }
 *      });
 *
 *      ABP.PopUp.showYesNo('Are you sure you want to delete all of your records?', 'Deletion Confirmation', function(confirmed){
 *          if (confirmed){
 *              // The user has pressed yes
 *          } else {
 *              // The user has pressed No
 *          }
 *      });
 */
Ext.define('ABP.view.base.popUp.PopUp', {
    extend: 'Ext.panel.Panel',
    singleton: true,
    requires: [
        'ABP.view.base.popUp.PopUpController',
        'ABP.view.base.popUp.PopUpHeader',
        'ABPControlSet.util.Markdown'
    ],
    alias: 'widget.abppopup',
    alternateClassName: 'ABP.Popup',
    controller: 'abppopupcontroller',
    header: {
        xtype: 'popupheader'
    },
    layout: {
        type: 'hbox',
        align: 'center',
        pack: 'start'
    },
    floating: true,
    centered: true,
    modal: true,
    cls: 'framePop',
    ui: 'popup',
    sizingConstants: {
        minWidth: 440,
        minHeight: 185,
        maxWidth: 760
    },
    minHeight: 185,
    shadow: false,
    config: {
        closeKeymap: undefined
    },
    // Accessibility
    ariaRole: 'alertdialog',
    //ariaLabelledBy: 'errorPopTitle',
    ariaDescribedBy: 'errorPopMessage',
    ariaAttributes: {
        'aria-modal': 'true',
        // 'aria-labelledby': 'errorPopTitle',
        // 'aria-describedby': 'errorPopMessage'
    },

    dockedItems: [{
        xtype: 'container',
        dock: 'bottom',
        itemId: 'errorPopButtonBar',
        cls: 'errorpop-buttonbar',
        layout: {
            type: 'hbox',
            pack: 'end'
        },
        items: [{
            xtype: 'button',
            frame: false,
            width: 100,
            bind: {
                text: '{i18n.error_ok_btn:htmlEncode}',
                ariaLabel: '{i18n.error_ok_btn:htmlEncode}',
            },
            handler: function () {
                this.up('abppopup').hidePopup();
            }
        }]
    }],
    items: [{
        xtype: 'component',
        itemId: 'errorPopIcon',
        cls: 'popIcon',
        flex: 1,
        html: '<i class="icon-window-warning"></i>'
    }, {
        xtype: 'component',
        id: 'errorPopMessage',
        cls: 'errorpop-message',
        ariaRole: 'alert',
        ariaAttributes: {
            'aria-live': 'polite'
        },
        flex: 7,
        width: '100%',
        scrollable: 'y',
        html: ''
    }],
    // Private - internal show method
    __showPopup: function (message, title, icon, buttonConfig, closeCallback, options) {
        var me = this;
        options = options || {};
        var __icon = me.down('#errorPopIcon');
        var __message = me.down('#errorPopMessage');
        var __buttonbar = me.down('#errorPopButtonBar');
        if (icon) {
            if (icon === '?') {
                __icon.setHtml('<i class="icon-question"></i>');
                if (!__icon.hasCls('actionblueIcon')) {
                    __icon.addCls('actionblueIcon');
                }
            } else if (icon === 'i') {
                __icon.setHtml('<i class="icon-information"></i>');
                if (!__icon.hasCls('actionblueIcon')) {
                    __icon.addCls('actionblueIcon');
                }
            } else if (Ext.isString(icon) && icon.length > 1) { // An icon specified with more than 1 character is assumed to be a font icon.
                __icon.setHtml('<i class="' + icon + '"></i>');
                if (__icon.hasCls('actionblueIcon')) {
                    __icon.removeCls('actionblueIcon');
                }
            } else {
                __icon.setHtml('<i class="icon-sign-warning"></i>');
                if (__icon.hasCls('actionblueIcon')) {
                    __icon.removeCls('actionblueIcon');
                }
            }
            __icon.setHidden(false);
        } else {
            __icon.setHidden(true);
        }
        if (title && Ext.isString(title)) {
            /*__title.setHtml(me.__checkString(title));
            __title.setHidden(false);*/
            me.__setTitle(me.__checkString(title));
        } else {
            me.__setTitle('');
            //__title.setHidden(true);
        }
        if (message) {
            var isMarkdown = options.isMarkdown || false;
            message = me.__getFormattedMessage(message, isMarkdown);
            // options supports showing a hyperlink in the pop.
            if (options && options.url) {
                // Showing a URL in the popup is tightly controlled. Not just any old HTML can be added to the popup message.
                var urlHtml = Ext.String.format('<br/><br/><a href="{0}" target="{1}" onclick="try { ABP.view.base.popUp.PopUp.hidePopup(); return true; } catch (e) {return true;}">{2}</a>', options.url, (options && options.urlTarget ? options.urlTarget : '_blank'), (options && options.urlDisplayText ? me.__checkString(options.urlDisplayText) : options.url));
                __message.setHtml(message + urlHtml);
            } else {
                __message.setHtml(message);
            }
            __message.setHidden(false);
        } else {
            __message.setHidden(true);
        }
        if (buttonConfig) {
            __buttonbar.removeAll();
            __buttonbar.add(me.__getCustomButtons(buttonConfig));
        } else {
            __buttonbar.removeAll();
            __buttonbar.add(me.__getDefaultButtons());
        }
        me.closeCallback = closeCallback;
        //me.setMaxHeight(Math.floor(ABP.util.Common.getWindowHeight() - (ABP.util.Common.getWindowHeight() / 20)));
        me.setCloseKeymap(Ext.getBody().addKeyListener(Ext.event.Event.ESC, me.hidePopup, me));
        me.calculateSizing(__message.hidden, __message.html);
        me.show();
        me.center();
        me.__putFocusOnButton();
    },
    // Private - gets the properly formatted string of message lines.
    __getFormattedMessage: function (message, isMarkdown) {
        if (isMarkdown) {
            return ABPControlSet.util.Markdown.parseMarkdown(message);
        } else {
            var me = this;
            if (Ext.isString(message)) {
                return me.__checkString(message);
            } else if (Ext.isArray(message)) {
                var line,
                    lines = '',
                    length = message.length;
                for (var i = 0; i < length; i++) {
                    line = message[i];
                    if (Ext.isString(line)) {
                        lines += me.__checkString(line) + (i === length - 1 ? '' : '<br/>');
                    }
                }
                return lines;
            }
        }
    },
    // Private - sets the title on the custom Header
    __setTitle: function (title) {
        if (title) {
            if (this.header.setTitle) {
                this.header.setTitle(title);
                this.header.show();
            } else {
                // first time showing a popup
                this.header.title = title;
            }
        } else {
            if (this.header.setTitle) {
                this.header.setTitle('');
                this.header.hide();
            } else {
                // first time showing a popup
                this.header.title = '';
                this.header.hidden = true;
            }
        }
    },
    // Private - Uses common functions to check if string is i18n or contains injections
    __checkString: function (strToCheck) {
        var copy = strToCheck.slice(0);
        var ret = ABP.util.Common.geti18nString(strToCheck, true);
        if (copy === ret) {
            ret = ABP.util.Common.inspectString(ret);
        }
        return Ext.String.htmlEncode(ret);
    },
    // Private - gets premade 'OK' button
    __getDefaultButtons: function () {
        return [{
            xtype: 'button',
            frame: false,
            minWidth: 100,
            automationCls: 'popup-btn-ok',
            defaultFocus: true,
            bind: {
                text: '{i18n.error_ok_btn:htmlEncode}'
            },
            handler: function () {
                this.up('abppopup').hidePopup();
            }
        }];
    },
    // Private - constructs buttons for button bar of popup
    __getCustomButtons: function (buttonConfig) {
        var me = this;
        var ret = [];
        var buttonText = '';
        var i = 0;
        if (Ext.isArray(buttonConfig)) {
            for (i = 0; i < buttonConfig.length; ++i) {
                if (buttonConfig[i].text) {
                    buttonText = ABP.util.Common.geti18nString(buttonConfig[i].text);
                    ret.push({
                        xtype: 'button',
                        frame: false,
                        minWidth: 100,
                        defaultFocus: buttonConfig[i].defaultFocus,
                        args: buttonConfig[i].args,
                        text: Ext.String.htmlEncode(buttonText),
                        automationCls: 'popup-btn-' + i,
                        handler: function () {
                            this.up('abppopup').hidePopup(this.args);
                        }
                    });
                }
            }
        } else {
            if (buttonConfig.text) {
                buttonText = ABP.util.Common.geti18nString(buttonConfig.text);
                ret.push({
                    xtype: 'button',
                    frame: false,
                    minWidth: 100,
                    defaultFocus: buttonConfig.defaultFocus,
                    args: buttonConfig.args,
                    text: Ext.String.htmlEncode(buttonText),
                    handler: function () {
                        this.up('abppopup').hidePopup(this.args);
                    }
                });
            }
        }
        if (Ext.isEmpty(ret)) {
            ret = me.__getDefaultButtons();
        }
        return ret;
    },
    // Private - puts focus on a button so "enter key" can not interact with masked content
    __putFocusOnButton: function () {
        var me = this;
        var buttonbar = me.down('#errorPopButtonBar');
        var buttons = buttonbar.items.items;
        var i = 0;
        var foundFocus = false;
        for (i; i < buttons.length; ++i) {
            if (buttons[i].defaultFocus) {
                foundFocus = buttons[i];
                break;
            }
        }
        if (foundFocus) {
            foundFocus.focus();
        } else {
            if (buttons.length > 0) {
                buttons[0].focus();
            }
        }
    },
    // Private - keeps popup at a 3/2 ratio width/height
    calculateSizing: function (hidden, text) {
        var me = this;
        if (hidden) {
            me.setWidth(me.sizingConstants.minWidth);
        }
        else {
            var size = text.length * 7 + 120; //average width is 7px and we add for the icon in horizontal alignment.
            var largestSize = 10500; //10500 largest it should be without scrolling.
            var smallestSize = 325; //325 smallest text it should be without growing
            if (size < largestSize) {
                if (size <= smallestSize) {
                    // under the threshold, keep the min
                    me.setWidth(me.sizingConstants.minWidth);
                    me.setHeight(size / 14 > me.sizingConstants.minHeight ? size / 14 : me.sizingConstants.minHeight);
                }
                else {
                    //Horizontal layout calculations
                    me.setWidth(size < me.sizingConstants.maxWidth ? size : me.sizingConstants.maxWidth);
                    me.setHeight(size / 14 > me.sizingConstants.minHeight ? size / 14 : me.sizingConstants.minHeight);
                }
            } else {
                // over the threshold make it max, max height will be applied and content will scroll
                me.setWidth(me.sizingConstants.maxWidth);
                me.setHeight(size / 14 > me.sizingConstants.minHeight ? size / 14 : me.sizingConstants.minHeight);
            }
        }
    },

    hidePopup: function (args) {
        this.hide();
        if (this.closeCallback) {
            if (Ext.isFunction(this.closeCallback)) {
                this.closeCallback(args);
            } else {
                this.getController().fireEvent(this.closeCallback, args);
            }
        }
    },

    beforeclose: function () {
        Ext.destroy(this.getCloseKeymap());
    },

    afterRender: function () {
        var me = this;
        var win = Ext.ComponentQuery.query('app-main')[0];
        win.on('resize', function () {
            var pop = Ext.ComponentQuery.query('abppopup')[0];
            if (pop && !pop.hidden) {
                pop.setMaxHeight(Math.floor(ABP.util.Common.getWindowHeight() - (ABP.util.Common.getWindowHeight() / 30)));
                pop.updateLayout();
                pop.center();
            }
        });
        me.addBodyCls('framePop-body');
        me.callParent();
    },

    /**
    * Show a popup error message to the user
    * @deprecated since version 1.x
    * @param {string/string[]} [errorMessage] The error message to show to the user. An array of strings is accepted. Each string will be shown on its own line.
    * @param {string} [buttonMessage] The caption to show on the button
    * @param {function} [closeCallback] The callback function invoked when the user closes the popup
    * @param {object} [options]
    */
    showPopup: function (errorMessage, buttonMessage, closeCallback, options) {
        this.__showPopup(errorMessage, null, '!', { text: buttonMessage }, closeCallback, options);
    },

    /**
    * Show an information popup message to the user
    * @param {string/string[]} [message] The message to show to the user. An array of strings is accepted. Each string will be shown on its own line.
    * @param {string} [title] The caption / title of the popup
    * @param {object} [options]
    */
    showInfo: function (message, title, options) {
        this.__showPopup(message, title, 'i', null, null, options);
    },

    /**
    * Show an error popup message to the user
    * @param {string/string[]} [message] The error message to show to the user. An array of strings is accepted. Each string will be shown on its own line.
    * @param {string} [title] The caption / title of the popup
    * @param {object} [options]
    */
    showError: function (message, title, options) {
        this.__showPopup(message, title, '!', null, null, options);
    },

    /**
    * Show an popup message to the user asking the user to confirm with OK or Cancel
    * @param {string/string[]} [message] The message to show to the user. An array of strings is accepted. Each string will be shown on its own line.
    * @param {string} [title] The caption / title of the popup
    * @param {function} [closeCallback] The callback function invoked when the user closes the popup, passing true for OK and false for Cancel
    * @param {object} [options]
    */
    showOkCancel: function (message, title, callback, options) {
        this.__showPopup(message, title, '?', [{ text: 'error_ok_btn', defaultFocus: true, args: true }, { text: 'error_cancel_btn', args: false }], callback, options);
    },

    /**
    * Show an popup message to the user asking the user to confirm with Yes or No
    * @param {string/string[]} [message] The message to show to the user. An array of strings is accepted. Each string will be shown on its own line.
    * @param {string} [title] The caption / title of the popup
    * @param {function} [closeCallback] The callback function invoked when the user closes the popup, passing true for Yes and false for No
    * @param {object} [options]
    */
    showYesNo: function (message, title, callback, options) {
        this.__showPopup(message, title, '?', [{ text: 'error_yes_btn', defaultFocus: true, args: true }, { text: 'error_no_btn', args: false }], callback, options);
    },

    /**
    * Show an fully customised popup message to the user asking the user to confirm with Yes or No
    * @param {string/string[]} [message] The message to show to the user. An array of strings is accepted. Each string will be shown on its own line.
    * @param {string} [title] The caption / title of the popup
    * @param {string} [icon] '?' for question, "!" for warning or error, "i" for information, otherwise a font icon class can be provided.
    * @param {object} [buttonConfig] The config for the buttons to display on the popup
    * @param {function} [closeCallback] The callback function invoked when the user closes the popup
    * @param {object} [options]
    */
    customPopup: function (message, title, icon, buttonConfig, closeCallback, options) {
        this.__showPopup(message, title, icon, buttonConfig, closeCallback, options);
    },

    /**
    * Show a custom popup message to the user which includes a clickable hyperlink.
    * Clicking on the hyperlink closes the popup.
    * @param {String/string[]} [message] The message to show to the user. An array of strings is accepted. Each string will be shown on its own line.
    * @param {String} [url] The hyperlink url to show to the user
    * @param {String} [urlTarget] Optional. Browser target. For example, "_blank", "_top", etc. Leaving null results in "_blank".
    * @param {String} [urlDisplayText] Optional. If the URL has to be shown to the user (for example in a message) then if this text is supplied then it is shown instead of the URL.
    * @param {String} [title] The caption / title of the popup
    * @param {string} [icon] '?' for question, "!" for warning or error, "i" for information, otherwise a font icon class can be provided.
    * @param {Object} [buttonConfig] The config for the buttons to display on the popup
    * @param {Function} [closeCallback] The callback function invoked when the user closes the popup
    * @param {object} [options]
    */
    showHyperlink: function (message, url, urlTarget, urlDisplayText, title, icon, buttonConfig, closeCallback, options) {
        options = options || {};
        options.url = url;
        options.urlTarget = urlTarget;
        options.urlDisplayText = urlDisplayText;

        this.__showPopup(message, title, icon, buttonConfig, closeCallback, options);
    }

});
