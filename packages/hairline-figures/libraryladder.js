/**
 * Library ladder: a tall bookcase of four bays with a brass rail along its
 * top, and a rolling ladder hooked on the rail, its feet out on the floor.
 * The pointer picks a bay by where it stands: the ladder rolls along the rail
 * to it. At rest the ladder stands between bays, bright. The slider is how
 * far it rolls toward the bay.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, ringAt, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BAYS = 4, BW = 32, X1 = BAYS * BW, D = 16, H = 100, LW = 18;
const FY = 58, TY = 18, TZ = 108, REST = 30;
const SH = [4, 28, 52, 76];
const lean = (z) => FY - (FY - TY) * z / TZ;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.62);
  fit(C, [[0, 0, 0], [X1, 0, 0], [0, FY + 2, 0], [X1, FY + 2, 0], [0, 0, TZ], [X1, 0, TZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the case, its shelves and books on the open face
  const [cr, ci] = rings(0, 0, X1, D, 2, 1);
  put(solid(g), prism(P, front, cr, ci, 0, H));
  let sd = "", bd = "";
  for (const z of SH) sd += seg(P(1, D, z), P(X1 - 1, D, z));
  for (let b = 1; b < BAYS; b++) sd += seg(P(b * BW, D, 1), P(b * BW, D, H - 2));
  let s = 7;
  SH.forEach((z, si) => {
    for (let b = 0; b < BAYS; b++) {
      let x = b * BW + 2;
      while (x < (b + 1) * BW - 6) {
        s = (s * 37 + 11) % 101;
        const w = 3 + (s % 3), h = 13 + (s % 7);
        if (s % 9 !== 0) bd += poly([P(x, D, z), P(x + w, D, z), P(x + w, D, z + h), P(x, D, z + h)]);
        x += w + 0.6;
      }
    }
  });
  mk("path", { d: sd, class: "nf lo" }, g);
  mk("path", { d: bd, class: "nf lo" }, g);
  const [rr, ri] = rings(-4, D, X1 + 4, D + 3, 1.4, 0.5);
  put(solid(g), prism(P, front, rr, ri, H - 2, H + 1));

  // the ladder: two leaning stiles, rungs between, wheels at the feet
  const lg = mk("g", {}, g);
  const left = mk("path", { class: "sil" }, lg), rungs = mk("path", {}, lg), right = mk("path", { class: "sil" }, lg);
  const hooks = mk("path", { class: "nf" }, lg);
  const x = tween(REST);
  let last = NaN;
  const stile = (x0) => poly(hull(ringAt(P, rrect(x0, FY - 1.8, x0 + 2.4, FY + 1.8, 1, 3), 0).concat(ringAt(P, rrect(x0, TY - 1.4, x0 + 2.4, TY + 1.4, 1, 3), TZ))));
  function draw(x0) {
    if (x0 === last) return;
    last = x0;
    left.setAttribute("d", stile(x0));
    right.setAttribute("d", stile(x0 + LW));
    let d = "";
    for (let z = 14; z < TZ - 4; z += 13) {
      const y = lean(z), [r] = rings(x0 + 1, y - 1.2, x0 + LW + 1.4, y + 1.2, 0.8, 0.3);
      d += prism(P, front, r, r, z - 1, z + 1).sil;
    }
    rungs.setAttribute("d", d);
    let h = "";
    for (const xx of [x0 + 1.2, x0 + LW + 1.2]) h += poly(hull(ringAt(P, rrect(xx - 1.4, D + 0.5, xx + 1.4, TY + 1, 0.8, 3), H + 2).concat(ringAt(P, rrect(xx - 1.4, D + 0.5, xx + 1.4, TY + 1, 0.8, 3), TZ))));
    hooks.setAttribute("d", h);
  }

  const B = register(stage, (_dt, now) => { draw(tval(x, now)); return !tdone(x, now); });
  bag.add(B.unregister);

  const mids = []; for (let b = 0; b < BAYS; b++) mids.push(P(b * BW + BW / 2, D + 10, H / 2));
  function hit([sx, sy]) {
    let best = -1, bd2 = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd2) { bd2 = dd; best = k; } });
    return bd2 < 34 && Math.abs(mids[best][1] - sy) < 110 ? best : -1;
  }

  let act = -2;
  function goal(a) { return a < 0 ? REST : REST + (a * BW + BW / 2 - LW / 2 - 1 - REST) * reach; }
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(x, goal(a), performance.now(), 0);
    left.classList.toggle("hi", true); right.classList.toggle("hi", true);
    read.textContent = a < 0 ? "rest" : "bay " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "libraryladder",
  means: "A bookcase with a rolling ladder hooked on its rail: the ladder rolls along to the bay under the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.3, 0.9, 1],
  tour: [[187, 160], [260, 197], [150, 142], null],
  mount,
});
