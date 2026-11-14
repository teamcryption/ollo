/**
 * Reptile tank: a long glass tank with a rock and a branch inside, a mesh lid
 * on top and a heat lamp clamped to the lid. The pointer over the tank slides
 * the lid back, lamp and all, to open the tank; the lid turns bright. At rest
 * the lid is shut and the lamp's dome is the bright mark. The slider is how
 * far the lid slides.
 *
 * The pattern: one part sliding (drawer).
 */
const {
  Cam, circ, fit, facing, hull, poly, open, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 90, D = 44, H = 40, LID = 2.5, LR = 11;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let slide = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-4, -4, 0], [L + 4, D + 4, 0], [-50, -4, H + 30], [L + 4, D + 4, H], [L + 4, -4, H], [-4, D + 4, 0]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // back plate of the glass, then inside things, then front glass as outline
  const [tr, ti] = rings(0, 0, L, D, 3, 1.6);
  mk("path", { d: poly(ringAt(P, tr, 0)), class: "lo" }, g);
  // substrate
  put(solid(g), prism(P, front, rings(1.5, 1.5, L - 1.5, D - 1.5, 2, 1.2)[0], rings(1.5, 1.5, L - 1.5, D - 1.5, 2, 1.2)[1], 0, 6));
  // rock and branch
  const rock = [];
  for (const [r, z] of [[10, 6], [8, 11], [4.5, 15]]) rock.push(...ringAt(P, disc(64, 24, r, 20), z));
  mk("path", { d: poly(hull(rock)) }, g);
  mk("path", { d: seg(P(14, 30, 6), P(42, 14, 26)) + seg(P(30, 21, 17), P(40, 30, 24)), class: "lo nf" }, g);
  // glass walls: silhouette, far vertical edges dim
  const glass = mk("path", { class: "sil nf" }, g);
  glass.setAttribute("d", poly(hull(ringAt(P, tr, 0).concat(ringAt(P, tr, H)))));
  mk("path", { d: open(ringAt(P, ti, H - 1.6)), class: "lo nf" }, g);
  // the lid and lamp, one group that slides along x
  const lidS = solid(g), mesh = mk("path", { class: "nf lo" }, g), lamp = mk("path", {}, g), lampRim = mk("path", { class: "nf lo" }, g);
  lidS.sil.classList.add("sil");
  let last = NaN;
  function draw(dx) {
    if (dx === last) return;
    last = dx;
    const [lr, li] = rings(-dx, 0, L - dx, D, 3, 1.6);
    put(lidS, prism(P, front, lr, li, H, H + LID));
    let m = "";
    for (let k = 1; k < 6; k++) m += seg(P(-dx + (k * L) / 6, 2, H + LID), P(-dx + (k * L) / 6, D - 2, H + LID));
    mesh.setAttribute("d", m);
    const cx = -dx + 26, cy = D / 2, pts = [];
    for (let i = 0; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); pts.push(...ringAt(P, disc(cx, cy, LR * Math.cos(t) + 1, 24), H + LID + 3 + LR * 0.9 * Math.sin(t))); }
    lamp.setAttribute("d", poly(hull(pts.concat(ringAt(P, disc(cx, cy, LR, 24), H + LID)))));
    lampRim.setAttribute("d", poly(ringAt(P, disc(cx, cy, LR, 28), H + LID + 3)));
  }
  const dt = tween(0);
  const B = register(stage, (_dt, now) => { draw(tval(dt, now)); return !tdone(dt, now); });
  bag.add(B.unregister);

  // hit: the tank's rest box on screen, which never moves
  const pts = ringAt(P, tr, 0).concat(ringAt(P, tr, H + LID + LR + 4));
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const bx0 = Math.min(...xs), bx1 = Math.max(...xs), by0 = Math.min(...ys), by1 = Math.max(...ys);
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(dt, v ? slide : 0, performance.now(), 0);
    lidS.sil.classList.toggle("hi", v);
    lamp.setAttribute("class", v ? "" : "hi");
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setOn(sx > bx0 && sx < bx1 && sy > by0 && sy < by1),
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { slide = v; if (on) { tset(dt, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "snaketank",
  means: "A reptile tank with a heat lamp on its lid: the pointer over it slides the lid back to open the tank.",
  rules: [1, 4, 5, 6],
  range: [20, 40, 50],
  tour: [[200, 177], [237, 268], [163, 126], null],
  mount,
});
