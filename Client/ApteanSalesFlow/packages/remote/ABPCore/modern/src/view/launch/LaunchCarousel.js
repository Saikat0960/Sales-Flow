Ext.define('ABP.view.launch.LaunchCarousel', {
    extend: 'Ext.tab.Panel',
    requires: [
        'ABP.view.launch.LaunchCarouselController',
        'ABP.view.launch.LaunchCarouselModel'
    ],
    alias: 'widget.launchcarousel',
    controller: 'launchcarouselcontroller',
    viewModel: 'launchcarouselmodel',
    tabBar: {
        hidden: true
    },
    initialize: function (a, b) {
        this.onAfter('painted', this.setup);
    },
    setup: function () {
        var me = this;
        var vm = me.getViewModel();
        var startingLaunchCarouselTab = vm.get('startingLaunchCarouselTab');
        me.setActiveItem('#' + startingLaunchCarouselTab);
    }
});