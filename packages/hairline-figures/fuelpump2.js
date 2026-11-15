/**
 * fuelpump2: a jerry can: a tall flat body with a three-bar handle on top and a spout cap at one corner; it turns to face the pointer, the cap bright at rest. The pointer's place across the figure sets the turn
 * (a spring), from the rest lean; the part nearest the pointer, picked from
 * its rest centre, takes the bright stroke. The slider is the widest turn.
 */
const { Cam, fit, facing, prism, proj, rings, clamp, rad, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const PARTS = [["can",-10,-22,10,22,4,0,44],["cap",-4,-21,4,-13,4,44,50],["post",-2.5,-6,2.5,-2,1.2,44,47],["post",-2.5,16,2.5,20,1.2,44,47],["handle",-3,-7,3,21,2.5,47,51]];
const REST = -16, FAV = 1, R = 30, H = 52;
const rot = (ring, a) => { const c = Math.cos(a), s = Math.sin(a); return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c })); };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 3.9);
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [0, 0, H]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const items = PARTS.map(([n, x0, y0, x1, y1, r, z0, z1]) => {
    const b = Math.min(1.6, (Math.min(x1 - x0, y1 - y0)) / 2 - 0.3);
    const [ring, inner] = rings(x0, y0, x1, y1, r, b);
    return { n, ring, inner, z0, z1, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, s: solid(g) };
  });
  const ang = spring(REST);
  let last = NaN, act = -2;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), c = Math.cos(a), s = Math.sin(a);
    const order = items.map((it) => ({ it, key: it.cx * c - it.cy * s + it.cx * s + it.cy * c + it.z0 * 3 }));
    order.sort((p, q) => p.key - q.key);
    for (const { it } of order) { put(it.s, prism(P, front, rot(it.ring, a), rot(it.inner, a), it.z0, it.z1)); g.appendChild(it.s.g); }
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(Math.round(ang.x * 100) / 100); return m; });
  bag.add(B.unregister);
  const mids = items.map((it) => { const a = rad(REST), c = Math.cos(a), s = Math.sin(a); return P(it.cx * c - it.cy * s, it.cx * s + it.cy * c, (it.z0 + it.z1) / 2); });
  const ctr = P(0, 0, H / 2);
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.hypot(m[0] - sx, m[1] - sy); if (d < bd) { bd = d; best = k; } });
    return bd < 46 ? best : -1;
  }
  function move(p) {
    const k = hit(p);
    ang.t = k < 0 ? REST : clamp((p[0] - ctr[0]) * 0.6, -1, 1) * max;
    if (k < 0 && Math.abs(p[0] - ctr[0]) < 1) ang.t = REST;
    if (k >= 0 && Math.abs(ang.t - REST) < max * 0.5) ang.t = ang.t < REST ? -max : max;
    if (k !== act) {
      act = k;
      items.forEach((it, i) => it.s.sil.classList.toggle("hi", i === (k < 0 ? FAV : k)));
      read.textContent = k < 0 ? "rest" : items[k].n;
    }
    B.wake();
  }
  move([-999, -999]);
  bag.add(pointer(stage, { move, leave: () => move([-999, -999]) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "fuelpump2",
  means: "A jerry can with its handle and spout cap turns to face the pointer, and the part under it brightens.",
  rules: [1, 3, 5, 6],
  range: [20, 34, 48],
  tour: [[247, 20], [112, 229], [180, 140], null],
  mount,
});
