/**
 * Hay bales: a mown field with six round bales lying on their sides, each face
 * a wound spiral, and a post-and-rail fence along the far edges. The pointer
 * nudges them: the bales near it roll a little toward the reader, each on its
 * own spring, the spiral turning as it goes, the one under it furthest and
 * bright. At rest they lie scattered, one bright. The slider is the reach.
 *
 * The pattern: a continuous field on the ground; the hit is each bale's rest
 * centre on the plane of its axle, which never moves.
 */
const {
  Cam, clamp, fit, open, poly, hull, proj, rings, prism, facing, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 10, HW = 7, ROLL = 10;
const BALES = [[-38, -26], [-2, -32], [34, -22], [-30, 4], [6, -2], [40, 10]];
const REST = [1, 3, 0, 2.5, 0.5, 4], FAV = 3;
const XA = -60, XB = 66, YA = -48, YB = 26;
const falloff = (u) => (u <= 0 ? 1 : u <= 0.45 ? 1 - (u / 0.45) * 0.62 : u <= 1 ? 0.38 - ((u - 0.45) / 0.55) * 0.38 : 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value * 30, over = null;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[XA, YA, -3], [XB, YB, -3], [XB, YA, -3], [XA, YB, -3], [XA, YA, 16]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fo, fi] = rings(XA, YA, XB, YB, 5, 1.8);
  put(solid(g), prism(P, front, fo, fi, -3, 0));

  // the fence along the two far edges: posts, then two rails
  const fx = XA + 4, fy = YA + 4, posts = [];
  for (let y = YB - 6; y > fy; y -= 18) posts.push([fx, y]);
  for (let x = fx; x < XB - 2; x += 18) posts.push([x, fy]);
  posts.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
  let rails = "";
  const run1 = posts.filter((p) => p[0] === fx).sort((a, b) => a[1] - b[1]), run2 = posts.filter((p) => p[1] === fy).sort((a, b) => a[0] - b[0]);
  for (const line of [run1, run2]) for (const z of [7, 12]) rails += seg(P(line[0][0], line[0][1], z), P(line[line.length - 1][0], line[line.length - 1][1], z));
  mk("path", { class: "nf sil", d: rails }, g);
  for (const [x, y] of posts) { const [o, i] = rings(x - 1.2, y - 1.2, x + 1.2, y + 1.2, 0.6, 0.3); put(solid(g), prism(P, front, o, i, 0, 15)); }

  const layer = mk("g", {}, g);
  const bales = BALES.map(([cx, cy], k) => {
    const grp = mk("g", {}, layer), body = mk("path", { class: "sil" }, grp);
    const face = mk("path", { class: "nf lo", d: "" }, grp), spiral = mk("path", { class: "nf lo", d: "" }, grp);
    return { k, cx, cy, grp, body, face, spiral, sp: spring(REST[k]), drawn: NaN };
  });
  const circle = (x, y, r, n) => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return P(x + r * Math.cos(t), y, R + r * Math.sin(t)); });

  let order = "";
  function draw(b) {
    const s = clamp(b.sp.x, 0, ROLL + 2);
    if (Math.abs(s - b.drawn) < 1e-3) return;
    b.drawn = s;
    const x = b.cx + s, a = -s / R;
    b.body.setAttribute("d", poly(hull(circle(x, b.cy - HW, R, 40).concat(circle(x, b.cy + HW, R, 40)))));
    b.face.setAttribute("d", poly(circle(x, b.cy + HW, R - 0.8, 40)));
    const sp = [];
    for (let i = 0; i <= 90; i++) { const t = i / 90, r = 1 + t * (R - 3), th = a + t * Math.PI * 2 * 2.6; sp.push(P(x + r * Math.cos(th), b.cy + HW, R + r * Math.sin(th))); }
    b.spiral.setAttribute("d", open(sp));
  }
  function reorder() {
    const s = [...bales].sort((p, q) => p.cx + p.sp.x + p.cy - (q.cx + q.sp.x + q.cy));
    const key = s.map((b) => b.k).join();
    if (key !== order) { order = key; for (const b of s) layer.append(b.grp); }
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const b of bales) { if (stepS(b.sp, dt)) m = true; draw(b); }
    reorder();
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    let hit = null, bd = Infinity;
    if (over) for (const b of bales) { const d = Math.hypot(over[0] - b.cx, over[1] - b.cy); if (d < bd) { bd = d; hit = b; } }
    if (bd > 16) hit = null;
    for (const b of bales) {
      if (!over) b.sp.t = REST[b.k];
      else if (b === hit) b.sp.t = ROLL;
      else b.sp.t = Math.max(REST[b.k], ROLL * 0.7 * falloff(Math.hypot(over[0] - b.cx, over[1] - b.cy) / RAD));
      b.body.classList.toggle("hi", over ? b === hit : b.k === FAV);
    }
    read.textContent = hit ? "bale " + (hit.k + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], R);
      over = x > XA - 10 && x < XB + 10 && y > YA - 10 && y < YB + 10 ? [x, y] : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { RAD = v * 30; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "haybales",
  means: "Six round hay bales in a fenced field: the bales near the pointer roll toward the reader, the one under it furthest.",
  rules: [1, 3, 5, 8],
  range: [0.6, 1, 1.8],
  tour: [[164, 123], [134, 150], [222, 202], null],
  mount,
});
