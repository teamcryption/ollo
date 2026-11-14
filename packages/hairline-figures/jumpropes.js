/**
 * Jump ropes: three ropes hang in loops from hooks on a wall rail, a handle
 * down each side. The pointer picks a rope by where it stands: that rope
 * swings out from its hook, and its neighbours sway a little after it. At
 * rest the middle rope hangs swung out, bright. The slider is the stagger.
 */
const {
  Cam, fit, facing, open, prism, proj, rings, tdone, tset, tval, tween, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 44, HZ = 96, W = 7, DROP = 58, SW = 38, FAV = 1;
const X1 = (N - 1) * STEP + 40;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[0, -6, HZ + 8], [X1, 0, HZ + 8], [0, 0, HZ - DROP - 14], [X1, 0, HZ - DROP - 14], [X1 / 2, 60, HZ - 20], [X1 / 2, -6, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [rr, ri] = rings(0, -6, X1, 0, 2, 0.8);
  put(solid(g), prism(P, front, rr, ri, HZ, HZ + 6));
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 20 + k * STEP;
    const [hr, hi] = rings(x - 2, 0, x + 2, 4, 1.5, 0.6);
    put(solid(g), prism(P, front, hr, hi, HZ - 2, HZ + 2));
    const rope = mk("path", { class: "nf sil" }, g);
    const hl = mk("path", { class: "nf" }, g), hrd = mk("path", { class: "nf" }, g);
    items.push({ k, x, rope, hl, hrd, a: tween(k === FAV ? 18 : 0), last: NaN });
  }
  // a point hanging below the hook, swung out by a degrees about the hook
  const at = (a, x, z) => { const d = HZ - z, s = Math.sin(rad(a)), c = Math.cos(rad(a)); return P(x, 2 + d * s, HZ - d * c); };
  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const x = it.x, pts = [at(a, x, HZ - 2)];
    pts.push(at(a, x - W, HZ - 26));
    for (let i = 0; i <= 18; i++) { const s = (i / 18) * Math.PI; pts.push(at(a, x - W * Math.cos(s) * 1.6, HZ - 26 - DROP * Math.sin(s))); }
    pts.push(at(a, x + W, HZ - 26), at(a, x, HZ - 2));
    it.rope.setAttribute("d", open(pts));
    const handle = (hx) => { const p = [], q = []; for (const dx of [-1.6, 1.6]) { p.push(at(a, hx + dx, HZ - 10)); q.push(at(a, hx + dx, HZ - 26)); } return "M" + p[0] + "L" + q[0] + "L" + q[1] + "L" + p[1] + "Z"; };
    it.hl.setAttribute("d", handle(x - W - 1.6 * 0));
    it.hrd.setAttribute("d", handle(x + W));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 2, HZ - 40));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), v = a < 0 ? (k === FAV ? 18 : 0) : d === 0 ? SW : d === 1 ? 8 : 0;
      tset(it.a, v, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.rope.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "rope " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "jumpropes",
  means: "Three jump ropes hanging from hooks on a rail: the rope under the pointer swings out, its neighbours sway after it.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  tour: [[197, 183], [138, 153], [256, 212], null],
  mount,
});
