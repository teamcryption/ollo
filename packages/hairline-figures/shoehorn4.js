/**
 * Boot tree: a wooden boot form, a rounded foot block with a tall leg board
 * standing on its heel and a turned knob on top to lift it by. The pointer
 * over it swings the leg back on its heel hinge, as it does to slip into a
 * boot; at rest the leg leans a little, its knob bright. The hit is a fixed
 * screen box, so it never moves with the drawing.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rad, rings, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X0 = -12, Z0 = 18, TOP = 92, REST = 5, SWING = 38;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.5);
  const rot = (th) => { const c = Math.cos(th), s = Math.sin(th); return (x, y, z) => [X0 + (x - X0) * c - (z - Z0) * s, y, Z0 + (x - X0) * s + (z - Z0) * c]; };
  const ext = [[-18, -12, 0], [38, 12, 0], [38, -12, 0], [-18, 12, 0]];
  for (const th of [0, rad(SWING)]) { const f = rot(th); for (const x of [X0, 6]) for (const y of [-10, 10]) ext.push(f(x, y, TOP + 10)); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-16, -11, 38, 11, 10, 1.6);
  put(solid(g), prism(P, front, fr, fi, 0, Z0));
  const leg = mk("path", { class: "sil" }, g), legTop = mk("path", { class: "nf lo" }, g), hinge = mk("path", { class: "nf" }, g);
  const knob = mk("path", { class: "sil hi" }, g), knobTop = mk("path", { class: "nf lo" }, g);
  const foot = rrect(X0, -9, 6, 9, 5, 4), top = rrect(X0 + 1, -8, 4, 8, 4.5, 4), inner = rrect(X0 + 2.6, -6.4, 2.4, 6.4, 3, 4);
  const knobR = circ(4.5, 24), knobS = circ(3, 24);
  const t = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const f = rot(rad(REST + v * (SWING - REST) * amt)), Q = (x, y, z) => P(...f(x, y, z));
    const at = (r, z, dx = 0) => r.map((q) => Q(q.u + dx, q.v, z));
    leg.setAttribute("d", poly(hull(at(foot, Z0).concat(at(top, TOP)))));
    legTop.setAttribute("d", poly(at(inner, TOP)));
    const hp = [];
    for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2; hp.push(P(X0 + 2.5 * Math.cos(a), -11, Z0 + 2.5 * Math.sin(a)), P(X0 + 2.5 * Math.cos(a), 11, Z0 + 2.5 * Math.sin(a))); }
    hinge.setAttribute("d", poly(hull(hp)));
    const cx = X0 + 6.5;
    knob.setAttribute("d", poly(hull(at(knobS, TOP, cx).concat(at(knobR, TOP + 5, cx), at(knobR, TOP + 8, cx)))));
    knobTop.setAttribute("d", poly(at(knobS, TOP + 9, cx)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  let on = null;
  function setOn(o) {
    if (o === on) return;
    on = o;
    tset(t, o ? 1 : 0, performance.now(), 0);
    read.textContent = o ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setOn(Math.abs(sx - 200) < 130 && Math.abs(sy - 166) < 145), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "shoehorn4",
  means: "A wooden boot tree: the pointer swings its tall leg board back on the heel hinge, as it does to slip into a boot.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1],
  tour: [[216, 72], [193, 259], [288, 307], null],
  mount,
});
