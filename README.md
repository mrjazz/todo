TODO
====

[![Build Status](https://travis-ci.org/mrjazz/todo.svg?branch=master)](https://travis-ci.org/mrjazz/todo)

Simple application with keyboard management, drag&drop, quick adding todos and filters


[Here is the demo](http://mrjazz.github.io/todo/)

Changelog and features
----------------------


v0.0.5

Features:

 - Performance optimize for drag&drop and list rendering
 - Persistence in local storage
 - Parse hashtags (contexts)
 - Parse contacts (@ sign)
 - Design update

v0.0.4

Features:

 - Add notes
 - Add _date start_, _date end_
 - Add validation for dates (date start can't be after _date end_ and otherwise)
 - Hints for dates and correct date confirmation with separate style
 - Add icon for date when date exists
 - Add separate style for expired _end date_
 - View mode for notes with markdown

Fixes:

 - Delete items with children doesn't set focus correctly
 - For filtered view focus doesn't set by complete
 - Add item replace existing todos

Shortcuts:

 - N+N - Create note
 - N+P - Preview note with markdown
 - D+S - Shortcut for _Date Start_
 - D+E - Shortcut for _Date Start_

Refactoring:

 - Add mapping for shortcuts, maybe some kind of pattern matching


v0.0.3

 - Update description on howto popup
 - Howto popup added

Shortcuts:

 - Exit from edit by Esc
 - Ctrl+D - Duplicate
 - Ctrl+C or Ctrl+X - Copy or Cut
 - Ctrl+V - Paste below
 - Ctrl+← - Move item on upper level
 - Ctrl+→ - Make item child of previous item
 - Ctrl+↑/Ctrl+↓ - Re-order list items
 - Del - delete
 - F2 - make edit
 - Home/End - jump on top/end of list
 - Enter - Add below
 - Alt+Enter - Add item as child
 - Tab/Shift+Tab - Previous/next
 - Ctrl+Shift ← - Collapse all
 - Ctrl+Shift → - Expand all
 - Jump to parent by ←
 - If item has children and closed, expand by →
 - If item has children and open, collapse by ←
 - If item has children and open, jump to first item by →


Fixes:

 - Fix multiple selectTodo actions (probably can't be done because need process onFocus, onFocusOut events)
 - Fix multiple flipTodo actions
 - Fix critical issue with crashing browser
 - Fix issue with missed parent for nested items
 - For some reason after Del, Enter drop item (new ID should be generated according to max, not lengthr)


v0.0.2

 - Left/right arrow keys for expand-collapse items with children


v0.0.1

 - Fix editing in childrens
 - Cover reducers with tests
 - Drag into feature

