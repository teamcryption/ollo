/**
 * Jump leads: a car battery with two terminal posts, and two lead clamps.
 * The pointer picks a terminal by where it stands: its clamp swings up off
 * the floor and bites onto the post, and the other clamp drops back, a beat
 * later. At rest one clamp is on its post, bright; the other lies on the floor.
 *
 * The pattern: one of a few in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, open, prism, proj, rings, tdone, tset, tval, tween, lerp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 64, BY = 38, BZ = 34, TZ = 40;
const TERM = [[15, 12], [49, 12]], FLOOR = [[8, 58], [44, 66]], ANCH = [[-14, 92], [70, 96]];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-4, -4, 0], [BX + 4, -4, 0], [-14, 92, 0], [70, 96, 0], [0, 0, TZ + 22], [BX, 0, TZ + 22]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, BX, BY, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const [lr, li] = rings(4, 4, BX - 4, BY - 4, 4, 1.5);
  put(solid(g), prism(P, front, lr, li, BZ, BZ + 2));
  for (const [x, y] of TERM) put(solid(g), prism(P, front, disc(x, y, 4.5), disc(x, y, 3), BZ + 2, TZ - 4));

  const items = TERM.map(([tx, ty], k) => {
    const lead = mk("path", { class: "nf" }, g), s = solid(g);
    return { k, tx, ty, lead, s, t: tween(k === 0 ? 1 : 0), last: NaN };
  });

  function draw(it, t) {
    if (t === it.last) return;
    it.last = t;
    const [fx, fy] = FLOOR[it.k], [ax, ay] = ANCH[it.k];
    const x = lerp(fx, it.tx, t), y = lerp(fy, it.ty, t), z = lerp(0, TZ - 6, t) + Math.sin(Math.PI * t) * 16;
    const [cr, ci] = rings(x - 9, y - 3.5, x + 9, y + 3.5, 3, 1.2);
    put(it.s, prism(P, front, cr, ci, z, z + 7));
    const pts = [];
    for (let i = 0; i <= 16; i++) { const u = i / 16; pts.push(P(lerp(x + 9, ax, u), lerp(y, ay, u), lerp(z + 3, 0, u) + Math.sin(Math.PI * u) * (6 + 10 * t) * (1 - u))); }
    it.lead.setAttribute("d", open(pts));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.t, now)); if (!tdone(it.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = TERM.map(([x, y]) => P(x, y, BZ));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 50 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), on = a < 0 ? 0 : a;
    act = a;
    items.forEach((it, k) => {
      tset(it.t, k === on ? 1 : 0, now, k === on ? stag : 0);
      it.s.sil.classList.toggle("hi", k === on);
    });
    read.textContent = a < 0 ? "rest" : a === 0 ? "post +" : "post -";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "jumpstarter",
  means: "A car battery with two posts and two lead clamps: the clamp for the post under the pointer swings up and bites on.",
  rules: [1, 2, 5, 6],
  range: [0, 120, 300],
  tour: [[228, 116], [276, 140], [242, 136], null],
  mount,
});
