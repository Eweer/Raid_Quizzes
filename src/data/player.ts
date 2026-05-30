export interface Player {
	name: string;
	group: 1 | 2 | 3 | 4;
	role: "Tank" | "Healer" | "Melee" | "Ranged";
	isMobile: boolean;
}

export const players: Player[] = [
	{ name: "Bloodbornd",   group: 1, role: "Tank",   isMobile: false },
	{ name: "Cocorota",     group: 1, role: "Melee",  isMobile: false },
	{ name: "Teese",        group: 1, role: "Melee",  isMobile: false },
	{ name: "Garrïdan",     group: 1, role: "Melee",  isMobile: false },
	{ name: "Bunnyson",     group: 1, role: "Healer", isMobile: false },
	{ name: "Rinók",        group: 2, role: "Ranged", isMobile: false },
	{ name: "Zopenric",     group: 2, role: "Melee",  isMobile: false },
	{ name: "Nyldur",       group: 2, role: "Melee",  isMobile: false },
	{ name: "Barrydruid",   group: 2, role: "Healer", isMobile: false },
	{ name: "Géodes",       group: 2, role: "Healer", isMobile: false },
	{ name: "Demiân",       group: 3, role: "Ranged", isMobile: false },
	{ name: "Spaceypriest", group: 3, role: "Ranged", isMobile: false },
	{ name: "Shadraen",     group: 3, role: "Melee",  isMobile: false },
	{ name: "Kaiserto",     group: 3, role: "Ranged", isMobile: false },
	{ name: "Minarete",     group: 3, role: "Healer", isMobile: false },
	{ name: "Cooldan",      group: 4, role: "Ranged", isMobile: false },
	{ name: "Zylua",        group: 4, role: "Ranged", isMobile: false },
	{ name: "Brewcarry",    group: 4, role: "Tank",   isMobile: false },
	{ name: "Dellilah",     group: 4, role: "Healer", isMobile: false },
	{ name: "Okito",        group: 4, role: "Healer", isMobile: false },
];
