/**
 * Window samples: three sash window frames standing on a showroom plinth.
 * The frame nearest the pointer slides its lower sash up, the others
 * slide shut, staggered from it. At rest the sashes stand at mixed
 * openings and the first sash is bright.
 *
 * The pattern: one of many in a single row, sliding (riffle).
 */
const {
  Cam, fit, facing, fillet, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 46, FW = 36, FH = 60, PZ = 5, IN = 4, FAV = 0, RESTS = [14, 2, 7];
const OH = FH - 2 * IN, SH = OH / 2, OPEN = SH - 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  const X1 = (N - 1) * STEP + FW;
  fit(C, [[-6, -10, 0], [X1 + 6, 10, 0], [X1 + 6, -10, 0], [-6, 10, 0], [0, 0, PZ + FH], [X1, 0, PZ + FH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-6, -10, X1 + 6, 10, 5, 2);
  put(solid(g), prism(P, front, pr, pi, 0, PZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, grp = mk("g", {}, g);
    const [fr, fi] = rings(x0, -2.5, x0 + FW, 2.5, 1.5, 0.8);
    put(solid(grp), prism(P, front, fr, fi, PZ, PZ + FH));
    const F = (x, z) => P(x0 + x, 2.6, PZ + z), rect = (u0, z0, u1, z1, r) => poly(fillet([F(u0, z0), F(u1, z0), F(u1, z1), F(u0, z1)], [r, r, r, r], 3));
    mk("path", { d: rect(IN, IN, FW - IN, FH - IN, 1.5), class: "lo" }, grp);
    const ux = FW / 2;
    mk("path", { d: rect(IN + 1, IN + SH, FW - IN - 1, FH - IN - 1, 1) + seg(F(ux, IN + SH + 2), F(ux, FH - IN - 3)), class: "nf lo" }, grp);
    const sash = mk("path", { class: "sil" }, grp), bar = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x0, F, rect, sash, bar, z: tween(RESTS[k]), last: NaN });
  }

  function draw(it, s) {
    if (s === it.last) return;
    it.last = s;
    const z0 = IN + 1 + s, z1 = IN + SH + 1 + s, ux = FW / 2;
    it.sash.setAttribute("d", it.rect(IN + 0.5, z0, FW - IN - 0.5, z1, 1.2));
    it.bar.setAttribute("d", it.rect(IN + 3, z0 + 3, FW - IN - 3, z1 - 3, 1) + seg(it.F(ux, z0 + 3), it.F(ux, z1 - 3)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x0 + FW / 2, 0, PZ + FH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a);
      tset(it.z, a < 0 ? RESTS[k] : dd === 0 ? OPEN : 0, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sash.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "sash " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "blindsample",
  means: "Three sash window samples on a showroom plinth: the frame under the pointer slides its lower sash up while the others slide shut.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[135, 123], [200, 156], [265, 189], null],
  mount,
});
