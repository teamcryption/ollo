/**
 * Roller shutter: a shop front between two posts under a roll box, a
 * slatted shutter hanging in the opening, a counter inside. The pointer's
 * height on the front rolls the shutter up past it, so the shop shows
 * where you point. At rest the shutter hangs a third open, its lock bright.
 * The slider is how far the shutter may roll.
 *
 * The pattern: one continuous value read from the pointer (spring).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, seg, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 120, D = 16, H = 78, G = 3, PO = 7, REST = 0.34;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-10, -8, 0], [W + 10, D + 14, 0], [W + 10, -8, 0], [-10, D + 14, 0], [-3, -3, G + H + 14], [W + 3, D + 5, G + H + 14]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 2, b = 1.2, parent = g) => {
    const [ring, inner] = rings(x0, y0, x1, y1, r, b);
    const s = solid(parent); put(s, prism(P, front, ring, inner, z0, z1)); return s;
  };
  box(-10, -8, W + 10, D + 14, 0, G, 5, 2);
  box(0, 0, W, 3, G, G + H, 1.5, 0.8);
  // a door in the back wall, a shelf line
  mk("path", { class: "lo nf", d: poly([P(78, 3, G), P(102, 3, G), P(102, 3, G + 48), P(78, 3, G + 48)]) }, g);
  mk("path", { class: "lo nf", d: seg(P(PO + 4, 3, G + 52), P(70, 3, G + 52)) + seg(P(PO + 4, 3, G + 36), P(70, 3, G + 36)) }, g);
  box(18, 6, 62, 13, G, G + 24, 2, 1.2);
  box(0, 0, PO, D, G, G + H, 1.5, 0.8);
  const sh = mk("g", {}, g);
  const plate = mk("path", { class: "sil" }, sh), slats = mk("path", { class: "lo nf" }, sh), bar = mk("path", { class: "nf" }, sh);
  const lock = mk("circle", { r: 2.4, class: "dot" }, sh);
  box(W - PO, 0, W, D, G, G + H, 1.5, 0.8);
  box(-3, -3, W + 3, D + 5, G + H, G + H + 14, 3, 1.4);

  const zb = spring(H * REST);
  let last = NaN;
  function draw(z) {
    const r = Math.round(z * 10) / 10;
    if (r === last) return;
    last = r;
    const y = D - 1, x0 = PO, x1 = W - PO, b = G + r, t = G + H;
    plate.setAttribute("d", poly([P(x0, y, b), P(x1, y, b), P(x1, y, t), P(x0, y, t)]));
    let d = "";
    for (let s = t - 5; s > b + 4; s -= 5) d += seg(P(x0, y, s), P(x1, y, s));
    slats.setAttribute("d", d);
    bar.setAttribute("d", poly([P(x0, y + 0.6, b), P(x1, y + 0.6, b), P(x1, y + 0.6, b + 3), P(x0, y + 0.6, b + 3)]));
    const p = P(W / 2, y + 0.6, b + 1.5); lock.setAttribute("cx", p[0]); lock.setAttribute("cy", p[1]);
  }

  const B = register(stage, (dt) => { const m = stepS(zb, dt); draw(zb.x); return m; });
  bag.add(B.unregister);

  // the front face at rest never moves: read world x from screen x, then height
  const a0 = P(0, D, 0), a1 = P(W, D, 0), dz = P(0, D, 0)[1] - P(0, D, 1)[1];
  function hit([sx, sy]) {
    const u = (sx - a0[0]) / (a1[0] - a0[0]);
    if (u < 0.02 || u > 0.98) return null;
    const x = u * W, z = (P(x, D, G)[1] - sy) / dz;
    return z < -6 || z > H + 4 ? null : z;
  }
  let act = null;
  function set(z) {
    act = z;
    zb.t = z === null ? H * REST : clamp(z + 14, 6, H * reach);
    plate.classList.toggle("hi", z !== null);
    lock.setAttribute("class", z === null ? "dot" : "dot off");
    read.textContent = z === null ? "rest" : Math.round((zb.t / H) * 100) + "% up";
    B.wake();
  }
  set(null);
  bag.add(pointer(stage, { move: (p) => set(hit(p)), leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; if (act !== null) set(act); }, destroy: bag.dispose };
}

hairline({
  name: "shutterdoor",
  means: "A slatted roller shutter on a shop front: it rolls up past the pointer's height to show the counter inside.",
  rules: [1, 3, 5, 8],
  range: [40, 100, 100],
  tour: [[136, 193], [193, 144], [249, 155], null],
  mount,
});
