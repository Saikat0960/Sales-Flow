Ext.define('GridFilterBar.grid.FilterBar', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.filterbar',
    uses: [
        'Ext.window.MessageBox',
        'GridFilterBar.form.field.ClearButton',
        'GridFilterBar.form.field.OperatorButton',
        'Ext.container.Container',
        'Ext.util.DelayedTask',
        'Ext.layout.container.HBox',
        'Ext.data.ArrayStore',
        'Ext.button.Button',
        'Ext.form.field.Text',
        'Ext.form.field.Number',
        'Ext.form.field.Date',
        'Ext.form.field.ComboBox'
    ],
    mixins: {
        observable: 'Ext.util.Observable'
    },

    updateBuffer                : 800,                  // buffer time to apply filtering when typing/selecting

    columnFilteredCls           : Ext.baseCSSPrefix + 'column-filtered', // CSS class to apply to the filtered column header

    renderHidden                : true,                 // renders the filters hidden by default, use in combination with showShowHideButton
    showShowHideButton          : true,                 // add show/hide button in actioncolumn header if found, if not a new small column is created
    showHideButtonTooltipDo     : 'Show filter bar',    // button tooltip show
    showHideButtonTooltipUndo   : 'Hide filter bar',    // button tooltip hide
    showHideButtonIconCls       : 'filter',             // button iconCls

    showClearButton             : true,                 // use Ext.ux.form.field.ClearButton to allow user to clear each filter, the same as showShowHideButton
    showClearAllButton          : true,                 // add clearAll button in actioncolumn header if found, if not a new small column is created
    clearAllButtonIconCls       : 'clear-filters',      // css class with the icon of the clear all button
    clearAllButtonTooltip       : 'Clear all filters',  // button tooltip

    autoStoresRemoteProperty    : 'autoStores',         // if no store is configured for a combo filter then stores are created automatically, if remoteFilter is true then use this property to return arrayStores from the server
    autoStoresNullValue         : '###NULL###',         // value send to the server to expecify null filter
    autoStoresNullText          : '[empty]',            // NULL Display Text
    autoUpdateAutoStores        : false,                // if set to true combo autoStores are updated each time that a filter is applied

    enableOperators             : true,                 // enable operator selection for number and date filters

    // operator button texts
    textEq: 'Is equal to',
    textNe: 'Is not equal to',
    textGte: 'Great than or equal',
    textLte: 'Less than or equal',
    textGt: 'Great than',
    textLt: 'Less than',

    boolTpl: {
        xtype: 'combo',
        queryMode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        editable: false,
        operator: 'eq'
    },
    dateTpl: {
        xtype: 'datefield',
        editable: true,
        submitFormat: 'Y-m-d',
        operator: 'eq'
    },
    floatTpl: {
        xtype: 'numberfield',
        allowDecimals: true,
        minValue: 0,
        hideTrigger: true,
        keyNavEnabled: false,
        mouseWheelEnabled: false,
        operator: 'eq'
    },
    intTpl: {
        xtype: 'numberfield',
        allowDecimals: false,
        minValue: 0,
        operator: 'eq'
    },
    stringTpl: {
        xtype: 'textfield',
        operator: 'like'
    },
    comboTpl: {
        xtype: 'combo',
        queryMode: 'local',
        forceSelection: true,
        editable: false,
        triggerAction: 'all',
        operator: 'eq'
    },
    listTpl: {
        xtype: 'combo',
        queryMode: 'local',
        forceSelection: true,
        editable: false,
        triggerAction: 'all',
        multiSelect: true,
        operator: 'in'
    },

    constructor: function() {
        var me = this;

        me.mixins.observable.constructor.call(me);
        me.callParent(arguments);
    },

    // private
    init: function(grid) {
        var me = this;

        grid.on({
            columnresize: me.resizeContainer,
            columnhide: me.resizeContainer,
            columnshow: me.resizeContainer,
            beforedestroy: me.unsetup,
            reconfigure: me.resetup,
            scope: grid
        });

        // MIGRATION  It's no longer needed to add events before firing.
        // grid.addEvents('filterupdated');

        Ext.apply(grid, {
            filterBar: me,
            getFilterBar: function() {
                return this.filterBar;
            }
        });

        // me.boolTpl.store[0][1] = Ext.MessageBox.buttonText.yes;
        // me.boolTpl.store[1][1] = Ext.MessageBox.buttonText.no;

        me.setup.call(grid);
    },

    // private
    setup: function() {
        var grid = this,
            plugin = grid.getFilterBar();

        grid._filterBarPluginData = {};

        // configs from plugin, specific for grid and used in grid dcontext are stored in grid context
        grid._filterBarPluginData.updateBuffer = plugin.updateBuffer;
        grid._filterBarPluginData.columnFilteredCls = plugin.columnFilteredCls;
        grid._filterBarPluginData.renderHidden = plugin.renderHidden;
        grid._filterBarPluginData.showShowHideButton = plugin.showShowHideButton;
        grid._filterBarPluginData.showHideButtonTooltipDo = plugin.showHideButtonTooltipDo;
        grid._filterBarPluginData.showHideButtonTooltipUndo = plugin.showHideButtonTooltipUndo;
        grid._filterBarPluginData.showHideButtonIconCls = plugin.showHideButtonIconCls;
        grid._filterBarPluginData.showClearButton = plugin.showClearButton;
        grid._filterBarPluginData.showClearAllButton = plugin.showClearAllButton;
        grid._filterBarPluginData.clearAllButtonIconCls = plugin.clearAllButtonIconCls;
        grid._filterBarPluginData.clearAllButtonTooltip = plugin.clearAllButtonTooltip;
        grid._filterBarPluginData.autoStoresRemoteProperty = plugin.autoStoresRemoteProperty;
        grid._filterBarPluginData.autoStoresNullValue = plugin.autoStoresNullValue;
        grid._filterBarPluginData.autoStoresNullText = plugin.autoStoresNullText;
        grid._filterBarPluginData.autoUpdateAutoStores = plugin.autoUpdateAutoStores;
        grid._filterBarPluginData.enableOperators = plugin.enableOperators;
        grid._filterBarPluginData.textEq = plugin.textEq;
        grid._filterBarPluginData.textNe = plugin.textNe;
        grid._filterBarPluginData.textGte = plugin.textGte;
        grid._filterBarPluginData.textLte = plugin.textLte;
        grid._filterBarPluginData.textGt = plugin.textGt;
        grid._filterBarPluginData.textLt = plugin.textLt;
        grid._filterBarPluginData.boolTpl = plugin.boolTpl;
        grid._filterBarPluginData.dateTpl = plugin.dateTpl;
        grid._filterBarPluginData.floatTpl = plugin.floatTpl;
        grid._filterBarPluginData.intTpl = plugin.intTpl;
        grid._filterBarPluginData.stringTpl = plugin.stringTpl;
        grid._filterBarPluginData.comboTpl = plugin.comboTpl;
        grid._filterBarPluginData.listTpl = plugin.listTpl;


        grid._filterBarPluginData.visible = !plugin.renderHidden;
        grid._filterBarPluginData.autoStores = Ext.create('Ext.util.MixedCollection');
        grid._filterBarPluginData.autoStoresLoaded = false;
        grid._filterBarPluginData.columns = Ext.create('Ext.util.MixedCollection');
        grid._filterBarPluginData.containers = Ext.create('Ext.util.MixedCollection');
        grid._filterBarPluginData.fields = Ext.create('Ext.util.MixedCollection');
        grid._filterBarPluginData.actionColumn = grid.down('actioncolumn') || grid.down('actioncolumnpro');
        grid._filterBarPluginData.extraColumn = null;
        grid._filterBarPluginData.clearAllEl = null;
        grid._filterBarPluginData.showHideEl = null;
        grid._filterBarPluginData.filterArray = [];

        // create task per grid too
        grid._filterBarPluginData.task = Ext.create('Ext.util.DelayedTask');



        // MIGARTION start
        // In Ext5 we cant override proxy method encodeProxy. And we dont need it!
        // me.overrideProxy();
        // MIGRATIN end

        plugin.parseFiltersConfig.call(grid);    // sets me.columns and me.autoStores
        plugin.parseInitialFilters.call(grid);   // sets me.filterArray with the store previous filters if any (adds operator and type if missing)
        plugin.renderExtraColumn.call(grid);     // sets me.extraColumn if applicable

        // renders the filter's bar
        if (grid.rendered) {
            plugin.renderFilterBar.call(grid);
        } else {
            grid.on('afterrender', plugin.renderFilterBar, grid, { single: true });
        }
    },

    // private
    unsetup: function() {
        var grid = this,
            filterData = grid._filterBarPluginData,
            plugin = grid.getFilterBar();

        if (filterData.autoStores.getCount()) {
            grid.store.un('load', plugin.fillAutoStores, grid);
        }

        filterData.autoStores.each(function(item) {
            Ext.destroy(item);
        });

        filterData.autoStores.clear();
        filterData.autoStores = null;
        filterData.columns.each(function(column) {
            if (column.rendered) {
                if(column.getEl().hasCls(filterData.columnFilteredCls)) {
                    column.getEl().removeCls(filterData.columnFilteredCls);
                }
            }
        });

        filterData.columns.clear();
        filterData.columns = null;
        filterData.fields.each(function(item) {
            Ext.destroy(item);
        });

        filterData.fields.clear();
        filterData.fields = null;
        filterData.containers.each(function(item) {
            Ext.destroy(item);
        });

        filterData.containers.clear();
        filterData.containers = null;
        if (filterData.clearAllEl) {
            Ext.destroy(filterData.clearAllEl);
            filterData.clearAllEl = null;
        }

        if (filterData.showHideEl) {
            Ext.destroy(filterData.showHideEl);
            filterData.showHideEl = null;
        }
        if (filterData.extraColumn) {
            grid.headerCt.items.remove(filterData.extraColumn);
            Ext.destroy(filterData.extraColumn);
            filterData.extraColumn = null;
        }

        filterData.task = null;
        filterData.filterArray = null;
    },

    // private
    resetup: function() {
        var grid = this,
            plugin = grid.getFilterBar();

        plugin.unsetup.call(grid);
        plugin.setup.call(grid);
    },

    // private
    overrideProxy: function() {
        var grid = this,
            plugin = grid.getFilterBar();

           Ext.apply(grid.store.proxy, {
            encodeFilters: function(filters) {
                var min = [],
                    length = filters.length,
                    i = 0;

                for (; i < length; i++) {
                    min[i] = {
                        property: filters[i].property,
                        value   : filters[i].value
                    };
                    if (filters[i].type) {
                        min[i].type = filters[i].type;
                    }
                    if (filters[i].operator) {
                        min[i].operator = filters[i].operator;
                    }
                }
                return this.applyEncoding(min);
            }
        });
    },

    // private
    parseFiltersConfig: function() {
        var grid = this,
            filterData = grid._filterBarPluginData,
            plugin = grid.getFilterBar();

        //var columns = this.grid.headerCt.getGridColumns(true);
        // changed by Richard Laffers - the above is incompatible with Ext 4.2.1
        var columns = grid.headerCt.getGridColumns();
        filterData.columns.clear();
        filterData.autoStores.clear();

        Ext.each(columns, function(column) {
            if (column.filter) {
                if (column.filter === true || column.filter === 'auto') { // automatic types configuration (store based)
                    // MIGRATION start
                    // var type = me.grid.store.model.prototype.fields.get(column.dataIndex).type.type;
                    // model.fields.get(..) is incompatible with Ext5.
                    // field.type.type is incompatible with Ext5. We use field.getType().
                    var type;
                    Ext.each(grid.store.model.prototype.fields, function(field) {
                        if (field.name === column.dataIndex) {
                            type = field.getType();
                            return false;
                        }
                    });
                    // MIGARTION end
                    if (type == 'auto') { type = 'string'; }
                    column.filter = type;
                }
                if (Ext.isString(column.filter)) {
                    column.filter = {
                        type: column.filter // only set type to then use templates
                    };
                }
                if (column.filter.type) {
                    column.filter = Ext.applyIf(column.filter, filterData[column.filter.type + 'Tpl']); // also use     templates but with user configuration

                    // create store for boolean filter
                    if (column.filter.type == 'bool' && !column.filter.store) {
                        column.filter.store = [
                            [1, Ext.MessageBox.buttonText.yes],
                            [0, Ext.MessageBox.buttonText.no]
                        ];

                        if (column.filter.yesText) {
                            column.filter.store[0][1] = column.filter.yesText;
                        }

                        if (column.filter.noText) {
                            column.filter.store[1][1] = column.filter.noText;
                        }
                    }
                }

                if (column.filter.xtype == 'combo' && !column.filter.store) {
                    column.autoStore = true;
                    column.filter.store = Ext.create('Ext.data.ArrayStore', {
                        fields: [{
                            name: 'text'
                        },{
                            name: 'id'
                        }]
                    });
                    filterData.autoStores.add(column.dataIndex, column.filter.store);
                    column.filter = Ext.apply(column.filter, {
                        displayField: 'text',
                        valueField: 'id'
                    });
                }

                if (!column.filter.type) {
                    switch(column.filter.xtype) {
                        case 'combo':
                            column.filter.type = (column.filter.multiSelect ? 'list' : 'combo');
                            break;
                        case 'datefield':
                            column.filter.type = 'date';
                            break;
                        case 'numberfield':
                            column.filter.type = (column.filter.allowDecimals ? 'float' : 'int');
                            break;
                        default:
                            column.filter.type = 'string';
                    }
                }

                if (!column.filter.operator) {
                    column.filter.operator = filterData[column.filter.type + 'Tpl'].operator;
                }
                filterData.columns.add(column.dataIndex, column);
            }
        });

        if (filterData.autoStores.getCount()) {
            if (grid.store.getCount() > 0) {
                plugin.fillAutoStores.call(grid);
            }
            if (grid.store.remoteFilter) {
                var autoStores = [];
                filterData.autoStores.eachKey(function(key, item) {
                    autoStores.push(key);
                });
                grid.store.proxy.extraParams = grid.store.proxy.extraParams || {};
                grid.store.proxy.extraParams[filterData.autoStoresRemoteProperty] = autoStores;
            }
            grid.store.on('load', plugin.fillAutoStores, grid);
        }
    },

    // private
    fillAutoStores: function() {
        var grid = this,
            filterData = grid._filterBarPluginData
           ;

        if (!filterData.autoUpdateAutoStores && filterData.autoStoresLoaded) {
            return;
        }

        filterData.autoStores.eachKey(function(key, item) {
            var field,
                data,
                record,
                records,
                fieldValue;

            field = filterData.fields.get(key);
            if (field) {
                field.suspendEvents();
                fieldValue = field.getValue();
            }
            if (!grid.store.remoteFilter) { // values from local store
                data = grid.store.collect(key, true, false).sort();
                records = [];
                Ext.each(data, function(txt) {
                    if (Ext.isEmpty(txt)) {
                        Ext.Array.insert(records, 0, [{
                            text: filterData.autoStoresNullText,
                            id: filterData.autoStoresNullValue
                        }]);
                    } else {
                        records.push({
                            text: txt,
                            id: txt
                        });
                    }
                });
                item.loadData(records);
            } else { // values from server
                if (grid.store.proxy.reader.rawData[filterData.autoStoresRemoteProperty]) {
                    data = grid.store.proxy.reader.rawData[filterData.autoStoresRemoteProperty];
                    if (data[key]) {
                        records = [];
                        Ext.each(data[key].sort(), function(txt) {
                            if (Ext.isEmpty(txt)) {
                                Ext.Array.insert(records, 0, [{
                                    text: filterData.autoStoresNullText,
                                    id: filterData.autoStoresNullValue
                                }]);
                            } else {
                                records.push({
                                    text: txt,
                                    id: txt
                                });
                            }
                        });
                        item.loadData(records);
                    }
                }
            }
            if (field) {
                field.setValue(fieldValue);
                field.resumeEvents();
            }
        });

        filterData.autoStoresLoaded = true;
        if (grid.store.remoteFilter && !filterData.autoUpdateAutoStores) {
            delete grid.store.proxy.extraParams[filterData.autoStoresRemoteProperty];
        }
    },

    // private
    parseInitialFilters: function() {
        var grid = this,
            filterData = grid._filterBarPluginData,
            plugin = grid.getFilterBar()
            ;

        filterData.filterArray = [];
        //11.6.2015 Peter Sliacky
        //tuto podmienku som pridal po migracii z Ext JS 6.0.0.227 na 6.0.0.415, pretoze store.filters bol undifined
        //bolo by teda dobre toto opravit
        if (grid.store.filters) {
            grid.store.filters.each(function(filter) {
                // try to parse initial filters, for now filterFn is unsuported
                if (filter.property && !Ext.isEmpty(filter.value) && filterData.columns.get(filter.property)) {
                    if (!filter.type) {
                        filter.type = filterData.columns.get(filter.property).filter.type;
                    }
                    if (!filter.operator) {
                        filter.operator = filterData.columns.get(filter.property).filter.operator;
                    }
                    filterData.filterArray.push(filter);
                }
            });
        }
    },

    // private
    renderExtraColumn: function() {
        var grid = this,
            plugin = grid.getFilterBar(),
            filterData = grid._filterBarPluginData
            ;

        if (filterData.columns.getCount() && !filterData.actionColumn && (filterData.showClearAllButton || filterData.showShowHideButton)) {
            var extraColumnCssClass = Ext.baseCSSPrefix + 'filter-bar-extra-column-hack';
            if (!document.getElementById(extraColumnCssClass)) {
                var style = document.createElement('style'),
                    css = 'tr.' + Ext.baseCSSPrefix + 'grid-row td.' + extraColumnCssClass + ' { background-color: #ffffff !important; border-color: #ffffff !important; }'
                    ;

                style.setAttribute('type', 'text/css');
                style.setAttribute('id', extraColumnCssClass);
                document.body.appendChild(style);
                if (style.styleSheet) {     // IE
                    style.styleSheet.cssText = css;
                } else {                    // others
                    var cssNode = document.createTextNode(css);
                    style.appendChild(cssNode);
                }
            }
            filterData.extraColumn = Ext.create('Ext.grid.column.Column', {
                draggable: false,
                hideable: false,
                menuDisabled: true,
                sortable: false,
                resizable: false,
                fixed: true,
                width: 28,
                minWidth: 28,
                maxWidth: 28,
                header: '&nbsp;',
                tdCls: extraColumnCssClass,
                // we dont need export this column
                ignoreExport: true
            });
            grid.headerCt.add(filterData.extraColumn);
        }
    },

    // private
    renderFilterBar: function() {
        var grid = this,
            plugin = grid.getFilterBar(),
            filterData = grid._filterBarPluginData
            ;

        filterData.containers.clear();
        filterData.fields.clear();
        filterData.columns.eachKey(function(key, column) {
            var listConfig = column.filter.listConfig || {};
            listConfig = Ext.apply(listConfig, {
                style: 'border-top-width: 1px'
            });
            var plugins = [];
            if (filterData.showClearButton) {
                plugins.push({
                    ptype: 'clearbutton'
                });
            }
            if (filterData.enableOperators && (column.filter.type == 'date' || column.filter.type == 'int' || column.filter.type == 'float')) {
                plugins.push({
                    ptype: 'operatorbutton',
                    listeners: {
                        operatorchanged: function(txt) {
                            if (Ext.isEmpty(txt.getValue())) {
                                return;
                            }
                            plugin.applyInstantFilters.call(grid, txt);
                        }
                    },
                    // texts for the operator button items
                    texteq: filterData.textEq,
                    textne: filterData.textNe,
                    textgte: filterData.textGte,
                    textlte: filterData.textLte,
                    textgt: filterData.textGt,
                    textlt: filterData.textLt
                });
            }
            var field = Ext.widget(column.filter.xtype, Ext.apply(column.filter, {
                dataIndex: key,
                flex: 1,
                margin: 0,
                fieldStyle: 'border-left-width: 0px; border-bottom-width: 0px;',
                listConfig: listConfig,
                preventMark: true,
                msgTarget: 'none',
                checkChangeBuffer: 50,
                enableKeyEvents: true,
                listeners: {
                    change: plugin.applyDelayedFilters,
                    select: plugin.applyInstantFilters,
                    keypress: function(txt, e) {
                        if(e.getCharCode() == 13) {
                            e.stopEvent();
                            plugin.applyInstantFilters.call(grid, txt);
                        }
                        return false;
                    },
                    scope: grid
                },
                plugins: plugins
            }));
            filterData.fields.add(column.dataIndex, field);
            var container = Ext.create('Ext.container.Container', {
                dataIndex: key,
                layout: 'hbox',
                bodyStyle: 'background-color: "transparent";',
                width: column.getWidth(),
                items: [field],
                listeners: {
                    // TODO set scope to grid, or let scope set to default?
                    scope: plugin,
                    element: 'el',
                    mousedown: function(e) { e.stopPropagation(); },
                    click: function(e) { e.stopPropagation(); },
                    dblclick: function(e) { e.stopPropagation(); },
                    keydown: function(e) { e.stopPropagation(); },
                    keypress: function(e) { e.stopPropagation(); },
                    keyup: function(e) { e.stopPropagation(); }
                }
            });
            filterData.containers.add(column.dataIndex, container);
            container.render(Ext.get(column.id));
        });

        var excludedCols = [];
        if (filterData.actionColumn) {
            excludedCols.push(filterData.actionColumn.id);
        }

        if (filterData.extraColumn) {
            excludedCols.push(filterData.extraColumn.id);
        }

        //Ext.each(me.grid.headerCt.getGridColumns(true), function(column) {
        // changed by Richard Laffers - the above is incompatible with Ext 4.2.1
        Ext.each(grid.headerCt.getGridColumns(), function(column) {
            if (!Ext.Array.contains(excludedCols, column.id)) {
                column.setPadding = Ext.Function.createInterceptor(column.setPadding, function(h) {
                    if (column.hasCls(Ext.baseCSSPrefix + 'column-header-checkbox')) { //checkbox column
                        this.titleEl.setStyle({
                            paddingTop: '4px'
                        });
                    }
                    return false;
                });
            }
        });


        plugin.setVisible.call(grid, filterData.visible);

        plugin.renderButtons.call(grid);

        plugin.showInitialFilters.call(grid);
    },

    //private
    renderButtons: function() {
        var grid = this,
            plugin = grid.getFilterBar(),
            filterData = grid._filterBarPluginData,
            column,
            buttonEl
        ;

        if (filterData.showShowHideButton && filterData.columns.getCount()) {
            column = filterData.actionColumn || filterData.extraColumn;
            buttonEl = column.el.first().first();
            filterData.showHideEl = Ext.get(Ext.core.DomHelper.append(buttonEl, {
                tag: 'div',
                style: 'position: absolute; width: 16px; height: 16px; top: 3px; cursor: pointer; left: ' + parseInt((column.el.getWidth() - 16) / 2,10) + 'px',
                cls: filterData.showHideButtonIconCls,
                'data-qtip': (filterData.renderHidden ? filterData.showHideButtonTooltipDo : filterData.showHideButtonTooltipUndo)
            }));
            filterData.showHideEl.on('click', function() {

                plugin.setVisible.call(grid, !filterData.visible);
                filterData.showHideEl.set({
                    'data-qtip': (!filterData.visible ? filterData.showHideButtonTooltipDo : filterData.showHideButtonTooltipUndo)
                });
            });
        }

        if (filterData.showClearAllButton && filterData.columns.getCount()) {
            column = filterData.actionColumn || filterData.extraColumn;
            buttonEl = column.el.first().first();
            filterData.clearAllEl = Ext.get(Ext.core.DomHelper.append(buttonEl, {
                tag: 'div',
                //style: 'position: absolute; width: 16px; height: 16px; top: 25px; cursor: pointer; left: ' + parseInt((column.el.getWidth() - 16) / 2) + 'px',
                style: 'position: absolute; width: 16px; height: 16px; bottom: 2px; cursor: pointer; left: 2px',
                cls: filterData.clearAllButtonIconCls,
                'data-qtip': filterData.clearAllButtonTooltip
            }));

            filterData.clearAllEl.hide();
            filterData.clearAllEl.on('click', function() {
                plugin.clearFilters.call(grid);
            });
        }
    },

    // private
    showInitialFilters: function() {
        var grid = this,
            plugin = grid.getFilterBar(),
            filterData = grid._filterBarPluginData
            ;

        Ext.each(filterData.filterArray, function(filter) {
            var column = filterData.columns.get(filter.property);
            var field = filterData.fields.get(filter.property);
            if(!column.getEl().hasCls(filterData.columnFilteredCls)) {
                column.getEl().addCls(filterData.columnFilteredCls);
            }
            field.suspendEvents();
            field.setValue(filter.value);
            field.resumeEvents();
        });

        if (filterData.filterArray.length && filterData.showClearAllButton) {
            filterData.clearAllEl.show({duration: 1000});
        }
    },

    // private
    resizeContainer: function(headerCt, col) {
        var grid = this,
            plugin = grid.getFilterBar(),
            filterData = grid._filterBarPluginData,
            item,
            itemWidth,
            colWidth,
            dataIndex = col.dataIndex
        ;

        if (!dataIndex) {
            return;
        }

        item = filterData.containers.get(dataIndex);
        if (item && item.rendered) {
            itemWidth = item.getWidth();
            colWidth = filterData.columns.get(dataIndex).getWidth();
            if (itemWidth != colWidth) {
                item.setWidth(filterData.columns.get(dataIndex).getWidth());
                // MIGARTION start
                // doLayout() is deprecated in Ext5
                // item.doLayout();
                item.updateLayout();
                // MIGARTION end
            }
        }
    },

    // private
    applyFilters: function(field) {
        var grid = this,
            plugin = grid.getFilterBar(),
            filterData = grid._filterBarPluginData,
            column,
            newVal,
            myIndex
        ;

        if (!field.isValid()) {
            return;
        }

        column = filterData.columns.get(field.dataIndex);
        newVal = (grid.store.remoteFilter ? field.getSubmitValue() : field.getValue());

        if (Ext.isArray(newVal) && newVal.length === 0) {
            newVal = '';
        }

        myIndex = -1;
        Ext.each(filterData.filterArray, function(item2, index, allItems) {
            // MIGRATION start
            // if(item2.property === column.dataIndex) {
            if(item2.getProperty() === column.dataIndex) {
            // MIGRATION end
                myIndex = index;
            }
        });

        if(myIndex != -1) {
            filterData.filterArray.splice(myIndex, 1);
        }

        if(!Ext.isEmpty(newVal)) {
            if (!grid.store.remoteFilter) {
                var operator = field.operator || column.filter.operator,
                    filterFn;
                switch(operator) {
                    case 'eq':
                        filterFn = function(item) {
                            if (column.filter.type == 'date') {
                                return Ext.Date.clearTime(item.get(column.dataIndex), true).getTime() == Ext.Date.clearTime(newVal, true).getTime();
                            } else {
                                return (Ext.isEmpty(item.get(column.dataIndex)) ? filterData.autoStoresNullValue : item.get(column.dataIndex)) == (Ext.isEmpty(newVal) ? filterData.autoStoresNullValue : newVal);
                            }
                        };
                        break;
                    case 'gte':
                        filterFn = function(item) {
                            if (column.filter.type == 'date') {
                                return Ext.Date.clearTime(item.get(column.dataIndex), true).getTime() >= Ext.Date.clearTime(newVal, true).getTime();
                            } else {
                                return (Ext.isEmpty(item.get(column.dataIndex)) ? filterData.autoStoresNullValue : item.get(column.dataIndex)) >= (Ext.isEmpty(newVal) ? filterData.autoStoresNullValue : newVal);
                            }
                        };
                        break;
                    case 'lte':
                        filterFn = function(item) {
                            if (column.filter.type == 'date') {
                                return Ext.Date.clearTime(item.get(column.dataIndex), true).getTime() <= Ext.Date.clearTime(newVal, true).getTime();
                            } else {
                                return (Ext.isEmpty(item.get(column.dataIndex)) ? filterData.autoStoresNullValue : item.get(column.dataIndex)) <= (Ext.isEmpty(newVal) ? filterData.autoStoresNullValue : newVal);
                            }
                        };
                        break;
                    case 'ne':
                        filterFn = function(item) {
                            if (column.filter.type == 'date') {
                                return Ext.Date.clearTime(item.get(column.dataIndex), true).getTime() != Ext.Date.clearTime(newVal, true).getTime();
                            } else {
                                return (Ext.isEmpty(item.get(column.dataIndex)) ? filterData.autoStoresNullValue : item.get(column.dataIndex)) != (Ext.isEmpty(newVal) ? filterData.autoStoresNullValue : newVal);
                            }
                        };
                        break;
                    case 'like':
                        filterFn = function(item) {
                            var re = new RegExp(newVal, 'i');
                            return re.test(item.get(column.dataIndex));
                        };
                        break;
                    case 'in':
                        filterFn = function(item) {
                            var re = new RegExp('^' + newVal.join('|') + '$', 'i');
                            return re.test((Ext.isEmpty(item.get(column.dataIndex)) ? filterData.autoStoresNullValue : item.get(column.dataIndex)));
                        };
                        break;
                }
                filterData.filterArray.push(Ext.create('Ext.util.Filter', {
                    property: column.dataIndex,
                    filterFn: filterFn
                    // me: me
                }));
            } else {
                filterData.filterArray.push(Ext.create('Ext.util.Filter', {
                    property: column.dataIndex,
                    value: newVal,
                    type: column.filter.type,
                    operator: (field.operator || column.filter.operator)
                }));
            }
            if(!column.getEl().hasCls(filterData.columnFilteredCls)) {
                column.getEl().addCls(filterData.columnFilteredCls);
            }
        } else {
            if(column.getEl().hasCls(filterData.columnFilteredCls)) {
                column.getEl().removeCls(filterData.columnFilteredCls);
            }
        }
        grid.store.currentPage = 1;
        if(filterData.filterArray.length > 0) {
            if (!grid.store.remoteFilter) {
                grid.store.clearFilter();
            }
            if (grid.store.filters) {
                grid.store.filters.clear();
            }
            // MIGRATION start
            // grid.store.filter(me.filterArray);
            grid.store.addFilter(filterData.filterArray);
            // MIGRATION end

            if (filterData.clearAllEl) {
                filterData.clearAllEl.show({duration: 1000});
            }
        } else {
            grid.store.clearFilter();
            if (filterData.clearAllEl) {
                filterData.clearAllEl.hide({duration: 1000});
            }
        }
        if (!grid.store.remoteFilter && filterData.autoUpdateAutoStores) {
            plugin.fillAutoStores.call(grid);
        }
        grid.fireEvent('filterupdated', filterData.filterArray);
    },

    // private
    applyDelayedFilters: function(field) {
        var grid = this,
            filterData = grid._filterBarPluginData,
            plugin = grid.getFilterBar()
        ;

        if (!field.isValid()) {
            return;
        }

        filterData.task.delay(filterData.updateBuffer, plugin.applyFilters, grid, [field]);
    },

    // private
    applyInstantFilters: function(field) {
        var grid = this,
            filterData = grid._filterBarPluginData,
            plugin = grid.getFilterBar()
        ;

        if (!field.isValid()) {
            return;
        }

        filterData.task.delay(0, plugin.applyFilters, grid, [field]);
    },

    //private
    getFirstField: function() {
        var grid = this,
            filterData = grid._filterBarPluginData,
            plugin = grid.getFilterBar(),
            field
        ;

        // changed by Richard Laffers - the above is incompatible with Ext 4.2.1
        //Ext.each(me.grid.headerCt.getGridColumns(true), function(col) {
        Ext.each(grid.headerCt.getGridColumns(), function(col) {
            if (col.filter) {
                field = filterData.fields.get(col.dataIndex);
                return false;
            }
        });

        return field;
    },

    //private
    focusFirstField: function() {
        var grid = this,
            filterData = grid._filterBarPluginData,
            plugin = grid.getFilterBar(),
            field
        ;


        field = plugin.getFirstField.call(grid);

        if (field) {
            field.focus(false, 200);
        }
    },

    clearFilters: function() {
        var grid = this,
            filterData = grid._filterBarPluginData,
            plugin = grid.getFilterBar(),
            column
        ;


        if (filterData.filterArray.length === 0) {
            return;
        }

        filterData.filterArray = [];
        filterData.fields.eachKey(function(key, field) {
            field.suspendEvents();
            field.reset();
            field.resumeEvents();
            column = filterData.columns.get(key);
            if(column.getEl().hasCls(Ext.baseCSSPrefix + 'column-filtered')) {
                column.getEl().removeCls(Ext.baseCSSPrefix + 'column-filtered');
            }
        });

        grid.store.clearFilter();
        if (filterData.clearAllEl) {
            filterData.clearAllEl.hide({duration: 1000});
        }

        grid.fireEvent('filterupdated', filterData.filterArray);
    },

    setVisible: function(visible) {
        var grid = this,
            filterData = grid._filterBarPluginData,
            plugin = grid.getFilterBar()
        ;


        filterData.containers.each(function(item) {
            item.setVisible(visible);
        });

        if (visible) {
            plugin.focusFirstField.call(grid);
        }

        // MIGRATION start
        // doLayout() is deprecated in Ext5
        // me.grid.headerCt.doLayout();
        grid.headerCt.updateLayout();

        // MIGRATION end
        filterData.visible = visible;
    }

});


(function() {
    /**
     * @class GridFilterBar.form.field.ClearButton
     *
     * Plugin for text components that shows a "clear" button over the text field.
     * When the button is clicked the text field is set empty.
     * Icon image and positioning can be controlled using CSS.
     * Works with Ext.form.field.Text, Ext.form.field.TextArea, Ext.form.field.ComboBox and Ext.form.field.Date.
     *
     * Plugin alias is 'clearbutton' (use "plugins: 'clearbutton'" in GridPanel config).
     *
     * @author <a href="mailto:stephen.friedrich@fortis-it.de">Stephen Friedrich</a>
     * @author <a href="mailto:fabian.urban@fortis-it.de">Fabian Urban</a>
     *
     * @copyright (c) 2011 Fortis IT Services GmbH
     * @license Ext.ux.form.field.ClearButton is released under the
     * <a target="_blank" href="http://www.apache.org/licenses/LICENSE-2.0">Apache License, Version 2.0</a>.
     *
     * 2011-11-30 Ing. Leonardo D'Onofrio leonardo_donofrio at hotmail.com
     * Fixed clear button positioning in combos inside a tab
     * Use clearValue to clear combos
     * 2012-03-08 Ing. Leonardo D'Onofrio leonardo_donofrio at hotmail.com
     * Fix position when using with IconCombo
     * 2012-04-20 Ing. Leonardo D'Onofrio leonardo_donofrio at hotmail.com
     * FIX APPLIED FOR 4.1
     */
    Ext.define('GridFilterBar.form.field.ClearButton', {
        alias: 'plugin.clearbutton',

        /**
         * @cfg {Boolean} Hide the clear button when the field is empty (default: true).
         */
        hideClearButtonWhenEmpty: true,

        /**
         * @cfg {Boolean} Hide the clear button until the mouse is over the field (default: true).
         */
        hideClearButtonWhenMouseOut: true,

        /**
         * @cfg {Boolean} When the clear buttons is hidden/shown, this will animate the button to its new state (using opacity) (default: true).
         */
        animateClearButton: true,

        /**
         * @cfg {Boolean} Empty the text field when ESC is pressed while the text field is focused.
         */
        clearOnEscape: true,

        /**
         * @cfg {String} CSS class used for the button div.
         * Also used as a prefix for other classes (suffixes: '-mouse-over-input', '-mouse-over-button', '-mouse-down', '-on', '-off')
         */
        clearButtonCls: 'ext-ux-clearbutton',

        /**
         * The text field (or text area, combo box, date field) that we are attached to
         */
        textField: null,

        /**
         * Will be set to true if animateClearButton is true and the browser supports CSS 3 transitions
         * @private
         */
        animateWithCss3: false,

        /////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // Set up and tear down
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////////

        constructor: function(cfg) {
            Ext.apply(this, cfg);

            this.callParent(arguments);
        },

        /**
         * Called by plug-in system to initialize the plugin for a specific text field (or text area, combo box, date field).
         * Most all the setup is delayed until the component is rendered.
         */
        init: function(textField) {
            this.textField = textField;
            if (!textField.rendered) {
                textField.on('afterrender', this.handleAfterRender, this);
            }
            else {
                // probably an existing input element transformed to extjs field
                this.handleAfterRender();
            }
        },

        /**
         * After the field has been rendered sets up the plugin (create the Element for the clear button, attach listeners).
         * @private
         */
        handleAfterRender: function(textField) {
            this.isTextArea = (this.textField.inputEl.dom.type.toLowerCase() == 'textarea');

            this.createClearButtonEl();
            this.addListeners();

            this.repositionClearButton();
            this.updateClearButtonVisibility();

            this.addEscListener();
        },

        /**
         * Creates the Element and DOM for the clear button
         */
        createClearButtonEl: function() {
            var animateWithClass = this.animateClearButton && this.animateWithCss3;
            this.clearButtonEl = this.textField.bodyEl.createChild({
                tag: 'div',
                cls: this.clearButtonCls
            });
            if(this.animateClearButton) {
                this.animateWithCss3 = this.supportsCssTransition(this.clearButtonEl);
            }
            if(this.animateWithCss3) {
                this.clearButtonEl.addCls(this.clearButtonCls + '-off');
            }
            else {
                this.clearButtonEl.setStyle('visibility', 'hidden');
            }
        },

        /**
         * Returns true iff the browser supports CSS 3 transitions
         * @param el an element that is checked for support of the "transition" CSS property (considering any
         *           vendor prefixes)
         */
        supportsCssTransition: function(el) {
            var styles = ['transitionProperty', 'WebkitTransitionProperty', 'MozTransitionProperty',
                          'OTransitionProperty', 'msTransitionProperty', 'KhtmlTransitionProperty'];

            var style = el.dom.style;
            for(var i = 0, length = styles.length; i < length; ++i) {
                if(style[styles[i]] !== 'undefined') {
                    // Supported property will result in empty string
                    return true;
                }
            }
            return false;
        },

        /**
         * If config option "clearOnEscape" is true, then add a key listener that will clear this field
         */
        addEscListener: function() {
            if (!this.clearOnEscape) {
                return;
            }

            // Using a KeyMap did not work: ESC is swallowed by combo box and date field before it reaches our own KeyMap
            this.textField.inputEl.on('keydown',
                function(e) {
                    if (e.getKey() == Ext.EventObject.ESC) {
                        if (this.textField.isExpanded) {
                            // Let combo box or date field first remove the popup
                            return;
                        }
                        // No idea why the defer is necessary, but otherwise the call to setValue('') is ignored

                        // 2011-11-30 Ing. Leonardo D'Onofrio leonardo_donofrio at hotmail.com
                        if (this.textField.clearValue) {
                            Ext.Function.defer(this.textField.clearValue, 1, this.textField);
                        } else {
                            Ext.Function.defer(this.textField.setValue, 1, this.textField, ['']);
                        }
                        // end Ing. Leonardo D'Onofrio
                        e.stopEvent();
                    }
                },
                this);
        },

        /**
         * Adds listeners to the field, its input element and the clear button to handle resizing, mouse over/out events, click events etc.
         */
        addListeners: function() {
            // listeners on input element (DOM/El level)
            var textField = this.textField;
            var bodyEl = textField.bodyEl;
            bodyEl.on('mouseover', this.handleMouseOverInputField, this);
            bodyEl.on('mouseout', this.handleMouseOutOfInputField, this);

            // listeners on text field (component level)
            textField.on('destroy', this.handleDestroy, this);
            textField.on('resize', this.repositionClearButton, this);
            textField.on('change', function() {
                this.repositionClearButton();
                this.updateClearButtonVisibility();
            }, this);

            // listeners on clear button (DOM/El level)
            var clearButtonEl = this.clearButtonEl;
            clearButtonEl.on('mouseover', this.handleMouseOverClearButton, this);
            clearButtonEl.on('mouseout', this.handleMouseOutOfClearButton, this);
            clearButtonEl.on('mousedown', this.handleMouseDownOnClearButton, this);
            clearButtonEl.on('mouseup', this.handleMouseUpOnClearButton, this);
            clearButtonEl.on('click', this.handleMouseClickOnClearButton, this);
        },

        /**
         * When the field is destroyed, we also need to destroy the clear button Element to prevent memory leaks.
         */
        handleDestroy: function() {
            this.clearButtonEl.destroy();
        },

        /////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // Mouse event handlers
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Tada - the real action: If user left clicked on the clear button, then empty the field
         */
        handleMouseClickOnClearButton: function(event, htmlElement, object) {
            if (!this.isLeftButton(event)) {
                return;
            }
            // 2011-11-30 Ing. Leonardo D'Onofrio leonardo_donofrio at hotmail.com
            if (this.textField.clearValue) {
                this.textField.clearValue();
            } else {
                this.textField.setValue('');
            }
            // end Ing. Leonardo D'Onofrio
            this.textField.focus();
        },

        handleMouseOverInputField: function(event, htmlElement, object) {
            this.clearButtonEl.addCls(this.clearButtonCls + '-mouse-over-input');
            if (event.getRelatedTarget() == this.clearButtonEl.dom) {
                // Moused moved to clear button and will generate another mouse event there.
                // Handle it here to avoid duplicate updates (else animation will break)
                this.clearButtonEl.removeCls(this.clearButtonCls + '-mouse-over-button');
                this.clearButtonEl.removeCls(this.clearButtonCls + '-mouse-down');
            }
            this.updateClearButtonVisibility();
        },

        handleMouseOutOfInputField: function(event, htmlElement, object) {
            this.clearButtonEl.removeCls(this.clearButtonCls + '-mouse-over-input');
            if (event.getRelatedTarget() == this.clearButtonEl.dom) {
                // Moused moved from clear button and will generate another mouse event there.
                // Handle it here to avoid duplicate updates (else animation will break)
                this.clearButtonEl.addCls(this.clearButtonCls + '-mouse-over-button');
            }
            this.updateClearButtonVisibility();
        },

        handleMouseOverClearButton: function(event, htmlElement, object) {
            event.stopEvent();
            if (this.textField.bodyEl.contains(event.getRelatedTarget())) {
                // has been handled in handleMouseOutOfInputField() to prevent double update
                return;
            }
            this.clearButtonEl.addCls(this.clearButtonCls + '-mouse-over-button');
            this.updateClearButtonVisibility();
        },

        handleMouseOutOfClearButton: function(event, htmlElement, object) {
            event.stopEvent();
            if (this.textField.bodyEl.contains(event.getRelatedTarget())) {
                // will be handled in handleMouseOverInputField() to prevent double update
                return;
            }
            this.clearButtonEl.removeCls(this.clearButtonCls + '-mouse-over-button');
            this.clearButtonEl.removeCls(this.clearButtonCls + '-mouse-down');
            this.updateClearButtonVisibility();
        },

        handleMouseDownOnClearButton: function(event, htmlElement, object) {
            if (!this.isLeftButton(event)) {
                return;
            }
            this.clearButtonEl.addCls(this.clearButtonCls + '-mouse-down');
        },

        handleMouseUpOnClearButton: function(event, htmlElement, object) {
            if (!this.isLeftButton(event)) {
                return;
            }
            this.clearButtonEl.removeCls(this.clearButtonCls + '-mouse-down');
        },

        /////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        // Utility methods
        //
        /////////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Repositions the clear button element based on the textfield.inputEl element
         * @private
         */
        /* FIX FOR 4.1 */
        /*
        repositionClearButton: function() {
            var clearButtonEl = this.clearButtonEl;
            if (!clearButtonEl) {
                return;
            }
            var clearButtonPosition = this.calculateClearButtonPosition(this.textField);
            clearButtonEl.dom.style.right = clearButtonPosition.right + 'px';
            clearButtonEl.dom.style.top = clearButtonPosition.top + 'px';
        },
        */

        repositionClearButton : function() {
            var clearButtonEl = this.clearButtonEl;
            if (!clearButtonEl) {
                return;
            }
            var right = 0;
            if (this.fieldHasScrollBar()) {
                right += Ext.getScrollBarWidth();
            }
            if (this.textField.triggerWrap) {
                right += this.getTriggerWidth(this.textField);
            }
            // clearButtonEl.alignTo(this.textField.bodyEl, 'tr-tr', [-1 * (right + 3), 5]);
            clearButtonEl.alignTo(this.textField.bodyEl, 'r-r', [-1 * (right + 3), 0]);
        },
        /* END FIX FOR 4.1*/

        /**
         * Calculates the position of the clear button based on the textfield.inputEl element
         * @private
         */
        calculateClearButtonPosition: function(textField) {
            var positions = textField.inputEl.getBox(true, true);
            var top = positions.y;
            var right = positions.x;

            if (this.fieldHasScrollBar()) {
                right += Ext.getScrollBarWidth();
            }
            if (this.textField.triggerWrap) {
                right += this.getTriggerWidth(this.textField);
                // 2011-11-30 Ing. Leonardo D'Onofrio leonardo_donofrio at hotmail.com
                if (!this.getTriggerWidth(this.textField)) {
                    Ext.Function.defer(this.repositionClearButton, 100, this);
                }
                // end Ing. Leonardo D'Onofrio
            }
            // 2012-03-08 Ing. Leonardo D'Onofrio leonardo_donofrio at hotmail.com
            if (textField.inputEl.hasCls('ux-icon-combo-input')) {
                right -= 20; // Fix for IconCombo
            }
            // end Ing. Leonardo D'Onofrio
            return {
                right: right,
                top: top
            };
        },

        /**
         * Checks if the field we are attached to currently has a scrollbar
         */
        fieldHasScrollBar: function() {
            if (!this.isTextArea) {
                return false;
            }

            var inputEl = this.textField.inputEl;
            var overflowY = inputEl.getStyle('overflow-y');
            if (overflowY == 'hidden' || overflowY == 'visible') {
                return false;
            }
            if (overflowY == 'scroll') {
                return true;
            }
            //noinspection RedundantIfStatementJS
            if (inputEl.dom.scrollHeight <= inputEl.dom.clientHeight) {
                return false;
            }
            return true;
        },


        /**
         * Small wrapper around clearButtonEl.isVisible() to handle setVisible animation that may still be in progress.
         */
        isButtonCurrentlyVisible: function() {
            if (this.animateClearButton && this.animateWithCss3) {
                return this.clearButtonEl.hasCls(this.clearButtonCls + '-on');
            }

            // This should not be necessary (see Element.setVisible/isVisible), but else there is confusion about visibility
            // when moving the mouse out and _quickly_ over then input again.
            var cachedVisible = Ext.core.Element.data(this.clearButtonEl.dom, 'isVisible');
            if (typeof(cachedVisible) == 'boolean') {
                return cachedVisible;
            }
            return this.clearButtonEl.isVisible();
        },

        /**
         * Checks config options and current mouse status to determine if the clear button should be visible.
         */
        shouldButtonBeVisible: function() {
            if (this.hideClearButtonWhenEmpty && Ext.isEmpty(this.textField.getValue())) {
                return false;
            }

            var clearButtonEl = this.clearButtonEl;
            //noinspection RedundantIfStatementJS
            if (this.hideClearButtonWhenMouseOut
                && !clearButtonEl.hasCls(this.clearButtonCls + '-mouse-over-button')
                && !clearButtonEl.hasCls(this.clearButtonCls + '-mouse-over-input')) {
                return false;
            }

            return true;
        },

        /**
         * Called after any event that may influence the clear button visibility.
         */
        updateClearButtonVisibility: function() {
            var oldVisible = this.isButtonCurrentlyVisible();
            var newVisible = this.shouldButtonBeVisible();

            var clearButtonEl = this.clearButtonEl;
            if (oldVisible != newVisible) {
                if(this.animateClearButton && this.animateWithCss3) {
                    this.clearButtonEl.removeCls(this.clearButtonCls + (oldVisible ? '-on' : '-off'));
                    clearButtonEl.addCls(this.clearButtonCls + (newVisible ? '-on' : '-off'));
                }
                else {
                    clearButtonEl.stopAnimation();
                    clearButtonEl.setVisible(newVisible, this.animateClearButton);
                }

                // Set background-color of clearButton to same as field's background-color (for those browsers/cases
                // where the padding-right (see below) does not work)
                clearButtonEl.setStyle('background-color', this.textField.inputEl.getStyle('background-color'));
            }
        },

        isLeftButton: function(event) {
            return event.button === 0;
        }


        /**
         * getTriggerWidth
         *
         * Get the total width of the trigger button area.
         * This metod is deprecated on textField since ext 5.0, but is usefull
         *
         * @return {Number} The total trigger width
         */
        ,getTriggerWidth: function(textField) {
            var triggers = textField.getTriggers(),
                width = 0,
                id;
            if (triggers && textField.rendered) {
                for (id in triggers) {
                    if (triggers.hasOwnProperty(id)) {
                        width += triggers[id].el.getWidth();
                    }
                }
            }

            return width;
        }
    });

})();


/**
 * @class GridFilterBar.form.field.OperatorButton
 *
 * Plugin for text components that shows a "operator" button over the text field and shows a menu with operators.
 * For use in Ext.ux.grid.FilterBar plugin
 * 2012-07-30 by Ing. Leonardo D'Onofrio (leonardo_donofrio at hotmail.com)
*/
Ext.define('GridFilterBar.form.field.OperatorButton', {
	extend: 'Ext.AbstractPlugin',
	alias: 'plugin.operatorbutton',
	mixins: {
		observable: 'Ext.util.Observable'
	},

	autoHide: true,

	operatorButtonCls: Ext.baseCSSPrefix + 'operator-button',

	operator: 'eq',
	operators: ['eq', 'gte', 'lte', 'ne'],

    texteq: 'Is equal to',
    textne: 'Is not equal to',
    textgte: 'Great than or equal',
    textlte: 'Less than or equal',
    textgt: 'Great than',
    textlt: 'Less than',

	textField: undefined,
	operatorSet: {
		eq: {
			text: 'Is equal to',
			iconCls: Ext.baseCSSPrefix + 'operator-button-equal',
			value: 'eq'
		},
		ne: {
			text: 'Is not equal to',
			iconCls: Ext.baseCSSPrefix + 'operator-button-not-equal',
			value: 'ne'
		},
		gte: {
			text: 'Great than or equal',
			iconCls: Ext.baseCSSPrefix + 'operator-button-great-than-equal',
			value: 'gte'
		},
		lte: {
			text: 'Less than or equal',
			iconCls: Ext.baseCSSPrefix + 'operator-button-less-than-equal',
			value: 'lte'
		},
		gt: {
			text: 'Great than',
			iconCls: Ext.baseCSSPrefix + 'operator-button-great-than',
			value: 'gt'
		},
		lt: {
			text: 'Less than',
			iconCls: Ext.baseCSSPrefix + 'operator-button-less-than',
			value: 'lt'
		}
	},

	constructor: function(config) {
		var me = this, operatorSet;

		Ext.apply(me, config);

        operatorSet = me.operatorSet;
        for (var key in operatorSet) {
            operatorSet[key].text = me['text' + key];
        }

		me.mixins.observable.constructor.call(me);
		me.callParent(arguments);
	},

    init: function(textField) {
		var me = this,
			items = [];

		me.operator = (Ext.Array.contains(me.operators, me.operator) ? me.operator : me.operators[0]);
		me.task = Ext.create('Ext.util.DelayedTask');

		Ext.each(me.operators, function(op) {
			items.push(Ext.apply(Ext.clone(me.operatorSet[op]), {
				handler: me.onOperatorClick,
				scope: me
			}));
		});
		me.textField = textField;
		me.menu = Ext.create('Ext.menu.Menu', {
			items: items,
			listeners: {
				hide: me.onMenuHide,
				scope: me
			}
		});
		if (!textField.rendered) {
			textField.on('afterrender', me.onFieldRender, me, { single: true });
		} else {
			me.onFieldRender();
        }
        // MIGRATION  It's no longer needed to add events before firing.
		// me.addEvents('operatorchanged');
		// textField.addEvents('operatorchanged');
		textField.on({
			destroy: me.onFieldDestroy,
			focus: me.onFieldFocus,
			blur: me.onFieldBlur,
			resize: me.onFieldResize,
			scope: me
		});
	},

	onFieldRender: function(textField) {
		var me = this,
			bodyEl = me.textField.bodyEl,
			btn;

		btn = me.operatorButtonEl = me.textField.bodyEl.createChild({
			tag: 'div',
			cls: me.operatorButtonCls + ' ' + me.operatorSet[me.operator].iconCls,
			style: 'visibility: hidden;',
			'data-qtip': me.operatorSet[me.operator].text
		});

		// bodyEl.on('mouseover', me.onFieldMouseOver, me);
		// bodyEl.on('mouseout', me.onFieldMouseOut, me);
		// btn.on('mouseover', me.onButtonMouseOver, me);
		// btn.on('mouseout', me.onButtonMouseOut, me);
		btn.on('click', me.onButtonClick, me);

		me.repositionOperatorButton();
		me.updateOperatorButtonVisibility();
    },

	onFieldDestroy: function() {
		var me = this;

		me.operatorButtonEl.destroy();
		me.menu.destroy();
	},

	onFieldFocus: function() {
		var me = this;

		me.fieldInFocus = true;
		me.updateOperatorButtonVisibility();
	},

	onFieldBlur: function() {
		var me = this;

		me.fieldInFocus = false;
		me.updateOperatorButtonVisibility();
	},

	onFieldResize: function() {
		var me = this;

		me.repositionOperatorButton();
	},

	onFieldMouseOver: function(e) {
		var me = this;

		if (me.textField.triggerEl) {
			if (e.getRelatedTarget() == me.textField.triggerEl.elements[0].dom) {
				return;
			}
		}
		me.operatorButtonEl.addCls(me.operatorButtonCls + '-mouse-over-input');
		if (e.getRelatedTarget() == me.operatorButtonEl.dom) {
			// Moused moved to operator button and will generate another mouse event there.
			// Handle it here to avoid duplicate updates (else animation will break)
			me.operatorButtonEl.removeCls(me.operatorButtonCls + '-mouse-over-button');
			me.operatorButtonEl.removeCls(me.operatorButtonCls + '-mouse-down');
		}
		me.updateOperatorButtonVisibility();
	},

	onFieldMouseOut: function(e) {
		var me = this;

		if (me.textField.triggerEl) {
			if (e.getRelatedTarget() == me.textField.triggerEl.elements[0].dom) {
				return;
			}
		}
		me.operatorButtonEl.removeCls(me.operatorButtonCls + '-mouse-over-input');
		if (e.getRelatedTarget() == me.operatorButtonEl.dom) {
			// Moused moved from operator button and will generate another mouse event there.
			// Handle it here to avoid duplicate updates (else animation will break)
			me.operatorButtonEl.addCls(me.operatorButtonCls + '-mouse-over-button');
		}
		me.updateOperatorButtonVisibility();
	},

	onButtonMouseOver: function(e) {
		var me = this;

		e.stopEvent();
		if (me.textField.bodyEl.contains(e.getRelatedTarget())) {
			// has been handled in handleMouseOutOfInputField() to prevent double update
			return;
		}
		me.operatorButtonEl.addCls(me.operatorButtonCls + '-mouse-over-button');
		me.updateOperatorButtonVisibility();
	},

	onButtonMouseOut: function(e) {
		var me = this;

		e.stopEvent();
		if (me.textField.bodyEl.contains(e.getRelatedTarget())) {
			// will be handled in handleMouseOverInputField() to prevent double update
			return;
		}
		me.operatorButtonEl.removeCls(me.operatorButtonCls + '-mouse-over-button');
		me.operatorButtonEl.removeCls(me.operatorButtonCls + '-mouse-down');
		me.updateOperatorButtonVisibility();
	},

	onButtonClick: function(e) {
		var me = this;

		if (e.button !== 0) return;
		me.menu.showAt(e.getX(), e.getY(), false);
		e.stopEvent();
	},

	onOperatorClick: function(item) {
		var me = this,
			btn = me.operatorButtonEl,
			field = me.textField,
			lastOperator = me.operator;

		Ext.each(me.operators, function(op) {
			btn.removeCls(me.operatorSet[op].iconCls);
		});
		btn.addCls(item.iconCls);
		btn.set({
			'data-qtip': item.text
		});

		me.operator = item.value;
		field.operator = item.value;
		field.focus();
		if (lastOperator != me.operator) {
			me.textField.fireEvent('operatorchanged', me.textField, me.operator, lastOperator);
			me.fireEvent('operatorchanged', me.textField, me.operator, lastOperator);
		}
	},

	onMenuHide: function() {
		var me = this;

		me.updateOperatorButtonVisibility();
	},

	shouldButtonBeVisible: function() {
		var me = this;

		if (me.autoHide
			&& !me.menu.isVisible()
			&& !me.fieldInFocus
			&& !me.operatorButtonEl.hasCls(me.operatorButtonCls + '-mouse-over-button')
			&& !me.operatorButtonEl.hasCls(me.operatorButtonCls + '-mouse-over-input')) {
			return false;
		}
		return true;
	},

	updateOperatorButtonVisibility: function() {
		var me = this,
			btn = me.operatorButtonEl,
			oldVisible = btn.isVisible(),
			newVisible = me.shouldButtonBeVisible(),
			padding;

		if (!Ext.isWebKit) {
			padding = (newVisible ? 22 : 10);
		} else {
			padding = (newVisible || !me.webKitBugFlag ? 22 : 10);
			me.webKitBugFlag = true;
		}
		me.textField.inputEl.applyStyles({
			'padding-left': padding + 'px'
		});

		//if (oldVisible == newVisible) return;

		me.task.delay(200, function() {
			var oldVisible = btn.isVisible(),
				newVisible = me.shouldButtonBeVisible();

			if (oldVisible == newVisible) return;

			btn.stopAnimation();
			btn.setVisible(newVisible, {
				duration: 0
			});

			if (!Ext.isWebKit) {
				padding = (newVisible ? 22 : 10);
			} else {
				padding = (newVisible || !me.webKitBugFlag ? 22 : 10);
				me.webKitBugFlag = true;
			}
			me.textField.inputEl.applyStyles({
				'padding-left': padding + 'px'
			});
		});
	},

	repositionOperatorButton: function() {
		var me = this,
			btn = me.operatorButtonEl;

		if (!btn) return;
		btn.alignTo(this.textField.bodyEl, 'l-l', [2, 0]);
	}
});