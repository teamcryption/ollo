/**
 * Reception bell: a service bell on a front-desk counter, a round base, a
 * domed bell and a plunger on top. Over the bell the pointer presses the
 * plunger down and the dome rings bright. At rest the plunger stands up,
 * bright, where the hand would go. The slider is how deep the press goes.
 *
 * The pattern: one object, one press (a button).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const CZ = 14, BR = 20, BH = 4, DR = 16, STEM = 11;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let depth = value;
  const C = Cam(45, 0.5, 2.25);
  const top = CZ + BH + DR * 0.85;
  fit(C, [[-44, -34, 0], [44, 34, 0], [44, -34, 0], [-44, 34, 0], [0, 0, top + STEM + 3]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the counter
  const [cr, ci] = rings(-44, -34, 44, 34, 8, 2);
  put(solid(g), prism(P, front, cr, ci, 0, CZ));
  // the base: a low round plinth
  put(solid(g), prism(P, front, disc(0, 0, BR), disc(0, 0, BR - 2.5), CZ, CZ + BH));
  // the dome
  const domePts = [];
  for (let i = 0; i <= 8; i++) { const t = (i / 8) * (Math.PI / 2); domePts.push(...ringAt(P, disc(0, 0, DR * Math.cos(t), 32), CZ + BH + DR * 0.85 * Math.sin(t))); }
  const dome = mk("path", { d: poly(hull(domePts)), class: "sil" }, g);
  mk("path", { d: poly(ringAt(P, disc(0, 0, DR, 40), CZ + BH + 1)), class: "nf lo" }, g);
  // the plunger: a stem and a button that slide down into the dome
  const stem = mk("path", { class: "" }, g), btn = mk("path", { class: "sil" }, g), cap = mk("path", { class: "nf lo" }, g);
  const press = tween(0);
  let last = NaN;
  function draw(d) {
    if (d === last) return;
    last = d;
    const z0 = top - 1, z1 = top + STEM - d;
    stem.setAttribute("d", poly(hull(ringAt(P, disc(0, 0, 1.8, 12), z0).concat(ringAt(P, disc(0, 0, 1.8, 12), z1)))));
    btn.setAttribute("d", poly(hull(ringAt(P, disc(0, 0, 6, 24), z1).concat(ringAt(P, disc(0, 0, 6, 24), z1 + 2.2)))));
    cap.setAttribute("d", poly(ringAt(P, disc(0, 0, 4.5, 24), z1 + 2.2)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(press, now)); return !tdone(press, now); });
  bag.add(B.unregister);

  // hit against the rest pose: the bell's screen footprint, which never moves
  const mid = P(0, 0, CZ + BH + 6);
  const hit = ([sx, sy]) => Math.hypot(sx - mid[0], (sy - mid[1]) * 1.6) < 52;
  let on = null;
  function setOn(a) {
    if (a === on) return;
    on = a;
    tset(press, a ? depth : 0, performance.now(), 0);
    btn.classList.toggle("hi", !a);
    dome.classList.toggle("hi", a);
    read.textContent = a ? "ding" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { depth = v; if (on) { tset(press, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "bellcounter",
  means: "A service bell on a front desk: over it the pointer presses the plunger down and the dome rings bright.",
  rules: [1, 4, 5, 8],
  range: [3, 8, 10],
  tour: [[200, 140], [110, 205], [206, 150], null],
  mount,
});
