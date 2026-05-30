export interface Spot {
    id: number;
    label: string;
    rgbMask: [ number, number, number ]
}

export const spots: Spot[] = [
    { id: 1, label: "S1", rgbMask: [   0, 255,   0 ] },
    { id: 2, label: "S2", rgbMask: [ 255, 255,   0 ] },
    { id: 3, label: "S3", rgbMask: [ 255,   0, 255 ] },
    { id: 4, label: "S4", rgbMask: [   0, 255, 255 ] },
    { id: 5, label: "S5", rgbMask: [   0,   0, 255 ] },
    { id: 6, label: "S6", rgbMask: [ 255, 143,  68 ] },
    { id: 7, label: "S7", rgbMask: [ 255,   0,   0 ] },
    { id: 8, label: "S8", rgbMask: [   0,   0,   0 ] },
]