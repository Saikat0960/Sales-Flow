Ext.define('ABP.view.base.popUp.ShowByPopUp', {
    extend: 'Ext.Panel',
    alias: 'widget.abpshowbypopup',
    cls: 'abpshowbypopup',
    left: 0,
    modal: true,
    hideOnMaskTap: true,
    hide: function () {
        this.destroy();
    }
});