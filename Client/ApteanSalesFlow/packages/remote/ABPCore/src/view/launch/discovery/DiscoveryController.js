/**
 * @private
 *
 */
Ext.define('ABP.view.launch.discovery.DiscoveryController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.discoverycontroller',
    
    // Note this is only used for Classic (Modern does not have a boxready event)
    onBoxready: function (event, fn) {
        var me = this,
            vm = me.getViewModel(),
            view = me.getView();

        // Focus the email field
        view.down('#email').focus();
    },

    handleSpecialKeys: function(field, e){
        if (e.getKey() == e.ENTER) {
            this.loginButtonClick();
        }
    },
    
    loginButtonClick: function () {
        var me = this,
            view = this.getView(),
            vm = this.getViewModel(),
            email = vm.get('email'),
            emailField = view.down('#email');

        if (emailField.isValid() && email) {
            // Discover users organization and their auth details and redirect
            vm.set('errorText', null);
            me.fireEvent('main_showLoading', 'load_discovering', 'fullSize');
            ABP.util.Discovery.discover(email, function () {                
                // Failure function.
                this.fireEvent('main_hideLoading');
                this.fireEvent('main_ShowLogin');                                
            }.bind(me));
        } else {
            vm.set('errorText', "Fill in necessary fields");
        }
    },

    discoverFailure: function (failureMessage) {
        var vm = this.getViewModel();

        me.fireEvent('main_hideLoading');
        vm.set('errorText', failureMessage);
    }
});
