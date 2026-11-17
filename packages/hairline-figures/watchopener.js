/**
 * Watch press: a bench press for snapping case backs shut, a column and head
 * over a watch on its nest, a ram and die under the head, a long lever with
 * a ball knob. The nearer the pointer comes to the watch, the further the
 * lever swings down on its spring and the die presses onto the case back. At
 * rest the lever stands raised, its knob bright. The slider is the stroke.
 *
 * The pattern: one part answering on a spring (lever).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, spring, stepS, unproj, clamp, lerp, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const UP = rad(52), DOWN = rad(-6), L = 62, PV = [-28, 12, 76];
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gain = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-42, -32, 0], [42, 32, 0], [42, -32, 0], [-42, 32, 0], [-28 + L * Math.cos(UP), 12, 76 + L * Math.sin(UP) + 7], [-28 + L, 12, 76]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-42, -32, 42, 32, 10, 2);
  put(solid(g), prism(P, front, br, bi, 0, 7));
  const [cr, ci] = rings(-38, -7, -24, 7, 5, 1.5);
  put(solid(g), prism(P, front, cr, ci, 7, 84));
  put(solid(g), prism(P, front, disc(0, 0, 18), disc(0, 0, 16), 7, 11));
  put(solid(g), prism(P, front, disc(0, 0, 14), disc(0, 0, 11.5), 11, 17));
  const ram = solid(g), die = solid(g);
  const [hr, hi] = rings(-38, -9, 9, 9, 6, 1.8);
  put(solid(g), prism(P, front, hr, hi, 70, 84));
  const lever = solid(g), knob = solid(g);
  knob.sil.classList.add("hi");

  const blob = (c, r) => { const s = P(...c), pts = []; for (let i = 0; i < 20; i++) { const t = i / 20 * Math.PI * 2; pts.push([s[0] + r * Math.cos(t), s[1] + r * Math.sin(t)]); } return pts; };
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const S = 2.0, e = [PV[0] + L * Math.cos(a), PV[1], PV[2] + L * Math.sin(a)];
    const k = clamp((UP - a) / (UP - DOWN), 0, 1), zb = lerp(46, 22, k);
    put(ram, prism(P, front, disc(0, 0, 5, 20), disc(0, 0, 3.5, 20), zb + 5, 70));
    put(die, prism(P, front, disc(0, 0, 11, 30), disc(0, 0, 9, 30), zb, zb + 5));
    lever.sil.setAttribute("d", poly(hull(blob(PV, 4.5 * S).concat(blob(e, 3 * S)))));
    knob.sil.setAttribute("d", poly(blob(e, 6.5 * S)));
  }
  const sp = spring(UP);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 17), d = Math.hypot(x, y);
    if (d > 110) return leave();
    const k = clamp(1 - (d - 12) / 60, 0, 1) * clamp(gain, 0, 1);
    sp.t = lerp(UP, DOWN, k);
    read.textContent = Math.round(k * 100) + "%";
    B.wake();
  }
  function leave() { sp.t = UP; read.textContent = "rest"; B.wake(); }
  draw(UP);
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gain = v; }, destroy: bag.dispose };
}

hairline({
  name: "watchopener",
  means: "A watch case press: its lever swings down as the pointer nears the watch, and the die presses onto the case back.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[214, 296], [240, 236], [200, 217], null],
  mount,
});
