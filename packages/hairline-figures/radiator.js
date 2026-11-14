/**
 * Radiator: a row of fins on a low pipe, a round valve at the end. The
 * pointer picks a setting by where it stands along the radiator: the valve
 * turns to it, and warm air rises over the fins, higher the higher the
 * setting. At rest the valve sits on 2, bright. The slider is the rise.
 *
 * The pattern: a control turned by position along a row.
 */
const {
  Cam, circ, fit, facing, open, prism, proj, rad, rings, ringAt, poly, hull, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 9, FS = 9, FW = 6, FD = 12, Z0 = 6, Z1 = 62, X1 = (N - 1) * FS + FW, VX = X1 + 12, VY = FD / 2, REST = 2;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let rise = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-2, -2, 0], [VX + 8, FD + 2, 0], [-2, FD, Z1 + 5 * 12 + 4], [VX + 8, -2, Z1], [0, FD, 0]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const heat = mk("path", { class: "nf dash" }, g);
  const [pr, pi] = rings(-1, VY - 2.5, VX, VY + 2.5, 2.5, 0.8);
  put(solid(g), prism(P, front, pr, pi, Z0 + 3, Z0 + 8));
  for (let i = 0; i < N; i++) {
    const x = i * FS;
    if (i === 0 || i === N - 1) { const [lr, li] = rings(x + 1, VY - 2, x + FW - 1, VY + 2, 1.5, 0.6); put(solid(g), prism(P, front, lr, li, 0, Z0)); }
    const [fr, fi] = rings(x, 0, x + FW, FD, 3, 1);
    put(solid(g), prism(P, front, fr, fi, Z0, Z1));
  }
  put(solid(g), prism(P, front, disc(VX, VY, 3, 16), disc(VX, VY, 2, 16), Z0 + 3, Z0 + 12));
  const vs = solid(g);
  put(vs, prism(P, front, disc(VX, VY, 7), disc(VX, VY, 5.6), Z0 + 12, Z0 + 22));
  const mark = mk("path", { class: "nf" }, g);
  const V = tween(REST);
  let lastV = NaN;

  function draw(v) {
    if (v === lastV) return;
    lastV = v;
    const a = rad(-40 + v * 60), z = Z0 + 22;
    mark.setAttribute("d", seg(P(VX, VY, z), P(VX + 5 * Math.cos(a), VY + 5 * Math.sin(a), z)));
    let d = "";
    const h = v * rise;
    for (let i = 1; i < N; i += 2) {
      const x = i * FS + FW / 2, pts = [];
      for (let s = 0; s <= 8; s++) pts.push(P(x + 2.5 * Math.sin(s * 1.3), FD / 2, Z1 + 4 + (h * s) / 8));
      d += open(pts);
    }
    heat.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => { draw(tval(V, now)); return !tdone(V, now); });
  bag.add(B.unregister);

  const mids = [];
  for (let i = 0; i < N; i++) mids.push(P(i * FS + FW / 2, FD / 2, (Z0 + Z1) / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 70 ? Math.round(best / 2) + 1 : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(V, a < 0 ? REST : a, performance.now(), 0);
    vs.sil.classList.add("hi");
    read.textContent = a < 0 ? "rest" : "heat " + a;
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { rise = v; lastV = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "radiator",
  means: "A radiator: where the pointer stands along it sets the valve, which turns, and warm air rises higher over the fins.",
  rules: [1, 3, 5, 8],
  range: [4, 8, 12],
  tour: [[128, 185], [184, 213], [240, 241], null],
  mount,
});
