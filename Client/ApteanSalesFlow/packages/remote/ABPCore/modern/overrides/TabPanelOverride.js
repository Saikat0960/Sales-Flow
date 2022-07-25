Ext.define('ABP.view.overrides.TabPanelOverride', {
    override: 'Ext.Container',

    getComponent: function (component) {
        if (this.destroyed) {
            return null;
        }
        if (typeof component === 'number') {
            return this.getItems().getAt(component);
        }
        if (Ext.isObject(component)) {
            component = component.getItemId();
        }
        return this.getItems().get(component);
    }
});