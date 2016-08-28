TODO
----


Refactoring:

 - [ ] Use immutable.js for state
 - [ ] Move functionality from shortcut mapping to reducer
 - [ ] Make Items list more lightweight, move out shortcut handlers
 - [ ] Split libs and app code in webpack


Fixes:
 - [ ] When filter apply to old version of nodes
 - [ ] Reload after import without page reload (related to async calls processing)

Add new shortcuts:

 - [ ] ? - Help
 - [ ] Set colors/icons by 1..6 keys


Features:

 - [X] Make the whole row clickable for row focus
 - [ ] Group by functionality
 - [ ] Order by functionality
 - [ ] Completion in command line by tab
 - [ ] Persistence on the server
 - [ ] Encrypt data in storage
 - [ ] Extended help functionality
 - [ ] Add animation for deleted item
 - [ ] Make note icon clickable and preview note by click
 - [ ] Add recurrent todos support
 - [ ] Add notifications


__Calendar research__

 Options are:

   - https://vitalets.github.io/bootstrap-datepicker/
   - http://amsul.ca/pickadate.js/date/
   - http://demos.telerik.com/kendo-ui/datepicker/keyboard-navigation

 Parse text to date:
  - http://www.datejs.com/

 Display date:
  - http://momentjs.com/

__Design__

 Change pallette to:
  - #F7F9FE
  - #ECF1F2
  - #DCE8EB
  - #CBDBE0 (previously selected)
  - #BED2D9

v0.0.5

 - [X] Performance optimize for drag&drop and list rendering
 - [X] Persistence in local storage
 - [X] Parse hashtags (contexts)
 - [X] Parse contacts (@ sign)
 - [X] Design update

v0.0.4

Features:

 - [X] Add notes
 - [X] Add _date start_, _date end_
 - [X] Add validation for dates (date start can't be after _date end_ and otherwise)
 - [X] Hints for dates and correct date confirmation with separate style
 - [X] Add icon for date when date exists
 - [X] Add separate style for expired _end date_
 - [X] View mode for notes with markdown

Fixes:

 - [X] Delete items with children doesn't set focus correctly
 - [X] For filtered view focus doesn't set by complete
 - [X] Add item replace existing todos

Shortcuts:

 - [X] N+N - Create note
 - [X] N+P - Preview note with markdown
 - [X] D+S - Shortcut for _Date Start_
 - [X] D+E - Shortcut for _Date Start_

Refactoring:

 - [X] Add mapping for shortcuts, maybe some kind of pattern matching

v0.0.3

 - [X] Update description on howto popup
 - [X] Howto popup added

Shortcuts:

 - [X] Exit from edit by Esc
 - [X] Ctrl+D - Duplicate
 - [X] Ctrl+C or Ctrl+X - Copy or Cut
 - [X] Ctrl+V - Paste below
 - [X] Ctrl+← - Move item on upper level
 - [X] Ctrl+→ - Make item child of previous item
 - [X] Ctrl+↑/Ctrl+↓ - Re-order list items
 - [X] Del - delete
 - [X] F2 - make edit
 - [X] Home/End - jump on top/end of list
 - [X] Enter - Add below
 - [X] Alt+Enter - Add item as child
 - [X] Tab/Shift+Tab - Previous/next
 - [X] Ctrl+Shift ← - Collapse all
 - [X] Ctrl+Shift → - Expand all
 - [X] Jump to parent by ←
 - [X] If item has children and closed, expand by →
 - [X] If item has children and open, collapse by ←
 - [X] If item has children and open, jump to first item by →


Fixes:

 - [X] Fix multiple selectTodo actions (probably can't be done because need process onFocus, onFocusOut events)
 - [X] Fix multiple flipTodo actions
 - [X] Fix critical issue with crashing browser
 - [X] Fix issue with missed parent for nested items
 - [X] For some reason after Del, Enter drop item (new ID should be generated according to max, not lengthr)


v0.0.2

 - [X] Left/right arrow keys for expand-collapse items with children


v0.0.1

 - [X] Fix editing in childrens
 - [X] Cover reducers with tests
 - [X] Drag into feature
