Ext.define('ABP.view.session.about.AboutViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.about',

    formulas: {
        viewPercent: {
            get: function () {
                var width = Ext.Viewport.getWindowWidth();
                var height = Ext.Viewport.getWindowHeight();
                var ssThresh = this.get('smallScreenThreshold');
                var percent = '60%';
                if (width <= ssThresh || height <= ssThresh) {
                    percent = '90%';
                }
                return percent;
            }
        }
    }

});