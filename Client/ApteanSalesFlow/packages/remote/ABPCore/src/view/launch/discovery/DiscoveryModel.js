Ext.define('ABP.view.launch.discovery.DiscoveryModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.discoverymodel',

    data: {
        email: '',
        organization: '',
        errorText: '',
    },
    formulas: {
        shouldOrgBeRequired: function (get) {
            var email = get('email'),
                unknownDomains = ['gmail', 'yahoo', 'google'];
                
            return new RegExp(unknownDomains.join("|")).test(email);
        }
    }
});