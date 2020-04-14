import { abovePos, leftOfPos, rightOfPos, belowPos, getComputedSize, getMaxSize } from "./helpers.mjs"

/**
 * contextmenu event handler
 * @param {MouseEvent} ev
 */
export async function handler(ev) {
    ev.preventDefault();
    const options = await makeContextMenu(ev.target);
    showContextMenu(options, ev.clientX, ev.clientY);
}

/** Convert an asynchronous function into an event handler
 * Useful for when you want to fetchmenu elements over the network.
 * @param {(x:CustomEventInit) => Promise} handler 
 * @returns {(ev:CustomEvent) => Promise}
 */
export function asyncMenuHandler(handler) {
    return async ev => {
        ev.stopPropagation();
        await handler(ev.detail);
        ev.currentTarget.parentElement.dispatchEvent(menuEvent(ev.detail));
    }
}

/**
 * 
 * @param {HTMLElement} element 
 * @param {HTMLElement[] | () => HTMLElement[]} list 
 */
export function addMenuItems(element, list) {
    var handler;
    if (typeof list == "function")
        handler = ev => ev.detail.options.push(...list());
    else handler = ev => ev.detail.options.push(...list);
    element.addEventListener("menu", handler);
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
    const build_menu_event = menuEvent(detail);
    const root = element.getRootNode({ composed: true });
    const p = new Promise((res, rej) => {
        root.addEventListener( "menu", ev => res(ev.detail.options), {once:true} );
        setTimeout(rej, 5000);
    });
    element.dispatchEvent(build_menu_event);
    return p;
}

/** @param {CustomEventInit} detail */
function menuEvent(detail) {
    return new CustomEvent("menu", { bubbles: true, detail });
}