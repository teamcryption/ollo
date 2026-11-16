/**
 * Coin roller: a small counting box with a crank on its side and a wrapped
 * roll of coins coming out of its front. The pointer over the box turns the
 * crank most of a turn and the finished roll slides out of the front; leaving
 * draws it back. At rest the roll is bright. The slider is how far the roll
 * comes out.
 *
 * The pattern: one part turning on an axle, one sliding out (crank).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, rrect, rad, tset, tval, tdone, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const area = (p) => p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1]; }, 0);
const shift = (ring, du, dv) => ring.map((q) => ({ ...q, u: q.u + du, v: q.v + dv }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let out = value;
  const C = Cam(45, 0.5, 3.0);
  const arm = (ph) => (u, v, w) => { const c = Math.cos(rad(ph)), s = Math.sin(rad(ph)); return [50 + w, 20 + u * c - v * s, 24 + u * s + v * c]; };
  const ext = [[0, 0, 0], [50, 0, 0], [0, 40, 0], [50, 40, 0], [0, 0, 36], [62, 20, 46], [62, 20, 2], [62, 42, 24], [25, 98, 22], [25, 98, 6]];
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const ref = Math.sign(area(circ(10, 12).map((q) => P(q.u, q.v, 0))));
  function body(el, ring, inner, w0, w1, f) {
    const a = ring.map((q) => P(...f(q.u, q.v, w0))), b = ring.map((q) => P(...f(q.u, q.v, w1)));
    const up = Math.sign(area(b)) === ref;
    put(el, { sil: poly(hull(a.concat(b))), crease: poly(inner.map((q) => P(...f(q.u, q.v, up ? w1 : w0)))) });
  }

  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, 50, 40, 6, 1.8);
  put(solid(g), prism(P, front, br, bi, 0, 36));
  const [hr, hi] = rings(8, 8, 42, 32, 4, 1.5);
  put(solid(g), prism(P, front, hr, hi, 36, 40));
  const roll = solid(g), hub = solid(g), crank = solid(g), knob = solid(g);
  const axle = (cy, cz) => (u, v, w) => [50 + w, cy + u, cz + v];
  body(hub, circ(5, 20), circ(3.5, 20), 0, 3, axle(20, 24));
  const aR = rrect(-3, -3, 20, 3, 3, 3), aI = rrect(-2, -2, 19, 2, 2, 3);
  const st = { ph: tween(70), d: tween(14) };
  let last = NaN;

  function draw(ph, d) {
    if (ph * 1000 + d === last) return;
    last = ph * 1000 + d;
    body(roll, circ(8, 24), circ(6.6, 24), -2, d, (u, v, w) => [25 + u, 40 + w, 14 - v]);
    const f = arm(ph);
    body(crank, aR, aI, 3, 5.5, f);
    const e = f(18, 0, 5.5);
    body(knob, circ(2.6, 16), circ(1.8, 16), 0, 7, (u, v, w) => [e[0] + w, e[1] + u, e[2] + v]);
  }

  const B = register(stage, (_dt, now) => {
    draw(tval(st.ph, now), tval(st.d, now));
    return !tdone(st.ph, now) || !tdone(st.d, now);
  });
  bag.add(B.unregister);

  const bx = ext.slice(0, 6).map((p) => P(...p)), xs = bx.map((p) => p[0]), ys = bx.map((p) => p[1]);
  const inside = ([sx, sy]) => sx > Math.min(...xs) && sx < Math.max(...xs) && sy > Math.min(...ys) && sy < Math.max(...ys);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    const now = performance.now();
    tset(st.ph, on ? 370 : 70, now, 0);
    tset(st.d, on ? out : 14, now, on ? 120 : 0);
    roll.sil.classList.toggle("hi", !on);
    crank.sil.classList.toggle("hi", on);
    read.textContent = on ? "roll" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { out = v; const a = act; act = null; setActive(a); }, destroy: bag.dispose };
}

hairline({
  name: "coinroller",
  means: "A coin roller box: the pointer over it turns the side crank and a wrapped roll of coins slides out of the front.",
  rules: [1, 4, 5, 8],
  range: [36, 48, 58],
  tour: [[235, 110], [260, 150], [205, 175], null],
  mount,
});
