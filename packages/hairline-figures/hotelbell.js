/**
 * Key drop: a hotel key drop box, a rounded chest with a wide hinged flap over
 * its slot. The pointer swings the flap up on its back hinge, opening the slot
 * for a key. At rest the flap is held a little ajar, bright. The slider is how
 * far it opens.
 *
 * The pattern: one part swinging on the discrete clock; hit on the ground.
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rad, rings, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 40, BY = 30, H = 46, FX = 31, FY0 = -22, FL = 42, REST = 10, MAXA = 105;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-BX, -BY, 0], [BX, BY, 0], [BX, -BY, 0], [-BX, BY, 0], [-FX, FY0, H + FL], [FX, FY0, H + FL], [FX, FY0 + FL, H + 4]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-BX, -BY, BX, BY, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  mk("path", { d: poly([P(-FX + 3, FY0 + 6, H), P(FX - 3, FY0 + 6, H), P(FX - 3, FY0 + 14, H), P(-FX + 3, FY0 + 14, H)]), class: "lo" }, g);
  mk("path", { d: poly([P(-FX, FY0 - 2, H), P(FX, FY0 - 2, H), P(FX, FY0 + 2, H), P(-FX, FY0 + 2, H)]), class: "nf lo" }, g);
  const flap = mk("path", { class: "sil hi" }, g), edge = mk("path", { class: "nf lo" }, g);
  const A = tween(REST);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const q = (x, d, t) => P(x, FY0 + d * c - t * s, H + 0.5 + d * s + t * c);
    const pts = [];
    for (const t of [0, 2.5]) for (const x of [-FX, FX]) for (const d of [0, FL]) pts.push(q(x, d, t));
    flap.setAttribute("d", poly(hull(pts)));
    edge.setAttribute("d", poly([q(-FX + 3, 4, 2.5), q(FX - 3, 4, 2.5), q(FX - 3, FL - 4, 2.5), q(-FX + 3, FL - 4, 2.5)]));
  }

  const B = register(stage, (_dt, now) => { draw(tval(A, now)); return !tdone(A, now); });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    const k = v ? 1 : 0;
    if (k === on) return;
    on = k;
    const a = k ? REST + (MAXA - REST) * clamp(reach, 0.1, 1) : REST;
    tset(A, a, performance.now(), 0);
    read.textContent = k ? "open " + Math.round(a) + "°" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); setOn(Math.abs(x) < BX + 30 && Math.abs(y) < BY + 30); },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "hotelbell",
  means: "A hotel key drop box: the pointer swings its wide flap up on the back hinge to open the slot for a key.",
  rules: [1, 3, 5, 8],
  range: [0.2, 1, 1],
  tour: [[200, 160], [175, 140], [230, 200], null],
  mount,
});
