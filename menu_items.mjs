import { abovePos, leftOfPos, rightOfPos, belowPos, getComputedSize, getMaxSize } from "./helpers.mjs"

/**
 * A simple option
 * @param {String} name
 * @param {VoidFunction} action
 * @param {String} icon_url 
 * @returns {HTMLElement}
 */
export function option(name, action=null, icon_url=null) {
    const simple_option = document.createElement("div");
    if (action) {
        simple_option.classList.add("clickable");
        simple_option.onclick = action;
    } 
    else simple_option.classList.add("disabled");
    simple_option.append(getIcon(icon_url), name);
    return simple_option;
}

export const hr = () => document.createElement("hr");

/**
 * A menu element with sub-elements
 * @param {String} name 
 * @param {HTMLElement[] | () => HTMLElement[]} list 
 * @param {String} icon_url
 * @param {undefined|VoidFunction} action
 */
export function subgroup(name, list, icon_url=null, action=undefined) {
    const option = document.createElement("div");
    option.append(getIcon(icon_url), name);
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
        option.parentElement.removeSubmenu = null;
        submenu?.remove();
        removeTimer = null;
        submenu = null;
    }
    const set_remove_timer = () => {
        removeTimer = setTimeout(remove_submenu, 1000);
    }
    const clear_remove_timer = () => {
        clearTimeout(removeTimer);
        removeTimer = null;
    }
    option.onmouseenter = () => {
        if (!submenu?.isConnected) {
            option.parentElement.removeSubmenu?.call();
            option.parentElement.removeSubmenu = remove_submenu;
            submenu = createSubmenu(option, list);
            submenu.onmouseenter = () => {
                option.parentElement.onmouseenter?.call();
                clear_remove_timer();
            }
            submenu.onmouseleave = () => {
                option.parentElement.onmouseleave?.call();
                set_remove_timer();
            }
        } else clear_remove_timer();
    };
    option.onmouseleave = set_remove_timer;
    return option;
}

function getIcon(icon_url) {
    if (icon_url) {
        const img = document.createElement("img");
        img.src = icon_url;
        img.alt = "";
        img.style.objectFit = "contain";
        img.style.width = "1em";
        img.style.height = "1em";
        img.style.marginRight = "5px";
        img.style.verticalAlign = "text-top";
        return img;
    } else {
        const placeholder = document.createElement("span");
        placeholder.style.display = "inline-block";
        placeholder.style.width = "calc(1em + 5px)";
        return placeholder;
    }
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