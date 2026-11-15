/**
 * Mine cart: a tapered ore cart heaped with coal, standing on a short run of
 * track, rails on sleepers. The pointer picks a spot along the track and the
 * cart rolls there, wheels and all. At rest it waits near the far end of the
 * track, bright. The slider is how stiffly it rolls.
 */
const { Cam, clamp, facing, fit, hull, poly, prism, proj, rings, spring, stepS, unproj, disposer, mk, pointer, put, register, solid } = HL;

const LX = 96, Y0 = 0, Y1 = 20, REST = 18, XMIN = 14, XMAX = 82;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[0, -2, 0], [LX, Y1 + 2, 0], [LX, -2, 0], [0, Y1 + 2, 0], [XMIN, 10, 28], [XMAX, 10, 28]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  function box(s, x0, y0, x1, y1, z0, z1, r, b) { const [a, i] = rings(x0, y0, x1, y1, r || 0.6, b || 0.3); put(s, prism(P, front, a, i, z0, z1)); }

  for (let x = 4; x < LX; x += 11) { const s = solid(g); box(s, x - 2.5, -2, x + 2.5, Y1 + 2, 0, 1.5); }
  [4, 16].forEach((y) => { const s = solid(g); box(s, 0, y - 0.8, LX, y + 0.8, 1.5, 3); });
  const farW = [0, 1].map(() => mk("path", { class: "sil" }, g));
  const heap = mk("path", { class: "sil" }, g);
  const body = mk("path", { class: "sil" }, g), rim = mk("path", { class: "nf lo" }, g);
  const nearW = [0, 1].map(() => mk("path", { class: "sil" }, g));
  const hubs = mk("path", { class: "nf lo" }, g);

  const pos = spring(REST, { k: value, c: 2 * Math.sqrt(value) * 0.9 });
  let last = NaN;
  function wheel(cx, y) { const r = []; for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2; r.push(P(cx + 4 * Math.cos(a), y, 7 + 4 * Math.sin(a))); } return poly(r); }
  function draw(c) {
    if (c === last) return; last = c;
    farW.forEach((w, k) => w.setAttribute("d", wheel(c + (k ? 7 : -7), 3)));
    const pts = [];
    [[-9, 3, 17, 6], [-13, 0, 20, 20]].forEach(([dx, y0, y1, z]) => { pts.push(P(c + dx, y0, z), P(c - dx, y0, z), P(c + dx, y1, z), P(c - dx, y1, z)); });
    body.setAttribute("d", poly(hull(pts)));
    const top = [P(c - 13, 0, 20), P(c + 13, 0, 20), P(c + 13, 20, 20), P(c - 13, 20, 20)];
    rim.setAttribute("d", poly(top));
    const hp = [];
    for (let i = 0; i <= 12; i++) { const u = i / 12; hp.push(P(c - 11 + 22 * u, 10, 20 + 7 * Math.sin(Math.PI * u) + (i % 3 === 1 ? 1.5 : 0))); }
    hp.push(P(c + 12, 18, 20), P(c - 12, 18, 20), P(c - 12, 2, 20), P(c + 12, 2, 20));
    heap.setAttribute("d", poly(hull(hp)));
    nearW.forEach((w, k) => w.setAttribute("d", wheel(c + (k ? 7 : -7), 17)));
    const a = -(c - REST) / 4;
    hubs.setAttribute("d", [-7, 7].map((dx) => { const p = P(c + dx, 17, 7), q = P(c + dx + 3.5 * Math.cos(a), 17, 7 + 3.5 * Math.sin(a)); return "M" + p + "L" + q; }).join(""));
  }
  const B = register(stage, (dt) => { const m = stepS(pos, dt); draw(pos.x); return m; });
  bag.add(B.unregister);

  let act = null;
  function set(x) {
    if (x === act) return; act = x;
    pos.t = x === null ? REST : x;
    body.classList.toggle("hi", true);
    read.textContent = x === null ? "rest" : "m " + Math.round(x);
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 12);
    if (x < -6 || x > LX + 6 || y < -14 || y > Y1 + 12) return null;
    return Math.round(clamp(x, XMIN, XMAX));
  }
  set(null); draw(REST);
  bag.add(pointer(stage, { move: (p) => set(hit(p)), leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { pos.k = v; pos.c = 2 * Math.sqrt(v) * 0.9; }, destroy: bag.dispose };
}

hairline({
  name: "coalcart",
  means: "A coal-heaped mine cart on a run of track: it rolls along the rails to the spot the pointer picks.",
  rules: [1, 3, 5, 6],
  range: [30, 80, 160],
  tour: [[243, 174], [150, 128], [200, 152], null],
  mount,
});
