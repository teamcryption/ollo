/**
 * Pen rack: a dip pen lying across the notched posts of a small wooden rack,
 * holder, brass ferrule and nib. The pointer near it lifts the pen off the
 * rack and tips the nib down, ready to write. At rest it sits just raised,
 * bright. The slider is how far the nib tips.
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const cl = (v, a, b) => Math.max(a, Math.min(b, v));
const box = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
const top = (x0, y0, x1, y1, z) => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]];
const ZC = 27;
const xr = (x, r, n = 18) => { const o = []; for (let i = 0; i < n; i++) { const a = (i / n) * 2 * Math.PI; o.push([x, r * Math.cos(a), ZC + r * Math.sin(a)]); } return o; };
function mv(q, a, lift) {
  const x = q[0], z = q[2] - ZC, c = Math.cos(a), s = Math.sin(a);
  return [x * c + z * s, q[1], ZC + lift + z * c - x * s];
}

const REST = 0.12, CEN = [0, 0, 30];
function build(t, amp) {
  const a = amp * t * (Math.PI / 180), lift = 24 * t * t, m = (q) => mv(q, a, lift);
  return [
    { pts: box(-42, -16, 0, 42, 16, 6), loops: [top(-42, -16, 42, 16, 6)] },
    { pts: box(-36, -5, 6, -26, 5, 24), loops: [top(-36, -5, -26, 5, 24)] },
    { pts: box(26, -5, 6, 36, 5, 24), loops: [top(26, -5, 36, 5, 24)] },
    { pts: xr(-58, 3).concat(xr(-52, 4.4)).map(m) },
    { pts: xr(-52, 4.4).concat(xr(18, 3.4)).map(m), hi: true },
    { pts: xr(18, 3.6).concat(xr(30, 4)).map(m), loops: [xr(24, 3.8).map(m)] },
    { pts: [[30, -3.4, ZC], [30, 3.4, ZC], [44, 1.8, ZC - 0.4], [52, 0, ZC - 0.8], [44, -1.8, ZC - 0.4]].map(m), raw: true, loops: [[[30, 0, ZC], [41, 0, ZC - 0.3]].map(m)] },
  ];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.6);
  const ext = [];
  for (const t of [0, 0.5, 1]) for (const it of build(t, 44)) ext.push(...it.pts);
  fit(C, ext, 200, 166);
  const P = proj(C), pp = (q) => P(q[0], q[1], q[2]);
  const c = pp(CEN);
  const g = mk("g", {}, svg);
  const els = [], hiEls = [];
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    build(t, amp).forEach((it, i) => {
      if (!els[i]) { els[i] = { s: mk("path", { class: "sil" }, g), l: (it.loops || []).map(() => mk("path", { class: "nf lo" }, g)) }; if (it.hi) hiEls.push(els[i].s); }
      els[i].s.setAttribute("d", poly(it.raw ? it.pts.map(pp) : hull(it.pts.map(pp))));
      (it.loops || []).forEach((lp, j) => els[i].l[j].setAttribute("d", (lp.length > 2 ? poly : (p) => "M" + p.map((q) => q.join(",")).join("L"))(lp.map(pp))));
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
    read.textContent = p ? "up " + Math.round(t * 100) : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "penwiper",
  means: "A dip pen lying across a small notched wooden rack: the pointer lifts it off the posts and tips the nib down to write.",
  rules: [1, 3, 5, 6],
  range: [24, 34, 44],
  tour: [[203, 196], [150, 168], [262, 222], null],
  mount,
});
