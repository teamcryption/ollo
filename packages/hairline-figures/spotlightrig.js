/**
 * Follow spot: a long lamp barrel on a yoke, standing on a tripod. The
 * pointer on the floor is the performer: the barrel pans and tilts to follow
 * it, on springs. At rest it aims down-left, its lens bright. The slider is
 * how quickly it follows.
 *
 * The pattern: a continuous aim (two springs on angles), hit on the ground.
 */
const {
  Cam, clamp, fit, hull, poly, proj, seg, unproj, spring, stepS, rad,
  disposer, mk, pointer, register,
} = HL;

const PIV = [0, 0, 62], LEN = 70, RB = 9, RF = 12, REST = [200, -14];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-40, -40, 0], [40, 40, 0], [-44, 0, 90], [44, 0, 90], [0, -44, 90], [0, 44, 90]], 200, 170);
  const P = proj(C), g = mk("g", {}, svg);
  // tripod legs, the post, then the yoke and the barrel
  for (const a of [30, 150, 270]) mk("path", { d: seg(P(28 * Math.cos(rad(a)), 28 * Math.sin(rad(a)), 0), P(0, 0, 34)), class: "sil nf" }, g);
  mk("path", { d: seg(P(0, 0, 34), P(0, 0, PIV[2] - RB - 2)), class: "sil nf" }, g);
  const yoke = mk("path", { class: "nf" }, g), body = mk("path", { class: "sil" }, g), lens = mk("path", { class: "nf hi" }, g), band = mk("path", { class: "nf lo" }, g);
  const pan = spring(REST[0], { k: 100 * value, c: 18 * Math.sqrt(value) }), tilt = spring(REST[1], { k: 100 * value, c: 18 * Math.sqrt(value) });
  let lastKey = "";
  function ring(d, u, v, off, r) {
    return Array.from({ length: 28 }, (_, i) => {
      const t = (i / 28) * Math.PI * 2;
      return P(...[0, 1, 2].map((j) => PIV[j] + d[j] * off + r * (Math.cos(t) * u[j] + Math.sin(t) * v[j])));
    });
  }
  function draw() {
    const key = pan.x.toFixed(2) + "," + tilt.x.toFixed(2);
    if (key === lastKey) return;
    lastKey = key;
    const a = rad(pan.x), e = rad(tilt.x);
    const d = [Math.cos(a) * Math.cos(e), Math.sin(a) * Math.cos(e), Math.sin(e)];
    const u = [-Math.sin(a), Math.cos(a), 0], v = [u[1] * d[2] - u[2] * d[1], u[2] * d[0] - u[0] * d[2], u[0] * d[1] - u[1] * d[0]];
    const back = ring(d, u, v, -LEN * 0.4, RB), fr = ring(d, u, v, LEN * 0.6, RF), mid = ring(d, u, v, LEN * 0.15, RB + 1.2);
    const nearFront = d[0] + d[1] > 0;
    body.setAttribute("d", poly(hull(back.concat(fr))));
    lens.setAttribute("d", poly(nearFront ? fr : back));
    band.setAttribute("d", poly(mid));
    const ya = P(...[0, 1, 2].map((j) => PIV[j] + u[j] * (RB + 3))), yb = P(...[0, 1, 2].map((j) => PIV[j] - u[j] * (RB + 3)));
    yoke.setAttribute("d", seg(P(0, 0, PIV[2] - RB - 4), ya) + seg(P(0, 0, PIV[2] - RB - 4), yb));
    if (!nearFront) body.after(lens);
  }
  const B = register(stage, (dt) => { const a = stepS(pan, dt), b = stepS(tilt, dt); draw(); return a || b; });
  bag.add(B.unregister);
  function aim(p) {
    let tgt = null;
    if (p) { const [x, y] = unproj(C, p[0], p[1], 0); if (Math.hypot(x, y) < 160) tgt = [x, y]; }
    if (tgt) {
      let a = (Math.atan2(tgt[1], tgt[0]) * 180) / Math.PI;
      while (a - pan.t > 180) a -= 360;
      while (a - pan.t < -180) a += 360;
      pan.t = a;
      tilt.t = clamp((-Math.atan2(PIV[2], Math.hypot(...tgt) + 1) * 180) / Math.PI, -55, -8);
    } else { pan.t = REST[0]; tilt.t = REST[1]; }
    read.textContent = tgt ? "pan " + Math.round(((pan.t % 360) + 360) % 360) : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { pan.k = tilt.k = 100 * v; pan.c = tilt.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "spotlightrig",
  means: "A follow spot on a tripod: its barrel pans and tilts to follow the pointer across the floor.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[317, 260], [83, 260], [200, 300], null],
  mount,
});
