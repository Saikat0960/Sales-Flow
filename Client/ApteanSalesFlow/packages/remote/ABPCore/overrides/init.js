// Workaround for ExtJS bug (our ticket #49130). 
//
// iPad with iOS 13 is treated as Mac desktop instead of iOS touch device.
// This is because the Safari userAgent has changed in iOS 13 (on iPad only - iPhone is still ok).
// ExtJS code uses Ext.isiOS, Ext.isMac and Ext.platform.* tags to branch code. 
// We know that checkbox and radio buttons break because they do not respond to click events, other 
// than on their margins.
//
// Sencha recommend workaround code goes into index.html - in the beforeLoad handler. But since this
// means every Aptean product has to do this, a compromise is to correct the tags as ABPCore loads. 
// 
// As of Oct 10th 2019 Sencha have closed the bug and left it with their Engineering team. So there
// is no known date or release for a fix.

Ext.isiOS = Ext.isiOS ||
    /iPad|iPhone|iPod/.test(navigator.platform) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
if (Ext.isiOS) {
    Ext.isMac = false;
    Ext.platformTags.desktop = false;
    // Ext.platformTags.iPad = ????; // Ideally this should be set to, but waiting for Sencha to supply the right logic to fix their bug.
    // Ext.platformTags.tablet = ????; // Ideally this should be set to, but waiting for Sencha to supply the right logic to fix their bug.
}
