Ext.define('ABP.view.launch.selectuser.SelectUserModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.selectusermodel',
    requires: [
        'Ext.data.StoreManager'
    ],

    data: {
        selectedUser: null
    },

    stores: {
        // Define a "local" store that is only defined and used by the select user views.
        // No reason to define it and its model any more globally.
        userStore: {
            fields: [
                'env',
                'user',
                'envName'
            ],

            autoLoad: false, // Do not want to load until boostrap is loaded. At which point we will know what environments are valid.
            autoSync: true, // Flush to memory any change.

            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            },

            // Count of actual users, versus temporary ones added to support logging is as a new user
            // (a feature that in the future might get disabled by a config).
            numRealUsers: 0,

            load: function () {
                // Get known users for known environments.
                var users = ABP.util.LocalStorage.getUserData();
                if (!Ext.isArray(users)) {
                    users = []; // Initialize to an array anyway for later use.
                }

                // Sort the users by most recently used first.
                Ext.Array.sort(users,
                    function (a, b) {
                        if (Ext.isObject(a) && Ext.isObject(b)) {
                            var aDate = parseInt(a.data.LastLogin);
                            var bDate = parseInt(b.data.LastLogin);
                            if (aDate && !bDate) {
                                return -1;
                            } else if (!aDate && bDate) {
                                return 1;
                            } else if (!aDate && !bDate) {
                                return 0;
                            } else if (aDate < bDate) {
                                return 1;
                            } else if (aDate > bDate) {
                                return -1;
                            }
                        }
                        return 0;
                    }
                );

                // Provide environment name, or remove entry if the environment no longer exists.
                var envStore = Ext.data.StoreManager.lookup("ABPEnvironmentStore");
                if (envStore) {
                    if (Ext.isArray(users) && users.length > 0) {
                        for (var i = 0; i < users.length; i++) {
                            var env = envStore.getById(users[i].env);
                            if (env) {
                                // Add the environment name to the info that will be displayed.
                                users[i].envName = env.data.name;
                            } else {
                                // Clean up the local storage - invalid environments should not be present.
                                Ext.Array.removeAt(users, i);
                                i--; // Decrement array counter because we just removed an array element.
                            }
                        }
                    }
                }

                // Number of real users.
                this.numRealUsers = users.length;

                // Add an alternative entry at the top for using a new user.
                users.unshift({
                    user: ABP.util.Common.geti18nString('login_selectUserAnotherUser'),
                    username: ABP.util.Common.geti18nString('login_selectUserAnotherUser'),
                    useAnotherUser: true
                });

                // Put the users into the store.
                this.loadData(users);

                return this;
            }
        }
    },
});
