/**
 * Spice tin: a flat rounded tin with a lid hinged along its back edge and a
 * heap of spice inside. The pointer over the tin swings the lid up on its
 * hinge and back past upright; at rest it stands ajar, bright. The slider is
 * how far the lid opens.
 *
 * The pattern: one part answering the pointer, a lid turned about a hinge.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rad, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 32, D = 21, H = 20, LT = 3.2;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 3.2);
  fit(C, [[-W, -D, 0], [W, D, 0], [-W, D, 0], [W, -D, 0], [-W, -D - 12, H + 2 * D + 4], [W, -D - 12, H + 2 * D + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const body = mk("g", {}, g);
  const [br, bi] = rings(-W, -D, W, D, 7, 2.2);
  put(solid(body), prism(P, front, br, bi, 0, H));
  // the spice: a low heap inside the rim
  const heap = [];
  for (const [r, z] of [[16, 0], [12, 3], [7, 5.5], [3, 6.5]]) heap.push(...ringAt(P, disc(3, 2, r, 22), H - 5 + z));
  mk("path", { d: poly(hull(heap)), class: "nf lo" }, body);
  // the hinge pins along the back edge
  for (const x of [-W + 9, W - 9]) put(solid(body), prism(P, front, disc(x, -D - 0.6, 2, 14), null, H - 3, H + 1.5));

  const lidG = mk("g", {}, g), lid = solid(lidG);
  lid.sil.classList.add("hi");
  const [lr, li] = rings(-W - 0.8, -D - 0.8, W + 0.8, D + 0.8, 7.5, 2.4);

  let last = NaN, behind = null;
  function draw(t) {
    if (t === last) return;
    last = t;
    const a = rad(18 + (112 * amp - 18) * t), ca = Math.cos(a), sa = Math.sin(a);
    // a lid sample (x, v from the hinge, w up through the lid) turned about the hinge line
    const L = (q, w) => { const v = q.v + D + 0.8; return P(q.u, -D - 0.8 + v * ca - w * sa, H + v * sa + w * ca); };
    const pts = lr.map((q) => L(q, 0)).concat(lr.map((q) => L(q, LT)));
    lid.sil.setAttribute("d", poly(hull(pts)));
    const up = a > Math.PI / 2;
    lid.cr.setAttribute("d", poly(li.map((q) => L(q, up ? 0 : LT))));
    if (up !== behind) { behind = up; if (up) body.before(lidG); else body.after(lidG); }
  }
  const tw = tween(0);
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, H);
  let on = null;
  function set(v) {
    if (v === on) return;
    on = v;
    tset(tw, v ? 1 : 0, performance.now(), 0);
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => set(Math.abs(sx - mid[0]) < 110 && Math.abs(sy - mid[1]) < 80), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "spicetin",
  means: "A flat spice tin with a hinged lid: the pointer swings the lid up and back on its hinge to show the spice inside.",
  rules: [1, 4, 5, 8],
  range: [0.6, 1, 1],
  tour: [[186, 209], [150, 196], [232, 228], null],
  mount,
});
