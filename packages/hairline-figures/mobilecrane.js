/**
 * Mobile crane: a truck crane on its carrier, cab at the front, turret at
 * the back and a telescopic boom lying low over the cab. The pointer over
 * the crane sets it up: the outriggers slide out to their pads, the boom
 * luffs up and its fly section telescopes out of the base. At rest the fly
 * section is bright. The slider is how far the boom goes.
 *
 * The pattern: one part answering (a single gesture on one machine).
 */
const {
  Cam, circ, fit, facing, fillet, hull, poly, prism, proj, rings, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PV = [22, 18, 30], L0 = 80;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-4, -36, 0], [124, -36, 0], [124, 72, 0], [-4, 72, 0], [60, 18, 128], [150, 18, 50]], 200, 170);
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
  // far outriggers, carrier, cab, wheels, near outriggers
  const farG = mk("g", {}, g), body = mk("g", {}, g), nearG = mk("g", {}, g), top = mk("g", {}, g);
  const outs = [];
  for (const x of [12, 96]) outs.push({ x, far: [solid(farG), solid(farG)], near: [solid(nearG), solid(nearG)] });
  box(body, 0, 0, 102, 36, 8, 17, 3, 1.4);
  box(body, 100, 1, 124, 35, 6, 36, 4, 1.6);
  box(body, 112, 4, 122, 32, 26, 34, 2, 1);
  for (const x of [26, 46, 80]) wheel(body, x, 30, 38, 8);
  wheel(body, 110, 30, 38, 8);
  box(top, 8, 4, 38, 32, 17, 27, 4, 1.4);
  const fly = solid(top), base = solid(top), rope = mk("path", { class: "nf" }, top), hook = solid(top);
  fly.sil.classList.add("hi");

  const t = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const o = 4 + v * amp * 22, ang = (12 + v * amp * 28) * Math.PI / 180, e = v * amp * 40;
    for (const it of outs) {
      bar(it.far[0], [it.x, 0, 7], [it.x, -o - 2, 7], 7, 5);
      put(it.far[1], prism(P, front, ...rings(it.x - 5, -o - 7, it.x + 5, -o + 3, 3, 1), 0, 3));
      bar(it.near[0], [it.x, 36, 7], [it.x, 38 + o, 7], 7, 5);
      put(it.near[1], prism(P, front, ...rings(it.x - 5, 33 + o, it.x + 5, 43 + o, 3, 1), 0, 3));
    }
    const d = [Math.cos(ang), 0, Math.sin(ang)];
    const tipE = 104 + e, tip = add(PV, d, tipE);
    bar(fly, add(PV, d, 40 + e), tip, 6.5, 6);
    bar(base, add(PV, d, -6), add(PV, d, L0), 10, 9);
    const hz = Math.max(14, tip[2] - 26 - v * amp * 20);
    rope.setAttribute("d", seg(P(tip[0], 18, tip[2] - 3), P(tip[0], 18, hz + 6)));
    put(hook, prism(P, front, ...rings(tip[0] - 3.5, 14.5, tip[0] + 3.5, 21.5, 2, 1), hz, hz + 6));
  }

  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a ? 1 : 0, performance.now(), 0);
    read.textContent = a ? Math.round(12 + amp * 28) + "°" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    return x > -10 && x < 140 && y > -40 && y < 80;
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; if (act) read.textContent = Math.round(12 + amp * 28) + "°"; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "mobilecrane",
  means: "A truck crane: the pointer sets it up, outriggers sliding out as the boom luffs up and its fly section telescopes out.",
  rules: [1, 3, 5, 8],
  range: [0.3, 0.9, 1],
  tour: [[251, 186], [190, 205], [290, 232], null],
  mount,
});
