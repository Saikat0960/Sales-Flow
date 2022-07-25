Ext.define('ABP.view.session.subMenu.SubMenu', {
    extend: 'Ext.ActionSheet',
    alias: 'widget.submenu',
    requires: [
        'ABP.view.session.subMenu.SubMenuController'
    ],

    controller: 'submenucontroller',
    cls: 'ABP-submenu',
    width: 175,
    modal: true,
    hideOnMaskTap: true,

    hide: function () {
        this.destroy();
    },

    initialize: function () {
        var me = this;
        var configButtons = me.menuButtons;
        var buttons = [];
        var currButton = {};
        var i = 0;
        var labelString;
        var vm = Ext.ComponentQuery.query('app-main')[0].getViewModel();
        if (configButtons && configButtons.length > 0) {
            for (i; i < configButtons.length; ++i) {
                currButton = {

                    event: configButtons[i].event,
                    activateApp: configButtons[i].activateApp,
                    eventArgs: configButtons[i].eventArgs,
                    cls: 'ABP-submenu-button',
                    pressedCls: 'ABP-submenu-buttonpressed',
                    handler: 'subOptionClick'
                };
                if (configButtons[i].labelKey && configButtons[i].labelKey !== '') {
                    currButton.text = vm.checkI18n(configButtons[i].labelKey);
                    if (currButton.text === configButtons[i].labelKey) {
                        currButton.text = configButtons[i].label;
                    }
                } else {
                    currButton.text = configButtons[i].label;
                }
                buttons.push(currButton);
            }
        }
        if (buttons.length > 0) {
            me.setItems(buttons);
            me.setHeight(40 * buttons.length);
        }
    }
});