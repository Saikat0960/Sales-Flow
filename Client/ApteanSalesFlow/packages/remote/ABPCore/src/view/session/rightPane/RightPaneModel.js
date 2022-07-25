Ext.define('ABP.view.session.rightPane.RightPaneModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.rightpanemodel',

    data: {
        tabPrefix: 'rightPaneTab_',
        menuWidth: 330
    },

    formulas: {
        micro: {
            get: function () {
                var width;
                var height;
                var ssThresh;
                var ret = false;
                var isModern = Ext.os.deviceType === "Phone";

                if (isModern) {
                    width = ABP.util.Common.getWindowWidth();
                    height = ABP.util.Common.getWindowHeight();
                    if (isModern) {
                        ret = true;
                    }
                    this.setMenu(ret);
                }
                return ret;
            }
        },

        iconCls: {
            bind: '{profilePhoto}',
            get: function (photoUrl) {
                if (photoUrl) {
                    return 'profile-picture';
                }
                return 'icon-user';
            }
        }
    },

    setMenu: function (micro) {
        var me = this;
        var isClassic = Ext.os.deviceType === 'Tablet' || Ext.os.deviceType === 'Desktop';
        if (!micro) {
            if (isClassic) {
                me.set('menuWidth', 250);
            } else {
                me.set('menuWidth', 300);
            }
        } else {
            me.set('menuWidth', '100%');
        }
    }
});
