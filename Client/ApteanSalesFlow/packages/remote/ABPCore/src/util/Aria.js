/**
 * Utility class used to manipulate the sencha components and DOM elemtents to enhance the ARIA behavior
 */
Ext.define('ABP.util.Aria', {
    singleton: true,

    /**
     * Utility function to set the value of the aria-expanded attribute
     * 
     * Use for textfields that control / own a popup menu.
     * 
     * @param {Object} cmp the Sencha component to set the expanded attrbute on 
     * @param {Boolean} expanded whether to set the attribute as expanded 
     */
    setExpanded: function(cmp, expanded){
        if (!cmp) {
            return;
        }

        if (cmp.inputEl) {
            cmp.inputEl.dom.setAttribute('aria-expanded', expanded);
        }
    },

    /**
     * Utility function to set the value of the aria-activedescendant attribute
     * 
     * The activedescendant attribute should be set when a textbox controls a popup and the value selected in the popup wil be used in the textbox.
     * 
     * @param {Object} cmp the Sencha component to set the expanded attrbute on 
     * @param {String} selectedId the id of the selected element 
     */
    setActiveDecendant: function(cmp, selectedId){
        if (!cmp) {
            return;
        }

        if (cmp.inputEl) {
            cmp.inputEl.dom.setAttribute('aria-activedescendant', selectedId);
        }
        
    },

    /**
     * Utility function to encode an aria label so it can be displayed in an attribute.
     * 
     * For string values displayed in the aria attributes we don't want to encode the HTML chars as they 
     * are not read by the screen readers, so instead we will remove them from the string.
     * 
     * @param {String} s the original string that is going to be added to an attribute
     */
    encodeAttribute: function(s){
        if (!s){
            return s;
        }

        s = String(s).replace(/&/g, '')
                .replace(/"/g, '')
                .replace(/'/g, '')
                .replace(/</g, '')
                .replace(/>/g, '');
        return Ext.String.htmlEncode(s);
    }
});

// Extend the Ext format class to support the aria label formatting
Ext.apply(Ext.util.Format, {
    ariaEncode: function (v) {
        return ABP.util.Aria.encodeAttribute(v);
    }
});