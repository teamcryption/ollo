/**
 * Banknote: a teller's note tray, a shallow rounded tray holding a stack of
 * notes under a hinged weight bar. The pointer lifts the bar off the stack
 * on its back hinge, higher the nearer it comes, so the notes can be
 * counted out. At rest the bar is tipped up a little, bright. The slider is
 * how far the bar may swing.
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, rad, clamp, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const TW = 120, TD = 70, TZ = 8, NZ = 14, HY = 10, BD = 44, BT = 2.5, REST = 18;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-4, -4, 0], [TW + 4, TD + 4, 0], [TW + 4, -4, 0], [-4, TD + 4, 0], [10, HY, NZ + BD + 4], [TW - 10, HY, NZ + BD + 4]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(0, 0, TW, TD, 10, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));
  const [wr, wi] = rings(6, 6, TW - 6, TD - 6, 7, 1);
  mk("path", { d: poly(wr.map((q) => P(q.u, q.v, TZ))), class: "nf lo" }, g);
  // the stack of notes, with two edges showing its leaves
  const [nr, ni] = rings(14, 12, TW - 14, TD - 10, 2, 1.2);
  put(solid(g), prism(P, front, nr, ni, TZ - 2, NZ));
  for (const z of [TZ + 1.5, TZ + 3.5]) mk("path", { d: open([P(14, TD - 10, z), P(TW - 14, TD - 10, z)]), class: "nf lo" }, g);
  // hinge knuckles
  for (const x of [22, TW - 22]) put(solid(g), prism(P, front, ...rings(x - 5, HY - 4, x + 5, HY + 4, 3, 1), NZ, NZ + 5));
  const bar = solid(g);
  bar.sil.classList.add("hi");
  const grip = mk("path", { class: "nf lo" }, g);

  const ang = spring(REST);
  let last = NaN;
  function draw(a) {
    if (Math.abs(a - last) < 0.01) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const at = (x, d, t) => P(x, HY + d * c - t * s, NZ + 2 + d * s + t * c);
    const xs = [20, TW - 20], top = [], bot = [];
    for (const [x, d] of [[xs[0], 0], [xs[1], 0], [xs[1], BD], [xs[0], BD]]) { top.push(at(x, d, BT)); bot.push(at(x, d, 0)); }
    put(bar, { sil: poly(hull(top.concat(bot))), crease: open(top.concat([top[0]])) });
    grip.setAttribute("d", open([at(TW / 2 - 14, BD - 6, BT), at(TW / 2 + 14, BD - 6, BT)]));
  }
  draw(REST);

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [gx, gy] = unproj(C, sx, sy, NZ);
    const d = Math.hypot(gx - TW / 2, gy - TD / 2);
    if (d > 120) return leave();
    ang.t = REST + (maxA - REST) * clamp(1 - (d - 10) / 90, 0.1, 1);
    read.textContent = "bar " + Math.round(ang.t) + "°";
    B.wake();
  }
  function leave() { ang.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "banknote",
  means: "A teller's note tray: the pointer lifts the hinged weight bar off the stack of notes, higher the nearer it comes.",
  rules: [1, 3, 5, 8],
  range: [60, 95, 110],
  tour: [[258, 221], [200, 192], [142, 163], null],
  mount,
});
