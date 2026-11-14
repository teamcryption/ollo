/**
 * Stand mixer: a tilt-head mixer on its base, a bowl in front and a balloon
 * whisk hanging from the head into it. The pointer's height tilts the head
 * back on its hinge, lifting the whisk out of the bowl. At rest the head sits
 * almost closed and the speed dot is bright. The slider is the furthest tilt.
 *
 * The pattern: one part hinged, following the pointer (swing).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, rrect, seg, clamp, rad, spring, stepS,
  disposer, mk, place, pointer, put, register, solid,
} = HL;

const HX = 6, HZ = 48, REST = 5, BX = 40, BY = 18;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxT = value;
  const C = Cam(45, 0.5, 2.7);
  const rot = (x, y, z, a) => { const dx = x - HX, dz = z - HZ, c = Math.cos(rad(a)), s = Math.sin(rad(a)); return [HX + dx * c - dz * s, y, HZ + dx * s + dz * c]; };
  const ext = [[-2, -2, 0], [66, 38, 0], [66, -2, 0], [-2, 38, 0]];
  for (const [x, z] of [[0, 44], [58, 44], [58, 60], [0, 60]]) for (const y of [10, 26]) ext.push(rot(x, y, z, 60), rot(x, y, z, REST));
  fit(C, ext, 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [br, bi] = rings(0, 0, 64, 36, 9, 2);
  put(solid(g), prism(P, front, br, bi, 0, 6));
  const [cr, ci] = rings(0, 8, 16, 28, 6, 1.5);
  put(solid(g), prism(P, front, cr, ci, 6, 46));
  const speed = mk("circle", { r: 2.4, class: "dot" }, g);
  place(speed, P(16, 18, 30));

  // the whisk: a shaft and a balloon of wires, turning with the head
  const wg = mk("g", {}, g);
  const shaft = mk("path", { class: "nf" }, wg), balloon = mk("path", { class: "nf lo" }, wg), wires = mk("path", { class: "nf lo" }, wg);

  // the bowl: narrow foot, wide rim
  const foot = disc(BX, BY, 9), top = rrect(BX - 16, BY - 16, BX + 16, BY + 16, 16, 10), inner = rrect(BX - 14, BY - 14, BX + 14, BY + 14, 14, 10);
  put(solid(g), { sil: poly(hull(ringAt(P, foot, 6).concat(ringAt(P, top, 28)))), crease: open(ringAt(P, run(inner, front), 28)) });

  // the head, a rounded box that tilts back on its hinge
  const head = solid(g);
  head.sil.classList.add("sil");
  const [hr, hi] = rings(0, 10, 58, 26, 7, 2);

  const tilt = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = [];
    for (const q of hr) for (const z of [44, 58]) pts.push(P(...rot(q.u, q.v, z, a)));
    const crease = run(hi, front).map((q) => P(...rot(q.u, q.v, 58, a)));
    put(head, { sil: poly(hull(pts)), crease: open(crease) });
    const s0 = P(...rot(BX, BY, 44, a)), s1 = P(...rot(BX, BY, 36, a));
    shaft.setAttribute("d", seg(s0, s1));
    const bal = [], wd = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8, z = 36 - 22 * t, r = 6 * Math.sin(Math.PI * Math.pow(t, 0.7));
      for (const q of circ(r, 12)) bal.push(P(...rot(BX + q.u, BY + q.v, z, a)));
    }
    balloon.setAttribute("d", poly(hull(bal)));
    for (const k of [-0.5, 0.5]) {
      const w = [];
      for (let i = 0; i <= 8; i++) { const t = i / 8, z = 36 - 22 * t, r = 6 * Math.sin(Math.PI * Math.pow(t, 0.7)); w.push(P(...rot(BX + r * k, BY - r * k, z, a))); }
      wd.push(open(w));
    }
    wires.setAttribute("d", wd.join(" "));
  }

  const B = register(stage, (dt) => { const m = stepS(tilt, dt); draw(tilt.x); return m; });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { tilt.t = REST; speed.setAttribute("class", "dot"); head.sil.classList.remove("hi"); read.textContent = "rest"; B.wake(); return; }
    const f = clamp((250 - p[1]) / 170, 0.08, 1);
    tilt.t = REST + (maxT - REST) * f;
    speed.setAttribute("class", "dot off");
    head.sil.classList.add("hi");
    read.textContent = "tilt " + Math.round(tilt.t) + "°";
    B.wake();
  }
  draw(REST);
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxT = v; }, destroy: bag.dispose };
}

hairline({
  name: "mixerbowl",
  means: "A tilt-head stand mixer: the pointer's height swings the head back on its hinge and lifts the whisk out of the bowl.",
  rules: [1, 3, 5, 8],
  range: [25, 45, 60],
  tour: [[227, 260], [234, 146], [200, 90], null],
  mount,
});
