/**
 * Utility class holding the common keyboard functions
 *
 * @since ABP 3.0.0
 */
Ext.define('ABP.util.Keyboard', {
    singleton: true,

    /**
     * Attempt to set the keyboard focus to a specific element.
     */
    focus: function (selector) {
        var cmps = Ext.query(selector, false)
        if (cmps && cmps.length > 0) {
            // Need to get the actual component, as there's a slight bug i sencha query.
            var extCmp = Ext.getCmp(cmps[0].id);
            if (extCmp){
                Ext.getCmp(extCmp.id).focus(50);
                return true;
            }
            else {
                // Loop through the elements ensuring we don't set focus to a tab-guarded
                // element 'x-tab-guard'
                for (i=0; i<cmps.length; i++){
                    if (!cmps[i].hasCls('x-tab-guard')){
                        if (cmps[i].focus){
                            cmps[i].focus();
                            return true;
                        }
                    }
                }
                
            }
        }

        return false;
    }
});