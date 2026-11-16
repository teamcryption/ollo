/**
 * Root cellar door: a low earth-and-stone mound with a vent pipe and a plank hatch over steps going down. The pointer's x swings the hatch open on its side hinge; at rest it is ajar, bright. The slider is how far it opens.
 *
 * The pattern: one part turning on a hinge, driven by the pointer's x (a continuous spring).
 */
const B = (x0, y0, z0, x1, y1, z1) => [x0, y0, z0, x1, y1, z1];
const S = 2.05, AX = "y", O = [22, 0, 14], LO = 0, REST = 30, RANGE = [60, 100, 115], SORT = false, UNIT = "°";
const PARTS = [
  { boxes: [B(0, 0, 0, 96, 76, 14)], cyl: [[84, 10, 3.5, 14, 36]] },
  { lines: [[[24, 18, 14], [72, 18, 14], [72, 58, 14], [24, 58, 14], [24, 18, 14]], [[26, 26, 12], [70, 26, 12]], [[26, 34, 10], [70, 34, 10]], [[26, 42, 8], [70, 42, 8]], [[26, 50, 6], [70, 50, 6]]] },
  { mv: 1, hi: 1, boxes: [B(22, 16, 14, 74, 60, 16.5), B(62, 34, 16.5, 66, 42, 19)], top: [[[35, 16, 16.5], [35, 60, 16.5]], [[48, 16, 16.5], [48, 60, 16.5]], [[61, 16, 16.5], [61, 60, 16.5]]] },
];
const TOUR = [[110,200],[217,190],[310,190],null];

const { Cam, circ, fit, facing, hull, open, poly, prism, proj, clamp, lerp, rad, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;
const FACES = [[0, 2, 3, 1], [4, 5, 7, 6], [0, 4, 6, 2], [1, 3, 7, 5], [0, 1, 5, 4], [2, 6, 7, 3]];
const corners = (b) => [0, 1, 2, 3, 4, 5, 6, 7].map((i) => [b[i & 1 ? 3 : 0], b[i & 2 ? 4 : 1], b[i & 4 ? 5 : 2]]);
const area = (q) => { let s = 0; for (let i = 0; i < q.length; i++) { const a = q[i], b = q[(i + 1) % q.length]; s += a[0] * b[1] - b[0] * a[1]; } return s; };
function turn(p, ax, o, a) {
  const c = Math.cos(a), s = Math.sin(a), [i, j] = ax === "x" ? [1, 2] : ax === "y" ? [0, 2] : [0, 1];
  const q = p.slice(), di = p[i] - o[i], dj = p[j] - o[j];
  q[i] = o[i] + di * c - dj * s; q[j] = o[j] + di * s + dj * c;
  return q;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, S);
  const pose = (pt, part, a) => (part.mv ? turn(pt, AX, O, rad(a + (part.off || 0))) : pt);
  const ext = [];
  for (const part of PARTS) for (const a of [LO, RANGE[2], REST, (LO + RANGE[2]) / 2]) {
    for (const b of part.boxes || []) corners(b).forEach((c) => ext.push(pose(c, part, a)));
    for (const l of part.lines || []) l.forEach((c) => ext.push(pose(c, part, a)));
  }
  fit(C, ext, 200, 162);
  const P = proj(C), front = facing(C);
  const vis = Math.sign(area(FACES[1].map((i) => P(...corners(B(0, 0, 0, 1, 1, 1))[i]))));
  const g = mk("g", {}, svg), live = [];
  let run = null;
  for (const part of PARTS) {
    let host = g;
    if (part.mv) { if (!run) run = mk("g", {}, g); host = run; } else run = null;
    const pg = mk("g", {}, host), el = { part, pg, sils: [], faces: [], lines: [], run: host };
    for (const [x, y, r, z0, z1] of part.cyl || []) {
      const at = (rr) => circ(rr, 36).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
      put(solid(pg), prism(P, front, at(r), at(r - 1), z0, z1));
    }
    for (const l of part.lines || []) el.lines.push(mk("path", { class: part.lcls || "lo nf" }, pg));
    for (const b of part.boxes || []) { el.sils.push(mk("path", { class: "sil" }, pg)); el.faces.push(mk("path", { class: "nf lo" }, pg)); }
    for (const l of part.top || []) el.lines.push(mk("path", { class: "lo nf" }, pg));
    live.push(el);
  }
  function draw(el, a) {
    const part = el.part, ls = (part.lines || []).concat(part.top || []);
    ls.forEach((l, k) => el.lines[k].setAttribute("d", open(l.map((c) => P(...pose(c, part, a))))));
    (part.boxes || []).forEach((b, k) => {
      const q = corners(b).map((c) => P(...pose(c, part, a)));
      el.sils[k].setAttribute("d", poly(hull(q)));
      el.faces[k].setAttribute("d", FACES.map((f) => f.map((i) => q[i])).filter((f) => Math.sign(area(f)) === vis).map(poly).join(""));
    });
  }
  function order(a) {
    if (!SORT) return;
    const runs = new Set(live.filter((e) => e.part.mv).map((e) => e.run));
    for (const r of runs) {
      const els = live.filter((e) => e.run === r).map((e) => { const c = pose(e.part.c, e.part, a); return [c[0] + c[1], e]; });
      els.sort((u, v) => u[0] - v[0]).forEach(([, e]) => r.appendChild(e.pg));
    }
  }
  live.forEach((el) => draw(el, REST));
  order(REST);
  const sp = spring(REST);
  let last = REST;
  const L = register(stage, (dt) => {
    const moving = stepS(sp, dt);
    if (sp.x !== last) {
      last = sp.x;
      for (const el of live) if (el.part.mv) draw(el, sp.x);
      order(sp.x);
    }
    return moving;
  });
  bag.add(L.unregister);
  live.forEach((el) => el.part.hi && el.sils.forEach((s) => s.classList.add("hi")));
  function aim(t) {
    sp.t = t === null ? REST : lerp(LO, reach, clamp((t - 70) / 260, 0, 1));
    read.textContent = t === null ? "rest" : Math.round(sp.t) + UNIT;
    L.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: (p) => aim(p[0]), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "rootcellar",
  means: "A root cellar in a low mound: the pointer swings its plank hatch open on a side hinge to show the steps going down.",
  rules: [1, 3, 4, 5, 6],
  range: [60, 100, 115],
  tour: [[110,200],[217,190],[310,190],null],
  mount,
});
