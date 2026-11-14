/**
 * Incubator: a cabinet on a low plinth, a mattress on its tray and a clear
 * hood over it, two hand ports on the front. The pointer opens the hood:
 * the further along the cabinet it stands, the higher the hood lifts on its
 * spring, showing the small sleeper under it. At rest the hood sits a little
 * ajar, bright. The slider is how far the hood can lift.
 *
 * The pattern: one part answering where the pointer stands (terrain).
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rings, ringAt, rrect, unproj, circ,
  disposer, mk, pointer, put, register, solid, spring, stepS,
} = HL;

const W = 84, D = 46, CAB = 30, TRAY = 34, HH = 26, AJAR = 5;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, 0, TRAY + 40 + HH], [W, D, TRAY + 40 + HH]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // plinth and cabinet
  const [pr, pi] = rings(-4, -4, W + 4, D + 4, 5, 1.5);
  put(solid(g), prism(P, front, pr, pi, 0, 4));
  const [cr, ci] = rings(4, 4, W - 4, D - 4, 6, 1.8);
  put(solid(g), prism(P, front, cr, ci, 4, CAB));
  // drawer seam on the front face
  mk("path", { d: "M" + P(10, D - 4, 17).join(",") + "L" + P(W - 10, D - 4, 17).join(","), class: "nf lo" }, g);
  // tray and mattress
  const [tr, ti] = rings(0, 0, W, D, 6, 1.6);
  put(solid(g), prism(P, front, tr, ti, CAB, TRAY));
  const [mr, mi] = rings(8, 8, W - 8, D - 8, 5, 1.2);
  put(solid(g), prism(P, front, mr, mi, TRAY, TRAY + 3));
  // the sleeper: a small mound and a round head
  const mound = [];
  for (const [r, z] of [[8, 0], [6.5, 2.5], [4, 4.5]]) mound.push(...ringAt(P, disc(W / 2 + 6, D / 2, r), TRAY + 3 + z).map((p) => p));
  mk("path", { d: poly(hull(mound)), class: "nf" }, g);
  const head = [];
  for (const [r, z] of [[4, 0], [4.5, 2.5], [3, 5]]) head.push(...ringAt(P, disc(W / 2 - 10, D / 2, r), TRAY + 3 + z));
  mk("path", { d: poly(hull(head)), class: "nf" }, g);

  // the hood: rounded box with a slanted front, two ports
  const hood = solid(g), ports = mk("path", { class: "nf lo" }, g);
  hood.sil.classList.add("hi");
  const foot = rrect(2, 2, W - 2, D - 2, 6, 6), top = rrect(6, 6, W - 6, D - 10, 6, 6), inner = rrect(8, 8, W - 8, D - 12, 4, 6);
  const sp = spring(AJAR);
  let last = NaN;
  function draw(lift) {
    if (Math.abs(lift - last) < 0.01) return;
    last = lift;
    const z0 = TRAY + lift, z1 = z0 + HH;
    hood.sil.setAttribute("d", poly(hull(ringAt(P, foot, z0).concat(ringAt(P, top, z1)))));
    const pts = ringAt(P, inner, z1);
    hood.cr.setAttribute("d", "M" + pts.map((p) => p.join(",")).join("L") + "Z");
    let d = "";
    for (const px of [W * 0.3, W * 0.7]) {
      const c = [];
      for (let i = 0; i <= 24; i++) { const a = (i / 24) * Math.PI * 2; c.push(P(px + 6 * Math.cos(a), D - 4, z0 + HH * 0.45 + 6 * Math.sin(a))); }
      d += "M" + c.map((p) => p.join(",")).join("L") + "Z";
    }
    ports.setAttribute("d", d);
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  draw(AJAR);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (x < -20 || x > W + 20 || y < -30 || y > D + 30) return leave();
    const u = clamp(x / W, 0, 1);
    sp.t = AJAR + (reach - AJAR) * (0.25 + 0.75 * u);
    read.textContent = "open " + Math.round(u * 100);
    B.wake();
  }
  function leave() { sp.t = AJAR; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "incubator",
  means: "An infant incubator: the pointer lifts its clear hood on a spring, further along the cabinet higher, showing the sleeper.",
  rules: [1, 3, 5, 6],
  range: [16, 36, 40],
  tour: [[174, 205], [210, 200], [239, 206], null],
  mount,
});
