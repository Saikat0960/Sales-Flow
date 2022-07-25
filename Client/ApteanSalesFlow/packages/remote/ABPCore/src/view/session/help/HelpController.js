Ext.define('ABP.view.session.help.HelpController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.helpcontroller',

    listen: {
        component: {
            '*': {
                helpview_intialLoad: 'intialLoadDisplay'
            }
        }
    },

    closeClicked: function () {
        this.fireEvent('featureCanvas_hideSetting');
    },

    intialLoadDisplay: function () {
        var me = this;
        var vmData = me.getViewModel().data;
        var types = vmData.helpTypeStore.data.items;
        var records = vmData.helpLinkStore.data.items;
        var items = [];
        var i, j;
        var typeLabel, children;
        var obj;
        if (types) {
            for (i = 0; i < types.length; ++i) {
                typeLabel = types[i].data.type;
                children = [];
                for (j = 0; j < records.length; ++j) {
                    if (records[j].data.type === typeLabel) {
                        children.push(records[j].data);
                    }
                }
                if (children.length > 0) {
                    obj = {
                        title: typeLabel,
                        links: children
                    };
                    items.push(obj);
                }
            }
            if (items.length > 0) {
                var cardContainer = me.lookupReference('abp-help-tile-container');
                for (i = 0; i < items.length; ++i) {
                    cardContainer.add(items[i]);
                }
            }
        }
    },

    linkClick: function (link) {
        var vm = this.getViewModel();
        var url = link.url;
        var result = window.open(url);
        var blockedTitle = '';
        var blockedString = '';
        var htmlString = '';
        var target = '_blank';
        link.el.blur();
        if (Ext.isEmpty(result) && (!ABP.util.Common.isIOSChrome())) {
            blockedTitle = vm.get('i18n.help_blocked_Title');
            blockedString = vm.get('i18n.help_blocked_Text');
            cancelString = vm.get('i18n.error_cancel_btn');
            canButton = Ext.MessageBox.CANCEL;
            canButton.text = cancelString;
            htmlString = Ext.String.format("{0}<BR/><BR/><A HREF='{1}' TARGET='{2}'>{3}</A>", blockedString, url, target, url);
            Ext.Msg.show({
                title: blockedTitle,
                message: htmlString,
                buttons: canButton
            });
        }

    }
});
