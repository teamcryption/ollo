/**
 * Seal press: a cast-iron embossing press on a small base, a C-shaped body
 * with a lower die and a long lever arm carrying the upper die. The pointer
 * near it pulls the lever down on its back pivot until the dies meet. At rest
 * the lever is raised, bright. The slider is how high the lever lifts.
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const cl = (v, a, b) => Math.max(a, Math.min(b, v));
const cyl = (x, y, r, z0, z1, n = 20) => { const o = []; for (let i = 0; i < n; i++) { const a = (i / n) * 2 * Math.PI; o.push([x + r * Math.cos(a), y + r * Math.sin(a), z0], [x + r * Math.cos(a), y + r * Math.sin(a), z1]); } return o; };
const loop = (x, y, r, z, n = 24) => { const o = []; for (let i = 0; i < n; i++) { const a = (i / n) * 2 * Math.PI; o.push([x + r * Math.cos(a), y + r * Math.sin(a), z]); } return o; };
const box = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
const top = (x0, y0, x1, y1, z) => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]];
const H = [-22, 0, 42];
function rotY(q, a) {
  const x = q[0] - H[0], z = q[2] - H[2], c = Math.cos(a), s = Math.sin(a);
  return [H[0] + x * c + z * s, q[1], H[2] + z * c - x * s];
}

const RANGE = [20, 34, 44], REST = 0.15, CEN = [10, 0, 34];
function build(t, amp) {
  const a = (-(1 - t) * amp + 2 * t) * (Math.PI / 180), m = (q) => rotY(q, a);
  return [
    { pts: box(-34, -20, 0, 36, 20, 5), loops: [top(-34, -20, 36, 20, 5)] },
    { pts: box(-30, -8, 5, -14, 8, 40), loops: [top(-30, -8, -14, 8, 40)] },
    { pts: box(-14, -7, 5, 30, 7, 18), loops: [top(-14, -7, 30, 7, 18)] },
    { pts: cyl(20, 0, 8, 18, 23, 20), loops: [loop(20, 0, 8, 23, 20)] },
    { pts: cyl(-22, 0, 6, 36, 48, 16).map(m) },
    { pts: cyl(20, 0, 7.5, 24, 38, 20).map(m), loops: [loop(20, 0, 7.5, 24, 20).map(m)] },
    { pts: box(-28, -5, 37, 58, 5, 46).map(m), hi: true, loops: [top(-28, -5, 58, 5, 46).map(m)] },
    { pts: cyl(62, 0, 8, 34, 50, 18).map(m), loops: [loop(62, 0, 8, 50, 18).map(m)] },
  ];
}
const label = (t, on) => (on ? "p " + Math.round(t * 100) : "rest");

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.5);
  const ext = [];
  for (const t of [0, 0.5, 1]) for (const it of build(t, RANGE[2])) ext.push(...it.pts);
  fit(C, ext, 200, 166);
  const P = proj(C);
  const c = P(CEN[0], CEN[1], CEN[2]);
  const g = mk("g", {}, svg);
  const els = [], hiEls = [];
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    build(t, amp).forEach((it, i) => {
      if (!els[i]) { els[i] = { s: mk("path", { class: "sil" }, g), l: (it.loops || []).map(() => mk("path", { class: "nf lo" }, g)) }; if (it.hi) hiEls.push(els[i].s); }
      els[i].s.setAttribute("d", poly(hull(it.pts.map((q) => P(q[0], q[1], q[2])))));
      (it.loops || []).forEach((lp, j) => els[i].l[j].setAttribute("d", poly(lp.map((q) => P(q[0], q[1], q[2])))));
    });
  }
  const tw = tween(REST);
  draw(REST);
  hiEls.forEach((e) => e.classList.add("hi"));
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  function aim(p) {
    const t = p ? cl(1.3 - Math.hypot(p[0] - c[0], p[1] - c[1]) / 120, 0, 1) : REST;
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
  name: "sealingwax",
  means: "A cast-iron embossing seal press: the pointer pulls its long lever down on the back pivot until the dies meet.",
  rules: [1, 3, 5, 6],
  range: [20, 34, 44],
  tour: [[218, 178], [262, 176], [180, 205], null],
  mount,
});
