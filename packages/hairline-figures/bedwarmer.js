/**
 * Bed warmer: a round brass pan on a long handle, with a pierced, domed lid
 * hinged on the handle side. Over the pan the lid swings open on its hinge to
 * show where the coals go. At rest the lid sits just ajar, bright. The slider
 * is how wide it opens.
 *
 * The pattern: one lid on a hinge; the hit is a fixed plane through the pan's rim.
 */
const { Cam, clamp, circ, facing, fit, hull, poly, prism, proj, rings, ringAt, unproj, tdone, tset, tval, tween, disposer, mk, pointer, register, solid, rad } = HL;

const R = 18, H = 7, AJAR = rad(10);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let wide = value;
  const C = Cam(45, 0.5, 2.85);
  fit(C, [[-84, 0, 0], [R, 0, 0], [0, R, 0], [0, -R, 0], [-84, 0, 18], [-R - 6, 0, H + 2 * R]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const handle = solid(g), grip = solid(g), lid = solid(g), holes = mk("path", { class: "nf lo" }, lid.g), pan = solid(g);
  const tube = (x0, z0, x1, z1, r) => {
    const pts = [];
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; pts.push([x0, r * Math.cos(a), z0 + r * Math.sin(a)], [x1, r * Math.cos(a), z1 + r * Math.sin(a)]); }
    return poly(hull(pts.map((p) => P(...p))));
  };
  handle.sil.setAttribute("d", tube(-R + 2, H - 2, -58, 12, 1.3));
  grip.sil.setAttribute("d", tube(-58, 12, -84, 16, 2.6));
  const [ro, ri] = rings(-R, -R, R, R, R, 1.2);
  put2(pan, prism(P, front, ro, ri, 0, H));
  function put2(s, p) { s.sil.setAttribute("d", p.sil); s.cr.setAttribute("d", p.crease); }

  const prof = [[0, R], [2.2, R * 0.86], [4, R * 0.62], [5.2, R * 0.34], [5.6, 0.01]];
  const holePts = [];
  [[6, 6], [11.5, 10]].forEach(([r, n], k) => { for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + k * 0.3; holePts.push([R + r * Math.cos(a), r * Math.sin(a), 5.6 * (1 - (r / R) ** 2)]); } });
  const ang = tween(AJAR);
  let last = NaN, behind = false;

  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(a), s = Math.sin(a);
    const W = ([lx, ly, lz]) => P(-R + lx * c - lz * s, ly, H + lx * s + lz * c);
    const pts = [];
    prof.forEach(([lz, r]) => { for (let i = 0; i < 32; i++) { const b = (i / 32) * Math.PI * 2; pts.push([R + r * Math.cos(b), r * Math.sin(b), lz]); } });
    lid.sil.setAttribute("d", poly(hull(pts.map(W))));
    lid.cr.setAttribute("d", poly(pts.slice(0, 32).map(W)) + poly(pts.slice(64, 96).map(W)));
    let d = "";
    holePts.forEach(([x, y, z]) => { const q = []; for (let i = 0; i < 8; i++) { const b = (i / 8) * Math.PI * 2; q.push([x + 1.3 * Math.cos(b), y + 1.3 * Math.sin(b), z + 0.2]); } d += poly(q.map(W)); });
    holes.setAttribute("d", d);
    const back = a > rad(55);
    if (back !== behind) { behind = back; if (back) handle.g.after(lid.g); else pan.g.after(lid.g); }
  }
  pan.g.after(lid.g);

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    return Math.hypot(x, y) < R + 10;
  }
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    const A = clamp(40 + wide, 35, 125);
    tset(ang, on ? rad(A) : AJAR, performance.now(), 0);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  lid.sil.classList.add("hi");
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { wide = v; act = null; }, destroy: bag.dispose };
}

hairline({
  name: "bedwarmer",
  means: "A bed warming pan on a long handle: over the pan its pierced, domed lid swings open on its hinge.",
  rules: [1, 3, 4, 5],
  range: [0, 45, 90],
  tour: [[277, 210], [90, 90], [300, 205], null],
  mount,
});
