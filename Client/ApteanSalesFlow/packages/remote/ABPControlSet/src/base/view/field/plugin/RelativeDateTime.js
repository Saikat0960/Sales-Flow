/**
 * @private
*   Base relative date and time plugin class.
*
*   Adds necessary intervals for relative vs. absolute date and time fields when read-only.
*   Adds the ability to provide formatting for read-only date and time fields.
*/
Ext.define('ABPControlSet.base.view.field.plugin.RelativeDateTime', {
    extend: 'Ext.plugin.Abstract',

    alias: 'plugin.abprelativedatetime',

    // Parameter to keep track of the field absolute value.
    absoluteValue: null,

    // Parameter to keep track of the field relative value.
    relativeValue: null,

    // Parameter to keep track of the field maximum relative value.
    maxRelativeValue: null,

    // Parameter to determine when field can no longer be relative.
    canBeRelative: false,

    // Parameter to set the default format for relative dates once the threshold has been passed.
    dateFormat: 'jS F Y',

    // The init function is required by all plugins.
    init: function (component) {
        // Only date and time fields are valid.
        if (component.xtype !== 'abptime' && component.xtype !== 'abpdate' && component.xtype !== 'abpdatetime') {
            return;
        } else {
            // Set up the events and handlers to use.
            var listeners = {
                disable: this.onFieldDisable,
                enable: this.onFieldEnable,
                writeablechange: this.onFieldWritable,
                change: this.onFieldValueChanged,
                afterrender: this.onFieldRender,
                scope: this
            };

            // Set the initial values needed in the event functions.
            this.field = component;
            this.absoluteValue = component.getValue();
            this.maxRelativeValue = component.maxRelative ? component.maxRelative.split('|') : ['24', 'h'];
            this.field.relativeUpdate = component.relativeUpdate || 60;

            component.on(listeners);

            // Check if the field is disabled and if so, execute the change function.
            if (component.disabled) {
                this.onFieldDisable();
            }

            // Check if the field is read-only and if so, execute the change function.
            if (component.readOnly) {
                this.onFieldWritable();
            }

            // Set up the task runner for checking and updating relative time.
            var me = this;
            me.updateRunner = new Ext.util.TaskRunner();

            me.updateTask = me.updateRunner.newTask({
                run: me.updateFieldRelative,
                interval: me.field.relativeUpdate * 1000,
                scope: me
            });
        }
    },

    // Simple function to start the updateTask task runner.
    start: function () {
        if (this.updateTask) {
            this.updateTask.start();
        } else {
            this.startAfterRender = true;
        }
    },

    // Simple function to stop the updateTask task runner.
    stop: function () {
        if (this.updateTask) {
            this.updateTask.stop();
        }
    },

    // Simple function to update the absolute value of this plugin instance when the component value updates.
    onFieldValueChanged: function () {
        this.absoluteValue = this.field.getValue();

        // Check if the tooltip exists and is visible, if so then update the tooltip using the new absolute value.
        if (this.tip && this.tip.isVisible()) {
            this.tip.setConfig(this.getTipConfig());
        }

        // Check if the field is disabled and if so, execute the change function.
        if (this.field.disabled) {
            this.onFieldDisable();
        }

        // Check if the field is read-only and if so, execute the change function.
        if (this.field.readOnly) {
            this.onFieldWritable();
        }
    },

    // Simple function to start the updateTask task runner after render if component is not ready when start first called.
    onFieldRender: function () {
        if (this.startAfterRender) {
            this.start();
            if (this.canBeRelative && !this.tip) {
                this.createToolTip();
            }
        }
    },

    // Respond to field being disabled, via a listener in the init, by storing and removing the title.
    onFieldDisable: function () {
        var focusEl = this.field.getFocusEl();
        if (focusEl) {
            if (!this.savedTitle) {
                this.savedTitle = focusEl.dom.getAttribute('title');
            }
            focusEl.dom.removeAttribute('title');
        }
    },

    // Respond to field being enabled, via a listener in the init, by restoring the title - check that the field isn't read-only first.
    onFieldEnable: function () {
        if (this.savedTitle && !this.field.readOnly) {
            var focusEl = this.field.getFocusEl();
            if (focusEl) {
                focusEl.dom.setAttribute('title', this.savedTitle);
            }
        }
    },

    // Create a replacement tooltip to show absolute time in an easy-to-read format.
    createToolTip: function () {
        var fieldId = this.field.getId(),
            me = this,
            tipConfig = this.getTipConfig();

        this.tip = Ext.create('Ext.tip.ToolTip', {
            target: fieldId,
            title: tipConfig.title,
            minWidth: tipConfig.minWidth,
            html: tipConfig.html,
            cls: 'abp-relative-tip',
            shadow: 'drop',
            dismissDelay: 0,
            listeners: {
                beforeshow: function (tip) {
                    var config = me.getTipConfig();
                    tip.setMinWidth(config.minWidth);
                    tip.setTitle(config.title);
                    tip.setHtml(config.html);
                }
            }
        });
    },

    // Constructs and returns the dynamic tip configuration values.
    getTipConfig: function () {
        var title = Ext.Date.format(this.absoluteValue, this.dateFormat);
        var titleWidth = ABP.util.Common.actualMeasureText(title, '14px roboto');
        if (this.field.xtype === 'abpdatetime') {
            var time = Ext.Date.format(this.absoluteValue, 'g:i A');
            title = '<span class="tip-date">' + title + '</span><span class="tip-time">' + time + '</span>';
        }
        var tipConfig = {
            html: ABP.util.RelativeTime.format(this.absoluteValue, true),
            title: title,
            minWidth: titleWidth.width + 16,
        }
        return tipConfig;
    },

    // Respond to the field read-only value changing, and call updateFieldRelative to update the field.
    onFieldWritable: function () {
        if (this.field.setValue) {
            this.canBeRelative = this.field.readOnly;
            if (this.field.readOnly) {
                // Add a class to remove the border, disable the field to prevent validation, then create the quick tip.
                this.field.addCls('abp-relative-readonly');
                this.fieldDisabled = this.field.getDisabled();
                this.field.setDisabled(true);
                var focusEl = this.field.getFocusEl();
                if (focusEl && !this.tip) {
                    this.createToolTip();
                }
            } else {
                // Remove the class that removes the border, reset the disabled property to original, then destroy the quick tip.
                this.field.removeCls('abp-relative-readonly');
                if (typeof this.fieldDisabled !== null) {
                    this.field.setDisabled(this.fieldDisabled);
                }
            }

            this.updateFieldRelative();
        }
    },

    // Check that the time difference has not exceeded the maximum relative conversion interval, and return whether it has or not.
    checkRelativeValid: function () {
        var now = new Date();
        var offset = Ext.Date.diff(this.absoluteValue, now, this.maxRelativeValue[1]);

        if (offset > parseInt(this.maxRelativeValue[0])) {
            return false;
        }

        return true;
    },

    // Update the field according to whether it can be relative or not, and start or stop the task runner accordingly.
    updateFieldRelative: function () {
        var withinThreshold = this.checkRelativeValid(),
            focusEl = this.field.getFocusEl();
        if (this.field.setRawValue && this.canBeRelative) {
            if (withinThreshold) {
                this.relativeValue = ABP.util.RelativeTime.format(this.absoluteValue, true);
            } else {
                this.relativeValue = Ext.Date.format(this.absoluteValue, this.dateFormat);
            }
            this.field.setRawValue(this.relativeValue);

            // this code updates the tooltip dynamically and guarantees relative time for body
            if (this.tip && this.tip.isVisible()) {
                var config = this.getTipConfig();
                this.tip.setMinWidth(config.minWidth);
                this.tip.setTitle(config.title);
                this.tip.setHtml(config.html);
            }

            if (focusEl) {
                if (!this.savedTitle) {
                    this.savedTitle = focusEl.dom.getAttribute('title');
                }
                focusEl.dom.removeAttribute('title');
            }
            this.start();
        } else {
            this.field.setValue(this.absoluteValue);
            if (this.savedTitle && focusEl) {
                focusEl.dom.setAttribute('title', this.savedTitle);
            }
            this.stop();
        }
    },

    // Destroy task and taskrunner when plugin is destroyed, then call parent.
    destroy: function () {
        this.updateTask.destroy();
        this.updateRunner.destroy();
        this.callParent();
    }
});