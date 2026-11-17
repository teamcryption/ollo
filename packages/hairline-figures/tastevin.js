/**
 * Wine cradle: a bottle lying in a tray slung between two posts, pinned at
 * its middle. The pointer over the base tips the cradle so the neck dips to
 * pour; leaving rocks it back, neck raised. At rest the bottle is bright.
 * The slider is how far the neck dips.
 *
 * The pattern: one body turned about a fixed pin; the hit is the base's rest
 * footprint, which never moves. Far post, tray, bottle, near post, back to
 * front.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rad, rings, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const Z0 = 5, PZ = 34, PY = 15, REST = 14;
const BOT = [[-34, 2], [-33, 9], [8, 9], [15, 7], [20, 3.6], [33, 3.4], [34, 4.2], [36, 4.2]];
const TRAY = [[-36, -13], [12, -13], [12, 13], [-36, 13]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-40, -24, 0], [40, 24, 0], [40, -24, 0], [-40, 24, 0], [-36, 0, PZ + 34], [36, 0, PZ + 22], [30, 0, Z0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-40, -24, 40, 24, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, Z0));
  const post = (y) => { const [r, i] = rings(-2.5, y - 2.5, 2.5, y + 2.5, 2.4, 0.8); put(solid(g), prism(P, front, r, i, Z0, PZ + 3)); };
  post(-PY);
  const tray = mk("path", { class: "" }, g), trayIn = mk("path", { class: "nf lo" }, g);
  const body = mk("path", { class: "sil hi" }, g), lip = mk("path", { class: "nf lo" }, g);
  post(PY);
  const pin = mk("path", { class: "nf", d: poly(circ(2.6, 16).map((q) => P(q.u, PY + 2.6, PZ + q.v))) }, g);
  const rngs = BOT.map(([u, r]) => circ(r, 24).map((q) => [u, q.u, q.v]));
  const ang = tween(REST);
  let last = NaN;

  const xf = ([u, y, w], a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return P(u * c - w * s, y, PZ + u * s + w * c); };

  function draw(a) {
    if (a === last) return;
    last = a;
    const tp = [];
    for (const [u, y] of TRAY) tp.push(xf([u, y, -14], a), xf([u, y, -7], a));
    tray.setAttribute("d", poly(hull(tp)));
    trayIn.setAttribute("d", poly(TRAY.map(([u, y]) => xf([u * 0.94 - 1, y * 0.8, -7], a))));
    const pts = [];
    for (const r of rngs) for (const p of r) pts.push(xf(p, a));
    body.setAttribute("d", poly(hull(pts)));
    lip.setAttribute("d", poly(rngs[5].map((p) => xf(p, a))) + seg(xf([8, -9, 0], a), xf([8, 9, 0], a)));
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(ang, v ? -max : REST, performance.now(), 0);
    read.textContent = v ? "pour " + Math.round(max) + "°" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, Z0); setOn(x > -48 && x < 48 && y > -32 && y < 32); },
    leave: () => setOn(false),
  }));
  bag.add(() => { pin.remove(); svg.replaceChildren(); });
  return { set: (v) => { max = v; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "tastevin",
  means: "A wine bottle in a pouring cradle: the pointer tips it on its pin so the neck dips to pour, and leaving rocks it back.",
  rules: [1, 3, 5, 8],
  range: [14, 22, 30],
  tour: [[200, 216], [228, 260], [175, 170], null],
  mount,
});
