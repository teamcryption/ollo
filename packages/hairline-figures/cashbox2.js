/**
 * Coin scoop: a teller's counter with a shallow scoop resting on it, a few
 * coins lying in the tray and a short handle at its back. The pointer over
 * the counter tips the scoop up on its front lip, and the coins slide down
 * to the lip; leaving lays it back. At rest one coin is bright. The slider
 * is how far the scoop tips.
 *
 * The pattern: one part tilting on an edge (hinge).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, rrect, rad, tset, tval, tdone, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const area = (p) => p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1]; }, 0);
const shift = (ring, du, dv) => ring.map((q) => ({ ...q, u: q.u + du, v: q.v + dv }));
const COINS = [[38, 10], [30, 25], [20, 12], [14, 27]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tip = value;
  const C = Cam(45, 0.5, 2.25);
  const at = (th) => (u, v, w) => { const c = Math.cos(rad(th)), s = Math.sin(rad(th)); return [84 - u * c + w * s, 52 - v, 6 + u * s + w * c]; };
  const ext = [[0, 0, 0], [100, 0, 0], [0, 64, 0], [100, 64, 0], [0, 0, 6]];
  for (const th of [0, 42]) { const f = at(th); ext.push(f(74, 0, 6), f(74, 40, 6), f(0, 40, 9)); }
  fit(C, ext, 200, 170);
  const P = proj(C), front = facing(C);
  const ref = Math.sign(area(circ(10, 12).map((q) => P(q.u, q.v, 0))));
  function body(el, ring, inner, w0, w1, f) {
    const a = ring.map((q) => P(...f(q.u, q.v, w0))), b = ring.map((q) => P(...f(q.u, q.v, w1)));
    const up = Math.sign(area(b)) === ref;
    put(el, { sil: poly(hull(a.concat(b))), crease: poly(inner.map((q) => P(...f(q.u, q.v, up ? w1 : w0)))) });
  }

  const g = mk("g", {}, svg);
  const [kr, ki] = rings(0, 0, 100, 64, 6, 2);
  put(solid(g), prism(P, front, kr, ki, 0, 6));
  const handle = solid(g), scoop = solid(g);
  const coins = COINS.map(() => solid(g));
  const sR = rrect(0, 0, 52, 40, 8, 4), sI = rrect(3.5, 3.5, 48.5, 36.5, 5, 4);
  const hR = rrect(48, 15, 74, 25, 4, 3), hI = rrect(49.5, 16.5, 72.5, 23.5, 3, 3);
  const st = tween(6);
  let last = NaN;

  function draw(th) {
    if (th === last) return;
    last = th;
    const f = at(th), k = Math.min(1, th / 30);
    body(handle, hR, hI, 2, 5, f);
    body(scoop, sR, sI, 0, 6, f);
    COINS.forEach(([u, v], i) => {
      const uu = u + (7 + i * 1.5 - u) * k * 0.85;
      body(coins[i], shift(circ(6, 24), uu, v), shift(circ(4.6, 24), uu, v), 3, 5, f);
    });
  }

  const B = register(stage, (_dt, now) => { draw(tval(st, now)); return !tdone(st, now); });
  bag.add(B.unregister);

  const bx = ext.map((p) => P(...p)), xs = bx.map((p) => p[0]), ys = bx.map((p) => p[1]);
  const inside = ([sx, sy]) => sx > Math.min(...xs) && sx < Math.max(...xs) && sy > Math.min(...ys) && sy < Math.max(...ys);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(st, on ? tip : 6, performance.now(), 0);
    scoop.sil.classList.toggle("hi", on);
    coins[0].sil.classList.toggle("hi", !on);
    read.textContent = on ? "tip" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tip = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "cashbox2",
  means: "A coin scoop on a counter: the pointer over it tips the scoop on its lip and the coins slide down to the edge.",
  rules: [1, 4, 5, 8],
  range: [20, 32, 42],
  tour: [[219, 194], [250, 160], [180, 160], null],
  mount,
});
