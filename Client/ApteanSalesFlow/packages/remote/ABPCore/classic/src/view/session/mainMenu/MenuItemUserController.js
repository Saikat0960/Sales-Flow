Ext.define('ABP.view.session.mainMenu.MenuItemUserController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.menuitemusercontroller',

    init: function () {
        this.startTime = Date.now();
    },

    onRenderUser: function (p) {
        var me = this;
        var vm = me.getViewModel();

        var theTip = Ext.create('Ext.tip.Tip', {
            html: '',
            cls: 'user-tip',
            margin: '0 0 0 0',
            color: '#fff',
            shadow: false
        });

        var currentEnv = ABP.util.Config.getEnvironment();
        Ext.each(vm.get('bootstrapConf.availableEnvironments'), function (e) {
            if (e && e.id === currentEnv) {
                currentEnv = e.name;
                return false;
            }
        });

        var showFn = function () {
            var statusString = vm.get('i18n.sessionMenu_user')
                + ' '
                + vm.get('userDisplay')
                + '&nbsp;&nbsp;&nbsp;&nbsp;'
                + vm.get('i18n.sessionMenu_environment')
                + ' '
                + currentEnv
                + '&nbsp;&nbsp;&nbsp;&nbsp;'
                + vm.get('i18n.sessionMenu_time')
                + me.getUseTime();

            theTip.update(statusString);
            theTip.showAt(me.getView().getX() + 150, me.getView().getY());
        };

        var hideFn = function () {
            theTip.hide();
        };

        p.getEl().on('mouseover', showFn);
        p.getEl().on('mouseout', hideFn);
        p.getEl().on('touchstart', showFn);
        p.getEl().on('touchend', hideFn);

        var userClickSetting = vm.get('conf.settings.userClick');
        if (userClickSetting && userClickSetting.appId && userClickSetting.event) {
            p.getEl().on('click', function () {
                me.fireEvent('main_fireAppEvent', userClickSetting.appId, userClickSetting.event, userClickSetting.eventArgs);
            });
        }
    },

    getUseTime: function () {
        var diff = Date.now() - this.startTime;
        diff = Math.floor(diff / 1000);

        var hh = Math.floor(diff / 3600);
        var mm = Math.floor(diff % 3600 / 60);
        var ss = diff % 60;

        mm = (mm < 10) ? '0' + mm : mm;
        ss = (ss < 10) ? '0' + ss : ss;

        return (hh + ":" + mm + ":" + ss);
    },

    inspectUser: function (user) {
        var allowed = (((allowed || '') + '')
            .toLowerCase()
            .match(/<[a-z][a-z0-9]*>/g) || [])
            .join('');
        var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
            commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
        return user.replace(commentsAndPhpTags, '')
            .replace(tags, function ($0, $1) {
                return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
            }).replace('/>', '').trim();
    }
});