/**
 * Static class to manage an Ajax request queue.
 */
Ext.define('ABP.util.RequestQueue', {
    alternateClassName: 'ABPRequestQueue',
    singleton: true,
    requestQueue: [],

    /**
     * Pushes a request into the queue.
     */
    push: function (request) {
        var me = this;
        if (request && request.url) {
            me.requestQueue.push(request);
            ABPLogger.logDebug('Queued request: ' + request.url);
        }
    },

    /**
     * Starts sending the requests in queue. 
     * These requests will happen more or less simultaneously so the order in which they resolve is not guarenteed.
     */
    start: function () {
        var me = this;
        while (!Ext.isEmpty(me.requestQueue)) {
            var request = me.pop();
            if (request) {
                ABPLogger.logDebug('Retry request from queue: ' + request.url);
                ABP.util.Ajax.request(request);
            }
        }
    },

    /**
     * If the queue is empty or not.
     * @returns whether or not the queue is empty.
     */
    isEmpty: function () {
        return Ext.isEmpty(this.requestQueue);
    },

    privates: {

        /**
         * Removes the first item of the queue.
         * @returns the first request in the queue.
         * @private
         */
        pop: function () {
            var me = this;
            if (!Ext.isEmpty(me.requestQueue) && me.requestQueue.length > 0) {
                var nextRequest = me.requestQueue[0];

                /*if a request was put into the queue because its response code was 401, 
                we want to remove the authorization header so our ajax.js request function can give it a new one. 
                currently, headers are only applied by the request function if they do not already exist (Ext.applyIf)*/
                if (nextRequest.headers && nextRequest.headers.Authorization) {
                    delete nextRequest.headers.Authorization;
                }
                Ext.Array.removeAt(me.requestQueue, 0);
                return nextRequest;
            }
        }
    }

});