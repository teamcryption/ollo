/**
 * Pendulum ride: a fairground pendulum on two A-frame towers, its long arm
 * hung from the axle at the top with a ring of seats at the foot and a
 * counterweight above. The pointer's x swings the arm out to either side.
 * At rest the arm hangs a little off true, the gondola bright. The slider is
 * how far the arm swings.
 *
 * The pattern: one part turning on an axle, driven by the pointer's x.
 */

const { Cam, fit, hull, poly, proj, clamp, lerp, rad, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;
const K = 0.5, CE = Math.sqrt(1 - K * K) / Math.SQRT2;
const depth = (p) => (p[0] + p[1]) * CE + p[2] * K;
const B = (x0, y0, z0, x1, y1, z1, hi) => ({ hi, c: [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]] });
const NB = [[1, 3, 4], [0, 2, 5], [1, 3, 6], [0, 2, 7], [0, 5, 7], [1, 4, 6], [2, 5, 7], [3, 4, 6]];
function rot(b, ax, deg, o) {
  const a = rad(deg), c = Math.cos(a), s = Math.sin(a);
  const f = (p) => { const q = [p[0] - o[0], p[1] - o[1], p[2] - o[2]]; let r;
    if (ax === "z") r = [q[0] * c - q[1] * s, q[0] * s + q[1] * c, q[2]];
    else if (ax === "y") r = [q[0] * c + q[2] * s, q[1], -q[0] * s + q[2] * c];
    else r = [q[0], q[1] * c - q[2] * s, q[1] * s + q[2] * c];
    return [r[0] + o[0], r[1] + o[1], r[2] + o[2]]; };
  if (b.c) b.c = b.c.map(f);
  if (b.pts) { b.pts = b.pts.map(f); b.lines = (b.lines || []).map((l) => l.map(f)); }
  return b;
}
const mv = (b, dx, dy, dz) => { const f = (p) => [p[0] + dx, p[1] + dy, p[2] + dz]; if (b.c) b.c = b.c.map(f); if (b.pts) { b.pts = b.pts.map(f); b.lines = (b.lines || []).map((l) => l.map(f)); } return b; };



function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, K, SCALE);
  const ext = [];
  for (const s of [0, 0.25, 0.5, 0.75, 1]) for (const b of parts(s)) ext.push(...(b.c || b.pts));
  fit(C, ext, 200, 165);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const pool = [];
  let last = NaN;
  function draw(s) {
    if (s === last) return;
    last = s;
    const ps = parts(s).map((b) => ({ b, d: depth((b.c || b.pts).reduce((a, p) => [a[0] + p[0], a[1] + p[1], a[2] + p[2]], [0, 0, 0]).map((v) => v / (b.c || b.pts).length)) + (b.dz || 0) }));
    ps.sort((a, b) => a.d - b.d);
    ps.forEach(({ b }, i) => {
      if (!pool[i]) pool[i] = solid(g);
      const sd = pool[i];
      g.appendChild(sd.g);
      let crease = "";
      if (b.c) {
        let h = 0; b.c.forEach((p, k) => { if (depth(p) > depth(b.c[h])) h = k; });
        const a = P(...b.c[h]);
        crease = NB[h].map((k) => { const q = P(...b.c[k]); return `M${a[0].toFixed(2)},${a[1].toFixed(2)}L${q[0].toFixed(2)},${q[1].toFixed(2)}`; }).join("");
      } else {
        crease = b.lines.map((l) => "M" + l.map((p) => P(...p).map((v) => v.toFixed(2)).join(",")).join("L")).join("");
      }
      put(sd, { sil: poly(hull((b.c || b.pts).map((p) => P(...p)))), crease });
      sd.sil.classList.toggle("hi", !!b.hi);
    });
    for (let i = ps.length; i < pool.length; i++) put(pool[i], { sil: "", crease: "" });
  }
  const sp = spring(REST);
  const L = register(stage, (dt) => { const m = stepS(sp, dt); draw(clamp(sp.x, -0.05, 1.05)); return m; });
  bag.add(L.unregister);
  draw(REST);
  let here = false;
  const say = () => { read.textContent = here ? LABEL(clamp(sp.t, 0, 1)) : "rest"; };
  say();
  bag.add(pointer(stage, {
    move: ([sx]) => { here = true; sp.t = clamp(lerp(REST, 1, clamp((sx - X0) / 150, 0, 1)) * reach + REST * (1 - reach), 0, 1); say(); L.wake(); },
    leave: () => { here = false; sp.t = REST; say(); L.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

const SCALE = 1.75, REST = 0.6, X0 = 125;
const LABEL = (s) => Math.round(lerp(-75, 75, s)) + "°";
const oct = (r, z0, z1) => { const pts = [], top = [], bot = []; for (let k = 0; k < 8; k++) { const a = (k + 0.5) * Math.PI / 4, x = r * Math.cos(a), y = r * Math.sin(a); bot.push([x, y, z0]); top.push([x, y, z1]); } pts.push(...bot, ...top); return { pts, lines: [top.concat([top[0]])] }; };
function parts(s) {
  const out = [], a = lerp(-75, 75, s), PZ = 100;
  for (const y of [-16, 14]) {
    out.push(B(-46, y - 2, 0, -36, y + 4, 2), B(36, y - 2, 0, 46, y + 4, 2));
    out.push(rot(B(-43, y, 0, -39, y + 2, 104), "y", 21, [-41, y, 0]), rot(B(39, y, 0, 43, y + 2, 104), "y", -21, [41, y, 0]));
  }
  out.push(B(-4, -16, PZ - 3, 4, 16, PZ + 3));
  const arm = [B(-2.5, -2.5, 26, 2.5, 2.5, PZ + 18), B(-8, -6, PZ + 14, 8, 6, PZ + 24), mv(oct(22, 10, 19), 0, 0, 0), mv(oct(16, 19, 30), 0, 0, 0)];
  arm[2].hi = true;
  out.push(...arm.map((b) => rot(b, "y", a, [0, 0, PZ])));
  return out;
}

hairline({
  name: "pendulumride",
  means: "A fairground pendulum ride on A-frame towers: the pointer swings the long arm and its ring of seats out to either side.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[140, 200], [300, 190], [215, 160], null],
  mount,
});
