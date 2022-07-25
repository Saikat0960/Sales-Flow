# ABPControlSet

# Coding/Check-in standards:

    ALWAYS perform a "sencha app build" before pushing code to the branch. This will catch debugger statements and syntax errors.

    ALWAYS run the app after the last "sencha app build" and check the console to ensure nothing is causing new warnings or errors.

    No trailing commas, ever.

    No debugger statements, ever.

    Use "" quotes always unless formatting a string which requires a " to be used within the string; in this case use ''.

    Conditional if statements require {} brackets always. Never have a conditional statement without them.
        BAD:
            if (condition)
                logic
        GOOD:
            if (condition) {
                logic
            }

    On the same note, conditional if block formatting, the opening bracket "{" always goes directly after the ending ")" or "else", never on the next line.
        BAD:
            if (condition)
            {

            }
            else
            {

            }
        GOOD:
            if (condition) {

            } else {

            }

    The same goes for "for" statements:
        GOOD:
            for () {

            }

# Good practices: (https://www.swarmonline.com/9-ext-js-performance-optimisation-tips/)

Performance is important for all applications, some more than others. Below we’ve compiled a list of tips for improving the performance of your Ext JS or Sencha Touch app.

1. Avoid Ext.ComponentQuery.query
When finding a component in Ext JS, try to avoid Ext.ComponentQuery.query if you can. This is typically used to find components globally and there are a few alternatives that can help avoid this operation.

Using .up and .down functions from a target component is typically faster since it limits the area a query search will take place and it will return the first element it finds rather than searching for multiple.

// Searches parent components
this.up('#myComponent');
// Searches child components
this.down('#myComponent');
You can also query inside an element to avoid searching the global space.

// Searches for multiple child components
container.query('#myComponent');
If you must use Ext.ComponentQuery.query, make sure you query for multiple components where you can. This is commonly forgotten about functionality.

var myComponent = Ext.ComponentQuery.query('#myComponent');
var yourComponent = Ext.ComponentQuery.query('#yourComponent');

// Querying for multiple components will find them in one pass rather than multiple
var ourComponents = Ext.ComponentQuery.query('#myComponent, #yourComponent');
2. Batch creation of your views
It's easy to use multiple calls to the add function without considering the performance implications. Below are some examples of slow and fast ways to use this functionality.

// Slow
this.add(header);
this.add(main);
this.add(footer);

// Adding multiple in the same call is faster
this.add(header, main, footer);

// Or as an array
this.add([header, main, footer]);
It's also possible to suspend layouts temporarily

// Also fast
this.suspendLayouts();
this.add(header);
this.add(main);
this.add(footer);
this.resumeLayouts(true);
3. Avoid unnecessary panels
Try to use the Container component wherever you can instead of Panel. Ext JS defaults to Panel, but Container is a much more lightweight component. Ensure you’re using Container in places that you don’t need the full functionality of the more powerful Panel Component by specifying the xtype.

4. Reduce component and store nesting
Think carefully when nesting components and ensure you don’t nest them deeper than you need to. This can be more expensive to render and harder code to follow overall.

Likewise over-using associations within stores can cause some serious performance decreases. Try to keep them as simple as possible and measure the performance impact with console.time

5. Proper handling of listeners
Improper usage of listeners can be a common cause of memory leaks and performance issues. Make sure that when you create a listener that it is being destroyed properly. The following type of listener attached to a component is destroyed automatically.

Ext.define('MyApp.view.main.MyList', {
  listeners: {
    itemtap: function() {
      console.log('item tapped!');
    }
  }
});
However, global listeners or listening to a different component must be removed manually. Best place for this is typically the components destroy method.

// Must be removed with Ext.un
Ext.on('globalevent', this.myCallback, this);

// Must be removed with component.un
component.on('compevent', this.myCallback, this);
6. Avoid store.each for large data sets
.each as well as the native .forEach require a function to invoke for every item in the array. If you don’t require this functionality a simple for loop can be significantly faster.

// Slow
var totalCost = 0;
myStore.each(function (record) {
  totalCost += record.get('Cost');
});

// Fast
var totalCost = 0;
var records = myStore.getData().getRange();
for (var i = 0; i < records.length; i++) {
  totalCost += records[i].get('Cost');
}

7. Adjust CSS animate frame-rate
By default all CSS animations run at 60 frames per second(fps). This provides a smooth looking animation, but in a lot of cases this isn’t necessary. You may be able to gain some performance by reducing the fps of certain animations, and in a lot of cases gaining performance without much of a noticeable difference to the end user. This example illustrates how to change the steps of an animation, or the number of frames for the complete animation.

// 30fps for 1s, 15fps for 2s animations
animation-timing-function: steps(30);
8. Careful use of getWidth and getHeight
Requesting certain information from DOM elements can cause the browser to recalculate style and layout. Doing this too often is commonly called layout thrashing. A detailed list of things that trigger this has been compiled over at GitHub. Probably the most common versions of this you’ll find in Ext JS are getWidth and getHeight. Call these as infrequent as possible by storing the returned value in a variable and try to do it before you make any other alterations to the view.

9. Ensure browser caching is enabled
When assets are served to the browser (js, png, jpg, css), headers should contain an expiry date to avoid each page change from downloading the same assets again. This is a simple thing that is commonly missed when configuring your server. Making sure common assets are set to at least 1 week can make page loads much faster.




# Testing

Syntax Checks – Syntax checks are not exactly unit tests because there is no logic being tested. Instead we analyze our code for syntactical errors – errors that may or may not be caught before application execution.

Unit Tests – True to its contemporary meaning within software development, unit tests are a series of objective logic tests. Unit tests attempt to isolate small pieces of our code: given specific inputs, unit tests expect specific outputs. In this manner unit tests are essentially mathematical proofs (remember those from high school?) that confirm what our business logic is supposed to do.

UI Tests (aka Integration Tests) – UI Tests are not the same as unit tests. UI Tests attempt to subjectively verify that elements on the screen behave (and/or look) as expected when a user performs a given action. There is no math or logic involved: the tests render the environment as a whole (containing all runtime dependencies) and wait to verify that the DOM has changed in a desired way. You can think of these tests as a robot manually testing the application.