/**
 * @private
 */
Ext.define('ABP.view.launch.selectuser.SelectUserController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.selectusercontroller',
    requires: [
        'ABP.store.ABPEnvironmentStore'
    ],
    listen: {
        component: {
            '*': {
                selectuser_select: 'selectUser',
                selectuser_delete: 'deleteUser',
                selectuser_new: 'newUser'
            }
        },
        controller: {
            '*': {
                selectuser_load_users: 'loadUsers'
            }
        },
        store: {
            '#ABPEnvironmentStore': {
                datachanged: 'environmentStoreChanged'
            }
        }
    },

    /**
     * @private
     * One of the users has been clicked.
     * This makes this user the one to attempt login.
     */
    selectUser: function (record) {
        if (record) {
            var env = record.get('env');
            var user = record.get('username'); // Use the casefull version of the username - whatever the user typed in.
            var logonAsUserObj = ABP.util.Common.getLoginAsUserObj(
                env,
                user,
                ABP.util.LocalStorage.getForUser(env, user, 'sessionToken'),
                ABP.util.LocalStorage.getForUser(env, user, 'SavedLanguage'),
                ABP.util.LocalStorage.getForUser(env, user, 'SavedPassword') // Usually passwords are not saved in local storage. Instead a sessionToken is preferred.
            )
            this.fireEvent('main_loginAsUser', logonAsUserObj);
        }
    },

    /**
     * A user is being deleted from local storage.
     */
    deleteUser: function (record) {
        if (record) {
            // Remove the user from local storage.
            ABP.util.LocalStorage.removeAllForUser(record.get('env'), record.get('user'));
            // Refresh the list of users.
            var vm = this.getViewModel();
            if (vm) {
                var users = vm.getStore('userStore');
                if (users) {
                    users.reload();
                }
            }
        }
    },

    /**
     * Load the users into the store that is shown in the selection list.
     */
    loadUsers: function () {
        var vm = this.getViewModel();
        if (vm) {
            var users = vm.getStore('userStore');
            if (users) {
                users.load();

                if (users.numRealUsers) {
                    vm.set('selectedUser', users.getAt(1));
                }
                else{
                    // Always should have atleast 1 user
                    vm.set('selectedUser', users.getAt(0));
                }

                console.log('store loaded');
            }
        }
    },

    /**
     * Go to the login form.
     */
    newUser: function () {
        // Show the login panel.
        this.fireEvent('main_showLoginForNewUser', null);
    },

    /**
     * The set of selectable users depends on what environments are valid.
     * So if the environment store changes or is loaded, then re-evaluate
     * the selectable users.
     */
    environmentStoreChanged: function () {
        this.loadUsers();
    },

    init: function () {
        this.callParent();
        // Load users into dataview if the environments have been bootstrapped in.
        var vm = this.getViewModel();
        if (vm && vm.get('bootstrapped')) {
            this.loadUsers();
        }
    }

});