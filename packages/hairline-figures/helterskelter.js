/**
 * Helter skelter: a fairground tower under a pointed roof, its slide wound
 * twice round it from the top door to the ground, and riders on mats. The
 * pointer's x sends the riders down the spiral, round towards the foot. At
 * rest they sit spaced down the slide, the top one bright. The slider is how
 * far down they slide.
 *
 * The pattern: one part travelling a path, driven by the pointer's x.
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

const SCALE = 2.75, REST = 0.12, X0 = 110;
const LABEL = (s) => Math.round(s * 72) + "°";
const N = 28, TOP = 84, RI = 11, RO = 25;
const at = (t, r, dz = 0) => { const a = -Math.PI * 0.25 + t * Math.PI * 4; return [r * Math.cos(a), r * Math.sin(a), TOP - (TOP - 3) * t + dz]; };
function parts(s) {
  const out = [];
  for (let k = 0; k < 12; k++) { const z0 = k * 8, z1 = Math.min(z0 + 8, 92); const sl = { pts: [], lines: [] }; for (let j = 0; j < 12; j++) { const a = (j + 0.5) * Math.PI / 6; sl.pts.push([10 * Math.cos(a), 10 * Math.sin(a), z0], [10 * Math.cos(a), 10 * Math.sin(a), z1]); } out.push(sl); }
  const roof = { pts: [[0, 0, 116]], lines: [] }; for (let j = 0; j < 12; j++) { const a = (j + 0.5) * Math.PI / 6; roof.pts.push([14 * Math.cos(a), 14 * Math.sin(a), 92]); }
  out.push(roof);
  for (let i = 0; i < N; i++) {
    const t0 = i / N, t1 = (i + 1) / N, a = at(t0, RI), b = at(t1, RI), c = at(t1, RO), d = at(t0, RO);
    const up = (p, h) => [p[0], p[1], p[2] + h];
    out.push({ pts: [a, b, c, d, up(c, 3), up(d, 3)], lines: [[up(d, 3), up(c, 3)]] });
  }
  for (let k = 0; k < 6; k++) {
    const t = clamp(k * 0.16 + s * 0.2, 0, 1), p = at(t, (RI + RO) / 2, 0), ang = -45 + t * 720 + 90;
    const rider = [B(-4, -6, 0, 4, 6, 1.5, k === 0), B(-3, -2, 1.5, 3, 4, 7), B(-2, -1.5, 7, 2, 2.5, 13)];
    for (const b of rider) out.push(Object.assign(mv(rot(b, 'z', ang, [0, 0, 0]), p[0], p[1], p[2] + 1), { dz: 2 }));
  }
  return out;
}

hairline({
  name: "helterskelter",
  means: "A fairground helter skelter: the pointer sends the riders on their mats down the slide that winds twice round the tower.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[150, 200], [300, 180], [220, 150], null],
  mount,
});
