Ext.define('ABP.view.base.automation.AutomationHintOverlay', {
    extend: 'Ext.panel.Panel',
    singleton: true,
    alias: 'widget.automationoverlay',
    layout: {
        type: 'absolute'
    },
    floating: true,
    centered: true,
    //    modal: true,
    items: [],

    cls: 'automation-overlay',

    overlayTip: undefined,

    toggle: function () {
        if (this.isVisible()) {
            this.hideOverlay();
        } else {
            this.showOverlay();
        }
    },

    showOverlay: function () {
        var me = this;
        var re = ABP.util.Constants.AUTOMATION_CLASS_REGEX;
        var matches;
        var regions = [];
        var i;

        if (!this.overlayTip) {
            overlayTip = Ext.create('Ext.tip.ToolTip', {
                target: this.getEl(),
                delegate: 'div[autolabel]',
                trackMouse: true,
                renderTo: Ext.getBody(),
                listeners: {
                    beforeshow: function updateTipBody(tip) {
                        tip.update(tip.triggerElement.getAttribute('autolabel'));
                    }
                }
            });
        }

        function walk(el, func) {
            func(el);
            el = el.firstChild;
            while (el) {
                walk(el, func);
                el = el.nextSibling;
            }
        }

        function getElPos(el) {
            var left = 0, top = 0;
            while (el) {
                left += (el.offsetLeft - el.scrollLeft + el.clientLeft);
                top += (el.offsetTop - el.scrollTop + el.clientTop);
                el = el.offsetParent;
            }
            return { left: left, top: top };
        }

        function createRegion(el, label) {
            var elPos = getElPos(el);
            return {
                xtype: 'component',
                cls: 'automation-hint',
                x: elPos.left,
                y: elPos.top,
                width: el.offsetWidth,
                height: el.offsetHeight,
                html: label,
                autoEl: {
                    tag: 'div',
                    autolabel: label
                },
                listeners: {
                    el: {
                        mouseover: me.highlightElement,
                        mouseleave: me.removeElementHighlight
                    }
                }
            };
        }

        walk(Ext.getBody().dom, function (el) {
            if (el.nodeType === 1) {
                if (el.offsetWidth > 0) {
                    matches = el.className.match(re);
                    if (matches !== null) {
                        regions.push(createRegion(el, matches
                            .filter(function (val, index, array) { return Ext.isString(val) && array.indexOf(val) === index; })
                            .reduce(function (acc, curVal, _index, array) { if (array.length > 1) { return acc + ' ' + curVal; } else { return curVal; } }))); // filtering and concatening so that we can display ALL automation classes.
                    }
                    if (el.hasAttribute('automationId')) {
                        regions.push(createRegion(el, 'automationId: ' + el.getAttribute('automationId')));
                    }
                }
            }
        });

        me.removeAll();
        me.setSize(Ext.getBody().getViewSize());
        me.add(regions);
        me.center();
        me.show();
    },

    hideOverlay: function () {
        this.hide();
    },

    highlightElement: function () {
        var cmp = Ext.getCmp(this.id);
        cmp.addCls('automation-hint-over');
    },

    removeElementHighlight: function () {
        var cmp = Ext.getCmp(this.id);
        cmp.removeCls('automation-hint-over');
    }
});