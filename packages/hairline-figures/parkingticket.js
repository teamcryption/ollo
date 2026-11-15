/**
 * Ticket barrier: a pay housing on a kerb island, a striped boom arm and the
 * post its tip rests on. Point at the lane and the boom swings up; leave and
 * it settles back on its post. At rest the boom is bright, a touch raised.
 * The slider is how far the boom opens.
 *
 * The pattern: one part swinging about a pivot.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, seg, unproj, rad, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 108, PZ = 36, PY = 18, REST = 4, W = 2.4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 1.88);
  const tipAt = (a) => [8, PY + L * Math.cos(rad(a)), PZ + L * Math.sin(rad(a))];
  fit(C, [[-6, -6, 0], [22, -6, 0], [-6, PY + L + 6, 0], [22, PY + L + 6, 0], tipAt(80), [8, PY, PZ + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [ir, ii] = rings(-6, -6, 22, 26, 4, 1.5);
  put(solid(g), prism(P, front, ir, ii, 0, 3));
  const [hr, hi] = rings(0, 0, 16, 16, 3, 1.5);
  put(solid(g), prism(P, front, hr, hi, 3, 46));
  const [cr, ci] = rings(2, 2, 14, 14, 2.5, 1);
  put(solid(g), prism(P, front, cr, ci, 46, 49));
  // ticket slot on the near face
  mk("path", { d: seg(P(16, 4, 30), P(16, 12, 30)), class: "lo nf" }, g);
  const tip = tipAt(REST), py = tip[1];
  const [pr, pi] = rings(4, py - 4, 12, py + 4, 2.5, 1);
  put(solid(g), prism(P, front, pr, pi, 0, tip[2] - W - 0.4));
  // the pivot hub
  const hub = solid(g);
  const [ur, ui] = rings(3, PY - 2, 13, PY + 4, 3, 1);
  put(hub, prism(P, front, ur, ui, PZ - 6, PZ + 6));
  const arm = mk("path", { class: "sil" }, g), stripes = mk("path", { class: "lo nf" }, g);

  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const pt = (t, dx, dz) => P(8 + dx, PY + t * c - dz * s, PZ + t * s + dz * c);
    const pts = [];
    for (const t of [0, L]) for (const dx of [-W, W]) for (const dz of [-W, W]) pts.push(pt(t, dx, dz));
    arm.setAttribute("d", poly(hull(pts)));
    let d = "";
    for (let t = 22; t < L; t += 20) d += seg(pt(t, W, W), pt(t + 8, -W, W)) + seg(pt(t, W, W), pt(t + 8, W, -W));
    stripes.setAttribute("d", d);
  }

  const ang = tween(REST);
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(ang, on ? open : REST, performance.now(), 0);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  arm.classList.add("hi");
  setActive(false);
  const hit = ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, 0); return x > -30 && x < 50 && y > -10 && y < PY + L + 10; };
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "parkingticket",
  means: "A car park ticket barrier: point at the lane and the striped boom swings up off its post; leave and it settles back.",
  rules: [1, 3, 5, 8],
  range: [40, 65, 80],
  tour: [[270, 228], [177, 274], [118, 304], null],
  mount,
});
