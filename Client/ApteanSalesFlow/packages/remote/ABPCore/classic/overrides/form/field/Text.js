Ext.define('ABP.form.field.Text', {
    override: 'Ext.form.field.Text',

    setVtypeText: function (val) {
        if (val !== undefined) {
            this.vtypeText = val;
        }
    }
});
