/**
 * Allows products to register (through their Initialize.js file) against ABP Ajax calls.  This can allow the products to be informed of
 * success/failure to handle details for themselves, or substitute the Ajax call and pass the return back to ABP.
 */
Ext.define('ABP.util.AjaxInteractionManager', {
    singleton: true,

    requires: [
        'ABP.util.Logger'
    ],

    config: {
        registeredAjaxCommunications: {},
        registeredAjaxSubstitutions: {},
        registeredAjaxUrlQueryStringParameters: {}
    },

    constructor: function (config) {
        this.initConfig(config);
    },

    /**
     * Returns the Interactions registered against the ajaxIdentifier
     * @param {String} ajaxIdentifier the Ajax request to get requests for.  Use ABP.util.Ajax.availableRequests for best results
     * @return {Object} the interaction registered for the ajaxIdentifier
     * @return {Array} return.communications - the array of communications objects registered against the ajaxIdentifier
     * @return {Object} return.substitute - the substitute object registered against the ajaxIdentifier
     */
    getAjaxInteractions: function (ajaxIdentifier) {
        var communications = this.getRegisteredAjaxCommunications()[ajaxIdentifier];
        var substitute = this.getRegisteredAjaxSubstitutions()[ajaxIdentifier];
        var urlQueryStringParameters = this.getRegisteredAjaxUrlQueryStringParameters()[ajaxIdentifier];
        var ret = null;
        if (communications || substitute || urlQueryStringParameters) {
            ret = {
                'communications': communications,
                'substitute': substitute,
                'urlQueryStringParameters': urlQueryStringParameters
            };
        }
        return ret;
    },
    /**
     * Registers a communication against the ajaxIdentifier.
     * Once the request returns, the registered success or failure handlers will be called in order of registration,
     * then the original Ajax success or failure function will be called.
     * Communications will fire in the order they are registered and ABP will handle the original success/failure last.
     * @param {String} ajaxIdentifier the Ajax request to register against.  Use ABP.util.Ajax.availableRequests for best results
     * @param {String} appId appId of package this is coming from
     * @param {Object} handlerObj Object container the handlers for success and failure
     *       handlerObj:
     *              - `success` - {Function/String} additional success handler to call before original Ajax request success is called
     *              - `failure` - {Function/String} additional failure handler to call before original Ajax request failure is called
     */
    registerAjaxCommunication: function (ajaxIdentifier, appId, handlerObj) {
        ABP.util.Logger.logTrace("Registering Ajax Communication: " + ajaxIdentifier + ' for ' + appId);
        if (this.getRegisteredAjaxCommunications()[ajaxIdentifier]) {
            this.getRegisteredAjaxCommunications()[ajaxIdentifier].push({
                'appId': appId,
                'handlerObj': handlerObj
            });
        } else {
            this.getRegisteredAjaxCommunications()[ajaxIdentifier] = [{
                'appId': appId,
                'handlerObj': handlerObj
            }];
        }
    },
    /**
     * Registers a substitute against the ajaxIdentifier
     * A substitute will prevent the Ajax request from sending.  Instead it will call the function defined as substituteFunc, passing the Ajax options.
     * It is necessary for the handling function to still call the options.success or options.failure, passing the corresponding JSON return for ABP to handle the return.
     * Only a single substitute can be registered against an Ajax request.  In the event that more than one package registers
     * a substitute, the last registered will overwrite the one before it.
     * @param {String} ajaxIdentifier the Ajax request to register against.  Use ABP.util.Ajax.availableRequests for best results
     * @param {String} appId appId of package this is coming from
     * @param {Function / String} substituteFunc the function that should be called to handle the request instead of proceeding with the Ajax request
     */
    registerAjaxSubstitute: function (ajaxIdentifier, appId, substituteFunc) {
        ABP.util.Logger.logTrace("Registering Ajax Override: " + ajaxIdentifier + ' for ' + appId);
        this.getRegisteredAjaxSubstitutions()[ajaxIdentifier] = {
            'appId': appId,
            'substituteFunc': substituteFunc
        };
    },
    /**
     * Registers a url query string parameter against the ajaxIdentifier
     * adds an additional url query string parameter to the options.url of the request
     * @param {String} ajaxIdentifier the Ajax request to register against.  Use ABP.util.Ajax.availableRequests for best results or 'all' for all the ABP.util.Ajax.availableRequests
     * @param {String} parameterName appId of package this is coming from
     * @param {String} parameterValue the function that should be called to handle the request instead of proceeding with the Ajax request
     */
    registerAjaxUrlQueryStringParameter: function (ajaxIdentifier, parameterName, parameterValue) {
        var me = this;
        ABP.util.Logger.logTrace("Registering Ajax Query String Parameter: " + ajaxIdentifier + ' of ' + parameterName + ':' + parameterValue);
        if (ajaxIdentifier !== 'all'){
            me.__setUrlQueryStringParameter(ajaxIdentifier, parameterName, parameterValue);
        } else {
            var availableRequests = ABP.util.Ajax.availableRequests;
            for (prop in availableRequests) {
                me.__setUrlQueryStringParameter(prop, parameterName, parameterValue);
            }
        }
    },

    privates: {
        __setUrlQueryStringParameter: function (ajaxIdentifier, parameterName, parameterValue) {
            var me = this;
            if (me.getRegisteredAjaxUrlQueryStringParameters()[ajaxIdentifier]) {
                me.getRegisteredAjaxUrlQueryStringParameters()[ajaxIdentifier].push({
                    'name': parameterName,
                    'value': parameterValue
                });
            } else {
                me.getRegisteredAjaxUrlQueryStringParameters()[ajaxIdentifier] = [{
                    'name': parameterName,
                    'value': parameterValue
                }];
            }
        }
    }
});
