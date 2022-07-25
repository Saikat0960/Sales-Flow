Ext.define('ABP.view.base.abpNumberField.ABPNumberField', {
    extend: 'Ext.field.Number',

    alias: 'widget.abpnumberfield',

    privates: {
        getValue: function () {
            this.callParent();
            var maxLength = this.getMaxLength();
            var val = this._value;
            if (!maxLength) {
                return val;
            }
            var valLen = val.toString().length;
            if (valLen > maxLength) {
                ret = val.toString().slice(0, maxLength);
                this.setValue(ret);
            } else {
                ret = val;
            }
            return val;
        }
    },
    checkValue: function () {
        var ret = true;
        var val = this._value;
        var maxVal = this.getMaxValue();
        var minVal = this.getMinValue();
        var valString;
        if (minVal && val < minVal) {
            valString = ABP.util.Common.geti18nString('login_extraValue');
            ret = false;

            ABP.view.base.popUp.PopUp.showError(this.getPlaceholder() + ' ' + valString + ' (' + minVal + '-' + maxVal + ')');
        } else if (maxVal && val > maxVal) {
            valString = ABP.util.Common.geti18nString('login_extraValue');
            ret = false;

            ABP.view.base.popUp.PopUp.showError(this.getPlaceholder() + ' ' + valString + ' (' + minVal + '-' + maxVal + ')');
        }
        return ret;
    },
    getErrorString: function () {
        var maxVal = this.getMaxValue();
        var minVal = this.getMinValue();
        var valString = ABP.util.Common.geti18nString('login_extraValue');
        return this.getPlaceholder() + ' ' + valString + ' (' + minVal + '-' + maxVal + ')'
    },
    syncEmptyCls: function () {
        var val = this._value,
            empty = (val !== undefined && val !== null && val !== '');
        this.toggleCls(this.emptyCls, !empty);
    }
});