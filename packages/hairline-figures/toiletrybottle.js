/**
 * Travel bottle: a small squeeze bottle with a hinged flip cap. The pointer
 * on the bottle tips it over to pour, and the cap's lid flips open on its
 * hinge to show the nozzle. At rest the lid sits ajar, bright. The slider is
 * how far the bottle tips.
 */
const {
  Cam, circ, rrect, fit, facing, hull, poly, open, run, proj, rad, clamp,
  tween, tset, tval, tdone, disposer, mk, pointer, register, solid,
} = HL;

const H = 46, NZ = 53, CZ1 = 60, LT = 3.5, R = 7.5, PV = 19, LMAX = rad(118);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tmax = value;
  const C = Cam(45, 0.5, 3.5);
  const tf = (p, a) => { const c = Math.cos(a), s = Math.sin(a), dx = p[0] - PV; return [PV + dx * c + p[2] * s, p[1], -dx * s + p[2] * c]; };
  const lidp = (p, L) => { const c = Math.cos(L), s = Math.sin(L), dx = p[0] + R, dz = p[2] - CZ1; return [-R + dx * c - dz * s, p[1], CZ1 + dx * s + dz * c]; };
  const at = (ring, z) => ring.map((q) => [q.u, q.v, z]);
  const body = rrect(-19, -13, 19, 13, 11, 8), bodyIn = rrect(-17, -11, 17, 11, 9, 8);
  const neck = circ(5, 24), cap = circ(R, 32), capIn = circ(R - 1.6, 32), noz = circ(1.8, 12);
  const front = facing(C);
  const lidLocal = [].concat(at(cap, CZ1), at(cap, CZ1 + LT), [[R + 3.2, -2.6, CZ1], [R + 3.2, 2.6, CZ1], [R + 3.2, -2.6, CZ1 + LT - 1], [R + 3.2, 2.6, CZ1 + LT - 1]]);
  const ext = [];
  for (const a of [0, rad(40)]) for (const L of [0, LMAX]) {
    for (const p of at(body, 0)) ext.push(tf(p, a));
    for (const p of lidLocal) ext.push(tf(lidp(p, L), a));
  }
  fit(C, ext, 200, 166);
  const P = proj(C);
  const pr = (pts, a) => pts.map((p) => P(...tf(p, a)));
  const g = mk("g", {}, svg);
  const sb = solid(g), sc = solid(g), nz = mk("path", {}, sc.g), sl = solid(g);
  sl.sil.classList.add("hi");
  const tilt = tween(rad(4)), lid = tween(rad(26));
  let lastA = NaN, lastL = NaN;

  function draw(a, L) {
    if (a === lastA && L === lastL) return;
    lastA = a; lastL = L;
    sb.sil.setAttribute("d", poly(hull(pr(at(body, 0).concat(at(body, H), at(neck, NZ)), a))));
    sb.cr.setAttribute("d", open(pr(at(run(bodyIn, front), H + 1.5), a)));
    sc.sil.setAttribute("d", poly(hull(pr(at(cap, NZ).concat(at(cap, CZ1)), a))));
    sc.cr.setAttribute("d", open(pr(at(run(capIn, front), CZ1), a)));
    nz.setAttribute("d", poly(hull(pr(at(noz, CZ1).concat(at(noz, CZ1 + 3)), a))));
    sl.sil.setAttribute("d", poly(hull(pr(lidLocal.map((p) => lidp(p, L)), a))));
    sl.cr.setAttribute("d", open(pr(at(run(capIn, front), CZ1 + LT).map((p) => lidp(p, L)), a)));
    if (L > rad(70)) g.insertBefore(sl.g, sc.g); else sc.g.after(sl.g);
  }

  const B = register(stage, (_dt, now) => {
    draw(tval(tilt, now), tval(lid, now));
    return !(tdone(tilt, now) && tdone(lid, now));
  });
  bag.add(B.unregister);

  const rest = hull(pr(at(body, 0).concat(at(cap, CZ1 + LT)), 0));
  const xs = rest.map((q) => q[0]), ys = rest.map((q) => q[1]);
  const box = [Math.min(...xs) - 12, Math.max(...xs) + 12, Math.min(...ys) - 14, Math.max(...ys) + 8];
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    const now = performance.now();
    tset(tilt, v ? rad(tmax) : rad(4), now, 0);
    tset(lid, v ? LMAX : rad(26), now, v ? 0 : 120);
    read.textContent = v ? "pour" : "rest";
    B.wake();
  }
  setOn(false);
  const hit = ([sx, sy]) => sx > box[0] && sx < box[1] && sy > box[2] && sy < box[3];
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { tmax = clamp(v, 10, 40); if (on) { tset(tilt, rad(tmax), performance.now(), 0); B.wake(); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "toiletrybottle",
  means: "A travel squeeze bottle: the pointer tips it to pour and its flip cap opens on the hinge to show the nozzle.",
  rules: [1, 4, 5, 8],
  range: [10, 30, 40],
  tour: [[163, 95], [168, 200], [150, 250], null],
  mount,
});
