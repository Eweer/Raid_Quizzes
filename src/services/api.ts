const WORKER_URL = "https://tight-flower-d805.eweer.workers.dev";

export async function sendRosterData(payload: {
	playerName: string;
	group: number;
	role: string;
	spotLabel: string;
	spotId: number;
	posX: number;
	posY: number;
}) {
	return await fetch(WORKER_URL, {
		redirect: "follow",
		method: "POST",
		mode: "no-cors",
		headers: { "Content-Type": "text/plain" },
		body: JSON.stringify(payload)
	});
}