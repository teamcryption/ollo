/**
 * Parallel rule: two flat rulers joined by two brass links, a knob on each,
 * lying on the chart. The pointer over it walks the far ruler out: the links
 * swing on their pivots and the ruler travels across and along, always
 * parallel to the near one. At rest the rulers lie closed with a hairline gap,
 * the far ruler bright. The slider is how far the links swing.
 *
 * The pattern: one part answering (links turning on a tween); the hit is the
 * rest pose's screen box, which never moves.
 */
const {
  Cam, circ, clamp, fit, facing, poly, prism, proj, rings, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const HL0 = 75, W = 9, LK = 50, PX = 45, PH0 = 24, Z1 = 3.2;
const phMax = (v) => clamp(40 + 45 * v, 40, 108);

/** A rounded link between two pivots, as a ring with normals. */
function stadium(a, b, r, n = 8) {
  const e = Math.atan2(b[1] - a[1], b[0] - a[0]), out = [];
  for (let i = 0; i <= n; i++) { const t = e - Math.PI / 2 + (i / n) * Math.PI; out.push({ u: b[0] + r * Math.cos(t), v: b[1] + r * Math.sin(t), nu: Math.cos(t), nv: Math.sin(t) }); }
  for (let i = 0; i <= n; i++) { const t = e + Math.PI / 2 + (i / n) * Math.PI; out.push({ u: a[0] + r * Math.cos(t), v: a[1] + r * Math.sin(t), nu: Math.cos(t), nv: Math.sin(t) }); }
  return out;
}
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let val = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-HL0 - 14, -LK - W - 2, 0], [HL0 + LK + 2, W + 2, 0], [-HL0 - 14, W + 2, 0], [HL0 + LK + 2, -LK - W - 2, 0], [0, 0, 12]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const mov = solid(g), movKnob = solid(g), fix = solid(g), fixKnob = solid(g);
  const links = [solid(g), solid(g)];
  const dots = [0, 1, 2, 3].map(() => mk("ellipse", { class: "dot m", rx: 2, ry: 1.2 }, g));
  const [fr, fi] = rings(-HL0, -W, HL0, W, 3, 1.2);
  put(fix, prism(P, front, fr, fi, 0, Z1));
  put(fixKnob, prism(P, front, disc(0, 0, 4), disc(0, 0, 2.6), Z1, Z1 + 7));
  mov.sil.classList.add("hi");
  const tw = tween(0);
  let last = NaN, over = false;

  function draw(t) {
    const ph = PH0 + t * (phMax(val) - PH0);
    if (ph === last) return;
    last = ph;
    const dx = LK * Math.cos(rad(ph)), dy = -LK * Math.sin(rad(ph));
    const [mr, mi] = rings(-HL0 + dx, dy - W, HL0 + dx, dy + W, 3, 1.2);
    put(mov, prism(P, front, mr, mi, 0, Z1));
    put(movKnob, prism(P, front, disc(dx, dy, 4), disc(dx, dy, 2.6), Z1, Z1 + 7));
    [-PX, PX].forEach((px, k) => {
      const a = [px, 0], b = [px + dx, dy];
      put(links[k], prism(P, front, stadium(a, b, 3.4), stadium(a, b, 2.2), Z1, Z1 + 1.4));
      [a, b].forEach((q, j) => { const s = P(q[0], q[1], Z1 + 1.5), el = dots[2 * k + j]; el.setAttribute("cx", s[0]); el.setAttribute("cy", s[1]); });
    });
    read.textContent = over ? `${Math.round(ph)}°` : "rest";
  }

  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const box = [P(-HL0 - 6, W + 4, 0), P(HL0 + LK, W + 4, 0), P(-HL0 - 6, -LK - W, 0), P(HL0 + LK, -LK - W, 0)];
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  function set(o) {
    if (o === over && !Number.isNaN(last)) return;
    over = o;
    tset(tw, o ? 1 : 0, performance.now(), 0);
    last = NaN; B.wake();
  }
  bag.add(pointer(stage, {
    move: ([sx, sy]) => set(sx > Math.min(...xs) && sx < Math.max(...xs) && sy > Math.min(...ys) - 10 && sy < Math.max(...ys)),
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  set(false);
  return { set: (v) => { val = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "parallelrule",
  means: "A navigator's parallel rule: the pointer walks the far ruler out on its two swinging links, kept parallel to the near one.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.4],
  tour: [[167, 153], [130, 170], [260, 205], null],
  mount,
});
