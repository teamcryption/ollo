/**
 * Candle mould: a metal tube mould standing on a drip tray, the cast candle
 * inside it. Over the figure the tube lifts straight up off the candle; at
 * rest it hangs a little raised, the bright candle foot showing. The slider
 * is how far the tube lifts.
 */
const { Cam, circ, fit, facing, prism, proj, ringAt, rings, poly, seg, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid } = HL;

const R = 15, H = 58, CR = 11, CH = 52, TZ = 4, REST = 0.25;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-26, -26, 0], [26, 26, 0], [26, -26, 0], [-26, 26, 0], [0, 0, TZ + H + 60]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-26, -26, 26, 26, 8, 2.2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));
  mk("path", { d: poly(ringAt(P, disc(0, 0, R + 3), TZ)), class: "nf lo" }, g);
  const candle = solid(g);
  put(candle, prism(P, front, disc(0, 0, CR), disc(0, 0, CR - 1.2), TZ, TZ + CH));
  candle.sil.classList.add("hi");
  const tube = solid(g), lip = mk("path", { class: "nf" }, g), mouth = mk("path", { class: "nf lo" }, g);
  const wick = mk("path", { class: "nf" }, g);
  const ring = mk("path", { class: "nf" }, g);
  const lift = tween(REST * value);

  function draw(f) {
    const z0 = TZ + f;
    put(tube, prism(P, front, disc(0, 0, R), disc(0, 0, R - 1.6), z0, z0 + H));
    lip.setAttribute("d", poly(ringAt(P, disc(0, 0, R + 2.5), z0 + 5)));
    mouth.setAttribute("d", poly(ringAt(P, disc(0, 0, R - 2), z0 + H)));
    ring.setAttribute("d", poly(ringAt(P, disc(0, 0, R + 2.5), z0 + H - 6)));
    wick.setAttribute("d", seg(P(0, 0, TZ + CH), P(0, 0, Math.max(z0 + H + 8, TZ + CH + 8))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(lift, now)); return !tdone(lift, now); });
  bag.add(B.unregister);

  const a = P(0, 0, TZ), b = P(0, 0, TZ + H);
  const hit = ([sx, sy]) => Math.abs(sx - a[0]) < 60 && sy > b[1] - 30 && sy < a[1] + 50;
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(lift, (v ? 1 : REST) * reach, performance.now(), 0);
    read.textContent = v ? "out " + Math.round(reach) : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; tset(lift, (on ? 1 : REST) * v, performance.now(), 0); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "candlemould",
  means: "A metal candle mould on a drip tray: the tube lifts up off the cast candle under the pointer.",
  rules: [1, 3, 5],
  range: [30, 56, 60],
  tour: [[200, 141], [205, 170], [195, 120], null],
  mount,
});
