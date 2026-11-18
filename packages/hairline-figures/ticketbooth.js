/**
 * Ticket booth: a fairground ticket booth with a pointed roof and a ticket
 * window on its front. A hatch hinged along the top of the window swings up
 * into an awning when the pointer comes over the booth. At rest the hatch
 * hangs ajar, bright. The slider is how far the hatch swings up.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, rad,
} = HL;

const W = 50, D = 40, H = 66, WX0 = 5, WX1 = 45, WZ0 = 24, WZ1 = 58, L = WZ1 - WZ0, REST = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amax = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-5, -5, 0], [W + 5, D + 5, 0], [W + 5, -5, 0], [-5, D + 30, 0], [W / 2, D / 2, 88], [WX0, D + 34, 70]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // ground plinth
  const [pr, pi] = rings(-5, -5, W + 5, D + 5, 3, 1.5);
  put(solid(g), prism(P, front, pr, pi, 0, 3));
  const [br, bi] = rings(0, 0, W, D, 2, 1.2);
  put(solid(g), prism(P, front, br, bi, 3, H));
  // the window opening and the inside back wall
  const win = [P(WX0, D, WZ0), P(WX1, D, WZ0), P(WX1, D, WZ1), P(WX0, D, WZ1)];
  mk("path", { d: poly(win), class: "lo" }, g);
  mk("path", { d: seg(P(WX0, D - 6, WZ1), P(WX0, D, WZ1)) + seg(P(WX0, D - 6, WZ1), P(WX0, D - 6, WZ0)) + seg(P(WX0, D - 6, WZ1), P(WX1, D - 6, WZ1)), class: "nf lo" }, g);
  mk("path", { d: [34, 42, 50].map((z) => seg(P(WX0 + 2, D - 6, z), P(WX1 - 2, D - 6, z))).join("") + [12, 20, 28, 36].map((x) => seg(P(x, D - 6, 34), P(x, D - 6, 52))).join(""), class: "nf" }, g);
  // a roll of tickets on the sill inside
  mk("path", { d: poly(hull([P(30, D - 4, WZ0), P(36, D - 4, WZ0), P(30, D - 4, WZ0 + 6), P(36, D - 4, WZ0 + 6), P(30, D - 1, WZ0), P(36, D - 1, WZ0), P(30, D - 1, WZ0 + 6), P(36, D - 1, WZ0 + 6)])), class: "lo" }, g);
  // the counter shelf under the window
  const [cr, ci] = rings(WX0 - 3, D, WX1 + 3, D + 7, 1.5, 0.8);
  put(solid(g), prism(P, front, cr, ci, WZ0 - 3, WZ0));
  // roof slab and pointed top
  const [rr, ri] = rings(-5, -5, W + 5, D + 5, 3, 1.5);
  put(solid(g), prism(P, front, rr, ri, H, H + 5));
  const apex = P(W / 2, D / 2, 88);
  mk("path", { d: poly(hull(ringAt(P, rr, H + 5).concat([apex]))) }, g);
  mk("path", { d: seg(apex, P(-5, D + 5, H + 5)) + seg(apex, P(W + 5, D + 5, H + 5)) + seg(apex, P(W + 5, -5, H + 5)), class: "nf" }, g);
  mk("path", { d: seg(apex, P(W / 2, D / 2, 96)), class: "nf" }, g);
  mk("path", { d: poly([P(W / 2, D / 2, 96), P(W / 2 + 8, D / 2 + 8, 94), P(W / 2, D / 2, 92)]), class: "lo" }, g);
  // the hatch
  const hatch = mk("path", { class: "sil hi" }, g), slat = mk("path", { class: "nf lo" }, g);
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const t = rad(a), dy = Math.sin(t), dz = -Math.cos(t);
    const at = (x, s) => P(x, D + 0.6 + L * s * dy, WZ1 + L * s * dz);
    hatch.setAttribute("d", poly([at(WX0 - 1, 0), at(WX1 + 1, 0), at(WX1 + 1, 1), at(WX0 - 1, 1)]));
    slat.setAttribute("d", [0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((s) => seg(at(WX0 - 1, s), at(WX1 + 1, s))).join(""));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  const box = hull([[0, 0, 0], [W, 0, 0], [0, D, 0], [W, D, 0], [0, 0, H], [W, 0, H], [0, D, H], [W, D, H], [W / 2, D / 2, 88]].map((q) => P(...q)));
  const inside = ([x, y]) => {
    let c = false;
    for (let i = 0, j = box.length - 1; i < box.length; j = i++) {
      const [xi, yi] = box[i], [xj, yj] = box[j];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  let on = null;
  function setOn(v, force) {
    if (v === on && !force) return;
    on = v;
    tset(ang, v ? amax : REST, performance.now(), 0);
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(inside(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amax = v; setOn(on, true); }, destroy: bag.dispose };
}

hairline({
  name: "ticketbooth",
  means: "A fairground ticket booth: over the booth, the hatch on its window swings up into an awning.",
  rules: [1, 3, 5, 6],
  range: [50, 120, 130],
  tour: [[188, 154], [200, 178], [176, 140], null],
  mount,
});
