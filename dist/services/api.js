const API_URL = "https://tight-flower-d805.eweer.workers.dev";
export async function sendRosterData(payload) {
    return await fetch(API_URL, {
        redirect: "follow",
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload)
    });
}
