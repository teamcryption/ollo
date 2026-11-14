/**
 * Ball return: the hood where balls come back from the pit, and two rails
 * running out of it with four balls resting on them, spread unevenly. The
 * pointer picks a ball by where it stands: the others roll along the rails to
 * close up against it, the nearest first, their finger holes turning as they
 * roll. At rest one ball stands apart, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), rolling to gather.
 */
const {
  Cam, fit, facing, prism, proj, rings, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, R = 10, LEN = 150, D = 2 * R + 1, CZ = 19, FAV = 3;
const REST = [14, 44, 68, 128];
const HOLES = [[0.35, 0.25], [0.35, -0.25], [0.75, 0]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-26, -18, 0], [LEN + 10, 16, 0], [LEN + 10, -16, 0], [-26, 18, 0], [-26, -18, 34], [LEN, 0, CZ + R]], 200, 168);
  const P = proj(C), front = facing(C), S = 1.95;
  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1, par = g) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(par), prism(P, front, o, i, z0, z1)); };
  block(-26, -18, -2, 18, 9, 2, 0, 34);
  block(-8, -14, LEN + 10, 14, 6, 1.5, 0, 8);
  block(0, -9, LEN, -5, 2, 0.8, 8, 12);
  const balls = mk("g", {}, g);
  block(0, 5, LEN, 9, 2, 0.8, 8, 12);

  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, balls);
    const body = mk("ellipse", { class: "sil", rx: R * S, ry: R * S }, grp);
    const holes = HOLES.map(() => mk("ellipse", { class: "nf lo", rx: 1.6, ry: 1.6 }, grp));
    items.push({ k, grp, body, holes, x: tween(REST[k]), last: NaN });
  }

  function draw(it, x) {
    if (x === it.last) return;
    it.last = x;
    const c = P(x, 0, CZ);
    it.body.setAttribute("cx", c[0]); it.body.setAttribute("cy", c[1]);
    const a = x / R + it.k * 1.3;
    HOLES.forEach(([el, off], j) => {
      // a hole on the sphere: rolling about the y axis turns it in the x-z plane
      const t = a + off, e = Math.cos(el), hx = Math.cos(t) * e, hz = Math.sin(t) * e, hy = Math.sin(el) * (j === 2 ? 0.3 : 1) * 0.6;
      const q = P(x + hx * R, hy * R, CZ + hz * R), vis = hx + hy > -0.1;
      it.holes[j].setAttribute("cx", q[0]); it.holes[j].setAttribute("cy", q[1]);
      it.holes[j].setAttribute("rx", vis ? 1.6 : 0); it.holes[j].setAttribute("ry", vis ? 1.6 : 0);
    });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.x, now)); if (!tdone(it.x, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = REST.map((x) => P(x, 0, CZ));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 20 && Math.abs(mids[best][1] - sy) < 40 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const lo = a < 0 ? 0 : Math.min(Math.max(REST[a] - a * D, R), LEN - R - (N - 1) * D);
    items.forEach((it, k) => {
      tset(it.x, a < 0 ? REST[k] : lo + k * D, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "ball " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "bowlingreturn",
  means: "A ball return with four balls on its rails: the others roll along the rails to close up against the ball under the pointer.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[128, 112], [170, 133], [285, 190], null],
  mount,
});
