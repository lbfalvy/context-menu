import { abovePos, leftOfPos, rightOfPos, belowPos, getComputedSize, getMaxSize } from "./helpers.mjs"

/**
 * A simple option
 * @param {String} name 
 * @param {VoidFunction} action 
 */
export function option(name, action=null) {
    const simple_option = document.createElement("div");
    if (action) {
        simple_option.classList.add("clickable");
        simple_option.onclick = action;
    } 
    else simple_option.classList.add("disabled");
    simple_option.textContent = name;
    return simple_option;
}

export const hr = () => document.createElement("hr");

/**
 * A menu element with sub-elements
 * @param {String} name 
 * @param {HTMLElement[] | () => HTMLElement[]} list 
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
    const remove_submenu = () => {
        clear_remove_timer();
        submenu?.removeSubmenu?.call();
        submenu?.remove();
        removeTimer = null;
        submenu = null;
    }
    const set_remove_timer = () => {
        option.parentElement.onmouseleave?.call();
        removeTimer = setTimeout(remove_submenu, 1000);
    }
    const clear_remove_timer = () => {
        option.parentElement.onmouseenter?.call();
        clearTimeout(removeTimer);
        removeTimer = null;
    }
    option.onmouseenter = () => {
        if (!submenu?.isConnected) {
            option.parentElement.removeSubmenu?.call();
            option.parentElement.removeSubmenu = remove_submenu;
            submenu = createSubmenu(option, list);
            submenu.onmouseenter = clear_remove_timer;
            submenu.onmouseleave = set_remove_timer;
        } else clear_remove_timer();
    };
    option.onmouseleave = set_remove_timer;
    return option;
}

/**
 * Construct and position a submenu by an item from an elements callback
 * @param {HTMLElement} parentElement 
 * @param {HTMLElement[] | () => HTMLElement[]} list 
 */
function createSubmenu(parentElement, list)
{
    // === Create new submenu ===
    const submenu = document.createElement("div");
    submenu.classList.add("context-menu");
    if (typeof list == "function")
        submenu.append(...list());
    else submenu.append(...list);
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