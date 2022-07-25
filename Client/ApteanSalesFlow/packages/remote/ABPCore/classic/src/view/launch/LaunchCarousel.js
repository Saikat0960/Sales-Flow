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

    listeners: {
        'afterRender': function (tabPanel) {
            var me = tabPanel;
            var vm = me.getViewModel();
            var startingLaunchCarouselTab = vm.get('startingLaunchCarouselTab');
            tabPanel.setActiveTab(startingLaunchCarouselTab);
            // Old: tabPanel.setActiveTab(showLogIn ? 1 : 0);
        }
    }
});