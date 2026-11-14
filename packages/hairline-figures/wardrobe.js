/**
 * Wardrobe: a tall cabinet with two doors on its front, a rail of hangers
 * inside. The pointer picks a door by where it stands: that door swings open
 * on its hinge to show the clothes, and the other closes. At rest the left
 * door stands ajar, bright. The slider is how far a door swings.
 *
 * The pattern: one of two in a single row (riffle).
 */
const {
  Cam, fit, facing, fillet, poly, prism, proj, rad, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 64, D = 30, H = 104, Z0 = 4, ZT = H - 5, DW = W / 2 - 2, AJAR = 24;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-2, -2, 0], [W + 2, D + DW + 4, 0], [W + 2, -2, H], [-2, D + DW + 4, H], [W + 2, D + 2, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-2, -2, W + 2, D + 2, 3, 1.2);
  put(solid(g), prism(P, front, pr, pi, 0, Z0));
  const [br, bi] = rings(0, 0, W, D, 4, 1.5);
  put(solid(g), prism(P, front, br, bi, Z0, H));
  // inside: a rail and hangers with clothes, seen when a door opens
  let ins = seg(P(4, D, H - 16), P(W - 4, D, H - 16));
  for (let i = 0; i < 6; i++) {
    const x = 8 + i * 9.6, top = H - 16, sh = top - 6, len = [34, 46, 30, 52, 40, 36][i];
    ins += seg(P(x, D, top), P(x - 4, D, sh)) + seg(P(x, D, top), P(x + 4, D, sh));
    ins += "M" + [P(x - 4, D, sh), P(x - 4, D, sh - len), P(x + 4, D, sh - len), P(x + 4, D, sh)].map((q) => q.join(",")).join("L");
  }
  mk("path", { d: ins, class: "nf lo" }, g);

  const doors = [0, 1].map((k) => {
    const grp = mk("g", {}, g);
    const sil = mk("path", { class: "sil" }, grp), knob = mk("path", { class: "nf lo" }, grp);
    return { k, hx: k ? W - 1 : 1, dir: k ? -1 : 1, sil, knob, a: tween(k === 0 ? AJAR : 0), last: NaN };
  });

  function draw(d, a) {
    if (a === d.last) return;
    d.last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a)), fx = d.hx + d.dir * DW * c, fy = D + DW * s;
    const pts = [P(d.hx, D, Z0 + 3), P(d.hx, D, ZT), P(fx, fy, ZT), P(fx, fy, Z0 + 3)];
    d.sil.setAttribute("d", poly(fillet(pts, [2, 2, 2, 2])));
    const kx = d.hx + d.dir * (DW - 4) * c, ky = D + (DW - 4) * s;
    d.knob.setAttribute("d", seg(P(kx, ky, H / 2 - 8), P(kx, ky, H / 2 + 8)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const d of doors) { draw(d, tval(d.a, now)); if (!tdone(d.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = [P(W / 4, D, H / 2), P((3 * W) / 4, D, H / 2)];
  function hit([sx, sy]) {
    const k = Math.abs(mids[0][0] - sx) < Math.abs(mids[1][0] - sx) ? 0 : 1;
    return Math.abs(mids[k][0] - sx) < 40 && Math.abs(mids[k][1] - sy) < 95 ? k : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    doors.forEach((d) => {
      tset(d.a, a < 0 ? (d.k === 0 ? AJAR : 0) : d.k === a ? swing : 4, now, 0);
      d.sil.classList.toggle("hi", d.k === (a < 0 ? 0 : a));
    });
    read.textContent = a < 0 ? "rest" : a === 0 ? "left" : "right";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { swing = v; if (act >= 0) { const a = act; act = -2; setActive(a); } }, destroy: bag.dispose };
}

hairline({
  name: "wardrobe",
  means: "A wardrobe with two doors: the door under the pointer swings open on its hinge to show the hangers, the other closes.",
  rules: [1, 4, 5, 8],
  range: [60, 100, 120],
  tour: [[143, 95], [254, 95], [226, 238], null],
  mount,
});
