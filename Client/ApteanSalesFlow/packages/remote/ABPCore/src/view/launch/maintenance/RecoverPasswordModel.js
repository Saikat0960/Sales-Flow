Ext.define('ABP.view.launch.maintenance.RecoverPasswordModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.recoverpassword',

    data: {
        recover_id: ''
    },

    formulas: {
        environment: {
            bind: {
                _def: '{bootstrapConf.defaultEnvironment}',
                _avail: '{bootstrapConf.availableEnvironments}',
                _selected: '{env_selection}'
            },
            get: function (data) {
                if (data._selected && data._selected.id) {
                    return data._selected.id;
                }
                var i;
                if (data._def && data._avail) {
                    for (i = 0; i < data._avail.length; ++i) {
                        if (data._avail[i].id === data._def || data._avail[i].name === data._def) {
                            return data._avail[i].id;
                        }
                    }
                } else if (data._avail.length > 0) {
                    return data._avail[0].id;
                }
                return null;
            }
        }
    }
});
