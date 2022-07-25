Ext.define('ApteanSalesFlowPackage.view.Dashboard.Dashboard', {
    extend: 'Ext.Panel',
    xtype: 'dashboard',

    renderTo: Ext.getBody(),
    requires: [
        'ApteanSalesFlowPackage.store.SODashboard',
        'ApteanSalesFlowPackage.store.DashboardPie',
        'ApteanSalesFlowPackage.store.SODashboardPie',
        'ApteanSalesFlowPackage.store.ShipmentDashboardPie',
        'ApteanSalesFlowPackage.store.QuoteDashboardPie',
        'ApteanSalesFlowPackage.store.CustomerDashboardPie'
    ],

    autoShow: true,
    viewModel: {
        stores: {
            SalesOrderStore: {
                type: 'sodashboard'
            },
            DashBoardStore: {
                type: 'dashboardpie'
            },
            DashBoardStore1: {
                type: 'sodashboardpie'
            },
            DashBoardStore2: {
                type: 'shipmentdashboardpie'
            },
            DashBoardStore3: {
                type: 'quotedashboardpie'
            },
            DashBoardStore4: {
                type: 'customerdashboardpie'
            }
        }
    },
    layout: 'fit',

    margin: 0,
    items: [
        {

            xtype: 'fieldcontainer',
            layout: {
                type: 'vbox',
                //align: 'stretch'
            },
            width:'100%',
            items: [
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    width:'100%',
                    height:'60%',
                    title: 'Total Approved VS Started',
                    items: [
                        {
                            width:'40%',
                            height:'100%',
                            xtype: 'polar',
                            renderTo: Ext.getBody(),
                            legend: {
                                docked: 'bottom'
                            },
                            bind: {
                                store: "{DashBoardStore}"
                            },

                            interactions: ['rotate', 'itemhighlight'],
                            shadow: true,
                            animate: true,
                            series: {
                                type: 'pie',
                                highlight: true,
                                angleField: 'value',

                                tooltip: {
                                    trackMouse: true,
                                    renderer: function (tooltip, storeItem, item) {
                                        tooltip.setHtml(storeItem.data.name + ":" + storeItem.data.value);
                                    }
                                },
                                label: {
                                    field: 'name',
                                    display: 'rotate'
                                },
                                donut: 30
                            }
                        }, {
                            xtype: 'fieldcontainer',
                            width:'50%',
                            height:'100%',
                            layout: 'vbox',
                            items: [{
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                width:'100%',
                                height:'50%',
                                items: [{
                                    width:'50%',
                                    xtype: 'polar',
                                    renderTo: Ext.getBody(),
                                    bind: {
                                        store: "{DashBoardStore1}"
                                    },
                                    interactions: ['rotate', 'itemhighlight'],
                                    shadow: true,
                                    animate: true,
                                    height:'100%',
                                    //padding: 30,
                                    colors: ['red', 'green'],
                                    series: {
                                        type: 'pie',
                                        highlight: true,
                                        angleField: 'value',

                                        tooltip: {
                                            trackMouse: true,
                                            renderer: function (tooltip, storeItem, item) {
                                                tooltip.setHtml(storeItem.data.name + ":" + storeItem.data.value);
                                            }
                                        },
                                        legends: true,
                                        label: {
                                            field: 'name',
                                            display: 'rotate'
                                        },
                                        donut: 30
                                    }
                                }, {
                                    width:'50%',
                                    xtype: 'polar',
                                    renderTo: Ext.getBody(),
                                    bind: {
                                        store: "{DashBoardStore2}"
                                    },

                                    interactions: ['rotate', 'itemhighlight'],
                                    shadow: true,
                                    animate: true,
                                    height: '100%',
                                    //padding: 30,
                                    series: {
                                        type: 'pie',
                                        highlight: true,
                                        angleField: 'value',
                                        showInLegend: true,
                                        tooltip: {
                                            trackMouse: true,
                                            renderer: function (tooltip, storeItem, item) {
                                                tooltip.setHtml(storeItem.data.name + ":" + storeItem.data.value);
                                            }
                                        },
                                        label: {
                                            field: 'name',
                                            display: 'rotate'
                                        },
                                        donut: 30
                                    }
                                }]
                            },
                            {
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                width:'100%',
                                height: '50%',
                                items: [
                                    {
                                        width:'50%',
                                        xtype: 'polar',
                                        renderTo: Ext.getBody(),
                                        height: '100%',
                                        //padding: 30,

                                        bind: {
                                            store: "{DashBoardStore3}"
                                        },

                                        interactions: ['rotate', 'itemhighlight'],
                                        shadow: true,
                                        animate: true,
                                        colors: ['yellow', 'green'],
                                        series: {
                                            type: 'pie',
                                            highlight: true,
                                            angleField: 'value',
                                            showInLegend: true,
                                            tooltip: {
                                                trackMouse: true,
                                                renderer: function (tooltip, storeItem, item) {
                                                    tooltip.setHtml(storeItem.data.name + ":" + storeItem.data.value);
                                                }
                                            },
                                            label: {
                                                field: 'name',
                                                display: 'rotate'
                                            },
                                            donut: 30
                                        }
                                    },
                                    {
                                        width:'50%',
                                        xtype: 'polar',
                                        renderTo: Ext.getBody(),
                                        height: '100%',
                                        //padding: 30,

                                        bind: {
                                            store: "{DashBoardStore4}"
                                        },

                                        interactions: ['rotate', 'itemhighlight'],
                                        shadow: true,
                                        animate: true,
                                        colors: ['yellow', 'green'],
                                        series: {
                                            type: 'pie',
                                            highlight: true,
                                            angleField: 'value',
                                            showInLegend: true,
                                            tooltip: {
                                                trackMouse: true,
                                                renderer: function (tooltip, storeItem, item) {
                                                    tooltip.setHtml(storeItem.data.name + ":" + storeItem.data.value);
                                                }
                                            },
                                            label: {
                                                field: 'name',
                                                display: 'rotate'
                                            },
                                            donut: 30
                                        }
                                    }]
                            }]
                        }]
                },
                {
                    xtype: 'cartesian',
                    renderTo: Ext.getBody(),
                    width: '100%',
                    height: '40%',
                    padding: '15 10 5 0',
                    bind: {
                        store: "{SalesOrderStore}"
                    },
                    title: "Last 10 Orders Placed",
                    axes: [{
                        type: 'numeric3d',
                        position: 'left',
                        title: 'Cost Of Order',
                        fields: ['total_Value']
                    }, {
                        type: 'category',
                        position: 'bottom',
                        title: 'Sales Order ID',
                        fields: ['sO_Number'],

                    }

                    ],

                    series: {
                        type: 'area',
                        highlight: true,

                        subStyle: {
                            fill: ['#388FAD'],
                            stroke: '#1F6D91'
                        },
                        xField: 'sO_Number',
                        yField: 'total_Value',
                        tooltip: {
                            trackMouse: true,
                            renderer: function (tooltip, storeItem, item) {

                                tooltip.setHtml(storeItem.data.total_Value);
                            }
                        },
                        label: {
                            field: 'Last 10 Orders',
                            display: 'insideEnd'

                        }

                    }

                },


            ]
        }

    ]

});

