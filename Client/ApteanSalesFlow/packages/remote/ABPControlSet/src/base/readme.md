# Base mixins and plugins.

The control set components derive their additional functionality through a set of mixins and plugins.
There are two potential goals this acheives.
    1. Simplicity of the code: This abstracts the code out of the components and allows for common code to be shared between both modern and classic toolkits.
    2. Less code added to the components themselves, leading to less possibilities of clashing with Ext JS framework code.

A good way to differentiate mixins and plugins:
    "A mixin changes the way a class works. A plugin changes the way an instance of a class works"

The structure is to be as follows:

    The "src/base" folder is to hold all of the base definitions of the mixins and plugins. The reason "base" is in the mix here, is so classic and modern toolkits can have the ability to extend the classes for additional functionality/toolkit specific functionality. If base wasn't in the namespace, the class names would clash when trying to extend. However, another route is available for adding additional functionality; which is overridin the base class.

    Mixins = src/base/mixin/*Component*.js

    Plugins = src/base/view/*component*/plugin/*Component*.js

    *** With the exception being plugins which apply to multiple types of components like the tooltip. These can be stored in src/base/view/plugin/*Plugin*.js ***

    When adding toolkit/additional functionality the mixins and plugins are to be overridden in the toolkit specific source.

    For example:

        A classic toolkit grid requires different logic to set the foreground color. The base grid mixin is "ABPControlSet.base.mixin.Grid".
        Under the classic toolkit source a file can be added @ src/mixin/ and be named Grid.js. Within this file, the "ABPControlSet.base.mixin.Grid" class will be overridden:

            Ext.define("ABPControlSet.mixin.Grid",{
                override: "ABPControlSet.base.mixin.Grid"

                // Add/override methods for classic toolkit specific logic.

            });

        Doing this allows us to keep one class name for mixins, and one ptype for plugins for ease of use of these files around the code.