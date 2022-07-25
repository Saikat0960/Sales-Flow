Ext.define('ABP.view.overrides.ABPTreeListItemOverride', {
    override: 'ABP.view.session.mainMenu.ABPTreeListItem',

    onFocus: function () {
        this.addFocusCls();
    },
    onBlur: function () {
        this.removeFocusCls();
    }

});