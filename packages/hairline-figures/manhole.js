/**
 * Manhole cover: a cast frame set in the road with a round cover in it. The
 * pointer over the figure lifts the cover off its seat and tips it aside to
 * show the shaft. At rest the cover sits ajar, bright. The slider is how far
 * it lifts.
 */
const { Cam, circ, fit, hull, poly, proj, open, clamp, spring, stepS, disposer, mk, pointer, register } = HL;

const W = 64, CX = 32, CY = 32, R = 22, T = 3.2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100;
  const C = Cam(45, 0.5, 2.95);
  fit(C, [[0, 0, 0], [W, W, 0], [W, 0, 0], [0, W, 0], [CX + 30, CY, 44], [CX + 30, CY + R, 30]], 200, 165);
  const P = proj(C);
  const g = mk("g", {}, svg);
  // the frame: a square plate with a round seat
  const plate = [[0, 0], [W, 0], [W, W], [0, W]];
  const pl = [];
  for (const [x, y] of plate) pl.push(P(x, y, 0), P(x, y, 3));
  mk("path", { d: poly(hull(pl)), class: "sil" }, g);
  mk("path", { d: poly(plate.map(([x, y]) => P(x, y, 3))), class: "nf lo" }, g);
  const ring = circ(R + 1.5, 48);
  mk("path", { d: poly(ring.map((q) => P(CX + q.u, CY + q.v, 3))), class: "lo" }, g);
  mk("path", { d: poly(circ(R - 2, 48).map((q) => P(CX + q.u, CY + q.v, -10))), class: "nf dash" }, g);
  const cov = mk("path", { class: "sil" }, g), top = mk("path", { class: "nf lo" }, g), grip = mk("path", { class: "nf" }, g);
  const s = spring(0.2, { k: 120, c: 20 });
  const rest = 0.2;
  let last = NaN;
  // a cover point: (u, v) on the disc at height h, lifted and tipped by o
  function cp(u, v, h, o) {
    const a = o * 1.05, lift = 3 + o * 26, dx = o * 24;
    return P(CX + dx + u * Math.cos(a) - h * Math.sin(a), CY + v, lift + u * Math.sin(a) + h * Math.cos(a));
  }
  function draw(o) {
    if (o === last) return;
    last = o;
    const c = circ(R, 40), pts = [];
    for (const q of c) pts.push(cp(q.u, q.v, 0, o), cp(q.u, q.v, T, o));
    cov.setAttribute("d", poly(hull(pts)));
    top.setAttribute("d", poly(c.map((q) => cp(q.u * 0.86, q.v * 0.86, T, o))));
    let d = "";
    for (let k = -3; k <= 3; k++) {
      const v = k * 5.5, h = Math.sqrt(Math.max(0, (R * 0.8) ** 2 - v * v));
      d += open([cp(-h, v, T, o), cp(h, v, T, o)]);
    }
    grip.setAttribute("d", d);
  }
  const B = register(stage, (dt) => { const m = stepS(s, dt); draw(s.x); return m; });
  bag.add(B.unregister);
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    s.t = v ? clamp(amt, 0.3, 1) : rest;
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: () => setOn(true), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; if (on) { s.t = clamp(amt, 0.3, 1); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "manhole",
  means: "A manhole cover in its frame: the pointer lifts the cover off its seat and tips it aside to open the shaft.",
  rules: [1, 3, 5, 6],
  range: [30, 100, 100],
  tour: [[200, 157], [150, 165], [250, 166], null],
  mount,
});
