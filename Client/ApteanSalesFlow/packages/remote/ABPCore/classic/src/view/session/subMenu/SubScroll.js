/*global IScroll: false */
Ext.define('ABP.view.session.subMenu.SubScroll', {
    extend: 'Ext.container.Container',
    alias: 'widget.subscroll',

    afterRender: function () {
        this.callParent();
        var me = this;
        if (this.getXType() === 'subscroll') {
            this._getIScrollElement = function () {
                return (this.el.dom);
            };
        }
        if (ABP.util.Config.isDesktop()) {
            if (this._getIScrollElement) {
                this._updateIScroll();
                this.on('afterlayout', this._updateIScroll, this);
            }
        }
        me.el.dom.onmouseleave = function () {
            var me = this;
            me = Ext.getCmp(me.id);
            me.addCls('noshowScroll');
        }
        me.el.dom.onmouseenter = function () {
            var me = this;
            me = Ext.getCmp(me.id);
            me.removeCls('noshowScroll');
        }
    },

    _ensureIScroll: function () {

        if (!this.iScroll) {
            var el = this._getIScrollElement();
            if (el.children.length > 0) {
                this.iScroll = new IScroll(el,
                    {
                        mouseWheel: true,
                        click: false, preventDefault: false,
                        scrollbars: true, fadeScrollbars: false
                    });
                this.iScrollTask = new Ext.util.DelayedTask(this._refreshIScroll, this);
            }
        }
    },

    _updateIScroll: function () {
        this._ensureIScroll();
        if (this.iScroll) {
            this.iScrollTask.delay(10);
        }
    },

    _refreshIScroll: function () {
        this.iScroll.refresh();
        var myH = this.up().el.dom.clientHeight;
        this.el.dom.style.height = myH + "px";
        this.el.child('div').dom.style.height = this.enabledItemCount * 41 + "px";
        this.iScrollTask.delay(1000);
    }
});