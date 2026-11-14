/**
 * Police box: a tall street booth on a plinth, roof cap and lamp on top, two
 * front doors with a small window each. The pointer picks a door by where it
 * stands and that door swings open on its hinge; the other closes. At rest the
 * right door stands ajar and the lamp is bright. The slider is how far it opens.
 *
 * The pattern: one of a few in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, rings, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 30, H = 74, Y = 30.2, DW = 12.5, Z0 = 8, Z1 = 66;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 2.65);
  fit(C, [[-4, -4, 0], [W + 4, W + 4 + DW, 0], [W + 4, -4, 0], [-4, W + 4 + DW, 0], [-2, -2, 94], [W + 2, W + 2, 94]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1, cls) => {
    const [o, i] = rings(x0, y0, x1, y1, r, b), s = solid(g);
    put(s, prism(P, front, o, i, z0, z1));
    if (cls) s.sil.classList.add(cls);
    return s;
  };
  box(-4, -4, W + 4, W + 4, 3, 1.5, 0, 4);
  box(0, 0, W, W, 2, 1.2, 4, H);
  box(-2, -2, W + 2, W + 2, 2.5, 1.4, H, H + 6);
  box(5, 5, W - 5, W - 5, 2, 1.2, H + 6, H + 10);
  const lamp = solid(g);
  put(lamp, prism(P, front, disc(15, 15, 3), disc(15, 15, 2), H + 10, H + 18));
  // side panels on the right face
  for (const z of [26, 46]) mk("path", { d: poly([P(W, 4, z), P(W, W - 4, z)]), class: "nf lo" }, g);

  const doors = [0, 1].map((k) => {
    const grp = mk("g", {}, g);
    const sil = mk("path", { class: "sil" }, grp), win = mk("path", { class: "nf lo" }, grp);
    return { k, sil, win, a: tween(k === 1 ? 18 : 0), last: NaN };
  });
  const pt = (k, a, d, z) => {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    return k === 0 ? P(2 + d * c, Y + d * s, z) : P(W - 2 - d * c, Y + d * s, z);
  };
  function draw(dr, a) {
    if (a === dr.last) return;
    dr.last = a;
    const q = (d, z) => pt(dr.k, a, d, z);
    dr.sil.setAttribute("d", poly([q(0, Z0), q(DW, Z0), q(DW, Z1), q(0, Z1)]));
    dr.win.setAttribute("d", poly([q(2.5, 52), q(DW - 2.5, 52), q(DW - 2.5, 61), q(2.5, 61)]) + poly([q(DW / 2, 52), q(DW / 2, 61)]).replace(/Z$/, ""));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const d of doors) { draw(d, tval(d.a, now)); if (!tdone(d.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = [P(8, Y, 37), P(W - 8, Y, 37)], topY = P(0, Y, H)[1], botY = P(0, Y, 0)[1];
  function hit([sx, sy]) {
    if (sy < topY - 30 || sy > botY + 20) return -1;
    const dd = mids.map((m) => Math.abs(m[0] - sx)), k = dd[0] < dd[1] ? 0 : 1;
    return dd[k] < 40 ? k : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    doors.forEach((d, k) => {
      tset(d.a, a < 0 ? (k === 1 ? 18 : 0) : k === a ? open : 0, now, 0);
      d.sil.classList.toggle("hi", k === a);
    });
    lamp.sil.classList.toggle("hi", a < 0);
    read.textContent = a < 0 ? "rest" : a === 0 ? "door L" : "door R";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (act >= 0) { const a = act; act = -2; setActive(a); } }, destroy: bag.dispose };
}

hairline({
  name: "policebox",
  means: "A police box on a plinth with a roof lamp: the door under the pointer swings open on its hinge, the other one closes.",
  rules: [1, 4, 5, 6],
  range: [40, 75, 100],
  tour: [[170, 187], [236, 187], null],
  mount,
});
