/**
 * Position from the right
 * @param {HTMLElement} elem 
 * @param {Number} pos 
 */
export function leftOfPos(elem, pos)
{
    elem.style.right = getMaxSize()[0] - pos + "px";
}

/**
 * Position from the bottom
 * @param {HTMLElement} elem 
 * @param {Number} pos 
 */
export function abovePos(elem, pos)
{
    elem.style.bottom = getMaxSize()[1] - pos + "px";
}

/**
 * Position from the top
 * @param {HTMLElement} elem 
 * @param {Number} pos 
 */
export function belowPos(elem, pos)
{
    elem.style.top = pos + "px";
}

/**
 * Position from the left
 * @param {HTMLElement} elem 
 * @param {Number} pos 
 */
export function rightOfPos(elem, pos)
{
    elem.style.left = pos + "px";
}

/** Get the computed size of an element
 * @param {HTMLElement} element 
 * @returns {[Number, Number]}
 */
export function getComputedSize(element)
{
    const style = getComputedStyle(element);
    const width = Number(style.width.slice(0, -2));
    const height = Number(style.height.slice(0, -2));
    return [width, height];
}

/** @return {[Number, Number]} */
export function getMaxSize()
{
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    return [width, height];
}