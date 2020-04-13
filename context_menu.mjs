/**
 * contextmenu event handler
 * @param {MouseEvent} ev
 */
export async function handler(ev) {
    ev.preventDefault();
    const options = await makeContextMenu(ev.target);
    showContextMenu(options, ev.clientX, ev.clientY);
}

/**
 * A simple option
 * @param {String} name 
 * @param {VoidFunction} action 
 */
export function option(name, action) {
    const simple_option = document.createElement("div");
    simple_option.classList.add("clickable")
    simple_option.textContent = name;
    simple_option.onclick = action;
    return simple_option;
}

export const hr = () => document.createElement("hr");

/**
 * A menu element with sub-elements
 * @param {String} name 
 * @param {() => HTMLElement[]} list 
 * @param {undefined|VoidFunction} action
 */
export function subgroup(name, list, action=undefined) {
    const option = document.createElement("div");
    option.textContent = name;
    option.classList.add("subgroup");
    if (action) {
        option.classList.add("clickable");
        option.onclick = action;
    }
    /** @type {HTMLElement} */
    var submenu = null;
    /** @type {Number} */
    var removeTimer = null;
    const removeSubmenu = () => {
        clearRemoveTimer();
        submenu?.remove();
        removeTimer = null;
        submenu = null;
    }
    const setRemoveTimer = () => {
        removeTimer = setTimeout(removeSubmenu, 1000);
    }
    const clearRemoveTimer = () => {
        clearTimeout(removeTimer);
        removeTimer = null;
    }
    option.onmouseenter = () => {
        if (!submenu?.isConnected) {
            option.parentElement.removeSubmenu?.call();
            option.parentElement.removeSubmenu = removeSubmenu;
            submenu = createSubmenu(option, list);
            submenu.onmouseenter = clearRemoveTimer;
            submenu.onmouseleave = setRemoveTimer;
        } else clearRemoveTimer();
    };
    option.onmouseleave = setRemoveTimer;
    return option;
}

/**
 * Show a menu.
 * @param {Array<HTMLElement>} options 
 * @param {Number} x 
 * @param {Number} y 
 */
export function showContextMenu(options, x, y) {
    document.getElementById("context-menu")?.remove();
    const menu = document.createElement("div");
    menu.id = "context-menu";
    menu.classList.add("context-menu");
    menu.append(...options);
    document.body.append(menu);
    CloseOnInput(menu);
    const [width, height] = getComputedSize(menu);
    const [max_width, max_height] = getMaxSize();
    if (x + width > max_width)
        leftOfPos(menu, x);
    else rightOfPos(menu, x);
    if (y + height > max_height)
        abovePos(menu, y);
    else belowPos(menu, y);
}

/**
 * Construct and position a submenu by an item from an elements callback
 * @param {HTMLElement} parentElement 
 * @param {() => HTMLElement[]} list 
 */
function createSubmenu(parentElement, list)
{
    // === Create new submenu ===
    const submenu = document.createElement("div");
    submenu.classList.add("context-menu");
    submenu.append(...list());
    document.body.append(submenu);
    // === Positioning ===
    const parent_rect = parentElement.getBoundingClientRect();
    const [width, height] = getComputedSize(submenu);
    const [max_width, max_height] = getMaxSize();
    if (parent_rect.right + width > max_width)
        leftOfPos(submenu, parent_rect.left-1);
    else rightOfPos(submenu, parent_rect.right+1);
    if (parent_rect.top + height > max_height)
        abovePos(submenu, parent_rect.bottom+1);
    else belowPos(submenu, parent_rect.top-1);
    return submenu;
}

function CloseOnInput(menu) {
    const close = () => {
        menu.removeSubmenu?.call();
        menu.remove();
        document.removeEventListener( "keydown", close_on_esc );
        document.removeEventListener( "click", close );
        document.removeEventListener( "contextmenu", close );
    }
    const close_on_contextmenu = () => {
        document.addEventListener( "contextmenu", close );
    }
    const close_on_esc = ev => {
        if (ev.key != "Escape") return;
        close();
    };
    document.addEventListener( "contextmenu", close_on_contextmenu, {once:true} );
    document.addEventListener( "click", close );
    document.addEventListener( "keydown", close_on_esc );
}

/**
 * Construct a context menu
 * @param {HTMLElement} element 
 * @returns {Promise<Array>}
 * @async
 */
function makeContextMenu(element) {
    const detail = { options: [] }
    const build_menu_event = new CustomEvent("menu", { bubbles: true, detail });
    const root = element.getRootNode({ composed: true });
    const p = new Promise((res, rej) => {
        root.addEventListener( "menu", ev => res(detail.options), {once:true} );
        setTimeout(rej, 5000);
    });
    element.dispatchEvent(build_menu_event);
    return p;
}

/**
 * Position from the right
 * @param {HTMLElement} elem 
 * @param {Number} pos 
 */
function leftOfPos(elem, pos)
{
    elem.style.right = getMaxSize()[0] - pos + "px";
}

/**
 * Position from the bottom
 * @param {HTMLElement} elem 
 * @param {Number} pos 
 */
function abovePos(elem, pos)
{
    elem.style.bottom = getMaxSize()[1] - pos + "px";
}

/**
 * Position from the top
 * @param {HTMLElement} elem 
 * @param {Number} pos 
 */
function belowPos(elem, pos)
{
    elem.style.top = pos + "px";
}

/**
 * Position from the left
 * @param {HTMLElement} elem 
 * @param {Number} pos 
 */
function rightOfPos(elem, pos)
{
    elem.style.left = pos + "px";
}

/** Get the computed size of an element
 * @param {HTMLElement} element 
 * @returns {[Number, Number]}
 */
function getComputedSize(element)
{
    const style = getComputedStyle(element);
    const width = Number(style.width.slice(0, -2));
    const height = Number(style.height.slice(0, -2));
    return [width, height];
}

/** @return {[Number, Number]} */
function getMaxSize()
{
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    return [width, height];
}