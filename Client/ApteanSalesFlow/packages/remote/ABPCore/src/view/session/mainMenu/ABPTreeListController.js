Ext.define('ABP.view.session.mainMenu.ABPTreeListController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.abptreelistcontroller',

    listen: {
        component: {
            treelistmenu: {
                itemclick: 'onItemClick'
            }
        }
    },

    onItemClick: function (treeList, options) {
        var me = this,
            node = options.node,
            nodeData = node ? node.getData() : null;
        if (nodeData) {
            if (nodeData.type === 'event' && nodeData.event) {
                me.fireEvent('main_fireAppEvent', nodeData.appId, nodeData.event, nodeData.eventArgs, nodeData.activateApp);
            } else if (nodeData.type === 'route' && nodeData.hash) {
                me.redirectTo(nodeData.hash);
            }
            // Close the menu unless this is a group node, where we want to allow expand/collapse.
            // If the TreeStore has lazyFill:true then the node iterface may not know the node has children yet. 
            // So need to look at the child data too.
            if (!node.hasChildNodes() && !node.getData().children) {
                if (ABP.util.Common.getClassic() && ABP.util.Config.getSessionConfig().settings.autoHideMenu
                    || ABP.util.Common.getModern()) {
                    me.fireEvent('session_closeMenu');
                }
            }
        }
        me.fireEvent('main_activeAppFocus');
    },

    onManageToolClick: function (e, cmp) {
        e.stopPropagation();
        var item = this.getView().getOverItem();
        if (item._node.get('manageEvent')) {
            this.fireEvent(item._node.get('appId') + '_showSettings', item._node.get('manageEvent'));
        }
    },
    // Begin Keymap handlers 
    navigateDownPress: function (event, treelistmenu) {
        var next = this.findNextMenuOption();
        if (next) {
            next.focus();
        }
    },
    navigateUpPress: function (event, treelistmenu) {
        var prev = this.findPreviousMenuOption();
        if (prev) {
            prev.focus();
        }
    },
    navigateLeftPress: function (event, treelistmenu) {
        var cmp = Ext.getCmp(event.target.id);
        if (cmp && cmp.collapse) {
            cmp.collapse();
        }
    },
    navigateRightPress: function (event, treelistmenu) {
        var cmp = Ext.getCmp(event.target.id);
        if (cmp && cmp.expand) {
            cmp.expand();
        }
    },
    navigateSelect: function (event, treelistmenu) {
        if (ABP.util.Common.getClassic()) {
            var activeEl = document.activeElement;
            activeEl.click();
        } else {
            var cmp = Ext.getCmp(event.target.id);
            cmp.onClick(event);
        }
    },
    navigateSelectSpecial: function (event, treelistmenu) {
        var activeEl = document.activeElement;
        var cmp = Ext.getCmp(activeEl.id);
        if (cmp && cmp.peelOffElement && cmp.peelOffElement) {
            if (cmp.peelOffElement.dom.href) {
                cmp.peelOffElement.dom.click();
            }
        }
    },
    navigateSelectShiftTab: function (event) {
        if (Ext.query('.nav-search-field').length > 0 && ABP.util.Config.getSessionConfig().settings.enableNavSearch) {
            ABP.util.Keyboard.focus('.nav-search-field');
        } else {
            var toolbarButtons = Ext.query('a[id^=abpbadgebutton]');
            if (toolbarButtons.length > 0) {
                toolbarButtons[toolbarButtons.length - 1].focus();
            } else {
                ABP.util.Keyboard.focus('.tool-button-left');
            }
        }
    },
    findNextMenuOption: function () {
        var activeEl = document.activeElement;
        var classList = activeEl.classList;
        var collapsed = classList.contains("x-treelist-item-collapsed");
        var classic = ABP.util.Common.getClassic();
        // Move down to your children
        if (activeEl.lastChild.firstChild && !collapsed) {
            return activeEl.lastChild.firstChild;
        }
        // Move down to your sibling
        var found = classic ? this.findNextVisibleSibling(activeEl) : this.findNextVisibleSiblingModern(activeEl);
        if (found) {
            return found;
        } else {
            classic ? this.focusNextParentSibling(activeEl) : this.focusNextParentSiblingModern(activeEl);
        }
    },
    findPreviousMenuOption: function () {
        var activeEl = document.activeElement;
        var found = ABP.util.Common.getClassic() ? this.findPreviousVisibleSibling(activeEl) : this.findPreviousVisibleSiblingModern(activeEl);
        if (found) {
            return found;
        } else {
            // focus parent
            var classList = activeEl.classList;
            var top = classList.contains('treeMenu-level-0');
            if (!top) {
                activeEl.parentNode.parentNode.focus();
            } else {
                //wrap around
                var parentsLastChild = activeEl.parentNode.lastChild;
                // activeEl.parentNode.lastChild !== activeEl
                if (parentsLastChild !== activeEl) {

                    // activeEl.parentNode.lastChild is visible
                    if (parentsLastChild._extData.isVisible === undefined || parentsLastChild._extData.isVisible) {
                        // is - checkchildren
                        var child = this.checkChildrenVisibility(parentsLastChild);
                        if (child) {
                            return child;
                        } else {
                            return parentsLastChild;
                        }
                        // not - findPreviousVisibleSibling
                    } else {
                        var visible = ABP.util.Common.getClassic() ? this.findPreviousVisibleSibling(parentsLastChild) : this.findPreviousVisibleSiblingModern(parentsLastChild);
                        if (visible && visible !== activeEl) {
                            return visible;
                        }
                    }
                }
            }
        }
    },
    findNextVisibleSibling: function (activeEl) {
        var ret = null;
        var testingNode = activeEl;
        for (; ;) {
            if (testingNode.nextSibling) {
                testingNode = testingNode.nextSibling;
                if (testingNode._extData.isVisible === undefined || testingNode._extData.isVisible) {
                    ret = testingNode;
                    break;
                }
            } else {
                break;
            }
        }
        return ret;
    },
    findNextVisibleSiblingModern: function (activeEl) {
        var ret = null;
        var testingNode = activeEl;
        var testingCmp;
        for (; ;) {
            if (testingNode.nextSibling) {
                testingNode = testingNode.nextSibling;
                testingCmp = Ext.getCmp(testingNode.id);
                if (!testingCmp.isHidden()) {
                    ret = testingNode;
                    break;
                }
            } else {
                break;
            }
        }
        return ret;
    },
    findPreviousVisibleSiblingModern: function (activeEl) {
        var ret = null;
        var testingNode = activeEl.previousSibling;
        var testingCmp;
        var found = false;
        for (; ;) {
            if (testingNode) {
                testingCmp = Ext.getCmp(testingNode.id);
                if (!testingCmp.isHidden()) {
                    ret = testingNode;
                    found = true;
                    break;
                }
                testingNode = testingNode.previousSibling;
            } else {
                break;
            }
        }
        if (found) {
            var child = this.checkChildrenVisibility(ret);
            if (child) {
                ret = child;
            }
        }
        return ret;
    },
    findPreviousVisibleSibling: function (activeEl) {
        var ret = null;
        var testingNode = activeEl.previousSibling;
        var found = false;
        for (; ;) {
            if (testingNode) {
                if (testingNode._extData.isVisible === undefined || testingNode._extData.isVisible) {
                    ret = testingNode;
                    found = true;
                    break;
                }
                testingNode = testingNode.previousSibling;
            } else {
                break;
            }
        }
        if (found) {
            var child = this.checkChildrenVisibility(ret);
            if (child) {
                ret = child;
            }
        }
        return ret;
    },
    checkChildrenVisibility: function (foundNode) {
        var classList = foundNode.classList;
        var collapsed = classList.contains('x-treelist-item-collapsed');
        var testingNode;
        var found = false;
        var ret = null;
        if (foundNode.lastChild.firstChild && !collapsed) {
            testingNode = foundNode.lastChild.lastChild;
            for (; ;) {
                if (testingNode) {
                    if (testingNode._extData.isVisible === undefined || testingNode._extData.isVisible) {
                        ret = testingNode;
                        found = true;
                        break;
                    }
                    testingNode = testingNode.previousSibling;
                } else {
                    break;
                }
            }
            if (found) {
                var child = this.checkChildrenVisibility(ret);
                if (child) {
                    ret = child;
                }
            }
        }
        return ret;
    },
    focusNextParentSibling: function (activeEl) {
        var testingNode = activeEl.parentNode.parentNode;
        var found = false;
        for (; ;) {
            if (testingNode.nextSibling) {
                testingNode = testingNode.nextSibling;
                if (testingNode._extData.isVisible === undefined || testingNode._extData.isVisible) {
                    testingNode.focus();
                    found = true;
                    break;
                }
            } else {
                break;
            }
        }
        // Not found means we have to wrap back to the top of the menu
        if (!found) {
            this.focusFirstMenuOption();
        }
    },
    focusNextParentSiblingModern: function (activeEl) {
        var testingNode = activeEl.parentNode.parentNode;
        var testingCmp;
        var found = false;
        for (; ;) {
            if (testingNode.nextSibling) {
                testingNode = testingNode.nextSibling;
                testingCmp = Ext.getCmp(testingNode.id);
                if (testingCmp && !testingCmp.isHidden()) {
                    testingNode.focus();
                    found = true;
                    break;
                }
            } else {
                break;
            }
        }
        // Not found means we have to wrap back to the top of the menu
        if (!found) {
            this.focusFirstMenuOption();
        }
    },
    treeListFocus: function () {
        var toFocus = this.findNextMenuOption();
        if (toFocus) {
            toFocus.focus();
        }
    },
    focusFirstMenuOption: function () {
        var view = this.getView();
        var activeEl = document.activeElement;
        activeEl.blur();
        view.focus();
    }
    // End Keymap handlers 
});
