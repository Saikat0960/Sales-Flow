
Ext.define('Overrides.BaseFieldOverride', {
    override: 'Ext.form.field.Base',

    getLabelableRenderData: function () {
        var me = this,
            data = me.callParent();
        if (me.allowBlank === false || me.required === true) { // required can be set to true/false for control set field configs.
            if (!ABP.util.Common.getModern()) {
                data.labelCls = 'abp-mandatory ' + data.labelCls;
            }
        }
        return data;
    },

    /**
     * Sencha recommended override to resolve UI binding issue on form fields.
     * Sencha support ticket #51295 (ExtJs Classic) Error while binding UI
     */
    privates: {

        elClsMap: {
            //'inputEl': 'typeCls', // won't work, have to handle separately (see updateChildElsUICls method)
            'labelEl': ['labelCls', 'labelInnerCls'],
            'bodyEl': ['baseBodyCls', 'fieldBodyCls'],
            'errorWrapEl': 'errorWrapCls',
            'errorEl': 'invalidMsgCls',
            'inputWrap': 'inputWrapCls',
            'triggerWrap': 'triggerWrapCls',
            'placeholderLabel': 'placeholderCoverCls'
        },

        addUIToElement: function () {
            this.callParent();
            this.updateChildElsUICls(true);
        },
        removeUIFromElement: function () {
            this.callParent();
            this.updateChildElsUICls(false);
        },

        // based off the same method in the Button class
        // but allows for a elClsMap key to map to an array
        updateChildElsUICls: function (add) {
            var me = this,
                ui = me.ui,
                state = add ? 'addCls' : 'removeCls',
                elClsMap = me.elClsMap,
                key, el, mapCls, cls, mapClsLen, i;

            for (key in elClsMap) {
                el = me[key];
                mapCls = elClsMap[key];
                if (!Ext.isArray(mapCls)) {
                    mapCls = [mapCls];
                }
                for (i = 0; mapClsLen = mapCls.length, i < mapClsLen; i++) {
                    cls = me[mapCls[i]];
                    if (el && cls) {
                        el[state](cls + '-' + ui);
                    }
                }
            }


            // handle inputEl and the x-form-text cls separately since there isn't a property for it.
            if (me.inputEl) {
                me.inputEl[state]('x-form-text-' + ui);
            }
        }
    }
});