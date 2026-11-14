/**
 * Jewellery box: a low cabinet of four shallow drawers, each with a knob,
 * rings resting in the trays. The pointer picks a drawer by its front: it
 * slides out to show the rings, and the drawers beside it slide a little,
 * staggered from it. At rest one drawer stands ajar, bright. The slider is
 * the stagger.
 *
 * The pattern: one of many in a single column (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 104, D = 58, N = 4, DH = 13, Z0 = 5, H = Z0 + N * DH + 6, OUT = 34, FAV = 2;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.62);
  fit(C, [[-4, -4, 0], [W + 4, D + OUT + 4, 0], [W + 4, -4, 0], [-4, D + OUT + 4, 0], [0, 0, H + 3], [W, 0, H + 3]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the cabinet, with a lid lip on top
  const [br, bi] = rings(0, 0, W, D, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, H - 3));
  const [lr, li] = rings(-2, -2, W + 2, D + 2, 5, 2);
  put(solid(g), prism(P, front, lr, li, H - 3, H));
  // drawers painted bottom first, so a higher drawer covers the one below
  const items = [];
  for (let k = N - 1; k >= 0; k--) {
    const z0 = Z0 + (N - 1 - k) * DH, grp = mk("g", {}, g);
    const sol = solid(grp), ring = mk("path", { class: "nf" }, grp), ring2 = mk("path", { class: "nf" }, grp), knob = mk("path", {}, grp);
    items[k] = { k, z0, sol, ring, ring2, knob, o: tween(k === FAV ? OUT * 0.45 : 1 + ((k * 5) % 3)), last: NaN };
  }

  function draw(it, o) {
    if (o === it.last) return;
    it.last = o;
    const y1 = D + 2 + o, z0 = it.z0 + 1, z1 = it.z0 + DH - 1;
    const [r, i] = rings(5, D - 1, W - 5, y1, 2.5, 2.2);
    put(it.sol, prism(P, front, r, i, z0, z1));
    // two rings lying in the tray, shown as the drawer clears the cabinet
    const show = o > 10;
    it.ring.setAttribute("d", show ? poly(ringAt(P, disc(W * 0.3, D + o * 0.55, 5), z1 - 0.5)) : "");
    it.ring2.setAttribute("d", show ? poly(ringAt(P, disc(W * 0.62, D + o * 0.5, 4.2), z1 - 0.5)) : "");
    const kn = disc(W / 2, y1 + 1.5, 2.6, 12);
    it.knob.setAttribute("d", poly(hull(ringAt(P, kn, (z0 + z1) / 2 - 1.3).concat(ringAt(P, kn, (z0 + z1) / 2 + 1.3)))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.o, now)); if (!tdone(it.o, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // rest fronts: static, so a drawer sliding out never moves its hit area
  const mids = items.map((it) => P(W / 2, D + 2, it.z0 + DH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < DH * 1.62 * 0.6 && Math.abs(mids[best][0] - sx) < 95 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), o = a < 0 ? (k === FAV ? OUT * 0.45 : 1 + ((k * 5) % 3)) : dd === 0 ? OUT : dd === 1 ? 7 : 1;
      tset(it.o, o, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sol.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "drawer " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "jewellerybox",
  means: "A jewellery box of four drawers: the drawer under the pointer slides out to show its rings, and its neighbours open a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[184, 149], [184, 202], [184, 167], null],
  mount,
});
