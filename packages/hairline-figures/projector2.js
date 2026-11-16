/**
 * Mini projector: a small rounded body on a round stand, its lens on the
 * front face. The pointer picks one of five aims by its bearing from the
 * stand on the ground: the body turns on the stand to face it, eased.
 * At rest it is turned a little aside, the lens bright.
 * The slider is how far it turns.
 */
const { Cam, clamp, facing, fit, prism, proj, rings, poly, rrect, tdone, tset, tval, tween, unproj, disposer, mk, pointer, put, register, solid } = HL;

const W = 34, D = 26, Z0 = 6, H = 18, LR = 6.5, AIMS = [-50, -25, 0, 25, 50], REST = -14, S = 5.2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 90;
  const C = Cam(45, 0.5, S);
  const R = Math.hypot(W, D) / 2;
  fit(C, [[-R, -R, 0], [R, R, 0], [-R, R, 0], [R, -R, 0], [0, 0, Z0 + H], [-R, R, Z0 + H], [R, -R, Z0 + H]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const stand = solid(g);
  put(stand, prism(P, front, rrect(-9, -9, 9, 9, 9, 10), rrect(-8, -8, 8, 8, 8, 10), 0, Z0));
  const body = solid(g);
  const lens = mk("path", { class: "sil" }, body.g);
  const lensIn = mk("path", { class: "nf lo" }, body.g);
  const o0 = rrect(-W / 2, -D / 2, W / 2, D / 2, 6, 8), i0 = rrect(-W / 2 + 1.4, -D / 2 + 1.4, W / 2 - 1.4, D / 2 - 1.4, 4.6, 8);
  const ang = tween(REST);
  let last = NaN;

  function rot(rg, c, s) { return rg.map((p) => ({ u: p.u * c - p.v * s, v: p.u * s + p.v * c, nu: p.nu * c - p.nv * s, nv: p.nu * s + p.nv * c })); }
  function draw(a) {
    if (a === last) return;
    last = a;
    const t = (a * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
    put(body, prism(P, front, rot(o0, c, s), rot(i0, c, s), Z0, Z0 + H));
    const circle = (r) => { const pts = []; for (let n = 0; n < 28; n++) { const q = (n / 28) * Math.PI * 2, lx = 4 + r * Math.cos(q), ly = D / 2 + 0.2; pts.push(P(lx * c - ly * s, lx * s + ly * c, Z0 + H / 2 + r * Math.sin(q))); } return poly(pts); };
    const vis = front({ u: 0, v: 0, nu: -s, nv: c });
    lens.setAttribute("d", vis ? circle(LR) : "");
    lensIn.setAttribute("d", vis ? circle(LR - 2.4) : "");
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (Math.hypot(x, y) > 70 || y < 4) return -1;
    const b = (Math.atan2(x, y) * 180) / Math.PI;
    let best = 0;
    AIMS.forEach((v, k) => { if (Math.abs(v - b) < Math.abs(AIMS[best] - b)) best = k; });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a < 0 ? REST : clamp(AIMS[a] * reach, -50, 50), performance.now(), 0);
    lens.classList.toggle("hi", a < 0);
    body.sil.classList.toggle("hi", a >= 0);
    read.textContent = a < 0 ? "rest" : "aim " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 90; if (act >= 0) { const a = act; act = -2; setActive(a); } }, destroy: bag.dispose };
}

hairline({
  name: "projector2",
  means: "A mini projector on a stand: it turns on the stand to face where the pointer is.",
  rules: [1, 3, 5],
  range: [30, 90, 90],
  tour: [[53, 175], [126, 212], [200, 248], null],
  mount,
});
