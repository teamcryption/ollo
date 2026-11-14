/**
 * Pallet jack: two forks under a pallet with a crate on it, the pump body
 * and its tiller at the back. The pointer's height over the jack raises the
 * forks, and the pallet and crate with them, while the tiller tips back as if
 * pumped. At rest the load sits a little raised, bright. The slider is the
 * lift's reach.
 *
 * The pattern: one load following a continuous input (lift).
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, clamp, rad, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const REST = 0.3, HL_ = 62;
const disc = (x, y, r, n = 16) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-2, -2, 0], [106, 46, 0], [106, -2, 0], [-2, 46, 0], [60, 20, 60], [120, 22, 76]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const mkS = () => solid(g);
  const parts = [[0, 6, 92, 14, 0, 4, 2, 1], [0, 30, 92, 38, 0, 4, 2, 1], [8, 0, 82, 44, 4, 11, 2, 1.6], [20, 6, 64, 38, 11, 40, 3, 2]].map((d) => {
    const [a, i] = rings(d[0], d[1], d[2], d[3], d[6], d[7]);
    return { a, i, z0: d[4], z1: d[5], s: mkS() };
  });
  const [ba, bi] = rings(90, 4, 106, 40, 4, 1.6);
  put(mkS(), prism(P, front, ba, bi, 2, 18));
  mk("path", { d: poly(hull(ringAt(P, disc(108, 22, 5), 0).concat(ringAt(P, disc(108, 22, 5), 6)))), class: "sil" }, g);
  const rod = mk("path", { class: "sil" }, g), grip = mk("path", { class: "sil" }, g);
  const sp = spring(REST);
  let last = NaN;
  function draw() {
    const v = sp.x;
    if (v === last) return;
    last = v;
    const lift = v * reach / 100 * 16;
    parts.forEach((p, k) => put(p.s, prism(P, front, p.a, p.i, p.z0 + lift, p.z1 + lift)));
    const a = rad(14 + v * 26), tx = 98 + HL_ * Math.sin(a), tz = 18 + HL_ * Math.cos(a);
    rod.setAttribute("d", poly(hull(ringAt(P, disc(98, 22, 1.8, 10), 18).concat(ringAt(P, disc(tx, 22, 1.8, 10), tz)))));
    grip.setAttribute("d", poly(hull(ringAt(P, disc(tx, 22, 1.8, 10), tz).concat(ringAt(P, disc(tx, 14, 1.8, 10), tz), ringAt(P, disc(tx, 30, 1.8, 10), tz)))));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  const yT = P(42, 22, 52)[1], yB = P(42, 22, 8)[1], xs = [P(0, 46, 0)[0] - 10, P(106, 0, 0)[0] + 10];
  let state = "";
  function set(p) {
    let t = REST, on = false;
    if (p && p[0] > xs[0] && p[0] < xs[1] && p[1] > yT - 40 && p[1] < yB + 40) { t = clamp((yB - p[1]) / (yB - yT), 0, 1); on = true; }
    sp.t = t;
    const s = on ? "+" + Math.round(t * reach / 100 * 16) + "cm" : "rest";
    if (s !== state) { state = s; read.textContent = s; }
    B.wake();
  }
  parts[3].s.sil.classList.add("hi");
  set(null);
  draw();
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "palletjack",
  means: "A pallet jack under a crated pallet: the pointer's height raises the forks and load while the tiller tips back.",
  rules: [1, 3, 5, 8],
  range: [20, 100, 100],
  tour: [[184, 90], [230, 130], [184, 160], null],
  mount,
});
