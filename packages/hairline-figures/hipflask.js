/**
 * Hip flask: a flat curved flask with a narrow shoulder, a short neck and a
 * hinged cap. At rest the flask stands with its cap flipped slightly ajar,
 * bright. The pointer over the flask tips it onto its corner to pour and the
 * cap swings fully open on its hinge. The slider is how far it tips.
 *
 * The pattern: one part answering a hover, hit on the rest pose.
 */
const { Cam, circ, rrect, fit, hull, poly, proj, rad, tween, tset, tval, tdone, disposer, mk, pointer, register, solid } = HL;

const W = 27, D = 7, H = 58, SH = 66, NR = 4.2, NZ = 72, CR = 5.4, CH = 8, HX = NR + 1.2;
const at = (ring, z, ox = 0) => ring.map((q) => [q.u + ox, q.v, z]);
const roty = (p, a, cx, cz) => { const dx = p[0] - cx, dz = p[2] - cz, c = Math.cos(a), s = Math.sin(a); return [cx + dx * c + dz * s, p[1], cz - dx * s + dz * c]; };

const BODY = [at(rrect(-W, -D, W, D, 6.5, 8), 0), at(rrect(-W, -D, W, D, 6.5, 8), H), at(rrect(-W + 7, -D + 1.5, W - 7, D - 1.5, 5, 8), SH)];
const BODYCR = at(rrect(-W + 8.2, -D + 2.6, W - 8.2, D - 2.6, 4, 8), SH);
const NECK = [at(circ(NR, 20), SH - 1), at(circ(NR, 20), NZ)];
const CAP = [at(circ(CR, 24), NZ), at(circ(CR, 24), NZ + CH)];
const CAPCR = at(circ(CR - 1.4, 24), NZ + CH);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tip = value;
  const C = Cam(45, 0.5, 3.0);
  const pose = (p, tilt, cap) => roty(cap ? roty(p, cap, HX, NZ) : p, tilt, W, 0);
  const ext = [];
  for (const [t, c] of [[0, 0], [rad(45), rad(160)], [rad(4), rad(25)]]) for (const r of BODY.concat(CAP)) for (const p of r) ext.push(pose(p, t, CAP.includes(r) ? c : 0));
  fit(C, ext, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const body = solid(g), neck = solid(g), cap = solid(g);
  cap.sil.classList.add("hi");
  const tw = { t: tween(rad(4)), c: tween(rad(25)) };
  let last = "";

  function draw(t, c) {
    const k = t.toFixed(4) + c.toFixed(4);
    if (k === last) return;
    last = k;
    const pr = (ring, cc) => ring.map((p) => P(...pose(p, t, cc)));
    body.sil.setAttribute("d", poly(hull(BODY.flatMap((r) => pr(r, 0)))));
    body.cr.setAttribute("d", poly(pr(BODYCR, 0)));
    neck.sil.setAttribute("d", poly(hull(NECK.flatMap((r) => pr(r, 0)))));
    cap.sil.setAttribute("d", poly(hull(CAP.flatMap((r) => pr(r, c)))));
    cap.cr.setAttribute("d", poly(pr(CAPCR, c)));
  }

  const B = register(stage, (_dt, now) => { draw(tval(tw.t, now), tval(tw.c, now)); return !tdone(tw.t, now) || !tdone(tw.c, now); });
  bag.add(B.unregister);

  const rest = BODY.concat(CAP).flatMap((r) => r.map((p) => P(...pose(p, rad(4), 0))));
  const xs = rest.map((q) => q[0]), ys = rest.map((q) => q[1]);
  const box = [Math.min(...xs) - 6, Math.min(...ys) - 6, Math.max(...xs) + 6, Math.max(...ys) + 6];
  const hit = ([sx, sy]) => sx > box[0] && sx < box[2] && sy > box[1] && sy < box[3];

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const now = performance.now();
    tset(tw.t, a ? rad(tip) : rad(4), now, 0);
    tset(tw.c, a ? rad(160) : rad(25), now, a ? 60 : 0);
    read.textContent = a ? "pour" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tip = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "hipflask",
  means: "A hip flask with a hinged cap: under the pointer it tips onto its corner to pour and the cap swings open.",
  rules: [1, 4, 5, 8],
  range: [20, 35, 45],
  tour: [[138, 163], [175, 120], [200, 200], null],
  mount,
});
