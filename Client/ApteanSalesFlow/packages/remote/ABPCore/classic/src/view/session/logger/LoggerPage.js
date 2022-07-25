Ext.define('ABP.view.session.logger.LoggerPage', {
    extend: 'ABP.view.components.panel.HeaderPanelBase',
    alias: 'widget.loggerpage',
    requires: [
        'ABP.util.Logger',
        'ABP.view.session.logger.LoggerController',
        'ABP.view.session.logger.LoggerViewModel'
    ],

    controller: 'loggerpagecontroller',
    viewModel: {
        type: 'loggerviewmodel'
    },

    bind: {
        title: '{i18n.logger_title:htmlEncode}'
    },

    layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'center'
    },
    closable: true,
    showFilter: true,
    listeners: {
        abp_header_filterChange: 'onFilterChanged'
    },

    header: {
        items: [
            {
                xtype: 'combo',
                bind: {
                    store: '{severity}'
                },
                flex: 2,
                minWidth: 200,
                maxWidth: 300,
                itemId: 'loggerSeverity',
                hideLabel: true,
                displayField: 'display',
                valueField: 'value',
                editable: false,
                forceSelection: true,
                autoSelect: true,
                value: 'ALL',
                listeners: {
                    change: 'severityChanged'
                }
            }
        ]
    },

    cls: 'about-container',
    height: '100%',
    width: '100%',

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

    items: [{
        xtype: 'dataview',
        store: 'ABPLoggingStore',
        autoScroll: false,
        margin: '8 0 8 0',
        itemSelector: '.log-item',
        scrollable: 'y',
        flex: 1,
        bind: {
            emptyText: '<div class="no-log-items">{i18n.logger_nothingtodisplay}</div>'
        },
        itemTpl: [
            '<div class="log-item {level:this.cls(values,parent[xindex-2],xindex-1,xcount)}">' +
            '{date:this.formatDate(values,parent[xindex-2],xindex-1,xcount)}' +
            '<div class="time-wrap">' +
            '<div class="log-item-abrev abp-logger-{level}" title="{level}">{level:this.firstChar}</div>' +
            '{time:this.formatTime(values,parent[xindex-2],xindex-1,xcount)}' +
            '</div>' +
            '<div class="line-wrap">' +
            '<div class="contents-wrap">' +
            '<label class="abp-logger-{level}">{level}</label>' +
            '<span class="message">{message}</span' +
            '<span class="detail">{detail}</span>' +
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
                    var formattedValue = this.formatIfDifferent(record, previous, 'H:i:s');
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
    }]
});
