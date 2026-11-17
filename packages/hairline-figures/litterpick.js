/**
 * Litter picker: a long shaft with a pistol grip and trigger at the top and a
 * pair of broad jaws at its foot. The pointer near the picker squeezes it
 * open: the jaws spread wide on their pivot; at rest they hang a little
 * apart, bright. The slider is how wide they open.
 */
const {
  Cam, fit, hull, poly, proj, ringAt, circ, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const LP = 96, TILT = -34, JL = 34, REST = 7;
const disc = (x, y, r, n = 14) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  let reach = value;
  const bag = disposer();
  const C = Cam(45, 0.5, 2.5);
  // s along the shaft from its foot, o across it in the screen plane
  const ax = (s, o = 0) => { const t = (TILT * Math.PI) / 180, w = s * Math.sin(t) + o * Math.cos(t); return [w * 0.707, -w * 0.707, 30 + s * Math.cos(t) - o * Math.sin(t)]; };
  const jaw = (side, a, s) => { const t = (a * Math.PI) / 180; return ax(-s * Math.cos(t), side * s * Math.sin(t)); };
  fit(C, [ax(LP + 12, -14), ax(LP + 12, 12), jaw(1, 52, JL + 3), jaw(-1, 52, JL + 3), ax(-JL - 3)], 200, 168);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const bar = (a, b, r) => hull(ringAt(P, disc(a[0], a[1], r), a[2]).concat(ringAt(P, disc(b[0], b[1], r), b[2])));
  const jaws = [mk("path", { class: "sil hi" }, g), mk("path", { class: "sil hi" }, g)];
  mk("path", { d: poly(bar(ax(0), ax(LP), 2)), class: "sil" }, g);
  mk("path", { d: poly(hull([...bar(ax(-2), ax(6), 3.6)])), class: "nf" }, g);
  mk("path", { d: poly(hull([...bar(ax(LP - 4), ax(LP + 10, -12), 3), ...bar(ax(LP - 2), ax(LP + 8), 3)])), class: "sil" }, g);
  mk("path", { d: poly(bar(ax(LP - 12, 1), ax(LP - 4, 9), 1.6)), class: "nf lo" }, g);
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    [1, -1].forEach((side, i) => {
      const pts = [];
      for (let k = 0; k <= 6; k++) { const s = (k / 6) * JL, w = 3 + 4 * Math.sin((k / 6) * Math.PI) ; pts.push(jaw(side, a, s), jaw(side, a - side * 0 + (w / Math.max(s, 6)) * 57.3 * 0.5, s)); }
      const tip = jaw(side, a - 10, JL + 2);
      pts.push(tip);
      jaws[i].setAttribute("d", poly(hull(pts.flatMap((p) => ringAt(P, disc(p[0], p[1], 1.2, 8), p[2])))));
    });
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(ang, on ? 22 + 30 * reach : REST, performance.now(), 0);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  const p0 = P(...ax(-JL)), p1 = P(...ax(LP + 10));
  const hit = ([sx, sy]) => { const dx = p1[0] - p0[0], dy = p1[1] - p0[1]; const t = Math.max(0, Math.min(1, ((sx - p0[0]) * dx + (sy - p0[1]) * dy) / (dx * dx + dy * dy))); return Math.hypot(sx - p0[0] - t * dx, sy - p0[1] - t * dy) < 46; };
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; act = null; }, destroy: bag.dispose };
}

hairline({
  name: "litterpick",
  means: "A litter picker: the pointer near it squeezes the grip and the broad jaws at its foot spread wide open on their pivot.",
  rules: [1, 4, 5],
  range: [0.3, 1, 1],
  tour: [[269, 290], [225, 225], [165, 110], null],
  mount,
});
