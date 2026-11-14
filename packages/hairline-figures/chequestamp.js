/**
 * Rubber stamps: four stamps, each a rubber block, a neck and a round knob,
 * held over a sheet of paper. The pointer picks a stamp by where it stands:
 * it presses down onto the sheet, and the stamps beside it dip a little,
 * staggered from it. At rest one stamp is down, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 30, B = 8, UP = 24, FAV = 1, PZ = 1.2;
const X1 = (N - 1) * STEP + 2 * B;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-10, -10, 0], [X1 + 10, 2 * B + 10, 0], [X1 + 10, -10, 0], [-10, 2 * B + 10, 0], [B, B, PZ + UP + 30], [X1 - B, B, PZ + UP + 30]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-10, -10, X1 + 10, 2 * B + 10, 2, 1);
  put(solid(g), prism(P, front, pr, pi, 0, PZ));

  const rest = (k) => (k === FAV ? 0 : UP - [2, 0, 5, 3][k]);
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = B + k * STEP, y = B, grp = mk("g", {}, g);
    const [br, bi] = rings(x - B, y - B, x + B, y + B, 2, 1.2);
    const block = solid(grp), neck = solid(grp), knob = mk("path", { class: "sil" }, grp);
    items.push({ k, x, y, br, bi, block, neck, knob, z: tween(rest(k)), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = PZ + lift;
    put(it.block, prism(P, front, it.br, it.bi, z0, z0 + 6));
    put(it.neck, prism(P, front, disc(it.x, it.y, 2.6), disc(it.x, it.y, 1.8), z0 + 6, z0 + 16));
    const pts = [];
    for (let i = -3; i <= 3; i++) { const t = (i / 3) * (Math.PI / 2); pts.push(...ringAt(P, disc(it.x, it.y, 6 * Math.cos(t), 24), z0 + 21 + 5.5 * Math.sin(t))); }
    it.knob.setAttribute("d", poly(hull(pts)));
  }

  const L = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(L.unregister);

  const mids = items.map((it) => P(it.x, it.y, PZ + UP));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 75 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const on = a < 0 ? FAV : a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? rest(k) : dd === 0 ? 0 : dd === 1 ? UP - 6 : UP;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.block.sil.classList.toggle("hi", k === on);
      it.knob.classList.toggle("hi", k === on);
    });
    read.textContent = a < 0 ? "rest" : "stamp " + (a + 1);
    L.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "chequestamp",
  means: "Four rubber stamps over a sheet: the stamp under the pointer presses down onto the paper, and its neighbours dip after it.",
  rules: [1, 2, 5, 9],
  range: [0, 40, 80],
  tour: [[133, 126], [178, 148], [267, 193], null],
  mount,
});
