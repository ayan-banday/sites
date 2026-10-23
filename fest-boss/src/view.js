// Logical game resolution. Height is fixed; width follows the screen's long side so phones
// held sideways fill edge to edge (picked once at boot; letterbox covers later resizes).
const long = Math.max(window.innerWidth, window.innerHeight);
const short = Math.max(1, Math.min(window.innerWidth, window.innerHeight));

export const H = 180;
export const W = Math.max(320, Math.min(400, Math.round((H * long) / short / 2) * 2));
