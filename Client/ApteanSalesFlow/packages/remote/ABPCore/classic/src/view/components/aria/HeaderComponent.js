/** 
 * An ARIA accessible wrapper for a component that adds the aria-role and aria-level attributes
 */
Ext.define('ABP.view.components.aria.HeaderComponent', {
    extend: 'Ext.Component',
    alias: 'widget.abpheadercomponent',

    ariaRole: 'header',
    ariaAttributes: {
        'aria-level': '2'
    }
});