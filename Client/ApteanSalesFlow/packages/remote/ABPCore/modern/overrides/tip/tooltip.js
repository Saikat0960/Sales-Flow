/**
 * Override of Modern Ext.tip.ToolTip.
 * 
 * Fixes bug where moving outside of an element showing a tooltip does not hide the tooltip.
 */
Ext.define('ABP.tip.ToolTip', {
    override: 'Ext.tip.ToolTip',

    privates: {
        onTargetOut: function (e) {
            // We have exited the current target
            if (this.currentTarget.dom && !this.currentTarget.contains(e.relatedTarget)) {
                // APTEAN OVERRIDE START 
                // If allowOver is not set or if it is set but we haven't moved into the tip, then kick off the hide timer
                if (!this.getAllowOver() ||
                    (this.getAllowOver() && !e.within(this.el, true))) { // Note: NOT within.
                    // APTEAN OVERRIDE END
                    this.handleTargetOut();
                }
            }
        }
    }
});
