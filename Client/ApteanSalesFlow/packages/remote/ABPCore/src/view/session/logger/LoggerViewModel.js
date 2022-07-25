Ext.define('ABP.view.session.logger.LoggerViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.loggerviewmodel',

    stores: {
        severity: {
            fields: ["display", "value"],
            data: [
                { "display": "All Logs", "value": "ALL" },
                { "display": "Info", "value": "INFO" },
                { "display": "Warning", "value": "WARN" },
                { "display": "Accessibility", "value": "ARIA" },
                { "display": "Error", "value": "ERROR" },
                { "display": "Fatal", "value": "FATAL" },
                { "display": "Trace", "value": "TRACE" },
                { "display": "Debug", "value": "DEBUG" }
            ]
        }
    }
});