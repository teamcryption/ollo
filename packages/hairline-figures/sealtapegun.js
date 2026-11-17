/**
 * Gummed tape: a parcel-counter dispenser, a squat body with a big roll of
 * paper tape lying across its back. The pointer pulls the tape: the strip
 * feeds out over the front lip, sagging as it grows, and the roll turns as it
 * pays out. At rest a short tongue shows, bright. The slider is how far it pulls.
 *
 * The pattern: one part sliding on the discrete clock; hit on the ground.
 */
const {
  Cam, clamp, fit, facing, hull, open, poly, prism, proj, rings, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 30, BY = 18, H = 30, RX = -6, RZ = H + 16, R = 20, HW = 13, TW = 11, REST = 12, MAXL = 62;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-BX, -BY, 0], [BX, BY, 0], [BX, -BY, 0], [-BX, BY, 0], [RX, 0, RZ + R], [BX + MAXL, TW, H - 22], [BX + MAXL, -TW, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-BX, -BY, BX, BY, 7, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  const disc = (y, r) => Array.from({ length: 40 }, (_, i) => { const t = (i / 40) * Math.PI * 2; return P(RX + r * Math.cos(t), y, RZ + r * Math.sin(t)); });
  mk("path", { d: poly(hull(disc(-HW, R).concat(disc(HW, R)))), class: "sil" }, g);
  mk("path", { d: poly(disc(HW, R)), class: "nf lo" }, g);
  mk("path", { d: poly(disc(HW, 7)), class: "nf lo" }, g);
  const spoke = mk("path", { class: "nf lo" }, g);
  const tape = mk("path", { class: "sil hi" }, g), lip = mk("path", { class: "nf lo" }, g);
  const L = tween(REST);
  let last = NaN;

  function draw(l) {
    if (l === last) return;
    last = l;
    const xs = [[RX + R * 0.7, RZ - R * 0.7], [BX - 2, H + 1]];
    for (let i = 1; i <= 10; i++) { const d = (i / 10) * l; xs.push([BX - 2 + d, H + 1 - 0.0036 * d * d]); }
    const far = xs.map(([x, z]) => P(x, -TW, z)), near = xs.map(([x, z]) => P(x, TW, z));
    tape.setAttribute("d", poly(far.concat(near.reverse())));
    lip.setAttribute("d", open([P(BX - 2, -TW, H + 1), P(BX - 2, TW, H + 1)]));
    const a = l / R;
    spoke.setAttribute("d", seg(P(RX + 7 * Math.cos(a), HW, RZ + 7 * Math.sin(a)), P(RX + (R - 2) * Math.cos(a), HW, RZ + (R - 2) * Math.sin(a))));
  }

  const B = register(stage, (_dt, now) => { draw(tval(L, now)); return !tdone(L, now); });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    const k = v ? 1 : 0;
    if (k === on) return;
    on = k;
    const l = k ? REST + MAXL * clamp(reach, 0.1, 1) : REST;
    tset(L, l, performance.now(), 0);
    read.textContent = k ? "tape " + Math.round(l) : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); setOn(x > -BX - 24 && x < BX + MAXL && Math.abs(y) < BY + 26); },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "sealtapegun",
  means: "A gummed tape dispenser: the pointer pulls the paper tape out over the front lip, sagging as it grows, and the roll turns.",
  rules: [1, 3, 5, 8],
  range: [0.2, 1, 1],
  tour: [[151, 138], [200, 170], [260, 215], null],
  mount,
});
