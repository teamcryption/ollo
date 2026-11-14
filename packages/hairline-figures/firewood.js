/**
 * Log store: split logs stacked under a lean-to roof on four posts. The
 * pointer picks a log by its end face and that log slides out of the stack
 * toward you; its neighbours draw out less, by distance. At rest the ends sit
 * unevenly, one bright. The slider is how far the logs come out.
 */
const {
  Cam, fit, prism, proj, rings, facing, tween, tset, tval, tdone, hull, poly, ringAt, run,
  disposer, mk, pointer, put, register, solid, clamp, circ,
} = HL;

const COLS = [-24, -12, 0, 12, 24], ROWS = [6, 17.5, 29], R = 5.6, L = 20, FAV = 7;
const REST = [2, -1, 3, 0, -2, 1, 4, -1, 2, 0, -2, 3, 1, -1, 2];
const C0 = circ(R, 20), C1 = circ(R - 1.1, 20);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-26, -36, 0], [26, 36, 0], [-26, -36, 50], [26, 36, 44], [L + 40, 0, 0]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const post = (x, y, z1) => { const [a, b] = rings(x - 1.5, y - 1.5, x + 1.5, y + 1.5, 1, 0.5); put(solid(g), prism(P, front, a, b, 0, z1)); };
  post(-22, -32, 47); post(-22, 32, 47); post(22, -32, 41);
  const [FR, FI] = rings(-24, -34, 24, 34, 2, 1.2);
  put(solid(g), prism(P, front, FR, FI, 0, 1.5));
  const lg = mk("g", {}, g);
  const logs = [];
  ROWS.forEach((z, r) => COLS.forEach((y, c) => {
    const i = logs.length, s = solid(lg);
    logs.push({ i, r, c, y, z, s, tw: tween(REST[i]), drawn: NaN });
  }));
  post(22, 32, 41);
  // the lean-to roof: a plate falling from the back posts to the front
  const roof = mk("g", {}, g);
  const top = [[-27, -36, 49], [-27, 36, 49], [27, 36, 42], [27, -36, 42]];
  mk("path", { class: "sil", d: poly(hull(top.map((q) => P(...q)).concat(top.map((q) => P(q[0], q[1], q[2] - 1.6))))) }, roof);
  mk("path", { class: "lo nf", d: "M" + P(26, -35, 42.2) + "L" + P(26, 35, 42.2) }, roof);

  // a log lies along x: its rings stand in the y-z plane
  const at = (q, x, y, z) => P(x, y + q.u, z + q.v);
  function draw(o, now) {
    const dx = tval(o.tw, now);
    if (Math.abs(dx - o.drawn) < 1e-3) return;
    o.drawn = dx;
    const x0 = -L + dx, x1 = L + dx;
    const pts = C0.map((q) => at(q, x0, o.y, o.z)).concat(C0.map((q) => at(q, x1, o.y, o.z)));
    o.s.sil.setAttribute("d", poly(hull(pts)));
    o.s.cr.setAttribute("d", poly(C1.map((q) => at(q, x1, o.y, o.z))) + poly(C0.map((q) => at(q, x1, o.y, o.z))));
  }
  const B = register(stage, (dt, now) => {
    let m = false;
    for (const o of logs) { draw(o, now); if (!tdone(o.tw, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  let amp = value, sel = null;
  const FALL = [1, 0.34, 0.12, 0.05, 0.02, 0.01, 0];
  function retarget() {
    const now = performance.now(), a = logs[sel ?? FAV];
    for (const o of logs) {
      const d = Math.abs(o.r - a.r) + Math.abs(o.c - a.c);
      o.to = REST[o.i] + (sel === null ? 0 : clamp(amp * 30, 0, 42) * FALL[d]);
      tset(o.tw, o.to, now, d * 40);
      o.s.sil.classList.toggle("hi", o === a);
    }
    // nearer logs paint later: higher, further toward +y, further out
    [...logs].sort((p, q) => p.y + p.z + p.to * 0.6 - (q.y + q.z + q.to * 0.6)).forEach((o) => lg.appendChild(o.s.g));
    read.textContent = sel === null ? "rest" : "log " + (a.r + 1) + "·" + (a.c + 1);
    B.wake();
  }
  // hit: each log's rest end face, never its moving one
  const ends = logs.map((o) => P(L + REST[o.i], o.y, o.z));
  bag.add(pointer(stage, {
    move: (p) => {
      let best = null, bd = 16;
      ends.forEach((e, i) => { const d = Math.hypot(p[0] - e[0], p[1] - e[1]); if (d < bd) { bd = d; best = i; } });
      sel = best; retarget();
    },
    leave: () => { sel = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { amp = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "firewood",
  means: "A log store under a lean-to roof: the log whose end the pointer touches slides out of the stack, its neighbours less.",
  rules: [1, 2, 3, 5, 6, 8],
  range: [0.5, 1, 1.4],
  tour: [[232, 159], [194, 198], [159, 238], null],
  mount,
});
