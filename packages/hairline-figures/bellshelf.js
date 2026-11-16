/**
 * School bell: a brass hand bell standing on a small wooden block.
 * The pointer near it lifts it by the handle and swings it, the clapper showing under the rim.
 * At rest it leans a little, bright. The slider is the swing.
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

const RANGE = [20, 32, 42], REST = 0.18, CEN = [0, 0, 30];
const SK = [[20, 0], [18, 4], [13, 14], [10, 24], [7, 30]];
function build(t, amp) {
  const lift = 10 * t, a = (amp * t + 4) * (Math.PI / 180), d = [Math.SQRT1_2, -Math.SQRT1_2, 0];
  const m = (q) => rot([q[0], q[1], q[2] + 6 + lift], [0, 0, 58 + lift], d, a);
  const skirt = []; for (const [r, z] of SK) skirt.push(...loop(0, 0, r, z, 28));
  const clap = cyl(0, 0, 3.5, 1, 7, 12).map((q) => rot([q[0], q[1], q[2] + 6 + lift], [0, 0, 58 + lift], d, a * 0.55));
  return [
    { pts: box(-24, -24, 0, 24, 24, 6), loops: [[[-24, -24, 6], [24, -24, 6], [24, 24, 6], [-24, 24, 6]]] },
    { pts: clap },
    { pts: skirt.map(m), hi: true },
    { pts: cyl(0, 0, 3, 30, 46, 14).map(m) },
    { pts: cyl(0, 0, 5.5, 46, 54, 16).map(m), loops: [loop(0, 0, 5.5, 54, 16).map(m)] },
  ];
}
const label = (t, on) => (on ? (t > 0.6 ? "ding" : "lift") : "rest");

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.7);
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
  name: "bellshelf",
  means: "A hand bell on a wooden block: the pointer lifts it by the handle and swings it, the clapper showing under the rim.",
  rules: [1, 3, 5, 6],
  range: [20,32,42],
  tour: [[200, 128], [215, 150], [200, 170], null],
  mount,
});
