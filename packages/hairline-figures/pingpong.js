/**
 * Ping pong: a table with its net and a paddle lying at each end. The
 * pointer picks a side of the table: that paddle lifts off the top, ready to
 * serve, and the other settles back down. At rest the far paddle is up,
 * bright. The slider is how high the paddle lifts.
 *
 * The pattern: one of a few, picked by screen x (riffle).
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, seg, tdone, tset, tval, tween, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 128, W = 70, TZ = 26, TH = 3, PR = 10, S = 1.8;
const PX = [26, 102], PY = 30;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, S);
  fit(C, [[-2, -2, 0], [L + 2, W + 2, 0], [L + 2, -2, 0], [-2, W + 2, 0], [PX[0], PY, TZ + TH + 30], [PX[1], PY, TZ + TH + 30]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const top = TZ + TH;
  for (const x of [14, L - 20]) { const [r, i] = rings(x, 8, x + 6, W - 8, 2, 0.8); put(solid(g), prism(P, front, r, i, 0, TZ)); }
  const [tr, ti] = rings(0, 0, L, W, 3, 1.4);
  put(solid(g), prism(P, front, tr, ti, TZ, top));
  mk("path", { d: seg(P(3, W / 2, top), P(L - 3, W / 2, top)), class: "nf lo" }, g);

  const mkPaddle = (k) => {
    const grp = mk("g", {}, g);
    return { k, x: PX[k], grp, handle: solid(grp), face: solid(grp), z: tween(k === 0 ? 0.7 : 0), last: NaN };
  };
  const pads = [mkPaddle(0)];
  const [nr, ni] = rings(L / 2 - 1.2, -5, L / 2 + 1.2, W + 5, 1, 0.4);
  put(solid(g), prism(P, front, nr, ni, top, top + 9));
  pads.push(mkPaddle(1));
  const ball = mk("ellipse", { class: "", rx: 2.2 * S, ry: 2.2 * S }, g);
  const bp = P(L / 2 + 14, W - 14, top + 2.2);
  ball.setAttribute("cx", bp[0]); ball.setAttribute("cy", bp[1]);

  function draw(p, t) {
    const z = top + 0.2 + t * lift;
    if (z === p.last) return;
    p.last = z;
    const [hr, hi] = rings(p.x - 1.8, PY + PR - 2, p.x + 1.8, PY + PR + 11, 1.6, 0.5);
    put(p.handle, prism(P, front, hr, hi, z, z + 3));
    put(p.face, prism(P, front, disc(p.x, PY, PR), disc(p.x, PY, PR - 1.6), z, z + 1.6));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const p of pads) { draw(p, tval(p.z, now)); if (!tdone(p.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = pads.map((p) => P(p.x, PY, top));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 70 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    pads.forEach((p, k) => {
      tset(p.z, a < 0 ? (k === 0 ? 0.7 : 0) : k === a ? 1 : 0, now, 0);
      p.face.sil.classList.toggle("hi", k === (a < 0 ? 0 : a));
      p.handle.sil.classList.toggle("hi", k === (a < 0 ? 0 : a));
    });
    read.textContent = a < 0 ? "rest" : a === 0 ? "far" : "near";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = clamp(v, 6, 30); pads.forEach((p) => { p.last = NaN; }); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "pingpong",
  means: "A ping pong table with a paddle at each end: the paddle on the side under the pointer lifts off the table, ready to serve.",
  rules: [1, 3, 5, 6],
  range: [6, 22, 30],
  tour: [[158, 124], [255, 173], [158, 124], null],
  mount,
});
