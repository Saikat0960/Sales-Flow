Ext.define('ABP.view.session.logger.LoggerPage', {
    extend: 'ABP.view.components.panel.HeaderPanelBase',
    alias: 'widget.loggerpage',
    requires: [
        'ABP.util.Logger',
        'ABP.view.session.logger.LoggerController',
        'ABP.view.session.logger.LoggerViewModel',
    ],
    controller: 'loggerpagecontroller',
    viewModel: {
        type: 'loggerviewmodel'
    },
    layout: {
        type: 'fit',
    },
    scrollable: 'y',
    cls: 'about-container',
    height: '100%',
    width: '100%',
    showFilter: Ext.os.deviceType === "Phone" ? false : true,
    tools: [
        {
            itemId: 'clearLog',
            iconCls: 'icon-garbage-can',
            callback: 'clearClicked',
            bind: {
                tooltip: '{i18n.logger_clear:htmlEncode}'
            },
        }
    ],
    header: Ext.os.deviceType === "Phone" ? null : {
        items: [
            {
                xtype: 'selectfield',
                bind: {
                    store: '{severity}'
                },
                cls: 'logpage-combo',
                itemId: 'loggerSeverity',
                labelCls: 'logpage-combo-label',
                displayField: 'display',
                valueField: 'value',
                editable: false,
                autoSelect: true,
                value: 'ALL',
                listeners: {
                    change: 'severityChanged'
                }
            }
        ]
    },
    items: [
        {
            xtype: 'dataview',
            store: 'ABPLoggingStore',
            margin: '4 4 4 4',
            flex: 1,
            itemTpl: [
                '<div class="log-item {level:this.cls(values,parent[xindex-2],xindex-1,xcount)}">' +
                '{date:this.formatDate(values,parent[xindex-2],xindex-1,xcount)}' +
                '<div class="time-wrap">' +
                '<div class="log-item-abrev abp-logger-{level}" title="{level}">{level:this.firstChar}</div>' +
                '</div>' +
                '<div class="line-wrap">' +
                '<div class="contents-wrap">' +
                '<label class="abp-logger-{level}">{level}</label>' +
                '<span class="message">{message}</span' +
                '<span class="detail">{detail}</span>' +
                '{time:this.formatTime(values,parent[xindex-2],xindex-1,xcount)}' +
                '</div>' +
                '</div>' +
                '</div>',
                {
                    cls: function (value, record, previous, index, count) {
                        var cls = '';

                        if (!index) {
                            cls += ' timeline-item-first';
                        }
                        if (index > count - 2) {
                            cls += ' timeline-item-last';
                        }

                        return cls;
                    },
                    firstChar: function (value) {
                        return value.charAt(0).toUpperCase();
                    },
                    formatTime: function (value, record, previous, index, count) {
                        var formattedValue = Ext.Date.format(new Date(value), 'H:i:s');
                        if (formattedValue) {
                            return '<div class="log-item-time">' + formattedValue + '</div>';
                        }

                        return '';
                    },
                    formatDate: function (value, record, previous, index, count) {
                        var formattedValue = this.formatIfDifferent(record, previous, 'j F Y');
                        if (formattedValue) {
                            return '<div class="timeline-epoch">' + formattedValue + '</div>';
                        }

                        return '';
                    },
                    formatIfDifferent: function (current, previous, format) {
                        var previousValue = previous && (previous.isModel ? previous.data : previous)['time'];
                        var currentValue = current && (current.isModel ? current.data : current)['time'];

                        currentValue = new Date(currentValue);
                        var currentFormat = Ext.Date.format(currentValue, format);

                        if (!previousValue) {
                            return currentFormat;
                        }

                        previousValue = new Date(previousValue);
                        var previousFormat = Ext.Date.format(previousValue, format);

                        if (currentFormat === previousFormat)
                            return '';

                        return currentFormat;
                    }
                }
            ]
        }
    ],

    listeners: {
        abp_header_filterChange: 'onFilterChanged'
    },

    bind: {
        title: '{i18n.logger_title}'
    },
    closable: true,
    initialize: function () {
        var me = this;
        me.callParent();
        if (Ext.os.deviceType === "Phone") {
            me.add({
                xtype: 'container',
                cls: 'filtermenu-cont',
                reference: 'filterMenu',
                docked: 'top',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'textfield',
                    itemId: 'headerFilter',
                    flex: 2,
                    height: 32,
                    margin: '3px 5px 3px 5px',
                    reference: 'headerFilter',
                    bind: {
                        value: '{headerFilterValue}',
                        placeholder: '{i18n.abp_filter_empty_text:htmlEncode}'
                    },
                    listeners: {
                        change: 'onFilterChanged'
                    }
                }, {
                    xtype: 'selectfield',
                    flex: 1,
                    bind: {
                        store: '{severity}'
                    },
                    cls: 'logpage-combo',
                    itemId: 'loggerSeverity',
                    labelCls: 'logpage-combo-label',
                    displayField: 'display',
                    valueField: 'value',
                    editable: false,
                    autoSelect: true,
                    value: 'ALL',
                    listeners: {
                        change: 'severityChanged'
                    }
                }]
            });
        }
    }
});
