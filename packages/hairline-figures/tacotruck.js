/**
 * Food truck: a box van with a cab, a service window on its long side and a
 * hinged hatch over it. The pointer over the truck swings the hatch up into
 * an awning above the counter; leaving lets it fall back to ajar. At rest the
 * hatch hangs a little open, bright. The slider is how far it opens.
 *
 * The pattern: one part swinging on a hinge.
 */
const {
  Cam, fit, facing, fillet, hull, poly, prism, proj, rings, unproj, clamp, tset, tval, tdone, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 120, W = 50, Z0 = 9, ZT = 60, HZ = 54, HL_ = 27, X0 = 24, X1 = 96, RW = 9;
const REST = 0.42;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = (value * Math.PI) / 180;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-4, -4, 0], [152, -4, 0], [152, W + 4, 0], [-4, W + 4, 0], [0, 0, ZT], [L, W + HL_, HZ], [X0, W + HL_, HZ + 4]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  function wheel(cx, y0, y1) {
    const pts = [];
    for (let i = 0; i < 24; i++) {
      const t = (i / 24) * Math.PI * 2, x = cx + RW * Math.cos(t), z = RW + RW * Math.sin(t);
      pts.push(P(x, y0, z), P(x, y1, z));
    }
    const s = solid(g);
    s.sil.setAttribute("d", poly(hull(pts)));
    const hub = [];
    for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2; hub.push(P(cx + 3.5 * Math.cos(t), y1, RW + 3.5 * Math.sin(t))); }
    mk("path", { d: poly(hub), class: "nf lo" }, s.g);
  }
  wheel(24, -1, 6); wheel(132, -1, 6);
  const [br, bi] = rings(0, 0, L, W, 6, 2);
  put(solid(g), prism(P, front, br, bi, Z0, ZT));
  const [cr, ci] = rings(L - 2, 3, 150, W - 3, 9, 2);
  put(solid(g), prism(P, front, cr, ci, Z0, 44));
  mk("path", { d: poly(fillet([P(150, 9, 28), P(150, W - 9, 28), P(150, W - 9, 40), P(150, 9, 40)], [2, 2, 2, 2])), class: "nf lo" }, g);
  wheel(24, W - 6, W + 1); wheel(132, W - 6, W + 1);
  // the service window and its counter
  mk("path", { d: poly(fillet([P(X0 + 4, W, 31), P(X1 - 4, W, 31), P(X1 - 4, W, HZ - 3), P(X0 + 4, W, HZ - 3)], [2, 2, 2, 2])), class: "nf lo" }, g);
  const [kr, ki] = rings(X0 + 2, W, X1 - 2, W + 7, 1.5, 0.6);
  put(solid(g), prism(P, front, kr, ki, 28, 30));

  const flap = mk("path", { class: "sil" }, g), edge = mk("path", { class: "nf lo" }, g);
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const dy = HL_ * Math.sin(a), dz = -HL_ * Math.cos(a), ny = 1.6 * Math.cos(a), nz = 1.6 * Math.sin(a);
    const c = (x, t, o) => P(x, W + 0.5 + dy * t + ny * o, HZ + dz * t + nz * o);
    const r = [2, 2, 2, 2];
    flap.setAttribute("d", poly(hull([c(X0, 0, 0), c(X1, 0, 0), c(X1, 1, 0), c(X0, 1, 0), c(X0, 0, 1), c(X1, 0, 1), c(X1, 1, 1), c(X0, 1, 1)])));
    edge.setAttribute("d", poly(fillet([c(X0 + 1, 0.04, 1), c(X1 - 1, 0.04, 1), c(X1 - 1, 0.97, 1), c(X0 + 1, 0.97, 1)], r)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let on = null;
  function setOpen(o) {
    if (o === on) return;
    on = o;
    tset(ang, o ? maxA : REST, performance.now(), 0);
    read.textContent = o ? "open " + Math.round((maxA * 180) / Math.PI) + "°" : "rest";
    B.wake();
  }
  flap.classList.add("hi");
  setOpen(false);
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 30);
    return x > -6 && x < 156 && y > -6 && y < W + 16;
  }
  bag.add(pointer(stage, { move: (p) => setOpen(hit(p)), leave: () => setOpen(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = clamp(v, 40, 100) * Math.PI / 180; if (on) { on = null; setOpen(true); } }, destroy: bag.dispose };
}

hairline({
  name: "tacotruck",
  means: "A food truck with a hinged hatch: the pointer swings it up into an awning over the counter; at rest it hangs ajar.",
  rules: [1, 3, 5, 8],
  range: [40, 80, 100],
  tour: [[200, 170], [150, 185], [250, 160], null],
  mount,
});
