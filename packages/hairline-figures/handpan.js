/**
 * Handpan: a steel lens with a raised centre note and a ring of tone fields,
 * resting on a low three-legged stand. The pan tilts its face toward the
 * pointer, steeper the farther out. At rest it tips slightly forward with the
 * centre note bright. The slider is how far it can tilt.
 */
const { Cam, circ, clamp, fit, hull, poly, proj, seg, unproj, spring, stepS, disposer, mk, pointer, register } = HL;

const R = 58, Z0 = 40, MAX = 0.5, REST = [0.12, 0.1];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-R, -R, 0], [R, R, 0], [-R, R, Z0 + 40], [R, -R, Z0 + 40], [0, 0, Z0 + 46]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const legs = mk("path", { class: "nf sil" }, g);
  let ld = "";
  for (let k = 0; k < 3; k++) { const a = 0.7 + k * 2.094; ld += seg(P(Math.cos(a) * 44, Math.sin(a) * 44, 0), P(Math.cos(a) * 16, Math.sin(a) * 16, Z0 - 12)); }
  legs.setAttribute("d", ld);
  const body = mk("path", { class: "sil" }, g), rim = mk("path", { class: "nf lo" }, g);
  const fields = Array.from({ length: 8 }, () => mk("path", { class: "nf lo" }, g));
  const ding = mk("path", { class: "nf hi" }, g);
  const tx = spring(REST[0], { k: 110, c: 15 }), ty = spring(REST[1], { k: 110, c: 15 });
  let lim = MAX * value, last = "";
  function draw() {
    const key = tx.x.toFixed(3) + ty.x.toFixed(3);
    if (key === last) return;
    last = key;
    const a = tx.x, b = ty.x;
    // tilt: rotate about y by a, about x by b, around (0,0,Z0)
    const T = (x, y, z) => {
      const x1 = x * Math.cos(a) + z * Math.sin(a), z1 = -x * Math.sin(a) + z * Math.cos(a);
      const y2 = y * Math.cos(b) - z1 * Math.sin(b), z2 = y * Math.sin(b) + z1 * Math.cos(b);
      return P(x1, y2, Z0 + z2);
    };
    const ring = (r, z, cx = 0, cy = 0) => circ(r, 40).map((q) => T(cx + q.u, cy + q.v, z));
    const prof = [[R, 0], [R * 0.92, 8], [R * 0.7, 15], [R * 0.4, 19], [R * 0.92, -8], [R * 0.6, -15], [R * 0.25, -18]];
    body.setAttribute("d", poly(hull(prof.flatMap(([r, z]) => ring(r, z)))));
    rim.setAttribute("d", poly(ring(R, 0)));
    fields.forEach((f, i) => { const t = (i / 8) * Math.PI * 2 + 0.3; f.setAttribute("d", poly(circ(7, 20).map((q) => T(Math.cos(t) * 36 + q.u, Math.sin(t) * 36 + q.v * 0.8, 15)))); });
    ding.setAttribute("d", poly(hull(ring(10, 19).concat(ring(7, 24)))));
  }
  const B = register(stage, (dt) => { const m1 = stepS(tx, dt), m2 = stepS(ty, dt); draw(); return m1 || m2; });
  bag.add(B.unregister);
  function tilt(t) {
    tx.t = t[0]; ty.t = t[1];
    read.textContent = t === REST ? "rest" : `${Math.round((Math.hypot(t[0], t[1]) * 180) / Math.PI)}°`;
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], Z0), r = Math.hypot(x, y);
      if (r < 6) return tilt(REST);
      const m = clamp(r / 120, 0, 1) * lim;
      tilt([(x / r) * m, -(y / r) * m]);
    },
    leave: () => tilt(REST),
  }));
  bag.add(() => svg.replaceChildren());
  draw(); tilt(REST);
  return { set: (v) => { lim = MAX * v; }, destroy: bag.dispose };
}

hairline({
  name: "handpan",
  means: "A handpan on its stand: the steel lens tilts its face toward the pointer, steeper the farther out you go.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[122, 171], [200, 172], [200, 54], null],
  mount,
});
