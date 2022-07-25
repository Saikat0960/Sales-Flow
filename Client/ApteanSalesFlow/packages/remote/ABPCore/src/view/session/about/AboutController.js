Ext.define('ABP.view.session.about.AboutController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.about',

    init: function () {
        var view = this.getView();
        var aboutInfo = ABP.util.PluginManager.getMergedPluginConfigs('aboutInfo');
        Ext.each(aboutInfo, function (info) { info.xtype = 'aboutitem'; info.showIcon = true; });
        view.down("#aboutAppsList").add(aboutInfo);

        var thirdPartyAttributions = ABP.util.PluginManager.getMergedPluginConfigs('thirdPartyAttributions');
        thirdPartyAttributions = this.checkForDuplicates(thirdPartyAttributions);
        Ext.each(thirdPartyAttributions, function (info) { info.xtype = 'aboutitem'; });
        if (thirdPartyAttributions.length === 0) {
            view.down("#aboutThirdPartySection").hide();
        } else {
            view.down("#aboutThirdPartyList").add(thirdPartyAttributions);
        }

    },
    checkForDuplicates: function (thirdPartyAttributions) {
        var ret = [];
        var i = 0;
        var j = 0;
        var found = false;
        var len = thirdPartyAttributions.length;
        var rem = [];
        var remPush = function (obj) {
            var found = false;
            for (var itt = 0; itt < rem.length; ++itt) {
                if (obj === rem[itt]) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                rem.push(obj);
            }
        }
        var ret = [];
        if (len < 2) {
            ret = thirdPartyAttributions;
        } else {
            for (i; i < len; ++i) {
                found = false;
                for (j = 0; j < thirdPartyAttributions.length; ++j) {
                    if (i !== j) {
                        if (thirdPartyAttributions[i].name === thirdPartyAttributions[j].name && thirdPartyAttributions[i].version === thirdPartyAttributions[j].version) {
                            found = true;
                            if (i < j) {
                                remPush(j); //rem.push(j);
                            }
                        }
                    }
                }
            }
            rem.sort();
            for (i = rem.length - 1; i > -1; --i) {
                thirdPartyAttributions.splice(rem[i], 1);
            }
            ret = thirdPartyAttributions;
        }
        return ret;
    },
    closeClicked: function () {
        this.fireEvent('featureCanvas_hideSetting');
    }
});
