/**
 * Wheelchair ramp: a sloped ramp with a handrail climbs to a landing at a
 * door step. A wheelchair stands on the slope; the pointer's place along the
 * ramp, read on the ground, rolls the chair there on a spring. At rest the
 * chair waits part way up, its near wheel bright. The slider is the rest spot.
 *
 * The pattern: one part following the pointer along a track.
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, ringAt, seg, clamp, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 120, W = 30, H = 24, LW = 40, R = 9;
const zAt = (x) => H * clamp(x / L, 0, 1);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let restT = value / 100;
  const C = Cam(45, 0.5, 1.85);
  fit(C, [[0, 0, 0], [L + LW, W, 0], [L + LW, 0, H + 30], [0, W, 0], [0, 0, 30], [L + LW, W, H]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const pt = (a) => P(a[0], a[1], a[2]);
  // ramp wedge
  const wedge = [[0, 0, 0], [L, 0, 0], [L, W, 0], [0, W, 0], [L, 0, H], [L, W, H]].map(pt);
  mk("path", { d: poly(hull(wedge)), class: "sil" }, g);
  mk("path", { d: open([P(1, W - 1, 0.4), P(L, W - 1, H - 0.4)]), class: "nf lo" }, g);
  // landing
  const [lr, li] = rings(L, -10, L + LW, W, 4, 1.6);
  put(solid(g), prism(P, front, lr, li, 0, H));
  // handrail on the far side
  let rail = "";
  for (let x = 0; x <= L; x += 30) rail += seg(P(x, 2, zAt(x)), P(x, 2, zAt(x) + 15));
  rail += seg(P(0, 2, 15), P(L, 2, H + 15)) + seg(P(L, 2, H + 15), P(L + LW - 4, 2, H + 15)) + seg(P(L + LW - 4, 2, H), P(L + LW - 4, 2, H + 15));
  mk("path", { d: rail, class: "nf" }, g);

  const cg = mk("g", {}, g);
  const farW = mk("path", { class: "sil" }, cg), seat = mk("path", { class: "sil" }, cg), nearW = mk("path", { class: "sil hi" }, cg), hub = mk("path", { class: "nf lo" }, cg);
  const wheel = (x, y, zc, r) => { const p = []; for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2; p.push(P(x + r * Math.cos(a), y, zc + r * Math.sin(a))); } return p; };
  const pos = spring(restT * L);
  let last = NaN;
  function draw(x) {
    if (x === last) return;
    last = x;
    const zg = zAt(x), zc = zg + R;
    farW.setAttribute("d", poly(wheel(x, 8, zc, R)));
    const box = [];
    for (const [bx, bz] of [[-5, 8], [7, 8 + 2.4], [7, 12 + 2.4], [-5, 12], [-7, 26], [-4, 27]]) for (const y of [8, 22]) box.push(P(x + bx, y, zg + bz));
    for (const y of [9, 21]) box.push(P(x + 11, y, zg + 3), P(x + 13, y, zg + 3));
    seat.setAttribute("d", poly(hull(box)));
    nearW.setAttribute("d", poly(wheel(x, 22, zc, R)));
    hub.setAttribute("d", poly(wheel(x, 22.2, zc, R - 3)));
  }
  draw(pos.x);
  const B = register(stage, (dt) => { const m = stepS(pos, dt); draw(pos.x); return m; });
  bag.add(B.unregister);

  function aim(t) {
    pos.t = t * L;
    read.textContent = t === restT && !aiming ? "rest" : Math.round(t * 100) + "%";
    B.wake();
  }
  let aiming = false;
  read.textContent = "rest";
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [wx] = unproj(C, sx, sy, 0); aiming = true; aim(clamp(wx / L, 0, 1)); },
    leave: () => { aiming = false; aim(restT); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { restT = v / 100; if (!aiming) aim(restT); }, destroy: bag.dispose };
}

hairline({
  name: "wheelchairramp",
  means: "A ramp with a handrail up to a landing: the wheelchair rolls along the slope to where the pointer stands.",
  rules: [1, 3, 5, 8],
  range: [0, 35, 100],
  tour: [[100, 142], [165, 160], [235, 177], null],
  mount,
});
