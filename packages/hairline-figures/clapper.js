/**
 * Slate board: a clapperboard standing upright, its striped clap stick hinged at the
 * left. The pointer lifts the stick open, wider the further right it is; the stick is the bright mark.
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

const PIV = [-55, 0, 72], REST = 14;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-55, -3, 0], [55, 3, 0], [-55, 3, 72], [55, 3, 72], [13, 3, 160], [-64, 3, 84]], 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  drawBox(solid(g), P, corners([-55, -3, 0], [110, 0, 0], [0, 6, 0], [0, 0, 62], ID));
  const L = (a, b, cls) => mk("path", { class: cls, d: seg(P(...a), P(...b)) }, g);
  L([-55, 3, 42], [55, 3, 42], "nf lo"); L([-55, 3, 22], [55, 3, 22], "nf lo"); L([0, 3, 0], [0, 3, 42], "nf lo");
  drawBox(solid(g), P, corners([-55, -3, 62], [110, 0, 0], [0, 6, 0], [0, 0, 10], ID));
  for (let i = 0; i < 5; i++) L([-43 + 22 * i, 3, 62], [-53 + 22 * i, 3, 72], "nf");
  const stick = solid(g), stripes = mk("path", { class: "nf" }, g);
  stick.sil.classList.add("hi");
  let amp = value, over = null, last = "";
  const A = spring(REST);
  function draw() {
    const key = A.x.toFixed(2); if (key === last) return; last = key;
    const f = (p) => rotY(p, PIV, rad(A.x));
    drawBox(stick, P, corners([-55, -3, 72], [110, 0, 0], [0, 6, 0], [0, 0, 12], f));
    let d = "";
    for (let i = 0; i < 5; i++) d += seg(P(...f([-45 + 22 * i, 3, 72])), P(...f([-33 + 22 * i, 3, 84])));
    stripes.setAttribute("d", d);
  }
  const B = register(stage, (dt) => { const m = stepS(A, dt); draw(); return m; });
  bag.add(B.unregister);
  function retarget() {
    A.t = over == null ? REST : clamp(REST + (16 + 16 * over) * amp, REST, 46);
    read.textContent = over == null ? "rest" : Math.round(A.t) + "° open";
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
  name: "clapper",
  means: "A film slate board: the pointer lifts the striped clap stick on its hinge, wider the further right it is.",
  rules: [1,3,5,8],
  range: [0.5, 1, 1.6],
  tour: [[200,106],[150,130],[270,120],null],
  mount,
});
