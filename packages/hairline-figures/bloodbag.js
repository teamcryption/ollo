/**
 * Blood bag rack: a stand with a crossbar and three bags on hooks. The pointer picks a bag by where it stands: it swings out, its neighbours less. At rest the middle bag hangs out, bright.
 */
const { Cam, fit, proj, hull, poly, open, mk, pointer, register, disposer, tween, tset, tval, tdone } = HL;
const BX = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
const RING = (c, u, v, r, n = 28) => Array.from({ length: n }, (_, i) => { const t = (i / n) * 2 * Math.PI, a = r * Math.cos(t), b = r * Math.sin(t); return [c[0] + u[0] * a + v[0] * b, c[1] + u[1] * a + v[1] * b, c[2] + u[2] * a + v[2] * b]; });
const CY = (cx, cy, r, z0, z1) => RING([cx, cy, z0], [1, 0, 0], [0, 1, 0], r).concat(RING([cx, cy, z1], [1, 0, 0], [0, 1, 0], r));
const ROT = (pts, o, ax, d) => { const a = (d * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a); return pts.map(([x, y, z]) => { const p = [x - o[0], y - o[1], z - o[2]]; let q; if (ax === "z") q = [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]; else if (ax === "y") q = [p[0] * c - p[2] * s, p[1], p[0] * s + p[2] * c]; else q = [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c]; return [q[0] + o[0], q[1] + o[1], q[2] + o[2]]; }); };
const TOP = [4, 5, 6, 7];

const N = 3, A0 = 0, A1 = -40, REST = [0, 0.35, 0], ANCH = [[4, -24, 70], [4, 0, 70], [4, 24, 70]], S = 2.55;
const BACK = [
  { p: BX(-12, -12, 0, 12, 12, 3), f: TOP },
  { p: CY(0, 0, 1.5, 3, 92), c: "" },
  { p: BX(-1.5, -34, 90, 1.5, 34, 93), f: TOP },
];
const FRONT = [];
function MOV(k, a) {
  const y = (k - 1) * 24, o = [0, y, 89], R = (p) => ROT(p, o, "y", a);
  const bot = R([[3, y, 52]])[0], tip = R([[3, y, 38]])[0];
  return [
    { p: R([[0, y, 89], [3, y, 82]]), line: true, c: "nf lo" },
    { p: R(BX(1, y - 8, 52, 5, y + 8, 82)), f: [1, 2, 6, 5], c: "sil" + (k === 1 ? " hi" : "") },
    { p: [bot, tip], line: true, c: "nf" },
  ];
}
const LABEL = (a, d) => (a < 0 ? "rest" : "bag " + (a + 1)) + " " + Math.abs(d) + "°";

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let sc = value / 100;
  const C = Cam(45, 0.5, S);
  const pts = [];
  BACK.concat(FRONT).forEach((pc) => pts.push(...pc.p));
  for (let k = 0; k < N; k++) for (const a of [A0, A1]) MOV(k, a).forEach((pc) => pts.push(...pc.p));
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
  name: "bloodbag",
  means: "Three blood bags on a hanger: the bag under the pointer swings out on its hook, and its neighbours sway a little.",
  rules: [1,2,5,6],
  range: [30, 100, 130],
  tour: [[221,116],[179,160],[200,120],null],
  mount,
});
