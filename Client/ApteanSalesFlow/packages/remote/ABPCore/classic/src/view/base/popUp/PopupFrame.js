/**
 * Blank poup panel for launch canvas extra buttons
 *
 * Made by ABP to house extra controls on login/settings from the product packages and launched by a configured button
 *
 * Will be supplied an xtype to run inside
 *
 * Standard Save and Close buttons docked to bottom
 * - Save will envoke a function on the internal content to request json formatted data to be sent in bootstrap/gonfiguration
 * - Close will close the popup
 */
Ext.define('ABP.view.base.popUp.PopUpFrame', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.popupframe',
    requires: [
        'ABP.view.base.popUp.PopUpHeader'
    ],

    floating: true,
    centered: true,
    modal: true,
    //cls: 'errorPop',
    cls: 'framePop',
    ui: 'popup',
    width: '50%',
    minHeight: 200,
    shadow: false,
    header: {
        xtype: 'popupheader'
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
                text: '{i18n.login_save:htmlEncode}'
            },
            handler: function () {
                var pop = this.up('popupframe');
                var inner = {};
                var ret;
                if (pop.config && pop.config.buttonInfo && pop.config.buttonInfo.contentXtype) {
                    inner = pop.down(pop.config.buttonInfo.contentXtype);
                    if (inner && inner.getController() && inner.getController().getSaveData) {
                        ret = inner.getController().getSaveData();
                        if (ret) {
                            pop.config.returnData = ret;
                        }
                    } else {
                        pop.closePopup();
                    }
                } else {
                    pop.closePopup();
                }
            }
        }, {
            xtype: 'button',
            frame: false,
            width: 100,
            cls: 'abp-popup-button',
            bind: {
                text: '{i18n.button_close:htmlEncode}'
            },
            handler: function () {
                this.up('popupframe').closePopup();
            }
        }]
    }],
    initComponent: function () {
        if (this.config && this.config.buttonInfo) {
            if (this.config.buttonInfo.contentXtype) {
                this.items = [{
                    xtype: this.config.buttonInfo.contentXtype,
                    padding: 10
                }];
            }
            if (this.config.buttonInfo.contentTitle) {
                //this.setTitle(this.config.buttonInfo.contentTitle);
                this.header.title = this.config.buttonInfo.contentTitle;
            }
        }
        this.addBodyCls('framePop-body');
        this.callParent();
    },
    closePopup: function () {
        if (this.config && this.config.returnData && this.config.returnData) {
            //add to button value
            Ext.getApplication().getMainView().down('[fieldId=' + this.config.buttonInfo.fieldId + ']').setFieldData(this.config.returnData);
        }
        this.destroy();
    },
    getHeader: function () {
        return this.header.getInnerHeader();
    }
});
