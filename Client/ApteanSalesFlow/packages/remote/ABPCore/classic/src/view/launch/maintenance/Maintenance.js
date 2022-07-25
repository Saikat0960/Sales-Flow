Ext.define('ABP.view.launch.maintenance.Maintenance', {
    extend: 'Ext.container.Container',
    requires: [
        'ABP.view.launch.maintenance.RecoverPassword',
        'ABP.view.launch.maintenance.ForcePassword',
        'ABP.view.launch.maintenance.ExtraStep',
        'ABP.view.launch.maintenance.OfflinePassword'
    ],
    alias: 'widget.maintenance',
    layout: {
        type: 'fit'
    },
    items: [],

    // xtypeToShow - maintenance pane to show
    // additionalXType - for ExtraStep pane, xtype to render inside
    showScreen: function (xtypeToShow, additionalStepInfo) {
        // If an extra auth step is being shown be sure to remove the old component if the xtype has changed.
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