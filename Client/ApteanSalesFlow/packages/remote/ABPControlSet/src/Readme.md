# ABPControlSet/src

This folder contains source code that will automatically be added to the classpath when
the package is used.

## Mixins

Mixin - "Parent"

Component

    responsiveWidth - M & C
    disabled - M & C
    tooltip - M & C
    hidden - M & C
    backgroundColor - M & C
    foregroundColor - M & C

Button - Component

    icons - C ****
    responsiveWidth - M & C
    disabled - M & C
    tooltip - M & C
    hidden - M & C
    backgroundColor - M & C
    foregroundColor - M & C

Text - Component

    spellcheck - ****
    responsiveWidth - M & C
    disabled - M & C
    tooltip - M & C
    hidden - M & C
    backgroundColor - M & C
    foregroundColor - M & C
    readOnly - M & C
    required - M & C
    fieldFormat - M & C
    fieldFormatter - M & C
    triggerTooltip - ****

Display - Text

    responsiveWidth - M & C
    disabled - M & C
    tooltip - M & C
    hidden - M & C
    backgroundColor - M & C
    foregroundColor - M & C
    readOnly - M & C ????
    required - M & C ????
    fieldFormat - M & C ???
    fieldFormatter - M & C ???

Checkbox - Text

    responsiveWidth - M & C
    disabled - M & C
    tooltip - M & C
    hidden - M & C
    backgroundColor - M & C
    foregroundColor - M & C
    readOnly - M & C
    required - M & C
    fieldFormat - ****
    fieldFormatter - ****
    boxLabel - ****

RadioGroup - Text

    responsiveWidth - M & C
    disabled - M & C
    tooltip - M & C
    hidden - M & C
    backgroundColor - M & C
    foregroundColor - M & C
    readOnly - M & C
    required - M & C
    fieldFormat - ****
    fieldFormatter - ****
    fieldLabel - ****
    labelAlign - ****
    value -
    items - dynamic set of items

Image - Text

    src - M & C
    responsiveWidth - M & C
    disabled - M & C
    tooltip - M & C
    hidden - M & C
    backgroundColor - M & C
    foregroundColor - M & C
    readOnly - ****
    required - ****

Tree - Component

    responsiveWidth - M & C
    disabled - M & C
    tooltip - M & C
    hidden - M & C
    backgroundColor - M & C
    foregroundColor - M & C
    items - ???

Grid - Component

    responsiveWidth - M & C
    disabled - M & C
    tooltip - M & C
    hidden - M & C
    backgroundColor - M & C
    foregroundColor - M & C
    fieldFormat - ???
    fieldFormatter - ???

ContextMenu

    backgroundColor
    foregroundColor
    keyMap
    parentComponent

ContextMenuItem ???

#Events

Text - and subclasses

    userchanged - field plugin
    focus - in trigger

Image

    click
    doubletap
    longpress

RadioGroup

    userchanged

Grid

    userchanged

#Additional features

Text

    focus in trigger
    disabling trigger
    field formatting - field plugin

TextArea

    expand vertically to full text when focused

Grid

    Show data as chart

ContextMenu

    for any component - create hook to provide contextual info from component

