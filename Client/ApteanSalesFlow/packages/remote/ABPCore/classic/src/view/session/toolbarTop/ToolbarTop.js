/**
 * Toolbar on top of session canvas
 *
 */
Ext.define('ABP.view.session.toolbarTop.ToolbarTop', {
    extend: 'Ext.container.Container',
    alias: 'widget.toolbartop',
    requires: ['ABP.view.session.toolbarTop.ToolbarTopController',
        'ABP.view.session.toolbarTop.ToolbarTopModel',
        'ABP.view.session.toolbarTop.ToolbarItem',
        // 'ABP.view.session.toolbarTop.ToolbarUser',
        'ABP.view.session.toolbarTop.search.SearchBar',
        'ABP.view.buttons.BadgeButton'],
    controller: 'toolbartopcontroller',
    viewModel: {
        type: 'toolbartopmodel'
    },
    ariaRole: 'menubar',
    currentFocus: -1,
    focusable: true,
    dock: 'top',
    bind: {
        height: '{toolbarHeight}'
    },
    ariaLabel: 'Toolbar',
    ui: 'abp-toolbar',
    // cls: 'toolbar-bg x-unselectable',
    layout: 'hbox',
    autoEl: 'header',

    items: [{
        xtype: 'container',
        align: 'left',
        layout: {
            type: 'hbox'
        },
        itemId: 'tool-buttons-left',
        docked: 'left',
        cls: 'left-cont',
        items: [{
            xtype: 'abpbutton',
            automationCls: 'toolbar-main-menu',
            uiCls: ['dark'],
            cls: 'tool-button-left abp-icon-button',
            ariaLabel: '{i18n.toolbar_toggleNavigation:ariaEncode}',
            scale: 'large',
            ariaAttributes: {
                'aria-owns': 'main-navigation-menu'
            },
            bind: {
                height: '{toolbarHeight}',
                ariaLabel: '{i18n.toolbar_toggleNavigation:ariaEncode}',
                ariaExpanded: '{menuOpen}',
                tooltip: '{i18n.toolbar_toggleNavigation:htmlEncode}'
            },
            iconCls: 'icon-menu',
            itemId: 'toolbar-button-menu',

            handler: 'toggleMenu'
        }, {
            xtype: 'component',
            itemId: 'toolbar-top-title',
            width: 205,
            bind: {
                html: '{mainMenuTopLabel}',
                cls: '{toolbarBrandingCls}',
                height: '{toolbarHeight}',
                hidden: '{!toolbarTitleBrandNameShow || toolbarTitleBrandImageShow}' // If image showing or branding hidden then don't show brand name.
            },
            cls: 'toolbar-top-title',
            setCls: function (nClass) {
                this.addCls(nClass);
            }
        }, {
            xtype: 'container',
            cls: 'toolbar-title-image-container',
            overCls: 'mouse-over',
            layout: 'fit',
            width: 205,
            bind: {
                height: '{toolbarHeight}',
                hidden: '{!toolbarTitleBrandImageShow}'   // If image hidden or branding hidden then hide this container.
            },
            listeners: {
                beforerender: 'toolbarTitleImageContainerBeforeRender',
                el: {
                    click: 'toolbarTitleImageClick'
                }
            }
        }]
    },
    {
        xtype: 'container',
        itemId: 'toolbarTitleContainer',
        flex: 1,
        ariaRole: 'banner',
        ariaAttributes: {
            // 'aria-level': '1',
            'aria-labelledby': 'toolbarTitle'
        },
        items: [
            {
                xtype: 'component',
                autoEl: 'h1',
                itemId: 'toolbarTitle',
                id: 'toolbarTitle',
                cls: 'toolbar-title',
                // ariaRole: 'header',
                // ariaAttributes: {
                //     'aria-level': '1'
                // },
                bind: {
                    html: '{toolbarTitle}',
                    height: '{toolbarHeight}'
                }
            }
        ]
    },
    {
        xtype: 'container',
        align: 'right',
        layout: {
            type: 'hbox',
            align: 'end',
            pack: 'end'
        },
        itemId: 'tool-buttons-right',
        docked: 'right',
        cls: 'right-cont',
        //ariaRole: 'toolbar',
        items: [],
        bind: {
            height: '{toolbarHeight}'
        },
        addButton: function (buttonToAdd) {
            var me = this;
            me.insert(0, buttonToAdd);
        }
    },
    {
        // Container for the tab panel buttons.
        xtype: 'segmentedbutton',
        itemId: 'rightpaneButtons',
        bind: {
            height: '{toolbarHeight}'
        },
        defaults: {
            userCls: 'button-dark-contrast'
        },
        allowMultiple: false,
        allowDepress: true,
        items: []
    }],

    listeners: {
        resize: 'onResizeToolbar',
        afterlayout: 'onAfterLayout'
    }
});
