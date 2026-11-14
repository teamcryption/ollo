/**
 * Noodle bowls: three bowls on a low tray, each with a pair of chopsticks
 * laid across its rim and a mound of noodles inside. The pointer picks a
 * bowl by where it stands: its chopsticks lift and tilt, pinching, and pull
 * two strands of noodle up with them; the bowls beside it stir a little,
 * staggered from it. At rest the middle pair is half raised, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 50, RT = 20, RF = 10, H = 13, LIFT = 20, FAV = 1, CZ = 3;
const X0 = RT + 4, X1 = X0 + (N - 1) * STEP + RT + 4, Y1 = 2 * RT + 8;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  const T = CZ + H;
  fit(C, [[0, 0, 0], [X1, Y1, 0], [X1, 0, 0], [0, Y1, 0], [X0, RT + 4 - 26, T + LIFT + 3], [X1 - RT - 4, RT + 4 + 26, T]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(0, 0, X1, Y1, 7, 2);
  put(solid(g), prism(P, front, tr, ti, 0, CZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, y = RT + 4, grp = mk("g", {}, g);
    // the bowl: a foot ring smaller than its rim, hulled
    const foot = ringAt(P, disc(x, y, RF, 32), CZ), top = ringAt(P, disc(x, y, RT, 48), T);
    mk("path", { d: poly(hull(foot.concat(top))), class: "sil" }, grp);
    mk("path", { d: poly(ringAt(P, disc(x, y, RT - 1.6, 48), T)), class: "nf lo" }, grp);
    // the broth line: the back of the inner wall, seen over the front rim
    mk("path", { d: open(ringAt(P, run(disc(x, y, RT - 3, 48), (q) => !front(q)), T - 3)), class: "nf lo" }, grp);
    // the noodles: a low mound rising just over the rim
    const mound = [];
    for (const [r, z] of [[12, -3], [10, 0], [7, 2], [3, 3]]) mound.push(...ringAt(P, disc(x + 1, y + 1, r, 24), T + z));
    mk("path", { d: poly(hull(mound)), class: "nf" }, grp);
    const strands = mk("path", { class: "nf lo" }, grp);
    const sticks = [mk("path", { class: "sil" }, grp), mk("path", { class: "sil" }, grp)];
    items.push({ k, x, y, sticks, strands, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN });
  }

  // a rod lying from a to b: the hull of two small rounds, thinner at the tip
  const rod = (a, b) => poly(hull(ringAt(P, disc(a[0], a[1], 1.4, 10), a[2]).concat(ringAt(P, disc(b[0], b[1], 0.9, 10), b[2]))));

  function draw(it, L) {
    if (L === it.last) return;
    it.last = L;
    const { x, y } = it, f = L / LIFT, base = T + 1.6;
    const tipZ = base + L * 0.45, backZ = base + L * 1.05;
    const tips = [];
    [-1, 1].forEach((s, i) => {
      const tip = [x + s * (3.2 - 2 * f), y + 24, tipZ], back = [x + s * 3.4, y - 27, backZ];
      it.sticks[i].setAttribute("d", rod(back, tip));
      tips.push(tip);
    });
    if (L < 1.5) { it.strands.setAttribute("d", ""); return; }
    // strands hang from the tips, inside the bowl, back down to the mound
    const d = [];
    for (const [dx, w] of [[-1, 1.2], [1.2, -1]]) {
      const pts = [];
      for (let i = 0; i <= 6; i++) {
        const t = i / 6, wz = lerpN(tipZ - 1, T + 2, t);
        pts.push(P(x + dx + w * Math.sin(t * 6), lerpN(y + 18, y + 6, t), wz));
      }
      d.push(open(pts));
    }
    it.strands.setAttribute("d", d.join(" "));
  }
  const lerpN = (a, b, t) => a + (b - a) * t;

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, T));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 3 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      for (const s of it.sticks) s.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bowl " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "noodlebowls",
  means: "Three noodle bowls on a tray: the chopsticks over the bowl under the pointer lift and pinch, pulling noodles up.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[133, 140], [267, 200], [200, 150], null],
  mount,
});
