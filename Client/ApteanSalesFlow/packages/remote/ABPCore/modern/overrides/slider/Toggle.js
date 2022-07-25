Ext.define('ABP.view.overrides.slider.Toggle', {
    override: 'Ext.slider.Toggle',

    setValue: function (newValue, oldValue) {
        this.callParent([newValue, oldValue]);
        if (this.thumbs && this.thumbs.length > 0) {
            this.onChange(this.thumbs[0], newValue, oldValue);
        }
    }
});