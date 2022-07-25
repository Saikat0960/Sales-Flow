/*
 * Based on DateTimeField @ https://github.com/gportela85/DateTimeField
 * Latest update on 3/3/2017. For Ext JS V6.2.1.167.
 */
Ext.define("ABPControlSet.view.picker.DateTime", {
    extend: "Ext.picker.Date",
    alias: "widget.abpdatetimepicker",
    requires: [
        "Ext.picker.Date",
        "Ext.slider.Single",
        "Ext.form.field.Time",
        "Ext.form.Label"
    ],
    isDateTimePicker: true,
    timeKeyNav: null,
    timeValue: null,

    initComponent: function() {
        var me = this;
        var defaultValue = Ext.isDate(me.defaultValue) ? me.defaultValue : Ext.Date.clearTime(new Date());
        var initValue = me.value ? me.value : defaultValue;

        me.timeValue = me.value ? me.value : null;

        me.callParent();

        // Set the value to prevent the base date picker from removing the time.
        me.value = defaultValue
    },

    beforeRender: function () {
        var me = this,
            pickerField = me.pickerField,
            dtAux = pickerField.getValue() ? new Date(pickerField.getValue()) : null;

        // Call parent.
        if (dtAux) {
            dtAux.setSeconds(0);
        }

        me.timeField = Ext.widget({
            xtype: 'abptime',
            ownerCt: me,
            padding: "8px 24px",
            width: 'calc(100% - 48px)',
            isModern: false, // Do not use the modern picker yet.
            name: me.pickerField.name,
            ownerLayout: me.getComponentLayout(),
            hideLabel: true,
            labelAlign: "top",
            labelSeparator: "",
            label: "Time",
            tabIndex: 0,
            //cls: 'x-selectable',
            //ariaRole: "presentation",
            value: dtAux,
            listeners: {
                select: me.changeTimeValue,
                scope: me
            },
            keyMap: {
                scope: me,
                enter: me.onEnterKey,
                // space: me.onSpaceKey,
     
                tab: function(e) {
                    // When the picker is floating and attached to an input field, its
                    // 'select' handler will focus the inputEl so when navigation happens
                    // it does so as if the input field was focused all the time.
                    // This is the desired behavior and we try not to interfere with it
                    // in the picker itself, see below.
                    this.handleTabKey(e);
     
                    // Allow default behaviour of TAB - it MUST be allowed to navigate.
                    return true;
                }
            }
        });

        me.callParent(arguments);
    },

    handleTabClick: function (e) {
        this.handleDateClick(e, this.activeCell.firstChild, true);
    },

    handleTabKey: function(e) {
        var me = this,
            activeDate = Ext.Date.clearTime(me.activeDate, true),
            t = me.getSelectedDate(activeDate),
            handler = me.handler;
 
        if (e.currentTarget === this.eventEl.dom && !e.shiftKey) {
            // If table has the focus, let the focus move to the time field
            return;
        }

        if (e.currentTarget === this.timeField.dom && e.shiftKey) {
            // If time has the focus, let the shift+tab move to the date table field
            this.eventEl.focus();
            return;
        }

        // The following code is like handleDateClick without the e.stopEvent()
        if (!me.disabled && t.dateValue && !Ext.fly(t.parentNode).hasCls(me.disabledCellCls)) {
            me.setValue(me.getDateTimeValue());
            me.fireEvent('select', me, me.value);
 
            if (handler) {
                Ext.callback(handler, me.scope, [me, me.value], null, me, me);
            }
 
            // If the ownerfield is part of an editor we must preventDefault and let
            // the navigationModel handle the tab event.
            if (me.pickerField && me.pickerField.isEditorComponent) {
                e.preventDefault();
            }
 
            me.onSelect();
        }
        // Even if the above condition is not met we have to let the field know
        // that we're tabbing out - that's user action we can do nothing about
        else {
            me.fireEventArgs('tabout', [me]);
        }
    },

    handleDateClick: function (e, t, /*private*/ blockStopEvent) {
        var me = this,
            time = me.timeField.getValue();

        if (blockStopEvent !== true) {
            e.stopEvent();
        }

        if (!me.disabled && t.dateValue && !Ext.fly(t.parentNode).hasCls(me.disabledCellCls)) {
            var hours = time ? time.getHours() : null;
            var minutes = time ? time.getMinutes() : null;

            // Only close the picker if the time has been set
            if (hours && minutes) {
                var auxDate = new Date(t.dateValue);
                auxDate.setHours(hours, minutes, 0);

                me.selectAndClose(auxDate);
            }
            else {
                // If the time has not been set, just update the selected date
                me.setValue(new Date(t.dateValue));
            }
        }
    },

    getDateTimeValue: function() {
        var me = this,
            time = me.timeField.getValue(),
            activeDate = me.getActive();
        
        var hours = time ? time.getHours() : 0;
        var minutes = time ? time.getMinutes() : 0;

        activeDate.setHours(hours, minutes, 0);
        return activeDate;
    },

    changeTimeValue: function (timeField, newValue) {
        var me = this,
            newTime = newValue.data.date,
            pickerValue = me.pickerField.getValue() || new Date();

        console.log('DATETIME: ' + pickerValue + ' ' + newTime);

        if (me.pickerField && pickerValue) {
            var timeDate = new Date(newTime);
            var unixTimestamp = pickerValue.setHours(timeDate.getHours(), timeDate.getMinutes());
            var auxDate = new Date(unixTimestamp);
            
            me.selectAndClose(auxDate);
        }
    },

    beforeDestroy: function () {
        var me = this;

        if (me.rendered) {
            Ext.destroy(
                me.timeField
            );
        }
        me.callParent();
    },
    privates: {
        // Do the job of a container layout at this point even though we are not a Container.
        // TODO: Refactor as a Container.
        finishRenderChildren: function () {
            var me = this;

            me.callParent();
            me.timeField.finishRender();
        },
        selectAndClose: function(v) {
            var me = this,
                handler = me.handler;

            me.setValue(v);
            me.value = v;
            me.fireEvent('select', me, me.value);

            if (handler) {
                handler.call(me.scope || me, me, me.value);
            }

            me.hideOnSelect = true;
            // event handling is turned off on hide
            // when we are using the picker in a field
            // therefore onSelect comes AFTER the select
            // event.
            me.onSelect();
        }
    },
    renderTpl: [
        '<div id="{id}-innerEl" data-ref="innerEl" role="presentation">',
            '<div class="{baseCls}-header">',
                '<div id="{id}-prevEl" data-ref="prevEl" class="{baseCls}-prev {baseCls}-arrow" role="presentation" title="{prevText}"></div>',
                '<div id="{id}-middleBtnEl" data-ref="middleBtnEl" class="{baseCls}-month" role="heading">{%this.renderMonthBtn(values, out)%}</div>',
                '<div id="{id}-nextEl" data-ref="nextEl" class="{baseCls}-next {baseCls}-arrow" role="presentation" title="{nextText}"></div>',
            '</div>',
            '<table role="grid" id="{id}-eventEl" data-ref="eventEl" class="{baseCls}-inner" cellspacing="0" tabindex="0">',
                '<thead>',
                    '<tr role="row">',
                        '<tpl for="dayNames">',
                            '<th role="columnheader" class="{parent.baseCls}-column-header" aria-label="{.}">',
                            '<div role="presentation" class="{parent.baseCls}-column-header-inner">{.:this.firstInitial}</div>',
                            '</th>',
                        '</tpl>',
                    '</tr>',
                '</thead>',
                '<tbody>',
                    '<tr role="row">',
                        '<tpl for="days">',
                            '{#:this.isEndOfWeek}',
                            '<td role="gridcell">',
                                '<div hidefocus="on" class="{parent.baseCls}-date"></div>',
                            '</td>',
                        '</tpl>',
                    '</tr>',
                '</tbody>',
            '</table>',
            '<div role="presentation" class="{baseCls}-footer">{%this.renderTimeField(values, out)%}</div>',
            '<tpl if="showToday">',
                '<div id="{id}-footerEl" data-ref="footerEl" role="presentation" class="{baseCls}-footer">{%this.renderTodayBtn(values, out)%}</div>',
            '</tpl>',
            // These elements are used with Assistive Technologies such as screen readers
            '<div id="{id}-todayText" class="' + Ext.baseCSSPrefix + 'hidden-clip">{todayText}.</div>',
            '<div id="{id}-ariaMinText" class="' + Ext.baseCSSPrefix + 'hidden-clip">{ariaMinText}.</div>',
            '<div id="{id}-ariaMaxText" class="' + Ext.baseCSSPrefix + 'hidden-clip">{ariaMaxText}.</div>',
            '<div id="{id}-ariaDisabledDaysText" class="' + Ext.baseCSSPrefix + 'hidden-clip">{ariaDisabledDaysText}.</div>',
            '<div id="{id}-ariaDisabledDatesText" class="' + Ext.baseCSSPrefix + 'hidden-clip">{ariaDisabledDatesText}.</div>',
        '</div>',
        {
            firstInitial: function (value) {
                return Ext.picker.Date.prototype.getDayInitial(value);
            },
            isEndOfWeek: function (value) {
                // convert from 1 based index to 0 based
                // by decrementing value once.
                value--;
                var end = value % 7 === 0 && value !== 0;
                return end ? '</tr><tr role="row">' : '';
            },
            renderTodayBtn: function (values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.todayBtn.getRenderTree(), out);
            },
            renderMonthBtn: function (values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.monthBtn.getRenderTree(), out);
            },
            renderTimeField: function (values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.timeField.getRenderTree(), out);
            }
        }
    ],

    getTimePickerSide: function () {
        var el = this.el,
            body = Ext.getBody(),
            bodyWidth = body.getViewSize().width;

        return (bodyWidth < (el.getX() + el.getWidth() + 140)) ? 'tl' : 'tr';
    },

    /**
     * Sets the current value to today.
     * @return {Ext.picker.Date} this
     */
    selectToday: function() {
        var me = this,
            btn = me.todayBtn,
            handler = me.handler;
 
        if (btn && !btn.disabled) {
            me.setValue(new Date());
            me.fireEvent('select', me, me.value);
            if (handler) {
                Ext.callback(handler, me.scope, [me, me.value], null, me, me);
            }
            me.onSelect();
        }
        return me;
    },

    /**
     * Sets the value of the date field
     * @param {Date} value The date to set
     * @return {Ext.picker.Date} this
     */
    setValue: function(value, time) {
        // If passed a null value just pass in a new date object.
        this.value = value || this.defaultValue;
        if (this.value.getHours() !== 0 && this.value.getMinutes() !== 0) {
            this.timeValue = value;
        }

        return this.update(this.value);
    },

    update: function(date, forceRefresh) {
        this.callParent(arguments);
        
        // Ensure we update the time control
        this.timeField.setValue(this.timeValue);
    },

    // Override - ensure we remove the time when selecting the date cell
    selectedUpdate: function(date) {
        var me        = this,
            t         = Ext.Date.clearTime(date, true).getTime(), // Need to remove the time to select the date, but must also clone the date
            cells     = me.cells,
            cls       = me.selectedCls,
            c,
            cLen      = cells.getCount(),
            cell;
        
        me.eventEl.dom.setAttribute('aria-busy', 'true');

        cell = me.activeCell;
        
        if (cell) {
            Ext.fly(cell).removeCls(cls);
            cell.setAttribute('aria-selected', false);
        }
 
        for (c = 0; c < cLen; c++) {
            cell = cells.item(c);
 
            if (me.textNodes[c].dateValue === t) {
                me.activeCell = cell.dom;
                me.eventEl.dom.setAttribute('aria-activedescendant', cell.dom.id);
                cell.dom.setAttribute('aria-selected', true);
                cell.addCls(cls);
                me.fireEvent('highlightitem', me, cell);
                break;
            }
        }
        
        me.eventEl.dom.removeAttribute('aria-busy');
    },

    // Override - don't remove the selected class 
    getSelectedDate: function(date) {
        var me = this,
            t = date.getTime(),
            cells = me.cells,
            cellItems = cells.elements,
            cLen = cellItems.length,
            cell, c;
 
        for (c = 0; c < cLen; c++) {
            cell = cellItems[c].firstChild;
 
            if (cell.dateValue === t) {
                return cell;
            }
        }
 
        return null;
    },
});