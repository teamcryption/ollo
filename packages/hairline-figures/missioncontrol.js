/**
 * Mission control: a row of consoles, each a desk with a screen standing on
 * its back edge. The pointer picks a console by where it stands: its screen
 * rises on its stand and the screens beside it rise a little, staggered from
 * it. At rest one screen stands raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween, seg,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 34, W = 30, D = 24, DZ = 14, SH = 18, LIFT = 17, FAV = 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.82);
  const X1 = (N - 1) * STEP + W;
  fit(C, [[-4, -4, 0], [X1 + 4, D + 8, 0], [X1 + 4, -4, 0], [-4, D + 8, 0], [0, 0, DZ + SH + LIFT + 6], [X1, 0, DZ + SH + LIFT + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-4, -4, X1 + 4, D + 8, 4, 1.5);
  put(solid(g), prism(P, front, fr, fi, 0, 2));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g);
    const [r0, i0] = rings(x + 3, 6, x + W - 3, D - 2, 2, 1);
    put(solid(grp), prism(P, front, r0, i0, 2, DZ - 2));
    const [r1, i1] = rings(x, 0, x + W, D, 2.5, 1.4);
    put(solid(grp), prism(P, front, r1, i1, DZ - 2, DZ));
    // keyboard: a low slab near the front edge
    const [rk, ik] = rings(x + 6, D - 10, x + W - 6, D - 4, 1, 0.6);
    put(solid(grp), prism(P, front, rk, ik, DZ, DZ + 1));
    const scr = mk("g", {}, grp);
    const stand = mk("path", { class: "lo nf" }, scr);
    const body = solid(scr);
    const glass = mk("path", { class: "nf lo" }, scr);
    // put screen behind the keyboard in paint order: insert before keyboard
    grp.insertBefore(scr, grp.children[2]);
    items.push({ k, x, scr, stand, body, glass, z: tween(k === FAV ? LIFT * 0.8 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = DZ + 3 + lift, cx = it.x + W / 2;
    it.stand.setAttribute("d", seg(P(cx, 4, DZ), P(cx, 4, z0)) + seg(P(cx - 1.5, 4, DZ), P(cx - 1.5, 4, z0)));
    const [rs, is] = rings(it.x + 2, 2, it.x + W - 2, 5, 1.2, 0.6);
    put(it.body, prism(P, front, rs, is, z0, z0 + SH));
    const a = P(it.x + 4, 5, z0 + 2), b = P(it.x + W - 4, 5, z0 + 2), c = P(it.x + W - 4, 5, z0 + SH - 2), d = P(it.x + 4, 5, z0 + SH - 2);
    it.glass.setAttribute("d", "M" + [a, b, c, d].map((p) => p.join(",")).join("L") + "Z");
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + W / 2, D / 2, DZ));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.8 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "desk " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "missioncontrol",
  means: "A row of mission consoles: the screen on the desk under the pointer rises on its stand, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[133, 155], [183, 174], [262, 258], null],
  mount,
});
