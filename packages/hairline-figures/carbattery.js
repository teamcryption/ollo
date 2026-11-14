/**
 * Car battery: a rounded block with a lid, six cell caps in a row and two
 * terminal posts, each wearing a cable clamp whose cable runs over the lid
 * and down the front. The pointer picks a terminal by where it stands: its
 * clamp lifts off the post. At rest the negative clamp sits half off,
 * bright. The slider is how far a clamp lifts.
 *
 * The pattern: one of a few in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 72, D = 40, H = 34, LZ = H + 3, POSTS = [14, W - 14], PY = 11, FAV = 1;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[0, 0, 0], [W, D + 14, 0], [W, 0, 0], [0, D + 14, 0], [0, 0, LZ + 30], [W, 0, LZ + 30]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  const [lr, li] = rings(2, 2, W - 2, D - 2, 4, 1.5);
  put(solid(g), prism(P, front, lr, li, H, LZ));
  // six cell caps along the lid's middle
  for (let k = 0; k < 6; k++) {
    const x = 18 + k * 7.2;
    put(solid(g), prism(P, front, disc(x, D / 2 + 6, 2.2, 14), disc(x, D / 2 + 6, 1.4, 14), LZ, LZ + 1));
  }

  const items = POSTS.map((x, k) => {
    const grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, PY, 4.5), disc(x, PY, 3.4), LZ, LZ + 2));
    put(solid(grp), prism(P, front, disc(x, PY, 3), disc(x, PY, 2.2), LZ + 2, LZ + 8));
    const cable = mk("path", { class: "nf" }, grp), cable2 = mk("path", { class: "nf lo" }, grp);
    const clamp = solid(grp);
    return { k, x, grp, cable, cable2, clamp, z: tween(k === FAV ? 0.5 : 0), last: NaN };
  });

  function draw(it, t) {
    if (t === it.last) return;
    it.last = t;
    const z0 = LZ + 3 + t * lift, x = it.x;
    put(it.clamp, prism(P, front, disc(x, PY, 5.2), disc(x, PY, 4), z0, z0 + 4.5));
    // the cable leaves the clamp's front, droops onto the lid and runs down the face
    const path = (dx) => [[x + dx, PY + 5, z0 + 2], [x + dx, PY + 11, z0 + 1 - t * lift * 0.4], [x + dx, D - 4, LZ + 1.5], [x + dx, D + 1.5, LZ - 1],
      [x + dx, D + 1.5, 4], [x + dx, D + 4, 1], [x + dx, D + 14, 0.5]].map((q) => P(...q));
    it.cable.setAttribute("d", open(path(-1.6)));
    it.cable2.setAttribute("d", open(path(1.6)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, PY, LZ + 6));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.hypot(m[0] - sx, (m[1] - sy) * 0.6); if (dd < bd) { bd = dd; best = k; } });
    return bd < 55 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    items.forEach((it, k) => {
      tset(it.z, a < 0 ? (k === FAV ? 0.5 : 0) : k === a ? 1 : 0, now, 0);
      it.clamp.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : a === 0 ? "pos +" : "neg −";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; items.forEach((it) => { it.last = NaN; }); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "carbattery",
  means: "A car battery with two cable clamps: the clamp on the terminal under the pointer lifts off its post.",
  rules: [1, 4, 5, 6],
  range: [10, 22, 30],
  tour: [[189, 114], [270, 154], [194, 226], null],
  mount,
});
