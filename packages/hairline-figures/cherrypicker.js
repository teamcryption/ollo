/**
 * Cherry picker: a wheeled base, a turret and a long boom with a bucket on
 * its end. Over the machine the boom swings up on the 700ms ease and the
 * bucket rides it, kept level; leaving lowers it to a low reach, the bucket
 * bright. The slider is the boom's top angle.
 *
 * The pattern: one part answering a discrete choice (tween).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, clamp, rad, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = 34, LEN = 70, PX = -24, PZ = 26;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value;
  const C = Cam(45, 0.5, 2.65);
  const end = (a) => [PX + LEN * Math.cos(rad(a)), PZ + LEN * Math.sin(rad(a))];
  const pts = [[-42, -18, 0], [42, 18, 0], [42, -18, 0], [-42, 18, 0]];
  for (const a of [REST, 75]) { const [ex, ez] = end(a); pts.push([ex - 9, -9, ez - 18], [ex + 9, 9, ez + 6]); }
  fit(C, pts, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-40, -16, 40, 16, 5, 1.6);
  put(solid(g), prism(P, front, cr, ci, 5, 15));
  for (const x of [-26, 26]) {
    const w = [];
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; w.push(P(x + 6 * Math.cos(a), 16.5, 6 + 6 * Math.sin(a))); }
    mk("path", { d: poly(w) }, g);
  }
  const [tr, ti] = rings(PX - 9, -9, PX + 9, 9, 6, 1.4);
  put(solid(g), prism(P, front, tr, ti, 15, PZ));
  const boom = mk("path", {}, g), fly = mk("path", { class: "lo nf" }, g);
  const hinge = mk("circle", { class: "dot m", r: 2.2 }, g);
  const bucket = solid(g);
  bucket.sil.classList.add("hi");
  const [br, bi] = rings(-8, -8, 8, 8, 2.5, 1.2);
  const mv = (ring, x) => ring.map((q) => ({ ...q, u: q.u + x }));

  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const [ex, ez] = end(a), c = Math.cos(rad(a)), s = Math.sin(rad(a)), t = 3;
    const q = (x, z) => P(x, 0, z);
    boom.setAttribute("d", poly([q(PX - s * t, PZ + c * t), q(ex - s * t, ez + c * t), q(ex + s * t, ez - c * t), q(PX + s * t, PZ - c * t)]));
    const m = 0.55;
    fly.setAttribute("d", "M" + q(PX + LEN * m * c, PZ + LEN * m * s).join(",") + "L" + q(ex, ez).join(","));
    const [hx, hy] = P(PX, 0, PZ);
    hinge.setAttribute("cx", hx); hinge.setAttribute("cy", hy);
    put(bucket, prism(P, front, mv(br, ex), mv(bi, ex), ez - 16, ez + 2));
  }

  const B = register(stage, (dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  function move([sx, sy]) {
    if (Math.abs(sx - 200) > 130 || sy < 15 || sy > 305) return leave();
    tset(ang, top, performance.now(), 0);
    read.textContent = "boom " + Math.round(top) + "°";
    B.wake();
  }
  function leave() { tset(ang, REST, performance.now(), 0); read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { top = clamp(v, 52, 75); }, destroy: bag.dispose };
}

hairline({
  name: "cherrypicker",
  means: "A cherry picker: over it the long boom swings up and lifts the bucket; the slider sets the boom's top angle.",
  rules: [3, 5, 8],
  range: [52, 64, 75],
  tour: [[264, 129], [200, 200], [140, 175], null],
  mount,
});
