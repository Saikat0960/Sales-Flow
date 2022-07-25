/**
 * @private
 * Use the actual width of the label when calculating the width adjustment rather than use the configured
 */
Ext.define('Overrides.layout.component.field.FieldContainer', {
    override: 'Ext.layout.component.field.FieldContainer',
    privates: {
        getWidthAdjustment: function () {
            var owner = this.owner,
                w = 0;

            if (owner.labelAlign !== 'top' && owner.hasVisibleLabel()) {
                var labelWidth = Ext.isNumber(owner.labelWidth) ? owner.labelWidth : owner.labelEl ? owner.labelEl.getWidth() : 0;
                w += (labelWidth + (owner.labelPad || 0));
            }

            if (owner.msgTarget === 'side' && owner.hasActiveError()) {
                w += owner.errorWrapEl.getWidth();
            }

            return w + owner.bodyEl.getPadding('lr');
        }
    }
});