/**
 * Pill bottles: four round bottles of different heights on a shelf, each
 * with a ridged cap. The pointer picks a bottle by where it stands: its cap
 * lifts off, and the caps beside it rise a little, staggered from it. At rest
 * one cap sits loosened, bright. The slider is the stagger.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 30, R = 11, LIFT = 18, FAV = 2, SZ = 4, CH = 7;
const H = [30, 40, 26, 34];
const X1 = (N - 1) * STEP + 2 * R;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-6, -6, 0], [X1 + 6, 2 * R + 6, 0], [X1 + 6, -6, 0], [-6, 2 * R + 6, 0], [R + STEP, R, SZ + 40 + CH + LIFT], [X1 - R, R, SZ + 34 + CH + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-6, -6, X1 + 6, 2 * R + 6, 5, 2);
  put(solid(g), prism(P, front, sr, si, 0, SZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + k * STEP, y = R, grp = mk("g", {}, g), top = SZ + H[k];
    put(solid(grp), prism(P, front, disc(x, y, R), disc(x, y, R - 1.6), SZ, top));
    // the label band: one dim ring around the body
    mk("path", { d: open(ringAt(P, disc(x, y, R, 32).filter(front), SZ + H[k] * 0.35)), class: "nf lo" }, grp);
    mk("path", { d: open(ringAt(P, disc(x, y, R, 32).filter(front), SZ + H[k] * 0.75)), class: "nf lo" }, grp);
    const cap = solid(grp), ridges = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, y, top, cap, ridges, z: tween(k === FAV ? LIFT * 0.4 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = it.top + 0.4 + lift;
    put(it.cap, prism(P, front, disc(it.x, it.y, R + 1), disc(it.x, it.y, R - 0.6), z0, z0 + CH));
    let d = "";
    for (const q of disc(it.x, it.y, R + 1, 24)) if (front(q) && q.nu + q.nv > -0.2) { const a = P(q.u, q.v, z0 + 1.4), b = P(q.u, q.v, z0 + CH - 1.4); d += `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`; }
    it.ridges.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, SZ + it.top / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.4 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.cap.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "rx " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "pillbottles",
  means: "Four pill bottles on a shelf: the cap of the bottle under the pointer twists up and off, and its neighbours loosen a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[127, 136], [176, 151], [273, 209], null],
  mount,
});
