/**
 * Hearing aids: an open charging case with two behind-the-ear aids lying in
 * their pockets, each a curved body with an ear hook, a tube and a dome tip.
 * The pointer picks an aid by where it stands: that aid lifts out of its
 * pocket, bright, and the lid swings back a little further. At rest the left
 * aid sits slightly raised, bright. The slider is how high an aid lifts.
 *
 * The pattern: one of a few in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 84, D = 40, H = 14, LW = 28, LD = 9;
const AIDS = [[10, 8], [46, 8]];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, -22, 56], [W, -22, 56], [AIDS[0][0], 8, H + 46], [AIDS[1][0] + LW, 8, H + 46]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the lid, hinged along the back edge
  const lidG = solid(g), lidOut = rrect(0, 0, W, D, 8, 6), lidIn = rrect(3, 3, W - 3, D - 3, 6, 6);
  const lidPts = (ring, a, off) => ring.map((q) => P(q.u, q.v * Math.cos(a) - off * Math.sin(a), H + q.v * Math.sin(a) + off * Math.cos(a)));
  let lastA = NaN;
  function drawLid(deg) {
    if (deg === lastA) return;
    lastA = deg;
    const a = (deg * Math.PI) / 180;
    lidG.sil.setAttribute("d", poly(hull(lidPts(lidOut, a, 0).concat(lidPts(lidOut, a, 4)))));
    lidG.cr.setAttribute("d", poly(lidPts(lidIn, a, 0)));
  }

  // the tray
  const [br, bi] = rings(0, 0, W, D, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  for (const [x, y] of AIDS) {
    const pocket = rrect(x - 7, y - 2, x + LW + 2, y + 19, 5, 4).map((q) => P(q.u, q.v, H));
    mk("path", { d: poly(pocket), class: "nf lo" }, g);
  }

  const items = AIDS.map(([x, y], k) => {
    const grp = mk("g", {}, g);
    const tube = mk("path", { class: "nf" }, grp), tip = solid(grp), body = solid(grp);
    return { k, x, y, tube, tip, body, z: tween(k === 0 ? 6 : 0), last: NaN };
  });

  function drawAid(it, z) {
    if (z === it.last) return;
    it.last = z;
    const { x, y } = it, z0 = H + z, tz = z0 + 2.5, pts = [];
    for (let i = 0; i <= 10; i++) { const t = -Math.PI / 2 - (i / 10) * Math.PI; pts.push(P(x + 1 + 5.5 * Math.cos(t), y + 10 + 5.5 * Math.sin(t), tz)); }
    pts.push(P(x + 14, y + 17, tz));
    it.tube.setAttribute("d", open(pts));
    put(it.tip, prism(P, front, disc(x + 17, y + 17, 3.6), disc(x + 17, y + 17, 2.4), z0, z0 + 4));
    const [r, i2] = rings(x, y, x + LW, y + LD, 4.5, 1.4);
    put(it.body, prism(P, front, r, i2, z0, z0 + 5.5));
  }

  const lid = tween(102);
  const B = register(stage, (_dt, now) => {
    let moving = !tdone(lid, now);
    drawLid(tval(lid, now));
    for (const it of items) { drawAid(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + LW / 2, it.y + 8, H));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 45 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      tset(it.z, a < 0 ? (k === 0 ? 6 : 0) : k === a ? lift : 0, now, from < 0 ? 0 : Math.abs(k - from) * 40);
      it.body.sil.classList.toggle("hi", k === (a < 0 ? 0 : a));
    });
    tset(lid, a < 0 ? 102 : 116, now, 0);
    read.textContent = a < 0 ? "rest" : a === 0 ? "left" : "right";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; if (act >= 0) { const a = act; act = -2; setActive(a); } }, destroy: bag.dispose };
}

hairline({
  name: "hearingaids",
  means: "An open case holding two hearing aids: the aid under the pointer lifts out of its pocket and the lid swings back.",
  rules: [1, 2, 5, 6],
  range: [12, 26, 40],
  tour: [[166, 160], [250, 195], [176, 165], null],
  mount,
});
