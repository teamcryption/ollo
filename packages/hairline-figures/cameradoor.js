/**
 * Action camera: a small rounded box with a round lens on its front, a
 * shutter button on top and a battery door on its side. At rest the door
 * stands ajar, bright. The pointer over the camera swings the door open on
 * its hinge, on a spring, to show the battery. The slider is how far.
 *
 * The pattern: one part answering (aim), hit on the rest footprint.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rad, rings, run, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 44, D = 30, H = 32, LU = D - 4, REST = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 3.65);
  fit(C, [[0, 0, 0], [W, D + 8, 0], [W + LU, 2, 0], [W + LU, 2, H], [0, 0, H + 3], [W + 4, D, 0], [W + 24, -9, H], [W + 24, -9, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [bo, bi] = rings(0, 0, W, D, 6, 1.6);
  put(solid(g), prism(P, front, bo, bi, 0, H));
  // the shutter button on top
  const [so, si] = rings(W - 18, 8, W - 8, 16, 2.5, 1);
  put(solid(g), prism(P, front, so, si, H, H + 2.6));
  // the lens: a barrel standing out of the front face, glass inside
  const LX = 15, LZ = H / 2 + 1, Y = (q, r, w) => P(LX + q.u * r, D + w, LZ + q.v * r);
  const ring = circ(1, 40);
  const barrel = solid(g);
  barrel.sil.setAttribute("d", poly(hull(ring.map((q) => Y(q, 10, 0)).concat(ring.map((q) => Y(q, 10, 5))))));
  barrel.cr.setAttribute("d", poly(ring.map((q) => Y(q, 7, 5))));
  mk("path", { class: "nf lo", d: poly(ring.map((q) => Y(q, 3.5, 5.2))) }, g);
  // the battery in its bay on the side face
  const X = (u, v) => P(W + 0.2, 4 + u, v);
  const [to, ti] = rings(2, 5, LU - 4, H - 5, 2, 1);
  mk("path", { class: "nf lo", d: poly(to.map((q) => X(q.u, q.v))) }, g);
  mk("path", { class: "nf lo", d: poly(ti.map((q) => X(q.u, q.v + 4))).replace(/Z$/, "") }, g);

  // the door: a plate hinged on the side face's far edge
  const [dO, dI] = rings(0, 3, LU, H - 3, 3, 1.2);
  const door = solid(g);
  const sp = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    const T = (q, w) => P(W + q.u * s + w * c, 2 + q.u * c - w * s, q.v);
    door.sil.setAttribute("d", poly(hull(dO.map((q) => T(q, 0)).concat(dO.map((q) => T(q, 2))))));
    door.cr.setAttribute("d", poly(dI.map((q) => T(q, 2))));
  }
  door.sil.classList.add("hi");
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(clamp(sp.x, 0, 115)); return m; });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    sp.t = v ? clamp(REST + swing, 0, 115) : REST;
    read.textContent = v ? "door " + Math.round(sp.t) + "°" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    return x > -4 && x < W + 10 && y > -4 && y < D + 6;
  }
  setOn(false);
  draw(REST);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { swing = v; if (on) { sp.t = clamp(REST + v, 0, 115); read.textContent = "door " + Math.round(sp.t) + "°"; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "cameradoor",
  means: "An action camera with a round lens: over it, the battery door on its side swings open on its hinge to show the battery.",
  rules: [1, 3, 5, 8],
  range: [40, 86, 100],
  tour: [[101, 72], [119, 115], [137, 163], null],
  mount,
});
