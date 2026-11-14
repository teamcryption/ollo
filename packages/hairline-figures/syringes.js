/**
 * Syringes: five syringes standing needle-down in a clinic rack. The pointer
 * picks one by where it stands: it lifts out of its hole, showing the needle,
 * and its neighbours rise a little, staggered from it. At rest one syringe is
 * half drawn, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 22, RT = 14, BR = 5, BH = 30, LIFT = 20, FAV = 2, NL = 11;
const X1 = (N - 1) * STEP;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-12, -12, 0], [X1 + 12, 12, 0], [-12, 12, 0], [X1 + 12, -12, 0], [0, 0, RT + BH + LIFT + 16], [X1, 0, RT + BH + LIFT + 16]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [rr, ri] = rings(-12, -12, X1 + 12, 12, 5, 2);
  put(solid(g), prism(P, front, rr, ri, 0, RT));
  for (let k = 0; k < N; k++) mk("path", { d: poly(ringAt(P, disc(k * STEP, 0, BR + 1.2), RT)), class: "nf lo" }, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g), x = k * STEP;
    const needle = mk("path", { class: "nf" }, grp), hub = solid(grp), barrel = solid(grp);
    const fill = mk("path", { class: "nf lo" }, grp), flange = solid(grp), rod = solid(grp), thumb = solid(grp);
    const rest = k === FAV ? LIFT * 0.6 : [3, 1, 0, 2, 0][k];
    items.push({ k, x, needle, hub, barrel, fill, flange, rod, thumb, rest, z: tween(rest), last: NaN });
  }
  const cyl = (s, x, r, z0, z1, b = 0.8) => put(s, prism(P, front, disc(x, 0, r), disc(x, 0, Math.max(0.3, r - b)), z0, z1));

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const b = RT + lift, x = it.x;
    it.needle.setAttribute("d", b - 3 > RT ? seg(P(x, 0, b - 3), P(x, 0, Math.max(RT, b - 3 - NL))) : "");
    if (b - 3 > RT) cyl(it.hub, x, 1.8, b - 3, b, 0.5); else put(it.hub, { sil: "", crease: "" });
    cyl(it.barrel, x, BR, b, b + BH);
    it.fill.setAttribute("d", poly(ringAt(P, disc(x, 0, BR - 0.3), b + BH * 0.55)));
    cyl(it.flange, x, BR + 3, b + BH, b + BH + 1.4, 1.2);
    cyl(it.rod, x, 1.4, b + BH + 1.4, b + BH + 10, 0.5);
    cyl(it.thumb, x, 4, b + BH + 10, b + BH + 11.5, 1);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, RT + BH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 75 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? it.rest : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.barrel.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "syr " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "syringes",
  means: "Five syringes stand needle-down in a clinic rack: the one under the pointer lifts out to show its needle.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[133, 127], [200, 161], [267, 194], null],
  mount,
});
