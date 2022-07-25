Ext.define('ABP.view.session.thumbbar.Thumbbar', {
    extend: 'Ext.Toolbar',
    alias: 'widget.thumbbar',
    requires: [
        'ABP.view.session.thumbbar.ThumbbarController',
        'ABP.view.session.thumbbar.ThumbbarModel'
    ],
    controller: 'thumbbar',
    viewModel: {
        type: 'thumbbarmodel'
    },
    cls: 'abp-thumbbar',
    ui: "thumbbar",
    layout: {
        type: 'hbox',
        pack: 'space-around'
    }
});