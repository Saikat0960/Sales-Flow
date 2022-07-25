Ext.define('ABP.SenchaTextOverrides.data.validator.Bound', {
    override: 'Ext.data.validator.Bound',
    getEmptyMessage: function () {
        return ABP.util.Common.geti18nString('s_dataValidator_bound_emptyMessage');
    },
    getMinOnlyMessage: function () {
        return ABP.util.Common.geti18nString('s_dataValidator_bound_minOnlyMessage');
    },
    getMaxOnlyMessage: function () {
        return ABP.util.Common.geti18nString('s_dataValidator_bound_maxOnlyMessage');
    },
    getBothMessage: function () {
        return ABP.util.Common.geti18nString('s_dataValidator_bound_bothMessage');
    }
});

Ext.define('ABP.SenchaTextOverrides.data.validator.Email', {
    override: 'Ext.data.validator.Email',
    getMessage: function (al) {
        return ABP.util.Common.geti18nString('s_dataValidator_email_message');
    }
});

Ext.define('ABP.SenchaTextOverrides.data.validator.Exclusion', {
    override: 'Ext.data.validator.Exclusion',
    getMessage: function () {
        return ABP.util.Common.geti18nString('s_dataValidator_exclusion_message');
    }
});

Ext.define('ABP.SenchaTextOverrides.data.validator.IPAddress', {
    override: 'Ext.data.validator.IPAddress',
    getMessage: function () {
        return ABP.util.Common.geti18nString('s_dataValidator_ipaddress_message');
    }
});

Ext.define('ABP.SenchaTextOverrides.data.validator.Format', {
    override: 'Ext.data.validator.Format',
    getMessage: function () {
        return ABP.util.Common.geti18nString('s_dataValidator_format_message');
    }
});

Ext.define('ABP.SenchaTextOverrides.data.validator.Number', {
    override: 'Ext.data.validator.Number',
    getMessage: function () {
        return ABP.util.Common.geti18nString('s_dataValidator_number_message');
    }
});

Ext.define('ABP.SenchaTextOverrides.data.validator.Inclusion', {
    override: 'Ext.data.validator.Inclusion',
    getMessage: function () {
        return ABP.util.Common.geti18nString('s_dataValidator_inclusion_message');
    }
});

Ext.define('ABP.SenchaTextOverrides.data.validator.Length', {
    override: 'Ext.data.validator.Length',
    getMinOnlyMessage: function () {
        return ABP.util.Common.geti18nString('s_dataValidator_length_minOnlyMessage');
    },
    getMaxOnlyMessage: function () {
        return ABP.util.Common.geti18nString('s_dataValidator_length_maxOnlyMessage');
    },
    getBothMessage: function () {
        return ABP.util.Common.geti18nString('s_dataValidator_length_bothMessage');
    }
});

Ext.define('ABP.SenchaTextOverrides.data.validator.Presence', {
    override: 'Ext.data.validator.Presence',
    getMessage: function () {
        return ABP.util.Common.geti18nString('s_dataValidator_presence_message');
    }
});

Ext.define('ABP.SenchaTextOverrides.data.validator.Range', {
    override: 'Ext.data.validator.Range',
    getMinOnlyMessage: function () {
        return ABP.util.Common.geti18nString('s_dataValidator_range_minOnlyMessage');
    },
    getMaxOnlyMessage: function () {
        return ABP.util.Common.geti18nString('s_dataValidator_range_maxOnlyMessage');
    },
    getBothMessage: function () {
        return ABP.util.Common.geti18nString('s_dataValidator_range_bothMessage');
    },
    getNanMessage: function () {
        return ABP.util.Common.geti18nString('s_dataValidator_range_nanMessage');
    }
});

Ext.define('ABP.SenchaTextOverrides.grid.plugin.DragDrop', {
    override: 'Ext.grid.plugin.DragDrop',
    bind: {
        dragText: '{i18n.s_grid_plugin_dragText}'
    },
    setDragText: function (val) {
        this.dragText = val;
    }
});

// changing the msg text below will affect the LoadMask
Ext.define('ABP.SenchaTextOverrides.view.AbstractView', {
    override: 'Ext.view.AbstractView',
    bind: {
        loadingText: '{i18n.s_abstractView_loading}'
    },
    setLoadingText: function (val) {
        this.loadingText = val;
    }
});

Ext.define('ABP.SenchaTextOverrides.picker.Date', {
    override: 'Ext.picker.Date',
    //format: 'm/d/y',
    //startDay: 0*/
    beforeRender: function () {
        /*
         * days array for looping through 6 full weeks (6 weeks * 7 days)
         * Note that we explicitly force the size here so the template creates
         * all the appropriate cells.
         */
        var me = this,
            encode = Ext.String.htmlEncode,
            days = new Array(me.numDays),
            today = Ext.Date.format(new Date(), me.format);
        if (me.padding && !me.width) {
            me.cacheWidth();
        }
        // Begin Override for setting i18n strings.
        // Date Picker is a window and cannot bind to i18n strings.
        me.todayText = me.isDateTimePicker ? ABP.util.Common.geti18nString('s_picker_date_nowText') : ABP.util.Common.geti18nString('s_picker_date_todayText');    
        me.minText = ABP.util.Common.geti18nString('s_picker_date_minText');
        me.maxText = ABP.util.Common.geti18nString('s_picker_date_maxText');
        me.disabledDaysText = ABP.util.Common.geti18nString('s_picker_date_disabledDaysText');
        me.disabledDatesText = ABP.util.Common.geti18nString('s_picker_date_disabledDatesText');
        me.nextText = ABP.util.Common.geti18nString('s_picker_date_nextText');
        me.prevText = ABP.util.Common.geti18nString('s_picker_date_prevText');
        me.monthYearText = ABP.util.Common.geti18nString('s_picker_date_monthYearText');
        me.todayTip = ABP.util.Common.geti18nString('s_picker_date_todayTip');
        // End i18n override
        me.monthBtn = new Ext.button.Split({
            ownerCt: me,
            ownerLayout: me.getComponentLayout(),
            text: '',
            tooltip: me.monthYearText,
            tabIndex: -1,
            ariaRole: 'presentation',
            listeners: {
                click: me.doShowMonthPicker,
                arrowclick: me.doShowMonthPicker,
                scope: me
            }
        });
        if (me.showToday) {
            me.todayBtn = new Ext.button.Button({
                ui: me.footerButtonUI,
                ownerCt: me,
                ownerLayout: me.getComponentLayout(),
                text: Ext.String.format(me.todayText, today),
                tooltip: Ext.String.format(me.todayTip, today),
                tooltipType: 'title',
                tabIndex: -1,
                ariaRole: 'presentation',
                handler: me.selectToday,
                scope: me
            });
        }
        me.callParent();
        Ext.applyIf(me, {
            renderData: {}
        });
        Ext.apply(me.renderData, {
            dayNames: me.dayNames,
            showToday: me.showToday,
            prevText: encode(me.prevText),
            nextText: encode(me.nextText),
            todayText: encode(me.todayText),
            ariaMinText: encode(me.ariaMinText),
            ariaMaxText: encode(me.ariaMaxText),
            ariaDisabledDaysText: encode(me.ariaDisabledDaysText),
            ariaDisabledDatesText: encode(me.ariaDisabledDatesText),
            days: days
        });
        me.protoEl.unselectable();
    }
});

Ext.define('ABP.SenchaTextOverrides.picker.Month', {
    override: 'Ext.picker.Month',
    beforeRender: function () {
        var me = this,
            i = 0,
            months = [],
            shortName = Ext.Date.getShortMonthName,
            monthLen = me.monthOffset,
            margin = me.monthMargin,
            style = '';
        // begin override for button text
        me.okBtn.text = ABP.util.Common.geti18nString('s_picker_month_okText');
        me.cancelBtn.text = ABP.util.Common.geti18nString('s_picker_month_cancelText');
        // end override
        if (me.padding && !me.width) {
            me.cacheWidth();
        }
        me.callParent();
        for (; i < monthLen; ++i) {
            months.push(shortName(i), shortName(i + monthLen));
        }
        if (Ext.isDefined(margin)) {
            style = 'margin: 0 ' + margin + 'px;';
        }
        Ext.apply(me.renderData, {
            months: months,
            years: me.getYears(),
            showButtons: me.showButtons,
            monthStyle: style
        });
    },
});

Ext.define('ABP.SenchaTextOverrides.toolbar.Paging', {
    override: 'Ext.PagingToolbar',
    bind: {
        afterPageText: '{i18n.s_toolbar_paging_afterPageText}',
        displayMsg: '{i18n.s_toolbar_paging_displayMsg}',
        emptyMsg: '{i18n.s_toolbar_paging_emptyMsg}'
    },
    setAfterPageText: function (val) {
        this.afterPageText = val;
    },
    setDisplayMsg: function (val) {
        this.displayMsg = val;
    },
    setEmptyMsg: function (val) {
        this.emptyMsg = val;
    },
    getPagingItems: function () {
        var me = this,
            inputListeners = {
                scope: me,
                blur: me.onPagingBlur
            };
        inputListeners[Ext.supports.SpecialKeyDownRepeat ? 'keydown' : 'keypress'] = me.onPagingKeyDown;
        return [
            {
                itemId: 'first',
                tooltip: ABP.util.Common.geti18nString('s_toolbar_paging_firstText'),
                overflowText: ABP.util.Common.geti18nString('s_toolbar_paging_firstText'),
                iconCls: Ext.baseCSSPrefix + 'tbar-page-first',
                disabled: true,
                handler: me.moveFirst,
                scope: me
            },
            {
                itemId: 'prev',
                tooltip: ABP.util.Common.geti18nString('s_toolbar_paging_prevText'),
                overflowText: ABP.util.Common.geti18nString('s_toolbar_paging_prevText'),
                iconCls: Ext.baseCSSPrefix + 'tbar-page-prev',
                disabled: true,
                handler: me.movePrevious,
                scope: me
            },
            '-',
            ABP.util.Common.geti18nString('s_toolbar_paging_beforePageText'),
            {
                xtype: 'numberfield',
                itemId: 'inputItem',
                name: 'inputItem',
                cls: Ext.baseCSSPrefix + 'tbar-page-number',
                allowDecimals: false,
                minValue: 1,
                hideTrigger: true,
                enableKeyEvents: true,
                keyNavEnabled: false,
                selectOnFocus: true,
                submitValue: false,
                // mark it as not a field so the form will not catch it when getting fields
                isFormField: false,
                width: me.inputItemWidth,
                margin: '-1 2 3 2',
                listeners: inputListeners
            },
            {
                xtype: 'tbtext',
                itemId: 'afterTextItem',
                html: Ext.String.format(me.afterPageText, 1)
            },
            '-',
            {
                itemId: 'next',
                tooltip: ABP.util.Common.geti18nString('s_toolbar_paging_nextText'),
                overflowText: ABP.util.Common.geti18nString('s_toolbar_paging_nextText'),
                iconCls: Ext.baseCSSPrefix + 'tbar-page-next',
                disabled: true,
                handler: me.moveNext,
                scope: me
            },
            {
                itemId: 'last',
                tooltip: ABP.util.Common.geti18nString('s_toolbar_paging_lastText'),
                overflowText: ABP.util.Common.geti18nString('s_toolbar_paging_lastText'),
                iconCls: Ext.baseCSSPrefix + 'tbar-page-last',
                disabled: true,
                handler: me.moveLast,
                scope: me
            },
            '-',
            {
                itemId: 'refresh',
                tooltip: ABP.util.Common.geti18nString('s_toolbar_paging_refreshText'),
                overflowText: ABP.util.Common.geti18nString('s_toolbar_paging_refreshText'),
                iconCls: Ext.baseCSSPrefix + 'tbar-loading',
                disabled: me.store.isLoading(),
                handler: me.doRefresh,
                scope: me
            }
        ];
    },
});

Ext.define('ABP.SenchaTextOverrides.form.Basic', {
    override: 'Ext.form.Basic',
    bind: {
        waitTitle: '{i18n.s_form_basic_waitTitle}'
    },
    setWaitTitle: function (val) {
        this.waitTitle = val;
    }
});

Ext.define('ABP.SenchaTextOverrides.form.field.Base', {
    override: 'Ext.form.field.Base',
    bind: {
        invalidText: '{i18n.s_form_field_base_invalidText}'
    },
    setInvalidText: function (val) {
        this.invalidText = val;
    }
});

Ext.define('ABP.SenchaTextOverrides.form.field.Text', {
    override: 'Ext.form.field.Text',
    bind: {
        minLengthText: '{i18n.s_field_text_minLengthText}',
        maxLengthText: '{i18n.s_field_text_maxLengthText}',
        blankText: '{i18n.s_field_text_blankText}',
        regexText: '{i18n.s_field_text_regexText}'
    },
    setMinLengthText: function (val) {
        this.minLengthText = val;
    },
    setMaxLengthText: function (val) {
        this.maxLengthText = val;
    },
    setBlankText: function (val) {
        this.blankText = val;
    },
    setRegexText: function (val) {
        this.regexText = val;
    }
});

Ext.define('ABP.SenchaTextOverrides.form.field.Number', {
    override: 'Ext.form.field.Number',
    bind: {
        minText: '{i18n.s_field_number_minText}',
        maxText: '{i18n.s_field_number_maxText}',
        nanText: '{i18n.s_field_number_nanText}'
    },
    setMinText: function (val) {
        this.minText = val;
    },
    setMaxText: function (val) {
        this.maxText = val;
    },
    setNanText: function (val) {
        this.nanText = val;
    }
});

Ext.define('ABP.SenchaTextOverrides.form.field.Date', {
    override: 'Ext.form.field.Date',
    bind: {
        disabledDaysText: '{i18n.s_field_date_disabledDaysText}',
        disabledDatesText: '{i18n.s_field_date_disabledDatesText}',
        minText: '{i18n.s_field_date_minText}',
        maxText: '{i18n.s_field_date_maxText}',
        invalidText: '{i18n.s_field_date_invalidText}'
    },
    setDisabledDaysText: function (val) {
        this.disabledDaysText = val;
    },
    setDisabledDatesText: function (val) {
        this.disabledDatesText = val;
    },
    setMinText: function (val) {
        this.minText = val;
    },
    setMaxText: function (val) {
        this.maxText = val;
    },
    setInvalidText: function (val) {
        this.invalidText = val;
    }
});

// TODO - figure this out
/*Ext.define('ABP.SenchaTextOverrides.form.field.ComboBox', {
    override: 'Ext.form.field.ComboBox',
}, function() {
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig, {
        loadingText: 'Loading...'
    });
});*/

// TODO
/*Ext.define('ABP.SenchaTextOverrides.form.field.HtmlEditor', {
    override: 'Ext.form.field.HtmlEditor',
    createLinkText: 'Please enter the URL for the link:'
}, function() {
    Ext.apply(Ext.form.field.HtmlEditor.prototype, {
        buttonTips: {
            bold: {
                title: 'Bold (Ctrl+B)',
                text: 'Make the selected text bold.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            italic: {
                title: 'Italic (Ctrl+I)',
                text: 'Make the selected text italic.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            underline: {
                title: 'Underline (Ctrl+U)',
                text: 'Underline the selected text.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            increasefontsize: {
                title: 'Grow Text',
                text: 'Increase the font size.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            decreasefontsize: {
                title: 'Shrink Text',
                text: 'Decrease the font size.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            backcolor: {
                title: 'Text Highlight Color',
                text: 'Change the background color of the selected text.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            forecolor: {
                title: 'Font Color',
                text: 'Change the color of the selected text.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyleft: {
                title: 'Align Text Left',
                text: 'Align text to the left.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifycenter: {
                title: 'Center Text',
                text: 'Center text in the editor.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            justifyright: {
                title: 'Align Text Right',
                text: 'Align text to the right.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertunorderedlist: {
                title: 'Bullet List',
                text: 'Start a bulleted list.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            insertorderedlist: {
                title: 'Numbered List',
                text: 'Start a numbered list.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            createlink: {
                title: 'Hyperlink',
                text: 'Make the selected text a hyperlink.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            },
            sourceedit: {
                title: 'Source Edit',
                text: 'Switch to source editing mode.',
                cls: Ext.baseCSSPrefix + 'html-editor-tip'
            }
        }
    });
});*/

Ext.define('ABP.SenchaTextOverrides.grid.header.Container', {
    override: 'Ext.grid.header.Container',
    bind: {
        sortAscText: '{i18n.s_grid_header_sortAscText}',
        sortDescText: '{i18n.s_grid_header_sortDescText}',
        lockText: '{i18n.s_grid_header_lockText}',
        unlockText: '{i18n.s_grid_header_unlockText}',
        columnsText: '{i18n.s_grid_header_columnsText}'
    },
    setSortAscText: function (val) {
        this.sortAscText = val;
    },
    setSortDescText: function (val) {
        this.sortDescText = val;
    },
    setLockText: function (val) {
        this.lockText = val;
    },
    setUnlockText: function (val) {
        this.unlockText = val;
    },
    setColumnsText: function (val) {
        this.columnsText = val;
    }
});

Ext.define('ABP.SenchaTextOverrides.grid.locking.Lockable', {
    override: 'Ext.grid.locking.Lockable',
    getMenuItems: function (getMenuItems, locked) {
        var me = this,
            unlockText = ABP.util.Common.geti18nString('s_grid_header_unlockText'),
            lockText = ABP.util.Common.geti18nString('s_grid_header_lockText'),
            unlockCls = Ext.baseCSSPrefix + 'hmenu-unlock',
            lockCls = Ext.baseCSSPrefix + 'hmenu-lock',
            unlockHandler = me.onUnlockMenuClick.bind(me),
            lockHandler = me.onLockMenuClick.bind(me);
        // runs in the scope of headerCt
        return function () {
            // We cannot use the method from HeaderContainer's prototype here
            // because other plugins or features may already have injected an implementation
            var o = getMenuItems.call(this);
            o.push('-', {
                itemId: 'unlockItem',
                iconCls: unlockCls,
                text: unlockText,
                handler: unlockHandler,
                disabled: !locked
            });
            o.push({
                itemId: 'lockItem',
                iconCls: lockCls,
                text: lockText,
                handler: lockHandler,
                disabled: locked
            });
            return o;
        };
    }
});

Ext.define('ABP.SenchaTextOverrides.grid.GroupingFeature', {
    override: 'Ext.grid.feature.Grouping',
    getMenuItems: function () {
        var me = this,
            groupByText = ABP.util.Common.geti18nString('s_grid_groupingFeature_groupByText'),
            disabled = me.disabled || !me.getGroupField(),
            showGroupsText = ABP.util.Common.geti18nString('s_grid_groupingFeature_showGroupsText'),
            enableNoGroups = me.enableNoGroups,
            getMenuItems = me.view.headerCt.getMenuItems;
        // runs in the scope of headerCt
        return function () {
            // We cannot use the method from HeaderContainer's prototype here
            // because other plugins or features may already have injected an implementation
            var o = getMenuItems.call(this);
            o.push('-', {
                iconCls: Ext.baseCSSPrefix + 'group-by-icon',
                itemId: 'groupMenuItem',
                text: groupByText,
                handler: me.onGroupMenuItemClick,
                scope: me
            });
            if (enableNoGroups) {
                o.push({
                    itemId: 'groupToggleMenuItem',
                    text: showGroupsText,
                    checked: !disabled,
                    checkHandler: me.onGroupToggleMenuItemClick,
                    scope: me
                });
            }
            return o;
        };
    }
});

Ext.define('ABP.SenchaTextOverrides.grid.PropertyColumnModel', {
    override: 'Ext.grid.PropertyColumnModel',
    bind: {
        nameText: '{i18n.s_grid_propertyColumnModel_nameText}',
        valueText: '{i18n.s_grid_propertyColumnModel_valueText}',
        trueText: '{i18n.s_grid_propertyColumnModel_trueText}',
        falseText: '{i18n.s_grid_propertyColumnModel_falseText}'
    },
    setNameText: function (val) {
        this.nameText = val;
    },
    setValueText: function (val) {
        this.valueText = val;
    },
    setTrueText: function (val) {
        this.trueText = val;
    },
    setFalseText: function (val) {
        this.falseText = val;
    }
    //dateFormat: 'm/j/Y',
});

Ext.define('ABP.SenchaTextOverrides.grid.BooleanColumn', {
    override: 'Ext.grid.BooleanColumn',
    bind: {
        trueText: '{i18n.s_grid_booleanColumn_trueText}',
        falseText: '{i18n.s_grid_booleanColumn_falseText}',
        undefinedText: '{i18n.s_grid_booleanColumn_undefinedText}'
    },
    setTrueText: function (val) {
        this.trueText = val;
    },
    setFalseText: function (val) {
        this.falseText = val;
    },
    setUndefinedText: function (val) {
        this.undefinedText = val;
    }
});

// TODO - formatting next two
/*Ext.define('ABP.SenchaTextOverrides.grid.NumberColumn', {
    override: 'Ext.grid.NumberColumn',
    bind: {
        : '{}'
    }
    //format: '0,000.00'
});*/

/*Ext.define('ABP.SenchaTextOverrides.grid.DateColumn', {
    override: 'Ext.grid.DateColumn',
    format: 'm/d/Y'
});*/

Ext.define('ABP.SenchaTextOverrides.form.field.Time', {
    override: 'Ext.form.field.Time',
    bind: {
        minText: '{i18n.s_field_time_minText}',
        maxText: '{i18n.s_field_time_maxText}',
        invalidText: '{i18n.s_field_time_invalidText}'
    },
    setMinText: function (val) {
        this.minText = val;
    },
    setMaxText: function (val) {
        this.maxText = val;
    },
    setInvalidText: function (val) {
        this.invalidText = val;
    }
    //format: 'g:i A',
    //altFormats: 'g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H'
});

// This has a config option no need for us to override the default
/*Ext.define('ABP.SenchaTextOverrides.form.field.File', {
    override: 'Ext.form.field.File',
    bind: {
        buttonText: '{i18n.s_field_file_buttonText}'
    },
    setButtonText: function (val) {
        this.buttonText = val;
    }
})*/

Ext.define('ABP.SenchaTextOverrides.form.CheckboxGroup', {
    override: 'Ext.form.CheckboxGroup',
    bind: {
        blankText: '{i18n.s_field_checkboxGroup_blankText}'
    },
    setBlankText: function (val) {
        this.blankText = val;
    }
});

Ext.define('ABP.SenchaTextOverrides.form.RadioGroup', {
    override: 'Ext.form.RadioGroup',
    bind: {
        blankText: '{i18n.s_field_radioGroup_blankText}'
    },
    setBlankText: function (val) {
        this.blankText = val;
    }
});

Ext.define('ABP.SenchaTextOverrides.grid.filters.Filters', {
    override: 'Ext.grid.filters.Filters',
    createMenuItem: function (menu, parentTableId) {
        var me = this,
            item;
        // only add separator if there are other menu items
        if (menu.items.length) {
            me.sep = menu.add('-');
        }
        item = menu.add({
            checked: false,
            itemId: 'filters',
            text: ABP.util.Common.geti18nString('s_grid_filters_menuFilterText'),
            listeners: {
                scope: me,
                checkchange: me.onCheckChange
            }
        });
        return (me.filterMenuItem[parentTableId] = item);
    }
});

Ext.define('ABP.SenchaTextOverrides.grid.filters.filter.Boolean', {
    override: 'Ext.grid.filters.filter.Boolean',
    createMenu: function (config) {
        var me = this,
            gId = Ext.id(),
            listeners = {
                scope: me,
                click: me.onClick
            },
            itemDefaults = me.getItemDefaults();
        me.callSuper(arguments);
        me.menu.add([
            Ext.apply({
                text: ABP.util.Common.geti18nString('s_grid_filters_boolean_yesText'),
                filterKey: 1,
                group: gId,
                checked: !!me.defaultValue,
                hideOnClick: false,
                listeners: listeners
            }, itemDefaults),
            Ext.apply({
                text: ABP.util.Common.geti18nString('s_grid_filters_boolean_noText'),
                filterKey: 0,
                group: gId,
                checked: !me.defaultValue && me.defaultValue !== null,
                hideOnClick: false,
                listeners: listeners
            }, itemDefaults)
        ]);
    },
});

// TODO deeper binding
/*Ext.define('ABP.SenchaTextOverrides.grid.filters.filter.Date', {
    override: 'Ext.grid.filters.filter.Date',
    bind: {
        : '{}'
    }
    fields: {
        lt: {text: 'Before'},
        gt: {text: 'After'},
        eq: {text: 'On'}
    },
    // Defaults to Ext.Date.defaultFormat
    //dateFormat: null
});*/

Ext.define('ABP.SenchaTextOverrides.grid.filters.filter.List', {
    override: 'Ext.grid.filters.filter.List',
    bind: {
        loadingText: '{i18n.s_grid_filters_list_loadingText}'
    },
    setLoadingText: function (val) {
        this.loadingText = val;
    }
});

Ext.define('ABP.SenchaTextOverrides.grid.filters.filter.Number', {
    override: 'Ext.grid.filters.filter.Number',
    createMenu: function () {
        var me = this,
            listeners = {
                scope: me,
                keyup: me.onValueChange,
                spin: {
                    fn: me.onInputSpin,
                    buffer: 200
                },
                el: {
                    click: me.stopFn
                }
            },
            itemDefaults = me.getItemDefaults(),
            menuItems = me.menuItems,
            fields = me.getFields(),
            field, i, len, key, item, cfg;
        me.callSuper();
        me.fields = {};
        for (i = 0, len = menuItems.length; i < len; i++) {
            key = menuItems[i];
            if (key !== '-') {
                field = fields[key];
                cfg = {
                    labelClsExtra: Ext.baseCSSPrefix + 'grid-filters-icon ' + field.iconCls
                };
                if (itemDefaults) {
                    Ext.merge(cfg, itemDefaults);
                }
                Ext.merge(cfg, field);
                cfg.emptyText = cfg.emptyText || ABP.util.Common.geti18nString('s_grid_filters_number_emptyText');
                delete cfg.iconCls;
                me.fields[key] = item = me.menu.add(cfg);
                item.filter = me.filter[key];
                item.filterKey = key;
                item.on(listeners);
            } else {
                me.menu.add(key);
            }
        }
    },
});

Ext.define('ABP.SenchaTextOverrides.grid.filters.filter.String', {
    override: 'Ext.grid.filters.filter.String',
    createMenu: function () {
        var me = this,
            config;
        me.callSuper();
        config = Ext.apply({}, me.getItemDefaults());
        if (config.iconCls && !('labelClsExtra' in config)) {
            config.labelClsExtra = Ext.baseCSSPrefix + 'grid-filters-icon ' + config.iconCls;
        }
        delete config.iconCls;
        config.emptyText = config.emptyText || ABP.util.Common.geti18nString('s_grid_filters_string_emptyText');
        me.inputItem = me.menu.add(config);
        me.inputItem.on({
            scope: me,
            keyup: me.onValueChange,
            el: {
                click: function (e) {
                    e.stopPropagation();
                }
            }
        });
    }
});

Ext.define('ABP.SenchaTextOverrides.view.MultiSelectorSearch', {
    override: 'Ext.view.MultiSelectorSearch',
    bind: {
        searchText: '{i18n.s_multiSelectorSearch_searchText}'
    },
    setSearchText: function (val) {
        this.searchText = val;
    }
});

Ext.define('ABP.SenchaTextOverrides.view.MultiSelector', {
    override: 'Ext.view.MultiSelector',
    bind: {
        emptyText: '{i18n.s_multiSelector_emptyText}',
        removeRowTip: '{i18n.s_multiSelector_removeRowTip}',
        addToolText: '{i18n.s_multiSelector_addToolText}'
    },
    setEmptyText: function (val) {
        this.emptyText = val;
    },
    setRemoveRowTip: function (val) {
        this.removeRowTip = val;
    },
    setAddToolText: function (val) {
        this.addToolText = val;
    }
});

Ext.define("ABP.SenchaTextOverrides.tab.Tab", {
    override: "Ext.tab.Tab",
    bind: {
        closeText: '{i18n.s_tab_closeText}'
    },
    setCloseText: function (val) {
        this.closeText = val;
    }
});