/*
*   A display with visual indicators for navigation through related forms.
*   Basic design is numbered circles connected by lines and styled related to form state.
*/

Ext.define('ABPControlSet.view.component.StepProgressBar', {
    extend: 'Ext.Component',
    xtype: 'abpstepprogressbar',

    tpl: ['<div class="abp-step-progress-container">',
        '<ul class="abp-step-progress-list">',
        '<tpl for="steps">',
        '<tpl if="complete">',
        '<li id="abp-step-number-id-{stepNum}" class="abp-step-progress-complete abp-step-progress-step">',
        '<span class="abp-step-progress-btn-wrapper">',
        '<span class="abp-step-progress-step-button">{stepCompleteLabel}</span>',
        '</span>',
        '<span class="abp-step-progress-step-label">{label}</span>',
        '</li>',
        '<tpl elseif="current">',
        '<li id="abp-step-number-id-{stepNum}" class="abp-step-progress-current abp-step-progress-step">',
        '<span class="abp-step-progress-btn-wrapper">',
        '<span class="abp-step-progress-step-button">{stepLabel}</span>',
        '</span>',
        '<span class="abp-step-progress-step-label">{label}</span>',
        '</li>',
        '<tpl else>',
        '<li id="abp-step-number-id-{stepNum}" class="abp-step-progress-undone abp-step-progress-step">',
        '<span class="abp-step-progress-btn-wrapper">',
        '<span class="abp-step-progress-step-button">{stepLabel}</span>',
        '</span>',
        '<span class="abp-step-progress-step-label">{label}</span>',
        '</li>',
        '</tpl>',
        '</tpl>',
        '</ul>',
        '</div>'
    ],

    // Since the button wrappers are given a specific width property, they are not repositioned on resize.
    // This is to force Sencha to reposition the elements.
    onResize: function (params, x, t, z) {
        this.hide();
        this.show();
    }
}
)