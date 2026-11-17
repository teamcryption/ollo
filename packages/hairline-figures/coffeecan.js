/**
 * Coffee canister: a round canister with a hinged lid held shut by a wire clamp at the front. The pointer throws the clamp and swings the lid open. At rest the lid is cracked, bright.
 *
 * The pattern: one part turning on a hinge or axis, driven by the pointer's x.
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
  fit(C, ext, 200, 162);
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

const SCALE = 3.95, REST = 0.12, X0 = 130;
const LABEL = (s) => Math.round(4 + 84 * s) + "°";
function cyl(r0, r1, z0, z1, hi, cx = 0, cy = 0) {
  const ring = (r, z) => { const o = []; for (let i = 0; i <= 28; i++) { const t = (i / 28) * 2 * Math.PI; o.push([cx + r * Math.cos(t), cy + r * Math.sin(t), z]); } return o; };
  const top = ring(r1, z1);
  return { hi, pts: ring(r0, z0).concat(top), lines: [top] };
}
const R = 18, H = 30;
function parts(s) {
  const out = [cyl(R, R, 0, H), B(-R - 3, -4, H - 4, -R + 1, 4, H)];
  const a = 4 + 84 * s;
  const lid = [cyl(R + 1, R + 1, H, H + 5, true, R + 1, 0), cyl(R - 4, R - 9, H + 5, H + 9, false, R + 1, 0), B(2 * R, -3, H + 1, 2 * R + 4, 3, H + 4)];
  out.push(...lid.map((b) => mv(rot(b, "y", -a, [0, 0, H]), -R - 1, 0, 0)));
  out.push(...[B(R + 1, -5, H - 14, R + 3, -3, H + 3), B(R + 1, 3, H - 14, R + 3, 5, H + 3), B(R + 1, -5, H - 14, R + 4, 5, H - 11)].map((b) => rot(b, "y", 110 * Math.min(1, s * 1.6) - 6, [R + 2, 0, H - 13])));
  return out;
}

hairline({
  name: "coffeecan",
  means: "A coffee canister with a clamp lid: the pointer throws the wire clamp and swings the hinged lid open.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[152, 154], [230, 179], [270, 200], null],
  mount,
});
