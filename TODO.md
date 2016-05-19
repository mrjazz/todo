TODO
----

Refactoring:

 - [ ] Move functionality from shortcut mapping to reducer
 - [ ] Make Items list more lightweight, move out shortcut handlers
 - [X] Add mapping for shortcuts, maybe some kind of pattern matching
 - [ ] Caching for cur items

Fixes:

 - [X] Fix multiple selectTodo actions (probably can't be done because need process onFocus, onFocusOut events)
 - [X] Fix multiple flipTodo actions
 - [X] Fix critical issue with crashing browser
 - [X] Fix issue with missed parent for nested items
 - [X] For some reason after Del, Enter drop item (new ID should be generated according to max, not lengthr)

Add new shortcuts:
 - [ ] Ctrl+F - Search
 - [ ] ? - Help
 - [ ] Set colors by 1..6 keys
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

Features:

 - [ ] Add description
 - [ ] Add notes in right panel
 - [ ] Add date start, date end in right panel
 - [ ] Parse hashtags
 - [ ] Create _todo next_ view
 - [ ] Update description on howto popup

 - [X] Howto popup added

v0.0.2

 - [X] Left/right arrow keys for expand-collapse items with children

v0.0.1

 - [X] Fix editing in childrens
 - [X] Cover reducers with tests
 - [X] Drag into feature
