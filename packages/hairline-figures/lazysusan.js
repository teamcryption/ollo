/**
 * Lazy Susan: a round turntable tray on a low foot, holding three jars of
 * different heights. At rest one jar, bright, sits at the front. The
 * pointer over the tray turns it, carrying the jars round so the next one
 * comes forward. The slider is how far it turns.
 *
 * The pattern: one part turning about its axis (turn).
 */
const { Cam, circ, fit, facing, poly, prism, proj, ringAt, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const R = 50, CR = 3, FZ = 6, TZ = 10, RJ = 30, REST = 30;
const JARS = [[12, 26], [9, 18], [10.5, 34]];
const rad = (d) => (d * Math.PI) / 180;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let turn = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [0, 0, TZ + 40], [-RJ, -RJ, TZ + 40]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, 22), null, 0, FZ));
  put(solid(g), prism(P, front, disc(0, 0, R, 72), disc(0, 0, R - CR, 72), FZ, TZ));
  const jg = mk("g", {}, g);
  const jars = JARS.map(([r, h], k) => {
    const grp = mk("g", {}, jg);
    return { k, r, h, grp, sil: mk("path", { class: k === 0 ? "sil hi" : "sil" }, grp), lid: mk("path", { class: "nf lo" }, grp), neck: mk("path", { class: "nf" }, grp) };
  });
  const th = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const pos = jars.map((j) => { const a = rad(deg + j.k * 120); return { j, x: RJ * Math.cos(a), y: RJ * Math.sin(a) }; });
    pos.sort((p, q) => p.x + p.y - (q.x + q.y));
    for (const { j, x, y } of pos) {
      jg.append(j.grp);
      const pr = prism(P, front, disc(x, y, j.r), null, TZ, TZ + j.h);
      j.sil.setAttribute("d", pr.sil);
      j.lid.setAttribute("d", poly(ringAt(P, disc(x, y, j.r, 40), TZ + j.h - 4)));
      j.neck.setAttribute("d", prism(P, front, disc(x, y, j.r * 0.6), null, TZ + j.h, TZ + j.h + 4).sil);
    }
  }
  const B = register(stage, (_dt, now) => { draw(tval(th, now)); return !tdone(th, now); });
  bag.add(B.unregister);
  const mid = P(0, 0, TZ);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(th, on ? REST + turn : REST, performance.now(), 0);
    read.textContent = on ? "turn" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], (sy - mid[1]) * 1.6) < 120), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { turn = v; if (act) { tset(th, REST + v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "lazysusan",
  means: "A lazy Susan with three jars: the pointer over the tray turns it, carrying the jars round so the next comes forward.",
  rules: [1, 3, 5, 6],
  range: [60, 120, 180],
  tour: [[217, 160], [278, 221], [122, 143], null],
  mount,
});
