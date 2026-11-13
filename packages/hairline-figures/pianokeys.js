/**
 * Piano keys: two octaves of a keyboard in its case, fourteen white keys and
 * ten raised black ones between a back panel and two end cheeks. The pointer
 * plays: the keys near it press down, each on its own spring, the one under it
 * deepest and bright. At rest a chord is held, its middle key bright. The
 * slider is the reach, in key widths.
 *
 * The pattern: a continuous field (terrain) along one row; the hit is on the
 * plane of the keys' resting tops, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NW = 14, WW = 9, GAP = 0.8, L = 48, KH = 8, DW = 5.2, DB = 3.6;
const BLK = [0, 1, 3, 4, 5], BWD = 5, BL = 30, BH = 6;
const X1 = NW * WW, BACK = -20, PH = KH + 13;
const NOTE = ["C", "D", "E", "F", "G", "A", "B"], SHARP = ["C#", "D#", "", "F#", "G#", "A#"];
const CHORD = { w7: 0.75, w9: 1, w11: 0.75 }, FAV = "w9";
const falloff = (u) => (u <= 0 ? 1 : u <= 0.45 ? 1 - (u / 0.45) * 0.62 : u <= 1 ? 0.38 - ((u - 0.45) / 0.55) * 0.38 : 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value * WW, over = null;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-6, BACK, -6], [X1 + 6, L + 3, -6], [X1 + 6, BACK, -6], [-6, L + 3, -6], [-6, BACK, PH], [X1 + 6, BACK, PH]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1, el = solid(g)) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(el, prism(P, front, o, i, z0, z1)); return el; };

  // the case: a base, the back panel with its knobs and a slot, and the far cheek
  block(-6, BACK, X1 + 6, L + 3, 3, 1.2, -6, 0);
  const panel = block(-6, BACK, X1 + 6, -1.5, 3, 1.4, 0, PH);
  mk("path", { class: "nf lo", d: seg(P(30, BACK + 9, PH), P(X1 - 30, BACK + 9, PH)) + seg(P(30, BACK + 12, PH), P(X1 - 30, BACK + 12, PH)) }, panel.g);
  for (const kx of [10, 19]) put(solid(g), prism(P, front, circ(2.8, 24).map((q) => ({ ...q, u: q.u + kx, v: q.v + BACK + 10 })), circ(1.8, 24).map((q) => ({ ...q, u: q.u + kx, v: q.v + BACK + 10 })), PH, PH + 2.4));
  block(-6, -1.5, -1, L + 3, 1.6, 0.6, 0, KH + 5);

  // white keys far to near, then the black keys over them
  const keys = [];
  for (let k = 0; k < NW; k++) {
    const x0 = k * WW + GAP / 2, x1 = (k + 1) * WW - GAP / 2;
    keys.push({ id: "w" + k, cx: (x0 + x1) / 2, y1: L, z0: 0, z1: KH, dmax: DW, x0, x1, b: 0.8, el: solid(g), name: NOTE[k % 7] + (3 + Math.floor(k / 7)) });
  }
  for (let k = 0; k < NW - 1; k++) {
    if (!BLK.includes(k % 7)) continue;
    const cx = (k + 1) * WW;
    keys.push({ id: "b" + k, cx, y1: BL, z0: KH - 0.5, z1: KH + BH, dmax: DB, x0: cx - BWD / 2, x1: cx + BWD / 2, b: 0.7, el: solid(g), name: SHARP[k % 7] + (3 + Math.floor(k / 7)) });
  }
  for (const key of keys) {
    [key.ring, key.inner] = rings(key.x0, 0, key.x1, key.y1, 1.2, key.b);
    key.rest = (CHORD[key.id] || 0) * key.dmax * 0.7;
    key.sp = spring(key.rest, { eps: 0.02 });
    key.drawn = NaN;
  }
  block(X1 + 1, -1.5, X1 + 6, L + 3, 1.6, 0.6, 0, KH + 5);

  function draw(key) {
    const d = clamp(key.sp.x, 0, key.dmax);
    if (d === key.drawn) return;
    key.drawn = d;
    put(key.el, prism(P, front, key.ring, key.inner, key.z0 - d, key.z1 - d));
  }
  const B = register(stage, (dt) => {
    let m = false;
    for (const key of keys) { if (stepS(key.sp, dt)) m = true; draw(key); }
    return m;
  });
  bag.add(B.unregister);

  /** The key under a point of the keys' resting top plane: a black key on its stretch, else the white key below it. */
  function under([x, y]) {
    if (y < BL + 1) { const b = keys.find((k) => k.id[0] === "b" && x >= k.x0 - 0.6 && x <= k.x1 + 0.6); if (b) return b; }
    return keys[clamp(Math.floor(x / WW), 0, NW - 1)];
  }

  function retarget() {
    const hit = over ? under(over) : null;
    for (const key of keys) {
      if (!over) key.sp.t = key.rest;
      else key.sp.t = key === hit ? key.dmax : key.dmax * 0.8 * falloff(Math.abs(key.cx - over[0]) / RAD);
      key.el.sil.classList.toggle("hi", over ? key === hit : key.id === FAV);
    }
    read.textContent = hit ? "key " + hit.name : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], KH);
      over = x > -3 && x < X1 + 3 && y > -6 && y < L + 14 ? [clamp(x, 0, X1 - 0.01), y] : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { RAD = v * WW; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "pianokeys",
  means: "Two octaves of piano keys in a case: the keys near the pointer press down, the one under it deepest.",
  rules: [1, 3, 5, 9],
  range: [1, 2, 3.5],
  tour: [[120, 152], [189, 168], [275, 200], null],
  mount,
});
