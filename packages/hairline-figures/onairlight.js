/**
 * On air light: a lightbox sign hung from a ceiling plate on a hinge bar. The pointer
 * swings the sign forward on its hinge, further the further right it is; the lit panel is the bright mark.
 */
const { Cam, fit, proj, hull, poly, seg, clamp, lerp, rad, spring, stepS, disposer, mk, pointer, register, solid } = HL;

/** The eight corners of a box from o along a, b, c, each passed through f. */
function corners(o, a, b, c, f) {
  const pts = [];
  for (const i of [0, 1]) for (const j of [0, 1]) for (const k of [0, 1])
    pts.push(f([0, 1, 2].map((n) => o[n] + a[n] * i + b[n] * j + c[n] * k)));
  return pts;
}
/** A box as a silhouette, with the three edges of its nearest corner as the crease. */
function drawBox(s, P, pts) {
  const sp = pts.map((q) => P(q[0], q[1], q[2]));
  let n = 0, bd = -1e9;
  pts.forEach((q, i) => { const d = (q[0] + q[1]) * 0.612 + q[2] * 0.5; if (d > bd) { bd = d; n = i; } });
  s.sil.setAttribute("d", poly(hull(sp)));
  s.cr.setAttribute("d", [1, 2, 4].map((m) => seg(sp[n], sp[n ^ m])).join(""));
}
/** Turns a point about the x axis (in y, z) or the y axis (in x, z) through a pivot. */
const rotX = (p, c, A) => { const y = p[1] - c[1], z = p[2] - c[2], co = Math.cos(A), si = Math.sin(A); return [p[0], c[1] + y * co - z * si, c[2] + y * si + z * co]; };
const rotY = (p, c, A) => { const x = p[0] - c[0], z = p[2] - c[2], co = Math.cos(A), si = Math.sin(A); return [c[0] + x * co - z * si, p[1], c[2] + x * si + z * co]; };
const ID = (p) => p;

const PIV = [0, 0, 100], REST = 10;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2);
  fit(C, [[-70, -14, 136], [70, 14, 136], [-60, 40, 60], [60, 40, 60], [-60, -10, 56], [60, 10, 56]], 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  drawBox(solid(g), P, corners([-70, -14, 130], [140, 0, 0], [0, 28, 0], [0, 0, 6], ID));
  for (const x of [-40, 40]) drawBox(solid(g), P, corners([x - 2, -2, 104], [4, 0, 0], [0, 4, 0], [0, 0, 26], ID));
  drawBox(solid(g), P, corners([-50, -3, 100], [100, 0, 0], [0, 6, 0], [0, 0, 4], ID));
  const box = solid(g), panel = mk("path", { class: "nf hi" }, g);
  let amp = value, over = null, last = "";
  const A = spring(REST);
  function draw() {
    const key = A.x.toFixed(2); if (key === last) return; last = key;
    const f = (p) => rotX(p, PIV, rad(A.x));
    drawBox(box, P, corners([-60, -10, 54], [120, 0, 0], [0, 20, 0], [0, 0, 46], f));
    panel.setAttribute("d", poly([[-50, 10, 62], [50, 10, 62], [50, 10, 92], [-50, 10, 92]].map((q) => P(...f(q)))));
  }
  const B = register(stage, (dt) => { const m = stepS(A, dt); draw(); return m; });
  bag.add(B.unregister);
  function retarget() {
    A.t = over == null ? REST : clamp(REST + (18 + 22 * over) * amp, REST, 60);
    read.textContent = over == null ? "rest" : "on " + Math.round(A.t) + "°";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { over = clamp((p[0] - 100) / 200, 0, 1); retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw(); retarget();
  return { set: (v) => { amp = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "onairlight",
  means: "An on air lightbox on a ceiling hinge: the pointer swings the lit sign forward, further toward the right.",
  rules: [1,3,5,8],
  range: [0.5, 1, 1.6],
  tour: [[212,195],[160,200],[270,190],null],
  mount,
});
