/**
 * Valet stand: a parking podium with a key cabinet on top and a row of key
 * tags hanging from hooks along its front. The pointer picks a tag by where
 * it stands: that tag lifts off its hook and its neighbours swing up a
 * little, staggered from it. At rest one tag is half lifted, bright.
 */
const {
  Cam, fit, facing, fillet, open, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 64, D = 36, PZ = 66, TZ = 84, N = 4, FAV = 2, LIFT = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-4, -4, 0], [W + 4, D + 10, 0], [W + 4, -4, 0], [-4, D + 10, 0], [-4, -4, TZ + 6], [W + 4, D + 4, TZ + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-4, -4, W + 4, D + 4, 6, 2);
  put(solid(g), prism(P, front, fr, fi, 0, 4));
  const [br, bi] = rings(6, 4, W - 6, D - 4, 6, 1.6);
  put(solid(g), prism(P, front, br, bi, 4, PZ));
  const [cr, ci] = rings(-2, -2, W + 2, D + 2, 5, 1.8);
  put(solid(g), prism(P, front, cr, ci, PZ, TZ));
  // a sloped writing lid on the cabinet
  const [lr, li] = rings(4, 4, W - 4, D - 4, 3, 1.2);
  put(solid(g), prism(P, front, lr, li, TZ, TZ + 3));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 10 + k * ((W - 20) / (N - 1));
    const hook = mk("path", { class: "nf lo" }, g), tag = mk("path", { class: "sil" }, g);
    items.push({ k, x, hook, tag, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN });
  }
  const yF = D + 2.5;
  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const y = yF + lift * 0.4, top = PZ - 2 + lift, bot = top - 16;
    const pts = [P(it.x - 5, y, top), P(it.x + 5, y, top), P(it.x + 5, y, bot), P(it.x - 5, y, bot)];
    it.tag.setAttribute("d", poly(fillet(pts, [2, 2, 2, 2])) + " " + poly(fillet([P(it.x - 1.2, y, top - 2), P(it.x + 1.2, y, top - 2), P(it.x + 1.2, y, top - 4.4), P(it.x - 1.2, y, top - 4.4)], [1, 1, 1, 1])));
    it.hook.setAttribute("d", open([P(it.x, yF - 0.5, PZ + 6), P(it.x, y, top - 3)]));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, yF, PZ - 10));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 22 && Math.abs(mids[best][1] - sy) < 40 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.tag.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "key " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "luggagecart2",
  means: "A valet podium with key tags on hooks: the tag under the pointer lifts off its hook and its neighbours swing up a little.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  tour: [[207, 175], [176, 159], [145, 143], null],
  mount,
});
