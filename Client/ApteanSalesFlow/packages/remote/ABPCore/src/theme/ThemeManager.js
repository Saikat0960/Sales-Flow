/**
 * This class manages the global theme state
 * {@link Ext.ABPThemeEvents} Observable instance. No selectors are supported for this domain.
 */
Ext.define('ABP.ThemeManager', {
        singleton: true,
        requires: [
            'ABP.events.ThemeEventDomain',
        ],

        config: {
            selectedTheme: Ext.theme.subThemeList[0]
        },

        applySelectedTheme: function (theme) {
            if (theme && theme.themes) {
                return theme.themes;
            }

            return theme;
        },

        updateSelectedTheme: function (theme, oldTheme) {
            ABPTheme.fireEvent('changed', theme);
        }
    },
    function (ThemeManager) {

        ABPTheme = typeof ABPTheme == "undefined" ? {} : ABPTheme;

        /**
         * @member ABPTheme
         * @method setTheme
         * Shorthand for {@link ABP.ThemeManager#setSelectedTheme}.
         */
        ABPTheme.setTheme = function (theme) {
            return ABP.ThemeManager.setSelectedTheme(theme);
        };
    });