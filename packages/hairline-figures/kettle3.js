/**
 * Stovetop kettle: a round whistling kettle on a burner grate. The pointer
 * across the stage tips the kettle forward on the rim of its base to pour,
 * spout first, on a spring. At rest it leans a touch, its body bright. The
 * slider is how far it may tip.
 *
 * The pattern: a continuous aim (terrain's spring, on one tilt angle).
 */
const { Cam, fit, hull, poly, open, proj, clamp, lerp, rad, spring, stepS, mk, pointer, register, disposer } = HL;

const FACES = [[4, 5, 7, 6], [0, 2, 3, 1], [1, 3, 7, 5], [0, 4, 6, 2], [2, 6, 7, 3], [0, 1, 5, 4]];
const area = (q) => { let s = 0; for (let i = 0; i < q.length; i++) { const a = q[i], b = q[(i + 1) % q.length]; s += a[0] * b[1] - a[1] * b[0]; } return s; };
const corners = (o, ex, ey, ez) => { const c = []; for (let i = 0; i < 8; i++) c.push([0, 1, 2].map((j) => o[j] + (i & 1 ? ex[j] : 0) + (i & 2 ? ey[j] : 0) + (i & 4 ? ez[j] : 0))); return c; };
const Z0 = 6, PIV = 21, REST = 4;
const PROF = [[19, 0], [22, 5], [22, 12], [19, 20], [12, 26]];
const ring = (cx, cy, z, r, n = 28) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i / n) * 2 * Math.PI), cy + r * Math.sin((i / n) * 2 * Math.PI), z]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const tf = (th) => { const c = Math.cos(rad(th)), s = Math.sin(rad(th)); return ([x, y, z]) => { const dx = x - PIV, dz = z - Z0; return [PIV + dx * c + dz * s, y, Z0 - dx * s + dz * c]; }; };
  const handle = (y) => Array.from({ length: 13 }, (_, i) => { const t = (i / 12) * Math.PI; return [-2 - 13 * Math.cos(t), y, Z0 + 25 + 16 * Math.sin(t)]; });
  const keyPts = (th) => { const T = tf(th); return [...ring(0, 0, Z0, 22, 12), ...ring(0, 0, Z0 + 26, 12, 12), [38, 0, Z0 + 30], ...handle(0)].map(T); };
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-30, -30, 0], [30, 30, 0], [30, -30, 0], [-30, 30, 0], ...keyPts(0), ...keyPts(55)], 200, 160);
  const P = proj(C);
  const sg = Math.sign(area([[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]].map((p) => P(...p))));
  const boxD = (c) => { const s = c.map((p) => P(...p)); return FACES.map((f) => f.map((i) => s[i])).filter((q) => area(q) * sg > 0).map(poly).join(""); };

  const g = mk("g", {}, svg);
  mk("path", { d: boxD(corners([-30, -30, 0], [60, 0, 0], [0, 60, 0], [0, 0, 3])) }, g);
  // the grate: two crossed bars and a ring, low on the plate
  mk("path", { d: boxD(corners([-24, -2, 3], [48, 0, 0], [0, 4, 0], [0, 0, 2])) }, g);
  mk("path", { d: boxD(corners([-2, -24, 3], [4, 0, 0], [0, 48, 0], [0, 0, 2])) }, g);
  mk("path", { d: poly(ring(0, 0, 5, 16, 40).map((p) => P(...p))), class: "nf lo" }, g);

  const kg = mk("g", {}, svg);
  const back = mk("path", { class: "nf" }, kg), body = mk("path", { class: "sil hi" }, kg), belt = mk("path", { class: "nf lo" }, kg);
  const lid = mk("path", {}, kg), knob = mk("path", {}, kg), spout = mk("path", {}, kg), cap = mk("path", {}, kg), front = mk("path", { class: "nf" }, kg);
  const cyl = (T, a, b, r) => {
    const A = T(a), B = T(b), d = B.map((v, i) => v - A[i]), L = Math.hypot(...d), n = d.map((v) => v / L);
    const u0 = Math.abs(n[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
    const dot = u0[0] * n[0] + u0[1] * n[1] + u0[2] * n[2], u = u0.map((v, i) => v - dot * n[i]), ul = Math.hypot(...u), U = u.map((v) => v / ul);
    const W = [n[1] * U[2] - n[2] * U[1], n[2] * U[0] - n[0] * U[2], n[0] * U[1] - n[1] * U[0]];
    const rg = (o) => Array.from({ length: 20 }, (_, i) => { const t = (i / 20) * 2 * Math.PI; return P(...o.map((v, j) => v + r * (Math.cos(t) * U[j] + Math.sin(t) * W[j]))); });
    const ra = rg(A), rb = rg(B), end = area(rb) * sg > 0 ? rb : ra;
    return poly(hull(ra.concat(rb))) + poly(end);
  };
  let last = NaN;
  function draw(th) {
    if (Math.abs(th - last) < 0.01) return;
    last = th;
    const T = tf(th), pp = (p) => P(...T(p));
    const pts = [];
    for (const [r, z] of PROF) pts.push(...ring(0, 0, Z0 + z, r).map(pp));
    back.setAttribute("d", open(handle(-3).map(pp)));
    body.setAttribute("d", poly(hull(pts)));
    belt.setAttribute("d", poly(ring(0, 0, Z0 + 12, 22, 40).map(pp)));
    lid.setAttribute("d", poly(hull([...ring(0, 0, Z0 + 26, 10).map(pp), ...ring(0, 0, Z0 + 27.5, 9).map(pp)])) + poly(ring(0, 0, Z0 + 27.5, 9).map(pp)));
    knob.setAttribute("d", cyl(T, [0, 0, Z0 + 27], [0, 0, Z0 + 31], 3));
    spout.setAttribute("d", cyl(T, [14, 0, Z0 + 10], [33, 0, Z0 + 26], 3.2));
    cap.setAttribute("d", cyl(T, [33, 0, Z0 + 26], [37, 0, Z0 + 29.5], 4.4));
    front.setAttribute("d", open(handle(3).map(pp)));
  }
  const sp = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); read.textContent = sp.t === REST && !m ? "rest" : Math.round(sp.x) + "°"; return m; });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: ([sx]) => { sp.t = lerp(REST, max, clamp((sx - 110) / 190, 0, 1)); B.wake(); },
    leave: () => { sp.t = REST; B.wake(); },
  }));
  draw(REST);
  read.textContent = "rest";
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "kettle3",
  means: "A whistling kettle on a burner: the pointer tips it forward on its base to pour, spout first.",
  rules: [3, 5, 8],
  range: [20, 40, 55],
  tour: [[200, 121], [265, 143], [150, 130], null],
  mount,
});
