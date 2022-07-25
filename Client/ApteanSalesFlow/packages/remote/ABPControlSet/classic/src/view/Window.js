/**
 * Extends the Ext.window.Window class to include enhanced functionality.
 */
Ext.define("ABPControlSet.view.Window", {
    extend: "Ext.window.Window",
    xtype: 'abpwindow',
    /**
     * @cfg {Boolean} scaleWithContainer
     * Enable automatic scaling of the window to fit within the container as it is resized.
     * Automatically expands to the initial height and width if provided; else expands to the scaled size of the container.
     */
    scaleWithContainer: true,

    /**
     * @cfg {Number} scaleWithContainerRatio
     * The % size (as floating point ratio) of the container to scale to.
     */
    scaleWithContainerRatio: 0.90,

    /**
     * @cfg {Boolean} skipCenter
     * A flag which can be set by subclasses to allow for x and y positioning by skipping the centering of the window.
     */
    skipCenter: false,

    /**
     * @cfg {Boolean} startMaximizedOnSmallViewport
     * Window will start 'maximized' if initialized on a small screen.
     * If enabled, this will override the 'maximized' config option if on a small screen.
     */
    startMaximizedOnSmallViewport: false,

    initComponent: function () {
        // Call parent.
        this.callParent();

        // Preserve the initial width and height used for 'scaleWithContainer'.
        this.initialWidth = this.width || 0;
        this.initialHeight = this.height || 0;

        // Determine if browser is a Desktop or Mobile Device.
        this.isDesktop = Ext.platformTags.desktop;

        // // Check if this is a small-viewport if requested, and enable 'maximized'.
        // if (this.startMaximizedOnSmallViewport && (!this.maximized)) {
        //     // Get locals.
        //     var snapPoint = Uxc.internal.Constants.RESPONSIVE_SNAPPOINT_WIDTH_1;
        //     var windowHeight = window.innerHeight;
        //     var windowWidth = window.innerWidth;

        //     // Enable 'maximized' if the window's height or width is less than the snap point.
        //     if (Math.min(windowHeight, windowWidth) < snapPoint) {
        //         this.maximized = true;
        //     }
        // }
    },

    /**
     * @private @ignore
     * Destroy component.
     */
    onDestroy: function () {
        // Unregister events.
        this.unregisterContainerResizeOnce();

        // Destroy parent.
        this.callParent(arguments);
    },

    restore: function (animate) {
        /// <private>
        /// <summary>
        /// Extends base implementation for 'restore'.
        /// Performs additional logic when the window is restored (ie. "un-maximized").
        /// </summary>
        /// </private>

        // Declare locals.

        // Call parent.
        this.callParent(animate);

        // Resize the window if container's window was resized or reoriented.
        if (this.resizedWhileMaximized && this.scaleWithContainer) {
            // Resize the window.
            this.doScaleWithContainer();

            // Reset the flag.
            delete this.resizedWhileMaximized;
        }
    },

    show: function (animateTarget, callback, scope) {
        // Short-term workaround to ensure layouts are not suspended before attempting to render new window.
        Ext.resumeLayouts(true);

        // Call parent.
        return this.callParent(arguments);
    },

    onWindowResize: function (width, height, eOpts) {
        /// <private>
        /// <summary>Extends base implementation for 'scaleWithContainer'.</summary>
        /// </private>

        // Declare locals.
        var me = this;

        // Do base resize.
        me.callParent();

        // Detect if orientation has changed.
        var orientation = me.getScreenOrientation();
        if (!orientation) {
            // Use new window width and height to determine orientation if screen.orientation is unavailable.
            orientation = (width > height) ? "landscape" : "portrait";
        }
        var orientationChanged = (this.oldOrientation !== orientation);
        if (orientationChanged) {
            this.oldOrientation = orientation;
        }

        // Flag that the window was resized or reoriented while maximized.
        if (me.maximized && me.scaleWithContainer && (this.isDesktop || orientationChanged)) {
            me.resizedWhileMaximized = true;
        }

        // Apply 'scaleWithContainer' resizing.
        if ((!me.isDestroyed) && (!me.maximized) && (me.scaleWithContainer) && (this.isDesktop || orientationChanged)
            && (!this.masked)) { // TODO: Temporary workaround to avoid a layout-system crash when the modal window is resized with the 'load mask' displayed.
            me.doScaleWithContainer({
                width: width,
                height: height
            });
        }
    },

    onShow: function () {
        /// <private>
        /// <summary>Extends base implementation to apply initial fit-within-container resize.</summary>
        /// </private>

        // Declare locals.
        var me = this;

        // Call parent.
        me.callParent(arguments);

        // Perform initial fit-within-container resize.
        if (me.scaleWithContainer) {
            // Defer initial fit-within-container if initially maximized.
            if (me.maximized) {
                this.resizedWhileMaximized = true;
            } else {
                // For non-desktop environments, wait for a late container resize event to workaround sizing issues with virtual keyboards.
                if (!Ext.platformTags.desktop) {
                    this.registerContainerResizeOnce();
                }

                // Do resize.
                me.doScaleWithContainer();
            }

            // Set the initial screen orientation.
            me.oldOrientation = me.getScreenOrientation();
        }
    },

    registerContainerResizeOnce: function () {
        /// <private>
        /// <summary>
        /// Register for a one-time check for a late container resize.
        /// This is to workaround issues with virtual keyboards not always triggering the expected resize events.
        /// </summary>
        /// </private>

        // Declare locals.
        var me = this;

        if (me.container && (!me._deferredResizeRegistered)) {
            me.container.on('resize', me.onDeferredContainerResizeOnce, me, { buffer: 50 });
            me._deferredResizeRegistered = true;
        }
    },

    unregisterContainerResizeOnce: function () {
        if (this._deferredResizeRegistered && this.container) {
            // Unregister deferred container resize.
            this.container.un("resize", this.onDeferredContainerResizeOnce, this);
            this._deferredResizeRegistered = false;
        }
    },

    onDeferredContainerResizeOnce: function (el, oldSize, eOpts) {
        try {
            // Do resize.
            this.doScaleWithContainer();
        } finally {
            // Unregister deferred container resize.
            this.unregisterContainerResizeOnce();
        }
    },

    syncMonitorWindowResize: function () {
        /// <private>
        /// <summary>Override base implementation to listen to resize events when 'scaleWithContainer' is true.</summary>
        /// </private>

        var me = this,
            currentlyMonitoring = me._monitoringResize,
            // all the states where we should be listening to window resize:
            yes = me.constrain || me.constrainHeader || me.maximized || me.scaleWithContainer,
            // all the states where we veto this:
            veto = me.hidden || me.destroying || me.isDestroyed;

        if (yes && !veto) {
            // we should be listening...
            if (!currentlyMonitoring) {
                // but we aren't, so set it up.
                // Delay so that we jump over any Viewport resize activity.
                // NOTE: Use longer delay for non-desktop devices.
                Ext.on('resize', me.onWindowResize, me, { buffer: Ext.platformTags.desktop ? 80 : 160 });
                me._monitoringResize = true;
            }
        } else if (currentlyMonitoring) {
            // we should not be listening, but we are, so tear it down
            Ext.un('resize', me.onWindowResize, me);
            me._monitoringResize = false;
        }
    },

    doScaleWithContainer: function (newContainerSize) {
        /// <private>
        /// <summary>Resizes and centers the window to fit within the container.</summary>
        /// <param name="newContainerSize" type="object">Optional parameter. Object with the new container's width and height.</param>
        /// </private>

        // Declare locals.
        var me = this;
        var relativeSize = me.scaleWithContainerRatio; // The % size (as float) of the container to scale to.

        // Get container reference.
        var parent = me.floatParent;
        var container = parent ? parent.getTargetEl() : me.container;

        // Get current container & window sizes.
        var containerSize = newContainerSize ? newContainerSize : container.getSize();
        var currentSize = me.getSize();

        // Declare the new size.
        var newBox = currentSize;

        // Scale the window width to fit within the container.
        //  - Window is being shrunk; window is larger than container.
        //  - Or container is smaller than initial width.
        //  - Or an initial width was not provided.
        if ((currentSize.width > containerSize.width)
            || (containerSize.width < me.initialWidth)
            || (me.initialWidth <= 0)) {

            // Shrink the window to 'relativeSize' % of container.
            newBox.width = containerSize.width * relativeSize;
        }
        // Restore the window to initial size, if specified, if container is large enough.
        //  - Window is being expanded; window is smaller than both container AND initial width.
        //  - AND container is larger than initial width.
        else if ((currentSize.width < Math.min(containerSize.width, me.initialWidth))
            && (containerSize.width > me.initialWidth)) {

            // Restore window to initial size.
            newBox.width = me.initialWidth;
        }

        // Scale the window height to fit within the container.
        //  - Window is being shrunk; window is larger than container.
        //  - Or container is smaller than initial height.
        //  - Or an initial height was not provided.
        if ((currentSize.height > containerSize.height)
            || (containerSize.height < me.initialHeight)
            || (me.initialHeight <= 0)) {
            // Shrink the window to 'relativeSize' % of container.
            newBox.height = (containerSize.height == 0 ? me.initialHeight : containerSize.height) * relativeSize;
        }
        // Restore the window to initial size, if specified, if container is large enough.
        //  - Window is being expanded; window is smaller than both container AND initial height.
        //  - AND container is larger than initial height.
        else if ((currentSize.height < Math.min(containerSize.height, me.initialHeight))
            && (containerSize.height > me.initialHeight)) {

            // Restore window to initial size.
            newBox.height = me.initialHeight;
        }

        // Apply size changes.
        me.setBox(newBox, false);

        // Only center the window skipCenter is not true.
        if (this.skipCenter !== true) {
            // Center the window position.
            this.center();
        }

        // Draw focus to the window, away from any text fields, to trigger the soft-keyboard to hide.
        if (!me.isDesktop) {
            me.focus();
        }
    },

    getScreenOrientation: function () {
        /// <private>
        /// <summary>Helper method to get the screen orientation.</summary>
        /// <returns>String value representing the orientation; null otherwise.</returns>
        /// </private>

        if ((Ext.supports.Orientation) && (screen.orientation)) {
            // "screen.orientation.type" returns a string of format "landscape-secondary"; it must be parsed.
            var orientationType = screen.orientation.type || "";
            var orientationArray = orientationType.split("-");
            var orientation = orientationArray[0];

            return orientation;
        }

        // "screen.orientation" is not supported.
        return null;
    }
});