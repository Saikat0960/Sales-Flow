Ext.define("ABPControlSet.common.Constants", {
    statics: {
        COLUMN_WIDTH_SAMPLE_PERCENTAGE: .05,
        MINIMUM_COLUMN_WIDTH: 40, // Width 40px
        COLUMN_HEADER_RIGHT_ALIGN_PADDING: 6, // Right align extra 6px width.
        COLUMN_HEADER_REQUIRED_PADDING: 12, // Required extra 12px width.
        COLUMN_HEADER_EXTRA_PADDING: 4, // Extra column padding 4px. Used as an extra buffer to ensure text is fully visible.
        COLUMN_MENU_TRIGGER_PADDING: 15, // 15px width extra for column menu trigger.
        COLUMN_SORT_ARROW_PADDING: 15, // 15px width extra for column sort arrow.
        COLUMN_FILTER_ICON_PADDING: 10, // 10px width extra for column filter icon.

        // Responsive Design Snap Points.
        RESPONSIVE_SNAPPOINT_WIDTH_1: 510, // Width 510px.

        // Default address map string. Inclides {0} to show where to embed the address. Redefine this if you need to use another map provider.
        MAP_URL_FORMAT_STRING: "https://www.google.com/maps/search/?api=1&query={0}"
        // Example alternative maps service.
        //MAP_URL_FORMAT_STRING: "https://www.bing.com/maps?where1={0}"
    }
});
