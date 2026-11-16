/**
 * Golf bag: a stand bag with clubs in its mouth and two stand legs folded
 * along its back. The pointer swings the legs open, and the bag tilts back
 * onto them. At rest the legs stand half open, bright. The slider is the
 * widest the legs open.
 *
 * The pattern: one part swinging open to the pointer.
 */
const { Cam, fit, hull, poly, proj, clamp, lerp, rad, spring, stepS, disposer, mk, pointer, register } = HL;

const H = 86, R = 12, REST = 0.5;
const ry = (p, a) => [p[0] * Math.cos(a) + p[2] * Math.sin(a), p[1], -p[0] * Math.sin(a) + p[2] * Math.cos(a)];
function cyl(P, a, b, r, n = 20) {
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d), w = d.map((v) => v / L);
  const t = Math.abs(w[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  let u = [w[1] * t[2] - w[2] * t[1], w[2] * t[0] - w[0] * t[2], w[0] * t[1] - w[1] * t[0]];
  const ul = Math.hypot(...u); u = u.map((v) => v / ul);
  const v = [w[1] * u[2] - w[2] * u[1], w[2] * u[0] - w[0] * u[2], w[0] * u[1] - w[1] * u[0]];
  const pts = [];
  for (let i = 0; i < n; i++) {
    const c = Math.cos((i / n) * 2 * Math.PI) * r, s = Math.sin((i / n) * 2 * Math.PI) * r;
    for (const e of [a, b]) pts.push(P(e[0] + u[0] * c + v[0] * s, e[1] + u[1] * c + v[1] * s, e[2] + u[2] * c + v[2] * s));
  }
  return poly(hull(pts));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-70, -30, 0], [20, 30, 0], [-70, 30, 0], [20, -30, 0], [0, 0, H + 26], [-40, 0, H + 20]], 200, 162);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const names = ["legL", "legR", "body", "club1", "club2", "club3", "pocket", "collar"];
  const el = {};
  for (const k of names) el[k] = mk("path", { class: k.startsWith("leg") ? "sil hi" : "sil" }, g);
  const open = spring(REST);
  let last = NaN;

  function draw(s) {
    if (s === last) return;
    last = s;
    const tilt = -rad(max) * 0.45 * s, B = (x, y, z) => ry([x, y, z], tilt);
    const top = B(0, 0, H), hinge = B(-R, 0, H - 18);
    const items = [];
    for (const sy of [-1, 1]) {
      const foot = [-R - 4 - 60 * Math.sin(rad(max) * s), sy * (5 + 16 * s), 0];
      items.push([sy < 0 ? "legL" : "legR", cyl(P, [hinge[0], hinge[1] + sy * 5, hinge[2]], foot, 1.6, 10), [foot[0] + 30, foot[1]]]);
    }
    items.push(["body", cyl(P, B(0, 0, 2), top, R, 32), [0, 0]]);
    items.push(["pocket", cyl(P, B(R - 1, 0, 22), B(R - 1, 0, 50), 6, 16), [R + 2, 0.5]]);
    items.push(["collar", cyl(P, B(0, 0, H - 3), B(0, 0, H + 2), R + 2, 32), [0.1, 0.1]]);
    [[-4, -4, 22], [3, 3, 18], [-3, 5, 26]].forEach(([x, y, h], i) => {
      items.push(["club" + (i + 1), cyl(P, B(x, y, H), B(x * 1.4 - 6, y * 1.4, H + h), 4.5, 12), [x - 2, y + 0.2]]);
    });
    items.sort((p, q) => p[2][0] + p[2][1] - (q[2][0] + q[2][1]));
    for (const [k, path] of items) { el[k].setAttribute("d", path); g.appendChild(el[k]); }
  }

  const Bk = register(stage, (dt) => { const m = stepS(open, dt); draw(open.x); return m; });
  bag.add(Bk.unregister);

  function aim(t, rest) {
    open.t = t;
    read.textContent = rest ? "rest" : Math.round(t * max) + "°";
    Bk.wake();
  }
  aim(REST, true);
  bag.add(pointer(stage, { move: ([sx]) => aim(clamp((340 - sx) / 260, 0, 1)), leave: () => aim(REST, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; last = NaN; aim(REST, true); }, destroy: bag.dispose };
}

hairline({
  name: "golfcart2",
  means: "A golf stand bag: its two legs swing open toward the pointer and the bag tilts back onto them.",
  rules: [1, 3, 5],
  range: [20, 35, 50],
  tour: [[300, 150], [100, 150], [172, 172], null],
  mount,
});
