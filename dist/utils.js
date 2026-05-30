export function $(id) {
    const elem = document.getElementById(id);
    if (!elem) {
        throw new Error(`Element #${id} not found`);
    }
    return elem;
}
