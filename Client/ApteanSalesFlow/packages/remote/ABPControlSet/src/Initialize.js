Ext.define('ABPControlSet.Initialize', {
    singleton: true,
    requires: [
        // Require all mixins.
        'ABPControlSet.base.view.*',
        'ABPControlSet.base.mixin.*',
        'ABPControlSet.mixin.*',
        'ABPControlSet.layout.*',
        'ABPControlSet.view.*',
        'ABPControlSet.store.*'
    ]
});
