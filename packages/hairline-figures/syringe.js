/**
 * Syringe: one syringe standing on its thumb rest, rod up into the barrel,
 * needle at the top. The pointer over it draws the plunger: the barrel rides
 * up the rod, as a dose is drawn. At rest it is part drawn, thumb rest bright.
 */
const { Cam, circ, fit, facing, poly, prism, proj, rings, ringAt, clamp, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const disc = (r, n = 32) => circ(r, n);
const ZB = 10, LIFT = 30, REST = 0.3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-36, -36, 0], [36, 36, 0], [0, 0, ZB + LIFT + 104]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const thumb = solid(g);
  put(thumb, prism(P, front, disc(26), disc(23), 0, 3));
  const rod = solid(g), mov = mk("g", {}, g);
  const fl = solid(mov), bar = solid(mov), stop = mk("path", { class: "nf lo" }, mov), hub = solid(mov), ndl = solid(mov);
  const [fr, fi] = rings(-46, -11, 46, 11, 7, 2);
  const sp = spring(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return; last = t;
    const zb = ZB + LIFT * t;
    put(rod, prism(P, front, disc(5), disc(3.5), 3, zb + 6));
    put(fl, prism(P, front, fr, fi, zb, zb + 2.5));
    put(bar, prism(P, front, disc(20, 48), disc(17.6, 48), zb + 2.5, zb + 72));
    stop.setAttribute("d", poly(ringAt(P, disc(20, 48), zb + 9)));
    put(hub, prism(P, front, disc(6), disc(4.4), zb + 72, zb + 80));
    put(ndl, prism(P, front, disc(1.4, 12), disc(0.6, 12), zb + 80, zb + 102));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const box = [P(-30, -30, 0), P(30, 30, 0), P(0, 0, ZB + 120), P(30, -30, 0), P(-30, 30, 0)];
  const xs = box.map((q) => q[0]), ys = box.map((q) => q[1]);
  const x0 = Math.min(...xs) - 6, x1 = Math.max(...xs) + 6, y0 = Math.min(...ys) - 6, y1 = Math.max(...ys) + 8;
  let act = null;
  function setA(on, p) {
    const k = on ? clamp((y1 - p[1]) / (y1 - y0), 0, 1) : -1;
    sp.t = on ? REST + (1 - REST) * (0.35 + 0.65 * amt) : REST;
    const hi = on ? bar : thumb;
    thumb.sil.classList.toggle("hi", !on); bar.sil.classList.toggle("hi", on);
    read.textContent = on ? "draw " + Math.round(sp.t * 10) + "ml" : "rest";
    act = on; B.wake();
  }
  setA(false);
  bag.add(pointer(stage, { move: (p) => setA(p[0] > x0 && p[0] < x1 && p[1] > y0 && p[1] < y1, p), leave: () => setA(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act) { sp.t = REST + (1 - REST) * (0.35 + 0.65 * v); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "syringe",
  means: "A syringe standing on its thumb rest: the pointer over it draws the plunger, and the barrel rides up the rod.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[200, 240], [200, 184], [200, 120], null],
  mount,
});
