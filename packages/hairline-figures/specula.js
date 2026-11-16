/**
 * Speculum tray: a covered instrument tray hinged on its back edge, two specula inside. Pointer over it swings the lid up; at rest it is ajar, the lid bright.
 */
const { Cam, fit, proj, hull, poly, open, mk, pointer, register, disposer, tween, tset, tval, tdone } = HL;
const BX = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
const RING = (c, u, v, r, n = 28) => Array.from({ length: n }, (_, i) => { const t = (i / n) * 2 * Math.PI, a = r * Math.cos(t), b = r * Math.sin(t); return [c[0] + u[0] * a + v[0] * b, c[1] + u[1] * a + v[1] * b, c[2] + u[2] * a + v[2] * b]; });
const CY = (cx, cy, r, z0, z1) => RING([cx, cy, z0], [1, 0, 0], [0, 1, 0], r).concat(RING([cx, cy, z1], [1, 0, 0], [0, 1, 0], r));
const ROT = (pts, o, ax, d) => { const a = (d * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a); return pts.map(([x, y, z]) => { const p = [x - o[0], y - o[1], z - o[2]]; let q; if (ax === "z") q = [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]; else if (ax === "y") q = [p[0] * c - p[2] * s, p[1], p[0] * s + p[2] * c]; else q = [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c]; return [q[0] + o[0], q[1] + o[1], q[2] + o[2]]; }); };
const TOP = [4, 5, 6, 7];

const N = 1, A0 = 0, A1 = 78, REST = [0.2], ANCH = [[25, 15, 10]], S = 3.75;
const BACK = [{ p: BX(0, 0, 0, 52, 32, 7), f: TOP }, { p: BX(2, 2, 6.9, 50, 30, 7), f: TOP, c: "nf lo" }];
const FRONT = [];
function MOV(_k, a) {
  const o = [0, 0, 7], R = (p) => ROT(p, o, "y", a);
  const lid = { p: R(BX(0, 0, 7, 52, 32, 11)), f: TOP, c: "sil hi" };
  const knob = { p: R(BX(40, 12, 11, 44, 20, 13)), f: TOP, c: "" };
  const ins = [
    { p: BX(10, 6, 7, 44, 11, 8.5), f: TOP, c: "" },
    { p: CY(42, 8.5, 3.5, 7, 9), c: "nf lo" },
    { p: BX(10, 20, 7, 44, 25, 8.5), f: TOP, c: "" },
    { p: CY(42, 22.5, 3.5, 7, 9), c: "nf lo" },
  ];
  return a > 45 ? [lid, knob].concat(ins) : ins.concat([lid, knob]);
}
const LABEL = (a, d) => (a < 0 ? "shut " : "open ") + d + "°";

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let sc = value / 100;
  const C = Cam(45, 0.5, S);
  const pts = [];
  BACK.concat(FRONT).forEach((pc) => pts.push(...pc.p));
  for (let k = 0; k < N; k++) for (const a of [A0, A1, A0 + (A1 - A0) * 1.3]) MOV(k, a).forEach((pc) => pts.push(...pc.p));
  fit(C, pts, 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  const paint = (el, fe, pc) => {
    const sp = pc.p.map((q) => P(...q));
    el.setAttribute("d", pc.line ? open(sp) : poly(hull(sp)));
    el.setAttribute("class", pc.c || "");
    fe.setAttribute("d", pc.f ? poly(pc.f.map((i) => sp[i])) : "");
  };
  const layer = (list) => list.map((pc) => { const el = mk("path", {}, g), fe = mk("path", { class: "nf lo" }, g); paint(el, fe, pc); return [el, fe]; });
  layer(BACK);
  const movers = [];
  for (let k = 0; k < N; k++) movers.push({ k, els: layer(MOV(k, A0)), tw: tween(REST[k]), last: NaN });
  layer(FRONT);
  const ang = (t) => A0 + (A1 - A0) * t * sc;
  function draw(m, t) {
    if (t === m.last) return;
    m.last = t;
    MOV(m.k, ang(t)).forEach((pc, i) => paint(m.els[i][0], m.els[i][1], pc));
  }
  let act = -2;
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const m of movers) { draw(m, tval(m.tw, now)); if (!tdone(m.tw, now)) moving = true; }
    read.textContent = act < 0 ? "rest" : LABEL(act, Math.round(ang(tval(movers[Math.max(act, 0)].tw, now))));
    return moving;
  });
  bag.add(B.unregister);
  const anch = ANCH.map((q) => P(...q));
  function hit([sx]) {
    if (N === 1) return 0;
    let best = 0, bd = Infinity;
    anch.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return best;
  }
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    movers.forEach((m, k) => {
      const d = Math.abs(k - a), t = a < 0 ? REST[k] : d === 0 ? 1 : d === 1 ? 0.3 : 0;
      tset(m.tw, t, now, from < 0 ? 0 : Math.abs(k - from) * 45);
      m.last = NaN;
    });
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sc = v / 100; movers.forEach((m) => { m.last = NaN; }); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "specula",
  means: "An instrument tray with two specula inside: the pointer swings its lid open on the back hinge.",
  rules: [1,5,6,8],
  range: [30, 100, 130],
  tour: [[205,215],[243,233],[183,203],null],
  mount,
});
