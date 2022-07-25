Ext.define('ABP.view.base.automation.AutomationHintOverlay', {
    extend: 'Ext.Container',
    singleton: true,
    tooltip: null,
    alias: 'widget.automationoverlay',
    positioned: true,
    centered: true,
    floated: true,
    fullscreen: true,
    hidden: true,
    items: [],
    style: 'background: rgba(255,255,255,0.2); z-index: 9;',
    cls: 'automation-over-top',
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
        var size = Ext.getBody().getViewSize();

        if (!this.overlayTip) {
            var config = {
                target: me.el,
                delegate: 'div[autolabel]',
                trackMouse: true,
                listeners: {
                    beforeshow: function updateTipBody(tip) {
                        tip.update(tip.triggerElement.getAttribute('autolabel'));
                    }
                }
            };
            me.overlayTip = Ext.create('Ext.tip.ToolTip', config);
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
            var left = 0,
                top = 0;
            var xyz = [];
            while (el) {
                left += (el.offsetLeft - el.scrollLeft + el.clientLeft);
                top += (el.offsetTop - el.scrollTop + el.clientTop);
                if (el.style.transform.indexOf('translate3d') > -1) {
                    xyz = el.style.transform.match(/[+-]?[0-9]+.?([0-9]+)?(?=px)/g); // Find values followed by 'px'
                    left += parseInt(xyz[0]);
                    top += parseInt(xyz[1]);
                }
                el = el.offsetParent;
            }
            return {
                left: left,
                top: top
            };
        }

        function createRegion(el, label) {
            var elPos = getElPos(el);
            return {
                xtype: 'component',
                cls: 'automation-hint',
                left: elPos.left,
                top: elPos.top,
                width: el.offsetWidth,
                height: el.offsetHeight,
                html: label,
                tooltip: label,
                tooltip: {
                    html: label,
                    trackMouse: true
                },
                autoEl: {
                    tag: 'div',
                    autolabel: label
                },
                listeners: {
                    mouseover: {
                        element: 'element',
                        fn: me.highlightElement
                    },
                    mouseleave: {
                        element: 'element',
                        fn: me.removeElementHighlight
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
                            .filter(function (val, index, array) {
                                return Ext.isString(val) && array.indexOf(val) === index;
                            })
                            .reduce(function (acc, curVal, _index, array) {
                                if (array.length > 1) {
                                    return acc + ' ' + curVal;
                                } else {
                                    return curVal;
                                }
                            }))); // filtering and concatening so that we can display ALL automation classes.
                    }
                    if (el.hasAttribute('automationId')) {
                        regions.push(createRegion(el, 'automationId: ' + el.getAttribute('automationId')));
                    }
                }
            }
        });
        me.removeAll();
        me.setSize(size.width, size.height);
        me.add(regions);
        me.show();
    },

    hideOverlay: function () {
        var me = this;
        me.removeAll(true, true);
        me.hide();
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