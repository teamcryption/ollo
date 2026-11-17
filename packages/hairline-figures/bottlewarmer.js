/**
 * Bottle warmer: a round warming pot with a bottle standing in it under a
 * domed lid hinged at the back. Over the pot the lid swings up on its hinge
 * and shows the bottle's teat. At rest the lid sits just ajar, bright. The
 * slider is how wide it opens.
 *
 * The pattern: one lid on a hinge; the hit is a fixed plane through the rim.
 */
const { Cam, clamp, facing, fit, hull, open, poly, prism, proj, rrect, run, ringAt, unproj, tdone, tset, tval, tween, disposer, mk, pointer, register, solid, rad } = HL;

const R = 24, H = 46, AJAR = rad(12);
const prof = [[0, R + 1], [4, R], [10, R - 3.5], [16, R - 10], [20, R - 17], [21.5, 0.01]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let wide = value;
  const C = Cam(45, 0.5, 2.95);
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [-R - 22, 0, H + 2 * R + 2], [0, 0, H + 22]], 226, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const body = solid(g), dial = mk("path", { class: "nf lo" }, body.g), opening = mk("path", { class: "nf lo" }, body.g);
  const bottle = solid(g), teat = solid(g), lid = solid(g);
  const ro = rrect(-R, -R, R, R, R, 14), ri = rrect(-R + 1.6, -R + 1.6, R - 1.6, R - 1.6, R - 1.6, 14);
  const pb = prism(P, front, ro, ri, 0, H);
  body.sil.setAttribute("d", pb.sil); body.cr.setAttribute("d", pb.crease);
  opening.setAttribute("d", poly(ringAt(P, rrect(-15, -15, 15, 15, 15, 14), H)));
  const dc = []; for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; dc.push(P(R * 0.98 * Math.cos(rad(45)) + 4 * Math.cos(a) * 0.7, R * 0.98 * Math.sin(rad(45)) - 4 * Math.cos(a) * 0.7, 16 + 4 * Math.sin(a))); }
  dial.setAttribute("d", poly(dc));
  const bo = rrect(-13, -13, 13, 13, 13, 14), bi = rrect(-11.5, -11.5, 11.5, 11.5, 11.5, 14);
  const pbt = prism(P, front, bo, bi, H, H + 9);
  bottle.sil.setAttribute("d", pbt.sil); bottle.cr.setAttribute("d", pbt.crease);
  const tp = [];
  [[0, 7], [4, 6], [8, 4], [12, 3.2], [15, 2.4], [16.5, 0.01]].forEach(([z, r]) => { for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; tp.push(P(r * Math.cos(a), r * Math.sin(a), H + 9 + z)); } });
  teat.sil.setAttribute("d", poly(hull(tp)));
  teat.cr.setAttribute("d", open(ringAt(P, run(rrect(-9, -9, 9, 9, 9, 14), front), H + 9)));
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
    lid.cr.setAttribute("d", poly(pts.slice(64, 96).map(W)));
    const back = a > rad(60);
    if (back !== behind) { behind = back; if (back) body.g.after(lid.g); else teat.g.after(lid.g); }
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    return Math.hypot(x, y) < R + 12;
  }
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(ang, on ? rad(clamp(40 + wide, 45, 95)) : AJAR, performance.now(), 0);
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
  name: "bottlewarmer",
  means: "A baby bottle warmer: over the pot its domed lid swings up on the back hinge and shows the bottle's teat.",
  rules: [4, 5, 6, 8, 9],
  range: [10, 45, 55],
  tour: [[226, 113], [200, 190], [250, 150], null],
  mount,
});
