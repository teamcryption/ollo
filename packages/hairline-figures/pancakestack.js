/**
 * Pancake stack: five pancakes on a plate, a pat of butter on top. The
 * pointer picks a pancake by its height in the stack: everything above it
 * lifts clear, staggered outward from it, so the cut shows. At rest the stack
 * leans a little and the top pancake is bright. The slider is the stagger.
 *
 * The pattern: one of many in a single column, picked by rest height.
 */
const {
  Cam, circ, fit, facing, proj, prism, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, R = 26, TH = 4.6, PZ = 2.4, LIFT = 16, CX = 0, CY = 0;
const OFF = [[0, 0], [1.6, -1], [-1.2, 1.4], [1.8, 1.2], [-0.6, -1.6]];
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.1);
  const top = PZ + N * TH + LIFT + 6;
  fit(C, [[-40, -40, 0], [40, 40, 0], [40, -40, 0], [-40, 40, 0], [0, 0, top]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the plate: a wide disc with a rim crease
  put(solid(g), prism(P, front, disc(CX, CY, 38, 48), disc(CX, CY, 30, 48), 0, PZ));

  const cakes = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g), s = solid(grp);
    cakes.push({ k, s, x: CX + OFF[k][0], y: CY + OFF[k][1], z0: PZ + k * TH, lift: tween(0), last: NaN });
  }
  // the butter rides on the top pancake
  const bs = solid(cakes[N - 1].s.g);
  const butter = (z) => { const [a, b] = [rrect(-6, -5, 6, 5, 1.6, 4), rrect(-5, -4, 5, 4, 1, 4)]; put(bs, prism(P, front, a, b, z, z + 3)); };

  function draw(c, l) {
    if (l === c.last) return;
    c.last = l;
    const z = c.z0 + l;
    put(c.s, prism(P, front, disc(c.x, c.y, R - (c.k % 2) * 0.8), disc(c.x, c.y, R - 2.4), z, z + TH - 0.3));
    if (c.k === N - 1) butter(z + TH - 0.3);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const c of cakes) { draw(c, tval(c.lift, now)); if (!tdone(c.lift, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // hit: the pointer's screen y against each pancake's rest middle
  const mids = cakes.map((c) => P(c.x, c.y, c.z0 + TH / 2));
  const axis = P(CX, CY, 0)[0];
  function hit([sx, sy]) {
    if (Math.abs(sx - axis) > R * 2.6) return -1;
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[1] - sy); if (d < bd) { bd = d; best = k; } });
    return bd < 26 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    cakes.forEach((c, k) => {
      const l = a < 0 ? (k === N - 1 ? 4 : 0) : k > a ? LIFT * (0.7 + 0.3 * Math.min(1, (k - a) / 2)) : 0;
      tset(c.lift, l, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      c.s.sil.classList.toggle("hi", k === (a < 0 ? N - 1 : a));
    });
    read.textContent = a < 0 ? "rest" : "cake " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "pancakestack",
  means: "Five pancakes on a plate: the one under the pointer stays put and everything above it lifts clear, so the stack opens there.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[200, 175], [200, 149], [200, 121], null],
  mount,
});
