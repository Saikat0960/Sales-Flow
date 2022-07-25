Ext.define('ABP.view.session.mainMenu.ABPTreeListItem', {
    extend: 'Ext.list.TreeItem',
    requires: [
        'Ext.list.TreeItem',
        'ABP.util.Common'
    ],
    alias: 'widget.abptreelistitem',
    config: {
        /**
         * @cfg {Number} itemCount
         * The optional number to display next to the menu text
         */
        itemCount: undefined,

        /**
         * @cfg {String} itemPriority
         * The optional priority for the number to display in the menu item
         *
         * ABP.util.Constants.badgePriority.Info = normal menu background
         * ABP.util.Constants.badgePriority.Success = theme color
         * ABP.util.Constants.badgePriority.Warning = orange
         * ABP.util.Constants.badgePriority.Alert = red
         */
        itemPriority: undefined,

        /**
        * @cfg {Boolean} showManageTool
        * Whether to show the manage tool cog for the menu item
        */
        showManageTool: false,

        /**
          * @cfg {Boolean} manageEvent
          * The event to fire when the manage tool it clicked
          */
        manageEvent: undefined
    },
    hideMode: 'offsets',
    focusable: true,
    tabIndex: -1,
    // Override the tree item element configuration to include an 'a' tag wrap element.
    element: {
        reference: 'element',
        tag: 'li',
        cls: Ext.baseCSSPrefix + 'treelist-item',
        // uiCls: 'dark',

        children: [{
            reference: 'rowElement',
            cls: Ext.baseCSSPrefix + 'treelist-row',

            children: [{
                // Use an 'a' tag. If the tree list item has an item link, the attribute will be set upon construction.
                tag: 'a',
                tabIndex: -1,
                role: "presentation",
                reference: 'wrapElement',
                cls: Ext.baseCSSPrefix + 'treelist-item-wrap',
                'aria-live': 'polite',
                'aria-atomic': true,
                'aria-relevant': 'additions',
                children: [{
                    reference: 'iconElement',
                    cls: Ext.baseCSSPrefix + 'treelist-item-icon'
                },
                // {
                //     reference: 'textElementWrapper',
                //     'aria-live' : 'polite',
                //     'aria-atomic' : true,
                //     'aria-relevant' : 'additions'
                // },
                {
                    reference: 'textElement',
                    'aria-hidden': true,
                    cls: Ext.baseCSSPrefix + 'treelist-item-text'
                },
                {
                    reference: 'shorthandElement',
                    cls: Ext.baseCSSPrefix + 'treelist-item-shorthand'
                },
                {
                    tag: 'a',
                    tabIndex: -1,
                    target: "_blank",
                    reference: 'peelOffElement',
                    title: 'Open in new Tab',
                    cls: Ext.baseCSSPrefix + 'treelist-item-tool treelist-tool-peel-off icon-windows'
                },
                {
                    tag: 'a',
                    tabIndex: -1,
                    target: "_blank",
                    reference: 'manageToolElement',
                    cls: Ext.baseCSSPrefix + 'treelist-item-tool treelist-tool-manage icon-gearwheel'
                },
                {
                    reference: 'expanderElement',
                    cls: Ext.baseCSSPrefix + 'treelist-item-expander'
                }]
            }]
        }, {
            reference: 'itemContainer',
            tag: 'ul',
            cls: Ext.baseCSSPrefix + 'treelist-container'
        }, {
            reference: 'toolElement',
            cls: Ext.baseCSSPrefix + 'treelist-item-tool'
        }]
    },

    constructor: function (config) {
        config = config || {};
        var me = this,
            node = config.node;

        // Add the context menu plugin.
        if (node && node.get('contextMenu')) {
            config.contextMenu = true;
            var pluginType = 'abpcontextmenu';
            config.plugins = config.plugins || {};
            if (Ext.isObject(config.plugins) && !config.plugins[pluginType]) {
                config.plugins[pluginType] = pluginType;
            } else if (Ext.isArray(config.plugins) && !config.plugins.indexOf(pluginType) > -1) {
                config.plugins.push(pluginType);
            }
        }
        me.callParent([config]);

        me.initToolTip(config);
        node = me.getNode();

        var peelOffElement = me.peelOffElement,
            wrapElement = me.wrapElement,
            itemHref = node.get("itemHref"),
            enableMenuPeelOff = ABP.util.Config.getSessionConfig().settings.enableMenuPeelOff,// System config.
            cls = node.get("cls"),
            itemCount = node.get("itemCount"),
            itemPriority = node.get("itemPriority"),
            hidden = node.get("hidden"),
            showManageTool = node.get('showManageTool'),
            shorthand = node.get('shorthand'),
            levelString = ABP.util.Common.geti18nString('aria_tree_level'),
            ariaText = ABP.util.Aria.encodeAttribute(Ext.String.htmlDecode(node.get('text'))),
            isSingleCollapse = ABP.util.Config.getSessionConfig().settings.mainMenuSingleExpand;

        if (node && node.parentNode && node.parentNode.id === "container_nav-recent" && !node.get('children')) {
            me.isToggleEvent = function () { return false; };
        }

        me.element.set({
            'aria-label': ariaText + levelString + node.get('depth')
        });

        if (node.childNodes && node.childNodes.length > 0) {
            me.element.set({
                'aria-expanded': node.get('expanded')
            });
        }

        if (peelOffElement) {
            peelOffElement.hide();

            if (!Ext.isEmpty(itemHref) && wrapElement) {
                wrapElement.set({
                    href: itemHref
                });
                me.element.set({
                    'aria-label': ariaText + levelString + node.get('depth') + ' alt + enter to open in new tab'
                });
                // Only add the peel off has-link class, if we want to show the peel off.
                if (enableMenuPeelOff) {
                    peelOffElement.addCls("has-link");
                    peelOffElement.set({
                        href: itemHref
                    });
                    peelOffElement.show();
                    peelOffElement.on({
                        click: function (e) {
                            e.stopPropagation();
                        }
                    });
                }
            }
        }

        if (!showManageTool) {
            me.manageToolElement.hide();
        }
        else {
            me.manageToolElement.show();
            me.manageToolElement.on({
                click: 'onManageToolClick'
            })
        }

        if (shorthand) {
            me.shorthandElement.setHtml(shorthand);
        }

        me.element.addCls(cls);
        me.setItemCount(itemCount);
        me.setItemPriority(itemPriority);
        if (hidden) {
            me.setHidden(hidden);
        }
        if (isSingleCollapse) {
            node.on('collapse', me.onNodeCollapse);
        }

        return me;
    },

    onNodeCollapse: function (me) {
        var parent = !Ext.isEmpty(me.childNodes);
        if (parent) {
            me.cascade({
                after: function (node) {
                    node.collapse();
                }
            });
        }
    },

    onNodeExpand: function (me) {

    },
    updateText: function (text) {
        this.renderNodeText(text, this.getItemCount(), this.getItemPriority());
    },

    updateItemCount: function (count) {
        this.renderNodeText(this.getText(), count, this.getItemPriority());
    },

    updateItemPriority: function (priority) {
        this.renderNodeText(this.getText(), this.getItemCount(), priority);
    },

    /**
    * Handle this node having fields changed.
    *
    * @param {Ext.data.TreeModel} node The node.
    * @param {String[]} modifiedFieldNames The modified field names, if known.
    *
    * @protected
    */
    nodeUpdate: function (node, modifiedFieldNames) {
        this.onNodeUpdate(node, modifiedFieldNames);
    },

    /**
     * Overriding treelistitem expand
     *
     * Base function does not check for node.
     * If a suggested treeItem is clicked, it's node will likely be removed before we get here.
     * The check ensures no 'Cannot read property 'expand' of null' Error
     * also needs to be captured to set the aria expanded property
     */
    expand: function () {
        var node = this.getNode();
        if (node) {
            node.expand();
            this.element.set({
                'aria-expanded': node.get('expanded')
            });
        }
    },
    /**
     * Overriding treelistitem collapse
     *
     * need to capture this to set the aria expanded property
     */
    collapse: function () {
        var node = this.getNode();
        if (node) {
            node.collapse();
            this.element.set({
                'aria-expanded': node.get('expanded')
            });
        }
    },

    privates: {
        onNodeUpdate: function (node, modifiedFieldNames) {
            var me = this;
            me.setItemCount(node.data['itemCount']);
            me.setItemPriority(node.data['itemPriority']);
            me.setHidden(node.data['hidden']);
            me.setText(node.data['text']);
        },

        renderNodeText: function (text, count, priority) {
            var css = null,
                node = this.getNode(),
                countString = ABP.util.Common.geti18nString('aria_badge_count'),
                updatedString = ABP.util.Common.geti18nString('aria_badge_updated_count'),
                levelString = ABP.util.Common.geti18nString('aria_tree_level'),
                ariaText = ABP.util.Aria.encodeAttribute(Ext.String.htmlDecode(node.get('text')));

            if (priority === ABP.util.Constants.badgePriority.Info) {
                css = 'priority-normal';
            }
            else if (priority === ABP.util.Constants.badgePriority.Success) {
                css = 'priority-low';
            }
            else if (priority === ABP.util.Constants.badgePriority.Warning) {
                css = 'priority-medium';
            }
            else if (priority === ABP.util.Constants.badgePriority.Alert) {
                css = 'priority-high';
            }

            if (count) {
                this.element.set({
                    'aria-label': ariaText + countString + count + levelString + node.get('depth')
                });
                this.wrapElement.set({
                    'aria-label': ariaText + updatedString + count
                });

                if (css) {
                    this.textElement.update(text + "<span class='nav-item-count " + css + "' aria-label='" + count + "'>" + count + "</span>");
                }
                else {
                    this.textElement.update(text + "<span class='nav-item-count' style='background-color: " + priority + "' aria-hidden=true>" + count + "</span>");
                }
            } else {
                this.textElement.update(text);
            }
        },

        initToolTip: function (config) {
            var me = this;
            var ttString = me.getTooltipText(config);
            var lString = me.getLabelText(config);

            var tipHtml = Ext.htmlEncode(!Ext.isEmpty(ttString) ? ttString : (lString || ''));
            if (config.shorthand) {
                tipHtml += '<span class="shorthand">' + Ext.htmlEncode(config.shorthand); // TODO: Is this supposed to have its <span> unended?
            }

            // A tooltip object is created because Ext.list.TreeItem does not support them natively.
            var tipConfig = {
                target: me.rowElement,
                html: tipHtml,
                anchor: 'top',
                showDelay: 1000,
                anchorToTarget: false,
                listeners: !Ext.isEmpty(ttString) ? undefined : {
                    beforeshow: me.tooltipBeforeShow
                }
            };
            if (Ext.toolkit === 'modern') {
                Ext.applyIf(tipConfig, {
                    align: 'b', // Modern only 
                });
            } else { // Classic
                Ext.applyIf(tipConfig, {
                    cls: 'main-menu', // Do not use this class for modern because it causes the tooltip to be huge.
                });
            }

            me.tooltip = Ext.create('Ext.tip.ToolTip', tipConfig);
        },

        getLabelText: function (config) {
            var lString = '',
                keyString,
                data = config.node.data,
                text = data.text,
                label = data.label,
                labelKey = data.labelKey;

            if (label && label.length) {
                lString = label;
            } else if (text && text.length) {
                lString = text;
            }
            if (labelKey && labelKey.length) {
                keyString = ABP.util.Common.geti18nString(labelKey);
                if (keyString !== labelKey) {
                    lString = keyString;
                }
            }

            return lString;
        },

        getTooltipText: function (config) {
            var ttString = '',
                keyString,
                data = config.node.data,
                tooltip = data.tooltip,
                tooltipKey = data.tooltipKey;

            if (tooltip && tooltip.length) {
                ttString = tooltip;
            }
            if (tooltipKey && tooltipKey.length) {
                keyString = ABP.util.Common.geti18nString(tooltipKey);
                if (keyString !== tooltipKey) {
                    ttString = keyString;
                }
            }

            return ttString;
        },

        tooltipBeforeShow: function (scope, eOpts) {
            var el = this.target || this.targetElement, // Classic:target, Modern:targetElement.
                textEl = el.down('.x-treelist-item-text'),
                textDom = textEl ? textEl.dom : null;

            if (textDom) {
                return (textDom.offsetWidth < textDom.scrollWidth);
            }
        }
    }
});
