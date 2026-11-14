/**
 * Steering wheel: a three-spoke wheel on a raked column that runs back into
 * a dashboard. The pointer steers it: the further right or left of the hub
 * the pointer stands, the further the wheel turns, up to a lock. At rest it
 * sits a little off centre with its top marker bright. The slider is the
 * lock, in degrees.
 *
 * The pattern: one part turning to follow the pointer (spring).
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rad, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 30, RI = 25, T = rad(28), WZ = 46, REST = -0.24;
const N = [0, Math.cos(T), Math.sin(T)], E1 = [1, 0, 0], E2 = [0, -Math.sin(T), Math.cos(T)];
const area = (p) => p.reduce((s, q, i) => { const o = p[(i + 1) % p.length]; return s + q[0] * o[1] - o[0] * q[1]; }, 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lock = value;
  const C = Cam(45, 0.5, 2.5);
  const W3 = (r, a, off) => [r * Math.cos(a) * E1[0] + off * N[0], r * Math.cos(a) * E1[1] + r * Math.sin(a) * E2[1] + off * N[1], WZ + r * Math.sin(a) * E2[2] + off * N[2]];
  fit(C, [[-60, -80, 0], [60, -34, 0], [-60, -34, 0], [60, -80, 0], W3(R, Math.PI / 2, 2), W3(R, -Math.PI / 2, 2), W3(R, 0, 2), W3(R, Math.PI, 2)], 200, 168);
  const P = proj(C), front = facing(C);
  const at = (r, a, off) => P(...W3(r, a, off));
  const ring = (r, off, n = 48) => Array.from({ length: n }, (_, i) => at(r, (i / n) * 2 * Math.PI, off));
  const g = mk("g", {}, svg);
  const [dr, di] = rings(-60, -80, 60, -34, 8, 2);
  put(solid(g), prism(P, front, dr, di, 0, 32));
  // the column: a cylinder from behind the hub back into the dash
  const col = (off) => Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * 2 * Math.PI, q = W3(4.5, a, off); return P(q[0], q[1], q[2]); });
  mk("path", { d: poly(hull(col(-3).concat(col(-40)))), class: "sil" }, g);

  const spokes = [0, 1, 2].map(() => mk("path", { class: "" }, g));
  const rim = mk("path", { class: "sil" }, g), rimIn = mk("path", { class: "nf lo" }, g);
  const hub = solid(g), mark = mk("path", { class: "nf" }, g);
  const outer = hull(ring(R, -2).concat(ring(R, 2)));
  let inner = ring(RI, 2);
  if (Math.sign(area(inner)) === Math.sign(area(outer))) inner = inner.slice().reverse();
  rim.setAttribute("d", poly(outer) + poly(inner));
  rimIn.setAttribute("d", poly(ring(R - 1.2, 2.1)));
  put(hub, { sil: poly(hull(ring(9, 0, 24).concat(ring(9, 3.5, 24)))), crease: poly(ring(7, 3.6, 24)) });

  const th = spring(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    [0, Math.PI, -Math.PI / 2].forEach((a0, k) => {
      const a = a0 + t, w = 0.16;
      spokes[k].setAttribute("d", poly([at(8, a - w * 2.5, 1), at(RI + 1, a - w, 1.5), at(RI + 1, a + w, 1.5), at(8, a + w * 2.5, 1)]));
    });
    const top = Math.PI / 2 + t, arc = [];
    for (let i = 0; i <= 8; i++) arc.push(at(R - 2.5, top - 0.14 + (i / 8) * 0.28, 2.3));
    for (let i = 8; i >= 0; i--) arc.push(at(R + 0.2, top - 0.14 + (i / 8) * 0.28, 2.3));
    mark.setAttribute("d", poly(arc));
  }

  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(th.x); return m; });
  bag.add(B.unregister);

  const c0 = at(0, 0, 0);
  let on = null;
  function aim(p) {
    const inside = p && Math.abs(p[0] - c0[0]) < 110 && Math.abs(p[1] - c0[1]) < 95;
    th.t = inside ? -clamp((p[0] - c0[0]) / 75, -1, 1) * rad(lock) : REST;
    if (inside !== on) { on = inside; rim.classList.toggle("hi", inside); mark.classList.toggle("hi", !inside); }
    const d = Math.round((-th.t * 180) / Math.PI);
    read.textContent = inside ? (d === 0 ? "0°" : (d > 0 ? "R " : "L ") + Math.abs(d) + "°") : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lock = v; }, destroy: bag.dispose };
}

hairline({
  name: "steeringwheel",
  means: "A steering wheel on its column: it turns as far as the pointer stands right or left of the hub, up to a lock.",
  rules: [3, 4, 5, 8],
  range: [45, 90, 135],
  tour: [[200, 160], [260, 160], null],
  mount,
});
