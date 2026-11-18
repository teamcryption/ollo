/**
 * Penny-farthing: a tall front wheel with the pedals on its hub, a tiny
 * trailing wheel, a curved backbone, a saddle perched over the big wheel and
 * a bar. Near the pointer the bike rolls forward, the great wheel and its
 * cranks turning as it goes. At rest it stands back, the big tyre bright.
 * The slider is how far it rolls.
 */
const { Cam, fit, proj, spring, stepS, poly, open, seg, disposer, mk, pointer, register, flatDot, place } = HL;

const R = 34, r = 9, FX = 44;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-r - 14, 0, 0], [FX + R + 38, 0, 0], [-r - 14, 0, 2 * R + 12], [FX + R + 38, 0, 2 * R + 12]], 200, 162);
  const P = proj(C);
  const g = mk("g", {}, svg);
  mk("path", { class: "dash", d: seg(P(-r - 14, 10, 0), P(FX + R + 38, 10, 0)) }, g);
  const dot = flatDot(g, C, 2, "dot off");
  const mkW = () => ({ tire: mk("path", { class: "sil" }, g), sp: mk("path", { class: "nf lo" }, g) });
  const rear = mkW();
  const back = mk("path", { class: "nf sil" }, g);
  const crankFar = mk("path", { class: "nf lo" }, g);
  const big = mkW();
  const fork = mk("path", { class: "nf sil" }, g);
  const crank = mk("path", { class: "nf sil" }, g);
  const saddle = mk("path", { class: "sil" }, g);
  const bar = mk("path", { class: "nf sil" }, g);
  const sp = spring(-12);
  let drawn = NaN, roll = value, on = false;
  const wheel = (w, cx, rr, a, n) => {
    const o = [], i = [], s = [];
    for (let k = 0; k < 48; k++) { const t = (k / 48) * Math.PI * 2; o.push(P(cx + rr * Math.cos(t), 0, rr + rr * Math.sin(t))); i.push(P(cx + (rr - 2.4) * Math.cos(t), 0, rr + (rr - 2.4) * Math.sin(t))); }
    for (let k = 0; k < n; k++) { const t = a + (k / n) * Math.PI * 2; s.push(seg(P(cx, 0, rr), P(cx + (rr - 2.4) * Math.cos(t), 0, rr + (rr - 2.4) * Math.sin(t)))); }
    w.tire.setAttribute("d", poly(o) + poly(i));
    w.sp.setAttribute("d", s.join(""));
  };
  const crankD = (x, a, y) => {
    const px = x + FX + 9 * Math.cos(a), pz = R + 9 * Math.sin(a);
    return seg(P(x + FX, y, R), P(px, y, pz)) + seg(P(px, y, pz), P(px, y + Math.sign(y) * 5, pz));
  };
  function draw() {
    const x = sp.x;
    if (Math.abs(x - drawn) < 1e-3) return;
    drawn = x;
    wheel(rear, x, r, -x / r, 6);
    wheel(big, x + FX, R, -x / R, 16);
    const bb = [];
    for (let k = 0; k <= 12; k++) { const t = k / 12, a = Math.PI * 0.5 * t; bb.push(P(x + FX - 6 - (FX - 6) * Math.sin(a), 0, r + (2 * R + 2 - r) * Math.cos(a))); }
    back.setAttribute("d", open(bb));
    fork.setAttribute("d", seg(P(x + FX, -3, R), P(x + FX - 5, 0, 2 * R + 4)) + seg(P(x + FX, 3, R), P(x + FX - 5, 0, 2 * R + 4)));
    const a = -x / R;
    crankFar.setAttribute("d", crankD(x, a + Math.PI, -4));
    crank.setAttribute("d", crankD(x, a, 4));
    saddle.setAttribute("d", poly([P(x + FX - 18, -4, 2 * R + 6), P(x + FX - 6, -3, 2 * R + 6), P(x + FX - 6, 3, 2 * R + 6), P(x + FX - 18, 4, 2 * R + 6)]));
    bar.setAttribute("d", seg(P(x + FX - 5, -14, 2 * R + 6), P(x + FX - 5, 14, 2 * R + 6)) + seg(P(x + FX - 5, 0, 2 * R + 4), P(x + FX - 5, 0, 2 * R + 6)));
    place(dot, P(x + FX, 10, 0));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  const lo = P(-r - 4, 0, 0), hi = P(FX + R + 4, 0, 2 * R + 8);
  function set(o) {
    on = o;
    sp.t = on ? 6 + 30 * roll : -12;
    big.tire.classList.toggle("hi", !on);
    crank.classList.toggle("hi", on);
    big.sp.classList.toggle("lo", true);
    read.textContent = on ? "ride" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => set(p[0] > lo[0] - 20 && p[0] < hi[0] + 20 && p[1] > hi[1] - 20 && p[1] < P(FX + R + 4, 0, 0)[1] + 30),
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  draw(); set(false);
  return { set: (v) => { roll = v; set(on); }, destroy: bag.dispose };
}

hairline({
  name: "pennyfarthing",
  means: "A penny-farthing: near the pointer it rolls forward, the great front wheel and its pedals turning as it goes.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[196, 160], [125, 175], [232, 135], null],
  mount,
});
