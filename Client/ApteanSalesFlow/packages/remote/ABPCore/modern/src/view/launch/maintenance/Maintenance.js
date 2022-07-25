Ext.define('ABP.view.launch.maintenance.Maintenance', {
    extend: 'Ext.Container',
    requires: [
        'ABP.view.launch.maintenance.ForcePassword',
        'ABP.view.launch.maintenance.RecoverPassword',
        'ABP.view.launch.maintenance.ExtraStep',
        'ABP.view.launch.maintenance.OfflinePassword'
    ],
    alias: 'widget.maintenance',
    height: '100%',
    items: [],
    cls: 'maintenance-modern',
    showScreen: function (xtypeToShow, additionalStepInfo) {
        var xtypeToShowObj = this.down(xtypeToShow);
        if (xtypeToShowObj && xtypeToShow === 'maintenanceextrastep') {
            // Always replace xtype here - data may have changed.
            this.removeAll();
            this.add({ xtype: xtypeToShow, additionalInfo: additionalStepInfo });
        }
        if (!xtypeToShowObj) {
            this.removeAll();
            this.add({ xtype: xtypeToShow, additionalInfo: additionalStepInfo });
        }
    }
});
