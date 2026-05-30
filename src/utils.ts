export function $<T extends HTMLElement = HTMLElement>(id: string) : T {
    const elem = document.getElementById(id);
    if (!elem) {
        throw new Error(`Element #${id} not found`);
    }
    return elem as T;
}