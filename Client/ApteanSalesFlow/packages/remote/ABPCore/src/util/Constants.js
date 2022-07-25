/**
 * ABP constants to use through the packages.
 */
Ext.define('ABP.util.Constants', {
    statics: {
        /**
         * The base font used throughout ABP
         *
         * for example:
         *
         * ABP.util.Constants.BASE_FONT
         */
        BASE_FONT: 'roboto, opensans, arial',

        /**
         * The width which triggers the responsive layout for small devices.
         * Defaults to 510px
         */
        RESPONSIVE_SNAPPOINT_WIDTH: 510,

        /**
         * The extra width needed to account for different styling on required field labels.
         */
        REQUIRED_FIELD_LABEL_INCREMENT: 10,

        /**
         * The list of colours from the design pallete that should be used in charts / graphs
         *
         * for example to use the colors in a pir chart bind to this array:
         *
         * series: {
         *       type: 'pie',
         *       bind: {
         *           colors: ABP.util.Constants.GRAPH_COLORS
         *       },
         */
        GRAPH_COLORS: [
            '#B23875', // Viola
            '#00E5D3', // Neptune
            '#B488FA', // Mauve
            '#12AEED', // Cerulean
            '#FF990A', // California
            '#FF366C', // Radical Red
            '#21C042', // Meadow
            '#4328B7', // Victoria
        ],

        CHART_COLORS: {
            victoria: '#4328B7',
            meadow: '#21C042',
            radicalRed: '#FF366C',
            california: '#FF990A',
            cerulean: '#12AEED',
            mauve: '#B488FA',
            neptune: '#00E5D3',
            viola: '#B23875',
            red: '#C90813',
        },

        /**
         * Regex to detect automation classes in a CSS string.
        */
        AUTOMATION_CLASS_REGEX: /\b(a-[a-zA-Z0-9-]+)\b/gm,

        /**
         * List of the standard colors used throughout the ABP applications
         *
         * ABP.util.Constants.colors.Blue
         * ABP.util.Constants.colors.BodyBackground
         */
        colors: {
            AlertRed: '#BD202E',
            WarningOrange: '#F7941E',
            ListHeader: '#969290',
            BodyBackground: '#E6E6E6',
            BodyColor: '#333333',
            Black: '#000000',
            White: '#FFFFFF',
            Blue: '#1284c7',
            Green: '#87B840',
            Text: '#33363a',
            Text: '#33363a', // Deep Grey
            LightText: '#49575B', // Dark Grey
            AxisText: '#59686C', // Nevada
            LightGreen: '#8cc640'
        },

        /**
         * Right Pane button badge states. Priority is Alert > Warning > Success > Info.
         */
        badgePriority: {
            Alert: '#C90813',
            Warning: '#EC641F',
            Success: '#0B9B29',
            Info: '#30ACDE'
        },

        /**
         * Login.
         */
        login: {
            // Number of seconds the local storage is valid for that holds info about which user to use when launching ABP in a tab.
            // Beyond this, the local storage LoginAsUser will be ignored and deleted, when detected.
            loginAsUserLifetime: 60 // In seconds.
        },

        /**
         * Html for the ABP loading lines. You may use this as HTML directly for your component. 
         *  Eg. 
         *      {
         *          xtype: 'component',
         *          html: ABP.util.Constants.loadingLinesHtml }
         *      }
         */
        loadingLinesHtml: '<div class="abp-loadmask loading-bars"><div class="bars slim"> <div class="rect1"></div> <div class="rect2"></div> <div class="rect3"></div> <div class="rect4"></div> <div class="rect5"></div> </div></div>',
    }
});
