/**
 * Parking meters: four meters in a row on a kerb, each a post with a rounded
 * head and a paddle flag on its face. The pointer picks a meter by where it is
 * along the row: its flag swings up to paid, the neighbours' flags rise a
 * little after it. At rest the flags hang at uneven angles, one bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row; the hit is the nearest rest head
 * along screen x.
 */
const {
  Cam, clamp, facing, fillet, fit, poly, prism, proj, rings, ringAt, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 20, HZ0 = 30, HZ1 = 50, KZ = 3, YF = 4.3, PZ = 35;
const REST = [208, 192, 150, 214], FAV = 2, UP = 90;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.1);
  const XN = (N - 1) * STEP;
  fit(C, [[-12, -9, 0], [XN + 10, 9, 0], [XN + 10, -9, 0], [-12, 9, 0], [-10, 0, HZ1], [XN + 6, 0, HZ1]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the kerb: one long low slab the meters stand on
  const [kr, ki] = rings(-12, -9, XN + 10, 9, 3, 1.2);
  put(solid(g), prism(P, front, kr, ki, 0, KZ));

  const meters = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP;
    const [pr, pi] = rings(x - 1.8, -1.8, x + 1.8, 1.8, 1.8, 0.6);
    put(solid(g), prism(P, front, pr, pi, KZ, HZ0 + 1));
    const [hr, hi] = rings(x - 6, -4, x + 6, 4, 4, 1.2);
    const head = solid(g);
    put(head, prism(P, front, hr, hi, HZ0, HZ1));
    // the coin slot on top and the window on the face
    mk("path", { class: "nf lo", d: poly(ringAt(P, rrect(x - 0.6, -2.4, x + 0.6, 2.4, 0.5, 3), HZ1)) +
      poly(rrect(x - 4, 40, x + 4, 46, 1.5, 4).map((s) => P(s.u, 4.05, s.v))) }, head.g);
    const flag = mk("path", { class: "sil" }, g);
    meters.push({ x, flag, a: tween(REST[k]), last: NaN });
  }

  // the paddle in the head's face plane, turned about its pivot by a degrees
  const PAD = fillet([[-1.4, -1], [7, -1], [7, -3], [14, -3], [14, 3], [7, 3], [7, 1], [-1.4, 1]],
    [0.8, 0.3, 1, 1.6, 1.6, 1, 0.3, 0.8], 4);
  function draw(m, a) {
    if (a === m.last) return;
    m.last = a;
    const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180), px = m.x + 3;
    m.flag.setAttribute("d", poly(PAD.map(([u, w]) => P(px + u * c - w * s, YF, PZ + u * s + w * c))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    meters.forEach((m) => { draw(m, tval(m.a, now)); if (!tdone(m.a, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: nearest rest head along screen x, within the row's band
  const heads = meters.map((m) => P(m.x, 0, (HZ0 + HZ1) / 2));
  function hit([sx, sy]) {
    let best = -1, bd = 1e9;
    heads.forEach(([hx, hy], k) => { const d = Math.abs(sx - hx); if (d < bd && Math.abs(sy - hy) < 90) { bd = d; best = k; } });
    return bd < 40 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    meters.forEach((m, k) => {
      const t = a < 0 ? REST[k] : k === a ? UP : clamp(REST[k] - 36 / Math.abs(k - a), 120, 214);
      tset(m.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      m.flag.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bay " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "parkingmeters",
  means: "A row of parking meters on a kerb: the flag of the meter under the pointer swings up to paid, its neighbours lift a little after.",
  rules: [1, 2, 4, 5],
  range: [0, 45, 90],
  tour: [[136, 88], [224, 132], [268, 154], null],
  mount,
});
