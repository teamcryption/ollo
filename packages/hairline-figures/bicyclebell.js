/**
 * Bicycle bell: a domed bell clamped on a length of handlebar, with a thumb
 * lever on its base plate. The pointer rings it: the lever swings in and the
 * dome rocks toward the pointer's side. At rest the lever is bright.
 * The slider is how far the dome rocks.
 *
 * The pattern: a continuous aim on a spring, picked on the base plane.
 */
const {
  Cam, circ, clamp, fit, hull, poly, proj, rad, unproj, spring, stepS,
  disposer, mk, pointer, register,
} = HL;

const BR = 4.5, BL = 62, PZ = 10, DR = 21, DH = 15, LV = 32;
const AX = [Math.SQRT1_2, Math.SQRT1_2, 0];

function rot(p, c, th) {
  const v = [p[0] - c[0], p[1] - c[1], p[2] - c[2]], cs = Math.cos(th), sn = Math.sin(th);
  const d = AX[0] * v[0] + AX[1] * v[1] + AX[2] * v[2];
  const x = [AX[1] * v[2] - AX[2] * v[1], AX[2] * v[0] - AX[0] * v[2], AX[0] * v[1] - AX[1] * v[0]];
  return [0, 1, 2].map((j) => c[j] + v[j] * cs + x[j] * sn + AX[j] * d * (1 - cs));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[0, -BL, -BR], [0, BL, BR], [DR + 6, DR + 6, PZ], [-DR - 6, -DR - 6, PZ + DH + 8], [DR + LV, 4, PZ]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const tube = (a, b, r, n = 20) => {
    const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d), e = d.map((x) => x / L);
    let u = Math.abs(e[2]) < 0.9 ? [e[1], -e[0], 0] : [1, 0, 0];
    const un = Math.hypot(...u); u = u.map((x) => x / un);
    const w = [e[1] * u[2] - e[2] * u[1], e[2] * u[0] - e[0] * u[2], e[0] * u[1] - e[1] * u[0]];
    const ring = (o) => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return P(...[0, 1, 2].map((j) => o[j] + r * (Math.cos(t) * u[j] + Math.sin(t) * w[j]))); });
    return poly(hull(ring(a).concat(ring(b))));
  };
  // the handlebar, then the clamp and the base plate
  mk("path", { class: "sil", d: tube([0, -BL, 0], [0, BL, 0], BR, 28) }, g);
  mk("path", { class: "sil", d: tube([0, -6, 0], [0, 6, 0], BR + 2.2, 28) }, g);
  mk("path", { class: "sil", d: tube([0, 0, 2], [0, 0, PZ - 1], 4) }, g);
  const plate = circ(DR - 3, 40);
  mk("path", { class: "sil", d: poly(hull(plate.map((q) => P(q.u, q.v, PZ - 1.5)).concat(plate.map((q) => P(q.u, q.v, PZ))))) }, g);
  const dome = mk("path", { class: "sil" }, g), lip = mk("path", { class: "nf lo" }, g), nut = mk("path", { class: "sil" }, g);
  const lever = mk("path", { class: "sil" }, g), pad = mk("path", { class: "sil" }, g);

  const tilt = spring(-0.12), push = spring(0);
  let last = "", over = false;
  const piv = [DR - 6, DR - 6, PZ];
  function draw() {
    const key = tilt.x.toFixed(3) + push.x.toFixed(3);
    if (key === last) return;
    last = key;
    const th = rad(26) * tilt.x * reach, c = [0, 0, PZ + 1], pts = [];
    for (let i = 0; i <= 7; i++) {
      const t = (i / 7) * (Math.PI / 2), r = DR * Math.cos(t) + (i === 0 ? 1.5 : 0);
      for (const q of circ(r, 32)) pts.push(P(...rot([q.u, q.v, PZ + 1 + DH * Math.sin(t)], c, th)));
    }
    dome.setAttribute("d", poly(hull(pts)));
    lip.setAttribute("d", poly(circ(DR - 1, 40).map((q) => P(...rot([q.u, q.v, PZ + 3.5], c, th)))));
    const nt = circ(3.2, 16), top = PZ + DH;
    nut.setAttribute("d", poly(hull(nt.map((q) => P(...rot([q.u, q.v, top], c, th))).concat(nt.map((q) => P(...rot([q.u, q.v, top + 4.5], c, th)))))));
    const a = rad(10 - 75 * push.x), tip = [piv[0] + LV * Math.cos(a), piv[1] - LV * Math.sin(a) * 0.2 + LV * Math.sin(a), PZ];
    lever.setAttribute("d", tube(piv, tip, 2.2));
    pad.setAttribute("d", tube([tip[0], tip[1], PZ - 2.5], [tip[0], tip[1], PZ + 2.5], 5.5));
  }

  const B = register(stage, (dt) => { const m1 = stepS(tilt, dt), m2 = stepS(push, dt); draw(); return m1 || m2; });
  bag.add(B.unregister);

  function aim(p) {
    let s = 0;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], PZ);
      over = Math.hypot(x, y) < 78;
      s = clamp((x - y) / Math.SQRT2 / 34, -1, 1);
    } else over = false;
    tilt.t = over ? s : -0.12;
    push.t = over ? 1 : 0;
    dome.classList.toggle("hi", over);
    lever.classList.toggle("hi", !over);
    pad.classList.toggle("hi", !over);
    read.textContent = over ? `ding ${Math.round(26 * s * reach)}°` : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last = ""; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "bicyclebell",
  means: "A bell on a handlebar: the pointer rings it, the thumb lever swings in and the dome rocks toward the pointer's side.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.3],
  tour: [[330, 183], [85, 183], [200, 150], null],
  mount,
});
