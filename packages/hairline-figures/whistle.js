/**
 * Whistle: a pea whistle on a lanyard, its loop hanging off a hook ring.
 * The pointer on the whistle tips it up on its ring, mouthpiece raised to
 * blow. At rest it hangs slightly tipped, bright. The slider is the tip.
 */
const {
  Cam, fit, hull, open, poly, proj, rings, clamp, rad, tween, tset, tval, tdone,
  disposer, mk, pointer, register, solid,
} = HL;

const PX = 44, PZ = 30;
function rotY(p, a) {
  const dx = p[0] - PX, dz = p[2] - PZ, c = Math.cos(a), s = Math.sin(a);
  return [PX + dx * c - dz * s, p[1], PZ + dx * s + dz * c];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 3.0);
  const ext = [[-22, 6, 20], [-22, 14, 12], [28, 20, 4], [0, 0, 24], [28, 0, 4]].flatMap((p) => [rotY(p, rad(-70)), rotY(p, rad(-10))]);
  fit(C, ext.concat([[PX + 16, -12, 0], [PX, 10, 0]]), 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  // ground cord: the lanyard lying away from the ring
  const cord = mk("path", { class: "nf lo" }, g);
  const pts = [];
  for (let i = 0; i <= 16; i++) { const t = i / 16; pts.push(P(PX + 16 * t, 10 - 22 * t + 6 * Math.sin(t * 6), PZ * (1 - t) * (1 - t))); }
  cord.setAttribute("d", open(pts));
  const parts = [
    { box: [0, 0, 28, 20, 4, 24], r: 9, b: 1.6 },
    { box: [-22, 6, 0, 14, 12, 20], r: 2, b: 1 },
  ];
  const sols = parts.map(() => solid(g));
  const ring = mk("path", { class: "nf" }, g);
  const pea = mk("path", { class: "nf lo" }, g);
  function solidPts(pt, a) {
    const [x0, y0, x1, y1, z0, z1] = pt.box;
    const [rg, inn] = rings(x0, y0, x1, y1, pt.r, pt.b);
    const pr = (q, z) => P(...rotY([q.u, q.v, z], a));
    const sil = poly(hull(rg.map((q) => pr(q, z0)).concat(rg.map((q) => pr(q, z1)))));
    const cr = poly(inn.map((q) => pr(q, z1)));
    return { sil, cr };
  }
  const tw = tween(rad(-10));
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    parts.forEach((pt, i) => { const d = solidPts(pt, a); sols[i].sil.setAttribute("d", d.sil); sols[i].cr.setAttribute("d", d.cr); });
    const rp = [];
    for (let i = 0; i <= 20; i++) { const t = (i / 20) * Math.PI * 2; rp.push(P(...rotY([PX - 6 + 7 * Math.cos(t), 10, PZ + 7 * Math.sin(t)], a))); }
    ring.setAttribute("d", poly(rp));
    const sp = [];
    for (let i = 0; i <= 16; i++) { const t = (i / 16) * Math.PI * 2; sp.push(P(...rotY([10 + 5 * Math.cos(t), 10 + 5 * Math.sin(t), 24], a))); }
    pea.setAttribute("d", poly(sp));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const mid = P(10, 10, 14);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? rad(-10 - 60 * clamp(amt, 0.2, 1)) : rad(-10), performance.now(), 0);
    sols[0].sil.classList.toggle("hi", true);
    read.textContent = on ? "blow" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([x, y]) => setActive(Math.hypot(x - mid[0], y - mid[1]) < 80), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "whistle",
  means: "A pea whistle on its lanyard: the pointer tips it up on its ring, mouthpiece raised to blow.",
  rules: [1, 3, 5, 8],
  range: [0.2, 0.7, 1],
  tour: [[164, 202], [140, 190], [185, 214], null],
  mount,
});
