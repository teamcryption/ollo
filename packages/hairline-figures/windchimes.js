/**
 * Wind chimes: seven tubes of different lengths hung on cords in a ring
 * under a round top, a striker disc among them on its own cord, all from one
 * hook. The pointer is the breeze: the tubes near it swing away from it, each
 * on its own spring, the one under it furthest and bright. At rest the tubes
 * lean a little, unevenly, as in a light wind, one bright. The slider is the
 * reach.
 *
 * The pattern: a continuous field (terrain) around a ring; the pick is the
 * tube whose resting middle is nearest the pointer on screen.
 */
const {
  Cam, circ, clamp, fillet, fit, facing, hull, poly, prism, proj, rad, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const TOP = 100, RT = 14, RC = 10, RTUBE = 1.7, GAP = 14, MAXA = 30, FAV = 4, ZS = TOP - 46, SAIL = [ZS - 18, ZS - 40];
const LEN = [58, 50, 44, 38, 33, 29, 26];
const REST = [5, 3, 7, 2, 6, 4, 3];
const ZM = TOP - 40;
const falloff = (u) => (u <= 0 ? 1 : u <= 0.45 ? 1 - (u / 0.45) * 0.62 : u <= 1 ? 0.38 - ((u - 0.45) / 0.55) * 0.38 : 0);
const disc = (r, n = 40) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value, over = null;
  const C = Cam(45, 0.5, 2.9);
  const low = SAIL[1];
  fit(C, [[-RT - 14, -RT - 14, low], [RT + 14, RT + 14, low], [RT + 14, -RT - 14, low], [-RT - 14, RT + 14, low], [0, 0, TOP + 14]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const cords = mk("path", { class: "nf lo" }, g);

  const tubes = LEN.map((len, k) => {
    const t = rad(-90 + (k * 360) / LEN.length), x = RC * Math.cos(t), y = RC * Math.sin(t);
    const grp = mk("g", {}, g);
    return { k, x, y, len, grp, body: mk("path", { class: "sil" }, grp), rim: mk("path", { class: "nf lo" }, grp), sx: spring(REST[k] * 0.7, { eps: 0.03 }), sy: spring(-REST[k] * 0.3, { eps: 0.03 }), last: "" };
  });
  // the striker hangs in the middle, among the tubes; paint all far to near
  const striker = { x: 0, y: 0, grp: mk("g", {}, g) };
  const stEl = solid(striker.grp);
  put(stEl, prism(P, front, disc(5.5), disc(4.6), ZS, ZS + 2.2));
  // the sail under the striker, a flat leaf turned to the wind
  const leaf = [[0, 0], [5, 4], [6, 12], [3, 20], [0, 22], [-3, 20], [-6, 12], [-5, 4]].map(([w, d]) => P(w * 0.7, -w * 0.7, SAIL[0] - d));
  mk("path", { class: "nf lo", d: seg(P(0, 0, ZS), P(0, 0, SAIL[0])) }, striker.grp);
  mk("path", { d: poly(fillet(leaf, leaf.map(() => 2))) }, striker.grp);
  [...tubes, striker].sort((a, b) => a.x + a.y - (b.x + b.y)).forEach((o) => g.appendChild(o.grp));
  const topEl = solid(g);
  put(topEl, prism(P, front, disc(RT, 48), disc(RT - 1.4, 48), TOP, TOP + 3));
  mk("path", { class: "nf", d: seg(P(0, 0, TOP + 3), P(0, 0, TOP + 9)) + poly(circ(3, 16).map((q) => P(q.u, 0, TOP + 12 + q.v))) }, g);

  /** A tube hanging from its cord's end, tilted by (ax, ay) degrees about x and y. */
  function drawTube(tb) {
    const ax = clamp(tb.sx.x, -MAXA, MAXA), ay = clamp(tb.sy.x, -MAXA, MAXA);
    const key = ax.toFixed(2) + "," + ay.toFixed(2);
    if (key === tb.last) return false;
    tb.last = key;
    let d = [Math.sin(rad(ax)), Math.sin(rad(ay)), -1];
    const n = Math.hypot(...d); d = d.map((v) => v / n);
    const top = [tb.x, tb.y, TOP - GAP], u = [1, 0, -d[0] / d[2] * 0], v = [0, 1, 0];
    const ring = (o) => circ(RTUBE, 16).map((q) => P(top[0] + d[0] * o + q.u * u[0] + q.v * v[0], top[1] + d[1] * o + q.v * v[1], top[2] + d[2] * o));
    const a = ring(0), b = ring(tb.len);
    tb.body.setAttribute("d", poly(hull(a.concat(b))));
    tb.rim.setAttribute("d", poly(a));
    return true;
  }
  let cordKey = "";
  const B = register(stage, (dt) => {
    let m = false;
    for (const tb of tubes) { if (stepS(tb.sx, dt)) m = true; if (stepS(tb.sy, dt)) m = true; drawTube(tb); }
    const key = tubes.map((t) => t.last).join();
    if (key !== cordKey) {
      cordKey = key;
      let d = seg(P(0, 0, TOP), P(0, 0, ZS + 2.2));
      for (const tb of tubes) d += seg(P(tb.x, tb.y, TOP), P(tb.x, tb.y, TOP - GAP));
      cords.setAttribute("d", d);
    }
    return m;
  });
  bag.add(B.unregister);

  const mids = tubes.map((tb) => P(tb.x, tb.y, TOP - GAP - tb.len / 2));
  function retarget(p) {
    let hit = null;
    if (p) {
      let bd = Infinity;
      mids.forEach((m, k) => { const dd = Math.hypot(m[0] - p[0], (m[1] - p[1]) * 0.35); if (dd < bd) { bd = dd; hit = tubes[k]; } });
      if (bd > 9) hit = null;
    }
    for (const tb of tubes) {
      if (!over) { tb.sx.t = REST[tb.k] * 0.7; tb.sy.t = -REST[tb.k] * 0.3; }
      else {
        // away from the pointer across the view, so the swing is seen, never foreshortened
        const r = Math.hypot(tb.x - over[0], tb.y - over[1]), side = mids[tb.k][0] >= p[0] ? 1 : -1;
        const amp = (tb === hit ? MAXA : MAXA * 0.75 * falloff(r / RAD)) * side * Math.SQRT1_2;
        tb.sx.t = amp; tb.sy.t = -amp;
      }
      tb.body.classList.toggle("hi", over ? tb === hit : tb.k === FAV);
    }
    read.textContent = hit ? "tube " + (hit.k + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], ZM);
      over = Math.hypot(x, y) < RT + 34 ? [x, y] : null;
      retarget(over ? p : null);
    },
    leave: () => { over = null; retarget(null); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget(null);
  return { set: (v) => { RAD = v; }, destroy: bag.dispose };
}

hairline({
  name: "windchimes",
  means: "A wind chime of seven tubes under a round top: the tubes near the pointer swing away from it, the one under it most.",
  rules: [1, 3, 5, 9],
  range: [12, 24, 40],
  tour: [[173, 122], [221, 137], [196, 170], null],
  mount,
});
