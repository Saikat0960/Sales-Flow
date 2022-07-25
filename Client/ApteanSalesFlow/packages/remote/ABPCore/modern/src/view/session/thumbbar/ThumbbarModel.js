Ext.define('ABP.view.session.thumbbar.ThumbbarModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.thumbbarmodel',

    data: {
        overCapacity: false,
        thumbOpen: false,
        portrait: null,
        trayOpen: false
    },
    formulas: {
        triggerShow: {
            bind: {
                _overCapacity: '{overCapacity}',
                _thumbOpen: '{thumbOpen}',
                _portrait: '{portrait}',
                _trayOpen: '{trayOpen}'
            },
            get: function (data) {
                // portrait orientation and tray populated = show
                return data._portrait && data._overCapacity && !data._trayOpen;
            }
        },
        trayShow: {
            bind: {
                _menuOpen: '{menuOpen}',
                _rpOpen: '{rightPaneOpen}',
                _trayOpen: '{trayOpen}',
            },
            get: function (data) {
                // menu or right pane open, we need them hidden
                var cont = this.getView().getController();
                if (data._menuOpen || data._rpOpen) {
                    if (data._trayOpen) {
                        cont.__closeTray();
                    }
                }
            }
        }
    }
});