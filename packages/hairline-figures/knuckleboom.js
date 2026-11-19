/**
 * Knuckle boom crane truck: a flatbed truck with a loader crane on a column
 * behind the cab, its two arms folded up at rest. The pointer over the truck
 * unfolds it: the inner arm lowers back over the bed and the outer arm opens
 * at the knuckle, a hook dropping from its tip. At rest the outer arm is
 * bright. The slider is how far it unfolds.
 *
 * The pattern: one part answering (a single gesture on one machine).
 */
const {
  Cam, circ, fit, facing, fillet, hull, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PV = [92, 18, 34], L1 = 55, L2 = 60;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-24, -4, 0], [126, -4, 0], [126, 40, 0], [-24, 40, 0], [80, 18, 98], [-22, 27, 72]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (par, x0, y0, x1, y1, z0, z1, r = 2.5, b = 1.2) => { const s = solid(par); const [ri, ii] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, ri, ii, z0, z1)); return s; };
  const add = (a, d, k) => a.map((v, i) => v + d[i] * k);
  function bar(s, a, b, w, h) {
    const d0 = b.map((v, i) => v - a[i]), L = Math.hypot(...d0), d = d0.map((v) => v / L);
    const nl = Math.hypot(d[1], d[0]), n = [d[1] / nl, -d[0] / nl, 0];
    const u = [n[1] * d[2] - n[2] * d[1], n[2] * d[0] - n[0] * d[2], n[0] * d[1] - n[1] * d[0]];
    const pts = [];
    for (const e of [a, b]) for (const sn of [-1, 1]) for (const su of [-1, 1]) pts.push(P(...add(add(e, n, sn * w / 2), u, su * h / 2)));
    const hl = hull(pts);
    s.sil.setAttribute("d", poly(fillet(hl, hl.map(() => 2.5))));
    const a2 = add(add(a, d, 1.5), u, h / 2), b2 = add(add(b, d, -1.5), u, h / 2), q = w / 2 - 1.2;
    s.cr.setAttribute("d", poly([add(a2, n, q), add(b2, n, q), add(b2, n, -q), add(a2, n, -q)].map((p) => P(...p))));
  }
  function wheel(par, x, y0, y1, r) {
    const ring = circ(r, 28), pts = [];
    for (const y of [y0, y1]) for (const q of ring) pts.push(P(x + q.u, y, 8 + q.v));
    const s = solid(par);
    s.sil.setAttribute("d", poly(hull(pts)));
    s.cr.setAttribute("d", poly(circ(r - 3, 24).map((q) => P(x + q.u, y1, 8 + q.v))));
  }
  const body = mk("g", {}, g), top = mk("g", {}, g);
  box(body, 0, 0, 102, 36, 8, 16, 3, 1.4);
  box(body, 2, 2, 84, 34, 16, 19, 2, 1);
  box(body, 100, 1, 124, 35, 6, 38, 4, 1.6);
  box(body, 112, 4, 122, 32, 28, 36, 2, 1);
  for (const x of [18, 38, 110]) wheel(body, x, 30, 38, 8);
  box(top, 86, 10, 98, 26, 16, 22, 3, 1.2);
  box(top, 89, 13, 95, 23, 22, 34, 2.5, 1);
  const inner = solid(top), outer = solid(top), rope = mk("path", { class: "nf" }, top), hook = solid(top);
  outer.sil.classList.add("hi");

  const t = tween(0);
  let last = NaN;
  const dir = (a) => [-Math.cos(a * Math.PI / 180), 0, Math.sin(a * Math.PI / 180)];
  function draw(v) {
    if (v === last) return;
    last = v;
    const a1 = 80 - v * amp * 50, a2 = -80 + v * amp * 85;
    const K = add(PV, dir(a1), L1), K2 = [K[0], 26, K[2]], tip = add(K2, dir(a2), L2);
    bar(inner, add(PV, dir(a1), -4), add(K, dir(a1), 3), 8, 8);
    bar(outer, add(K2, dir(a2), -4), tip, 6.5, 6.5);
    const hz = Math.max(22, tip[2] - 8 - v * amp * 28), hx = tip[0] - 2 * Math.cos(a2 * Math.PI / 180);
    rope.setAttribute("d", seg(P(hx, 26, tip[2] - 2), P(hx, 26, hz + 6)));
    put(hook, prism(P, front, ...rings(hx - 3.5, 22.5, hx + 3.5, 29.5, 2, 1), hz, hz + 6));
  }

  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);

  let act = null;
  const label = () => Math.round(amp * 100) + "%";
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a ? 1 : 0, performance.now(), 0);
    read.textContent = a ? label() : "rest";
    B.wake();
  }
  const box2 = [[0, 0, 0], [124, 0, 0], [124, 38, 0], [0, 38, 0], [0, 0, 40], [124, 0, 40], [124, 38, 40], [0, 38, 40], [80, 18, 96]].map((p) => P(...p));
  const X0 = Math.min(...box2.map((p) => p[0])), X1 = Math.max(...box2.map((p) => p[0]));
  const Y0 = Math.min(...box2.map((p) => p[1])), Y1 = Math.max(...box2.map((p) => p[1]));
  const hit = ([sx, sy]) => sx > X0 && sx < X1 && sy > Y0 && sy < Y1;
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; if (act) read.textContent = label(); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "knuckleboom",
  means: "A loader crane truck: the knuckle boom folded behind the cab unfolds over the flatbed, both arms opening at the knuckle.",
  rules: [1, 3, 5, 8],
  range: [0.3, 0.9, 1],
  tour: [[233, 142], [170, 200], [300, 240], null],
  mount,
});
