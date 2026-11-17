/**
 * Sand shaker: a turned pounce pot, waisted, with a dished top pierced with
 * holes, standing on a letter sheet. The pointer near it tips the pot over its
 * foot to shake sand onto the sheet. At rest it leans a little, its rim
 * bright. The slider is how far it tips.
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, place, pointer, register } = HL;

const cl = (v, a, b) => Math.max(a, Math.min(b, v));
const ring = (x, y, r, z, n = 24) => { const o = []; for (let i = 0; i < n; i++) { const a = (i / n) * 2 * Math.PI; o.push([x + r * Math.cos(a), y + r * Math.sin(a), z]); } return o; };
const box = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
const H = [16, 0, 2];
function rotY(q, a) {
  const x = q[0] - H[0], z = q[2] - H[2], c = Math.cos(a), s = Math.sin(a);
  return [H[0] + x * c + z * s, q[1], H[2] + z * c - x * s];
}
const HOLES = [[0, 0], [5, 0], [-5, 0], [0, 5], [0, -5], [3.6, 3.6], [-3.6, -3.6], [3.6, -3.6], [-3.6, 3.6]];

const REST = 0.15, CEN = [10, 0, 20];
function build(t, amp) {
  const a = (8 + (amp - 8) * t) * (Math.PI / 180), m = (q) => rotY(q, a);
  return {
    parts: [
      { pts: box(-26, -24, 0, 60, 24, 2), loops: [] },
      { pts: ring(0, 0, 16, 2).concat(ring(0, 0, 16, 6)).map(m), loops: [] },
      { pts: ring(0, 0, 15, 6).concat(ring(0, 0, 8, 19)).map(m), loops: [] },
      { pts: ring(0, 0, 8, 19).concat(ring(0, 0, 16, 33)).map(m), loops: [] },
      { pts: ring(0, 0, 17, 33).concat(ring(0, 0, 17, 37)).map(m), hi: true, loops: [ring(0, 0, 13.5, 36.2, 28).map(m)] },
    ],
    holes: HOLES.map(([x, y]) => m([x, y, 35.6])),
  };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 3.1);
  const ext = [];
  for (const t of [0, 0.5, 1]) for (const it of build(t, 80).parts) ext.push(...it.pts);
  fit(C, ext, 200, 170);
  const P = proj(C), pp = (q) => P(q[0], q[1], q[2]);
  const c = pp(CEN);
  const g = mk("g", {}, svg);
  const els = [], hiEls = [], dots = HOLES.map(() => null);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const b = build(t, amp);
    b.parts.forEach((it, i) => {
      if (!els[i]) { els[i] = { s: mk("path", { class: "sil" }, g), l: it.loops.map(() => mk("path", { class: "nf lo" }, g)) }; if (it.hi) hiEls.push(els[i].s); }
      els[i].s.setAttribute("d", poly(hull(it.pts.map(pp))));
      it.loops.forEach((lp, j) => els[i].l[j].setAttribute("d", poly(lp.map(pp))));
    });
    b.holes.forEach((q, i) => { if (!dots[i]) dots[i] = mk("circle", { r: 1.3, class: "dot off" }, g); place(dots[i], pp(q)); });
  }
  const tw = tween(REST);
  draw(REST);
  hiEls.forEach((e) => e.classList.add("hi"));
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  function aim(p) {
    const t = p ? cl(1.3 - Math.hypot(p[0] - c[0], p[1] - c[1]) / 120, 0, 1) : REST;
    tset(tw, t, performance.now(), 0);
    read.textContent = p ? Math.round(8 + (amp - 8) * t) + "deg" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "blottingrock",
  means: "A turned pounce pot with a pierced, dished top on a letter sheet: the pointer tips it over its foot to shake out sand.",
  rules: [1, 3, 5, 6],
  range: [50, 65, 80],
  tour: [[163, 92], [205, 135], [250, 175], null],
  mount,
});
