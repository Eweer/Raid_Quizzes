const API_URL = "https://tight-flower-d805.eweer.workers.dev";

export async function sendRosterData(payload: {
  playerName: string;
  group: number;
  role: string;
  spotLabel: string;
  spotId: string;
  posX: number;
  posY: number;
}) {
  return await fetch(API_URL, {
    redirect: "follow",
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(payload)
  });
}