Ext.define('ApteanSalesFlowPackage.view.Dashboard.Dashboard', {
    extend: 'Ext.Panel',
    xtype: 'dashboard',

    renderTo: Ext.getBody(),
    requires: [
        'ApteanSalesFlowPackage.store.SODashboard',
        'ApteanSalesFlowPackage.store.DashboardPie'
    ],
    controller: 'dashboard',
    autoShow: true,
    viewModel: {
        data: {
            completedata: {}
        },
        stores: {
            SalesOrderStore: {
                type: 'sodashboard'
            },
            DashBoardStore: {
                type: 'dashboardpie'
            }
        }
    },
    layout: 'fit',
    items: [
        {
            xtype: 'fieldcontainer',
            layout: {
                type: 'vbox'
            },
            width: '100%',
            style: 'background-color: #f2f2f2;',
            items: [
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    width: '100%',
                    height: '50%',
                    title: 'Total Approved VS Started',
                    items: [
                        {
                            width: '40%',
                            height: '100%',
                            padding: 10,
                            xtype: 'polar',
                            renderTo: Ext.getBody(),
                            legend: {
                                docked: 'bottom'
                            },
                            bind: {
                                store: "{DashBoardStore}"
                            },

                            interactions: ['rotate', 'itemhighlight'],
                            colors: ['#003f5c', '#7a5195', '#ef5675', '#ffa600'],
                            shadow: true,
                            animate: true,
                            series: {
                                type: 'pie',
                                highlight: true,
                                angleField: 'value',

                                tooltip: {
                                    trackMouse: true,
                                    renderer: 'onPieRender'
                                },
                                label: {
                                    field: 'name',
                                    display: 'rotate',
                                },
                                donut: 30
                            }
                        }, {
                            xtype: 'fieldcontainer',
                            width: '50%',
                            height: '100%',
                            layout: 'vbox',
                            items: [{
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                width: '100%',
                                height: '50%',
                                items: [{
                                    width: '50%',
                                    height: '100%',
                                    margin: 5,
                                    padding: '15 0 0 0',
                                    xtype: 'container',
                                    layout: 'center',
                                    style: 'background-color: #003f5c;',
                                    items: [{
                                        xtype: 'component',
                                        style: 'background-color: #003f5c; color: white;',
                                        bind: {
                                            html: [
                                                '<div style = "font-size:50px; text-align:center;" >{completedata.approvedSO}/{completedata.totalSO}</div></br><p>Sales Order approved</p>'
                                            ]
                                        }
                                    }],
                                    listeners:{
                                        element  : 'el',
                                        click: 'onSalesOrderClick'
                                    }
                                },
                                {
                                    width: '50%',
                                    height: '100%',
                                    margin: 5,
                                    padding: '15 0 0 0',
                                    xtype: 'container',
                                    layout: 'center',
                                    style: 'background-color: #ef5675;',
                                    items: [{
                                        xtype: 'component',
                                        style: 'background-color: #ef5675; color: white;',
                                        bind: {
                                            html: [
                                                '<div style = "font-size:50px; text-align:center;" >{completedata.approvedShipment}/{completedata.totalShipment}</div></br><p>Shipment approved</p>'
                                            ]
                                        }
                                    }],
                                    listeners:{
                                        element  : 'el',
                                        click: 'onShipmentClick'
                                    }
                                }]
                            },
                            {
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                width: '100%',
                                height: '50%',
                                items: [
                                    {
                                        width: '50%',
                                        height: '100%',
                                        margin: 5,
                                        padding: '15 0 0 0',
                                        xtype: 'container',
                                        layout: 'center',
                                        style: 'background-color: #ffa600;',
                                        items: [{
                                            xtype: 'component',
                                            style: 'background-color: #ffa600; color: white;',
                                            bind: {
                                                html: [
                                                    '<div style = "font-size:50px; text-align:center;" >{completedata.approvedQuote}/{completedata.totalQuote}</div></br><p>Quote approved</p>'
                                                ]
                                            }
                                        }],
                                        listeners:{
                                            element  : 'el',
                                            click: 'onQuoteClick'
                                        }
                                    },
                                    {
                                        width: '50%',
                                        height: '100%',
                                        margin: 5,
                                        padding: '15 0 0 0',
                                        xtype: 'container',
                                        layout: 'center',
                                        style: 'background-color: #7a5195;',
                                        items: [{
                                            xtype: 'component',
                                            style: 'background-color: #7a5195; color: white;',
                                            bind: {
                                                html: [
                                                    '<div style = "font-size:50px; text-align:center;" >{completedata.confirmed}/{completedata.prospect}</div></br><p>Prospect confirmed</p>'
                                                ]
                                            }
                                        }],
                                        listeners:{
                                            element  : 'el',
                                            click: 'onProspectClick'
                                        }
                                    }]
                            }]
                        }]
                },
                {
                    width: '90%',
                    height: '5%',
                    margin: '0 30 0 10',
                    xtype: 'container',
                    layout: 'center',
                    style: 'background-color: white;',
                    items: [{
                        xtype: 'component',
                        style: 'color: black; font-size: 18px;',
                        html: 'Last 10 Sales Orders'
                    }]
                },
                {
                    xtype: 'cartesian',
                    renderTo: Ext.getBody(),
                    width: '90%',
                    height: '47%',
                    margin: '0 30 40 10',
                    //style: 'border: 1px solid black;',
                    bind: {
                        store: "{SalesOrderStore}"
                    },
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
                        type: 'bar',
                        highlight: true,

                        subStyle: {
                            fill: ['#388FAD'],
                            stroke: '#1F6D91'
                        },
                        xField: 'sO_Number',
                        yField: 'total_Value',
                        tooltip: {
                            trackMouse: true,
                            renderer: 'onGraphRender'
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

