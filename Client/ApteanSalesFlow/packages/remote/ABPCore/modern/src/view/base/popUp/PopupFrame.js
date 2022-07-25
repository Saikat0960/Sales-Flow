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
    extend: 'Ext.Panel',
    alias: 'widget.popupframe',
    requires: [
        'ABP.view.base.popUp.PopUpHeader'
    ],
    floated: true,
    centered: true,
    modal: true,
    header: {
        xtype: 'popupheader'
    },
    cls: 'framePop',
    width: '90%',
    maxWidth: 316,
    minHeight: 200,
    shadow: false,
    layout: 'fit',
    items: [{
        xtype: 'container',
        docked: 'bottom',
        itemId: 'errorPopButtonBar',
        cls: 'errorpop-buttonbar',
        layout: {
            type: 'hbox',
            pack: 'end'
        },
        items: [{
            xtype: 'button',
            height: 36,
            width: 100,
            itemId: 'abpPopFrameClose',
            cls: 'abp-popup-button',
            handler: function () {
                this.up('popupframe').closePopup();
            }
        }, {
            xtype: 'button',
            height: 36,
            width: 100,
            itemId: 'abpPopFrameSave',
            cls: 'abp-popup-button',
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
        }]
    }],
    initialize: function () {
        var me = this;
        if (me.config && me.config.buttonInfo) {
            if (me.config.buttonInfo.contentXtype) {
                me.add({
                    xtype: me.config.buttonInfo.contentXtype,
                    padding: 10
                });
            }
            if (me.config.buttonInfo.contentTitle) {
                me.setTitle(me.config.buttonInfo.contentTitle);
            }
        }
        // Not sure Why these don't work above when declaring the panel, but this actually makes them work - Joe
        me.setCentered(true);
        me.setModal(true);
        me.callParent(arguments);
        me.addBodyCls('framePop-body');
        // Not a fan of these either, but without proper vm hierachy this is what we have to do
        me.down('#abpPopFrameClose').setText(ABP.util.Common.geti18nString('button_close'));
        me.down('#abpPopFrameSave').setText(ABP.util.Common.geti18nString('login_save'));
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
    },
    addTool: function (tool) {
        var header = this.getHeader(),  // creates if header !== false
            items;

        if (header) {
            items = this.createTools(Ext.Array.from(tool), this);

            if (items && items.length) {
                items = header.add(items);
            }
        }

        return items;
    }
});