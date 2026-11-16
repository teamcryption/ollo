/**
 * pH meter: a pen meter with its glass probe held over a beaker.
 * The pointer near it tilts the pen upright and dips the probe into the beaker.
 * At rest it leans over the rim, bright. The slider is how deep it dips.
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

let FR = [0.7, 0.7];
const cl = (v, a, b) => Math.max(a, Math.min(b, v));
const cyl = (x, y, r, z0, z1, n = 20) => { const o = []; for (let i = 0; i < n; i++) { const a = (i / n) * 2 * Math.PI; o.push([x + r * Math.cos(a), y + r * Math.sin(a), z0], [x + r * Math.cos(a), y + r * Math.sin(a), z1]); } return o; };
const loop = (x, y, r, z, n = 24) => { const o = []; for (let i = 0; i < n; i++) { const a = (i / n) * 2 * Math.PI; o.push([x + r * Math.cos(a), y + r * Math.sin(a), z]); } return o; };
const box = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
function rot(q, o, d, a) {
  const [x, y, z] = [q[0] - o[0], q[1] - o[1], q[2] - o[2]], c = Math.cos(a), s = Math.sin(a), k = d[0] * x + d[1] * y + d[2] * z;
  return [o[0] + x * c + (d[1] * z - d[2] * y) * s + d[0] * k * (1 - c), o[1] + y * c + (d[2] * x - d[0] * z) * s + d[1] * k * (1 - c), o[2] + z * c + (d[0] * y - d[1] * x) * s + d[2] * k * (1 - c)];
}

const RANGE = [14, 22, 26], REST = 0.1, CEN = [0, 0, 40];
function build(t, amp) {
  const tip = [10 * (1 - t), 0, 36 - amp * t], a = (1 - t) * 34 * (Math.PI / 180);
  const m = (q) => rot([q[0] + tip[0], q[1] + tip[1], q[2] + tip[2]], tip, [0, 1, 0], a);
  const f0 = Math.atan2(FR[1], FR[0]), fw = [];
  for (let i = 0; i <= 16; i++) { const b = f0 - Math.PI / 2 + (i / 16) * Math.PI; fw.push([17 * Math.cos(b), 17 * Math.sin(b), 30]); }
  for (let i = 16; i >= 0; i--) { const b = f0 - Math.PI / 2 + (i / 16) * Math.PI; fw.push([17 * Math.cos(b), 17 * Math.sin(b), 0]); }
  return [
    { pts: cyl(0, 0, 17, 0, 30, 28), loops: [loop(0, 0, 17, 30, 32), loop(0, 0, 14.5, 30, 32)] },
    { pts: cyl(0, 0, 2.5, 0, 16, 10).map(m) },
    { pts: cyl(0, 0, 4.5, 12, 18, 12).map(m) },
    { pts: box(-6, -4, 18, 6, 4, 66).map(m), hi: true, loops: [[[-6, -4, 66], [6, -4, 66], [6, 4, 66], [-6, 4, 66]].map(m)] },
    { pts: fw, raw: true },
  ];
}
const label = (t, on) => (on && t > 0.7 ? "pH 6.8" : on ? "pH --" : "rest");

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.8);
  const ext = [];
  for (const t of [0, 0.5, 1]) for (const it of build(t, RANGE[2])) ext.push(...it.pts);
  fit(C, ext, 200, 160);
  const P = proj(C);
  const c = P(CEN[0], CEN[1], CEN[2]), a0 = P(0, 0, 0), ax = P(1, 0, 0), ay = P(0, 1, 0), fl = Math.hypot(ax[1] - a0[1], ay[1] - a0[1]);
  FR = [(ax[1] - a0[1]) / fl, (ay[1] - a0[1]) / fl];
  const g = mk("g", {}, svg);
  const els = [];
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    build(t, amp).forEach((it, i) => {
      if (!els[i]) { els[i] = { s: mk("path", { class: it.hi ? "sil" : "" }, g), l: (it.loops || []).map(() => mk("path", { class: "nf" + (it.lo ? " lo" : "") }, g)) }; if (it.hi) hiEls.push(els[i].s); }
      els[i].s.setAttribute("d", poly((it.raw ? (x) => x : hull)(it.pts.map((q) => P(q[0], q[1], q[2])))));
      (it.loops || []).forEach((lp, j) => els[i].l[j].setAttribute("d", poly(lp.map((q) => P(q[0], q[1], q[2])))));
    });
  }
  const hiEls = [];
  const tw = tween(REST, 650);
  last = NaN;
  draw(REST);
  hiEls.forEach((e) => e.classList.add("hi"));
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  function aim(p) {
    const t = p ? cl(1.25 - Math.hypot(p[0] - c[0], p[1] - c[1]) / 110, 0, 1) : REST;
    tset(tw, t, performance.now(), 0);
    read.textContent = label(t, !!p);
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "phmeter",
  means: "A pen pH meter over a beaker: the pointer stands the pen upright and dips its glass probe into the beaker.",
  rules: [1, 3, 5, 6],
  range: [14,22,26],
  tour: [[168, 102], [190, 130], [200, 160], null],
  mount,
});
