Ext.define('ABP.view.overrides.PickerOverride', {
    override: 'Ext.picker.Picker',

    bind: {
        doneButton: '{i18n.selectfield_mobile_done:htmlEncode}',
        cancelButton: '{i18n.error_cancel_btn:htmlEncode}'
    }
});
