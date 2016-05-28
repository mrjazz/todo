TODO
----


Refactoring:

 - [ ] Move functionality from shortcut mapping to reducer
 - [ ] Make Items list more lightweight, move out shortcut handlers
 - [X] Add mapping for shortcuts, maybe some kind of pattern matching
 - [ ] Caching for cur items


Fixes:

 - [X] Delete items with children doesn't set focus correctly
 - [X] For filtered view focus doesn't set by complete
 - [X] Add item replace existing todos

Add new shortcuts:

 - [ ] Ctrl+→ - Display note for items with hidden note
 - [ ] Ctrl+← - Hide note for items with visible note
 - [X] D+S - Shortcut for _Date Start_
 - [X] D+E - Shortcut for _Date Start_
 - [ ] Ctrl+F - Search
 - [ ] ? - Help
 - [ ] Set colors by 1..6 keys

Features:

 - [X] Add notes
 - [X] Add date start, date end
 - [ ] View mode for notes with markdown
 - [ ] Parse hashtags
 - [ ] Create _todo next_ view
 - [ ] Add animation for deleted item
 - [ ] After research add visual calendar as option for date selection
 - [ ] Calendar research. Options are:

   - https://vitalets.github.io/bootstrap-datepicker/
   - http://amsul.ca/pickadate.js/date/
   - http://demos.telerik.com/kendo-ui/datepicker/keyboard-navigation

 Parse text to date:
  - http://www.datejs.com/

 Display date:
  - http://momentjs.com/


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
