/**
 * Dimmer: a square wall plate with a long paddle knob on a round collar. At
 * rest the knob leans low, its edge bright. The pointer over the plate turns
 * the knob up round its axis. The slider is how far it turns.
 *
 * The pattern: one part turning on its axis.
 */
const { Cam, circ, fit, hull, poly, proj, rings, rrect, tset, tval, tdone, tween, disposer, mk, place, pointer, register, solid } = HL;

const V = [0.612, 0.612, 0.5], REST = -35, CX = 30, CZ = 30;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let turn = value;
  const C = Cam(45, 0.5, 3.35);
  fit(C, [[0, 0, 0], [60, 0, 0], [0, 0, 60], [60, 4, 60], [0, 4, 0], [CX, 20, CZ + 22], [CX, 20, CZ - 22]], 200, 166);
  const P = proj(C);
  function slab(s, ring, inner, f, w0, w1) {
    const a = ring.map((q) => P(...f(q.u, q.v, w0))), b = ring.map((q) => P(...f(q.u, q.v, w1)));
    s.sil.setAttribute("d", poly(hull(a.concat(b))));
    const c0 = f(0, 0, w0), c1 = f(0, 0, w1), vis = (c1[0] - c0[0]) * V[0] + (c1[1] - c0[1]) * V[1] + (c1[2] - c0[2]) * V[2] > 0;
    s.cr.setAttribute("d", poly(inner.map((q) => P(...f(q.u, q.v, vis ? w1 : w0)))));
  }
  const wall = (u, v, w) => [u, w, v];
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(0, 0, 60, 60, 8, 2.4);
  slab(solid(g), pr, pi, wall, 0, 4);
  for (const [x, z] of [[8, 8], [52, 52]]) place(mk("circle", { r: 1.6, class: "dot off" }, g), P(x, 4, z));
  const at = (u, v, w) => [CX + u, w, CZ + v];
  slab(solid(g), circ(12, 24), circ(10.4, 24), at, 4, 7);
  const knob = solid(g);
  knob.sil.classList.add("hi");
  const dot = mk("circle", { r: 2, class: "dot" }, g);
  const kr = rrect(-21, -7.5, 21, 7.5, 7.5, 6), ki = rrect(-19.4, -5.9, 19.4, 5.9, 5.9, 6);
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180);
    const f = (u, v, w) => [CX + u * c - v * s, w, CZ + u * s + v * c];
    slab(knob, kr, ki, f, 7, 17);
    place(dot, P(...f(15, 0, 17)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  const box = [[0, 0, 0], [60, 0, 0], [0, 4, 60], [60, 4, 60]].map((p) => P(...p));
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const X0 = Math.min(...xs) - 6, X1 = Math.max(...xs) + 6, Y0 = Math.min(...ys) - 6, Y1 = Math.max(...ys) + 6;
  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(ang, o ? REST + turn : REST, performance.now(), 0);
    read.textContent = o ? Math.round((turn / 180) * 100) + "%" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([x, y]) => set(x > X0 && x < X1 && y > Y0 && y < Y1), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { turn = v; if (on) { tset(ang, REST + v, performance.now(), 0); read.textContent = Math.round((v / 180) * 100) + "%"; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "dimmer",
  means: "A wall dimmer with a long paddle knob: the pointer over the plate turns the knob up round its collar to brighten.",
  rules: [1, 4, 5, 8],
  range: [60, 110, 160],
  tour: [[193, 224], [160, 110], [240, 200], null],
  mount,
});
