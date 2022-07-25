/**
 * Sencha recommended override to resolve UI binding issue.
 * Sencha support ticket #51295 (ExtJs Classic) Error while binding UI
 */
Ext.define('overrides.Component', {
    override: 'Ext.Component'
}, function (Component) {
    // map setUi to setUI so that binding on 'ui' will work
    Component.createAlias('setUi', 'setUI');
});
