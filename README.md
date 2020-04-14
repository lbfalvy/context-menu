# context-menu
An efficient, extensible and very flexible context menu for the web.
# Documentation
 - function `handler( ev: MouseEvent ): Promise`  
   Add this as a handlerto the `contextmenu` event on objects which should have a context menu.
 - event `menu`  
   This is the event for collecting menu items. If you need to do asynchronous work, you can 
   call `event.stopPropagation()` and re-dispatch the event later. There's a 5 seconds timeout from the calling
   of `handler` after which the menu opening fails automatically.  
    - `event.detail.options: HTMLElement[]`: Array for menu items, elements should append their actions to it.
 - function `showContextMenu( options: HTMLElement[], x: Number, y: NUmber )`  
   Show a context menu at given coordinates with given options.
 - function `option( name: String, action: VoidFunction ): HTMLElement`  
   Returns a basic row for the context menu, which which has `name` written on it and executes `action` on click
 - function `hr() : HTMLElement`  
   Returns a separator. (Literally just a `<hr/>`)
 - function `subgroup(name: String, list: HTMLElement[] | () => HTMLElement[], action?: VoidFunction ): HTMLElement`  
   Returns a submenu that has `name` written on it and executes `action` on click (if provided).
    - `list`: If this is an array, it is shown when hovering over the option. If it's a function, it's called every time
      when the submenu is rendered.
 - function `addMenuItems( element: HTMLElement, list: HTMLElement[] | () => HTMLElement[] )`  
   Adds a menu handler to `element` which renders a menu using `list`.
 - function `asyncMenuHandler( handler: {options: HTMLElement[]} => Promise ): CustomEventHandler`  
   Converts an async function into an async menu handler by stopping and re-dispatching the event.
 - function `addDropdown( element: HTMLElement, list: HTMLElement[] | () => HTMLElement[] )`
   Adds a dropdown context menu to an element. Can be used for a multilevel menubar for example.
