/**
 * Hose reel: a garden hose reel on its low stand, two spoked side wheels on
 * an axle, the wound drum between them, a crank on the near wheel and the
 * hose's end lying out on the ground with its nozzle. At rest the crank
 * stands up, its handle bright. The pointer over the reel pays the hose out:
 * the wheel and crank turn, and the hose runs out along the ground. The
 * slider is how far.
 *
 * The pattern: one gesture answering (a turn and a slide on one tween); the
 * hit is on fixed planes through the rest pose.
 */
const {
  Cam, clamp, facing, fit, hull, lerp, open, poly, prism, proj, rings, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 27, RD = 19, ZC = 32, W = 40, OUT0 = 10, OUT1 = 92;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-R, -4, 0], [R, W + 14, 0], [-R, -4, ZC + R], [R + OUT1 + 12, W / 2, 0], [-R, W + 14, ZC + R]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const circle = (r, y, n = 40) => { const o = []; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; o.push(P(r * Math.cos(a), y, ZC + r * Math.sin(a))); } return o; };
  const disc = (r, y0, y1) => poly(hull(circle(r, y0).concat(circle(r, y1))));

  // the stand
  const [sr, si] = rings(-R - 4, -6, R + 4, W + 6, 6, 1.4);
  put(solid(g), prism(P, front, sr, si, 0, 3));
  mk("path", { class: "nf lo", d: seg(P(-R * 0.6, 0, 3), P(0, 0, ZC)) + seg(P(R * 0.6, 0, 3), P(0, 0, ZC)) }, g);
  // the far wheel, the wound drum, then the hose paying out
  mk("path", { class: "sil", d: disc(R, -2.5, 0) }, g);
  mk("path", { class: "sil", d: disc(RD, 0, W) }, g);
  const hose = mk("path", { class: "nf sil" }, g), noz = mk("path", { class: "sil" }, g);
  // the near wheel, its spokes and the crank
  mk("path", { class: "sil", d: disc(R, W, W + 2.5) }, g);
  mk("path", { class: "nf lo", d: poly(circle(R - 3, W + 2.5)) }, g);
  const spokes = mk("path", { class: "nf lo" }, g);
  const arm = mk("path", { class: "nf sil" }, g), knob = mk("path", { class: "sil" }, g);

  const t = tween(0);
  let last = NaN;
  function draw(k) {
    if (k === last) return;
    last = k;
    const f = k * clamp(amt, 0, 1), th = Math.PI / 2 + f * Math.PI * 2.75, yN = W + 2.5;
    let sp = "";
    for (let i = 0; i < 4; i++) { const a = th + (i * Math.PI) / 2; sp += seg(P(0, yN, ZC), P((R - 3) * Math.cos(a), yN, ZC + (R - 3) * Math.sin(a))); }
    spokes.setAttribute("d", sp);
    const ex = 0.72 * R * Math.cos(th), ez = ZC + 0.72 * R * Math.sin(th);
    arm.setAttribute("d", seg(P(0, yN, ZC), P(ex, yN, ez)) + seg(P(0, yN, ZC), P(0, yN + 3, ZC)));
    const knobPts = [];
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; knobPts.push(P(ex + 2 * Math.cos(a), yN, ez + 2 * Math.sin(a)), P(ex + 2 * Math.cos(a), yN + 9, ez + 2 * Math.sin(a))); }
    knob.setAttribute("d", poly(hull(knobPts)));
    const len = lerp(OUT0, OUT1, f), ye = W / 2, x1 = RD + 6 + len;
    const line = (d) => open([P(RD * 0.6, ye + d, ZC - RD * 0.8), P(RD + 1, ye + d, 6), P(RD + 6, ye + d, 1.2), P(x1, ye + 2 + d, 1.2)]);
    hose.setAttribute("d", line(-1.6) + line(1.6));
    const nz = [];
    for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2; nz.push(P(x1, ye + 2 + 2.4 * Math.cos(a), 2.4 + 2.4 * Math.sin(a)), P(x1 + 11, ye + 2 + 1.4 * Math.cos(a), 2.4 + 1.4 * Math.sin(a))); }
    noz.setAttribute("d", poly(hull(nz)));
  }

  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(t, on ? 1 : 0, performance.now(), 0);
    knob.classList.add("hi");
    read.textContent = on ? "pay out" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    return [0, ZC, ZC + R].some((z) => {
      const [x, y] = unproj(C, sx, sy, z);
      return x > -R - 6 && x < R + OUT0 + 40 && y > -8 && y < W + 14;
    });
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "hosereel",
  means: "A garden hose reel: the pointer over it turns the crank and wheel, and the hose pays out along the ground.",
  rules: [1, 4, 5, 8],
  range: [0.4, 1, 1],
  tour: [[101, 103], [150, 150], [200, 200], null],
  mount,
});
