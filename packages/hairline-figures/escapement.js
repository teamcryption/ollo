/**
 * Clock escapement: an anchor escapement standing upright, the saw-toothed
 * escape wheel below, the anchor rocking on its pivot above it with a pallet
 * on each arm, and the pendulum hanging from the anchor to a heavy bob. The
 * pointer pushes the bob away: the pendulum swings to the far side, the
 * anchor rocks with it and the wheel lets a tooth go. At rest the pendulum
 * hangs a little to one side, its bob bright. The slider is how wide it swings.
 *
 * The pattern: one swing on a spring; the hit is the pivot's fixed screen x.
 */
const {
  Cam, circ, clamp, fillet, fit, poly, proj, seg, spring, stepS,
  disposer, flatDot, mk, place, pointer, register,
} = HL;

const WZ = 40, WR = 34, WT = 26, N = 15, PZ = 90, LEN = 104, BOB = 11, SWING = 0.42, REST = -0.12;
const ANCHOR = [[-25, -24], [-4, 4], [4, 4], [25, -24], [22, -32], [17, -26], [0, -4], [-17, -26], [-22, -32]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.58);
  const ext = [[-WR, 0, WZ - WR], [WR, 0, WZ + WR], [0, 0, PZ + 8]];
  for (const a of [-1.3, 1.3]) ext.push([Math.sin(a * SWING) * (LEN + BOB) + 6, 7, PZ - Math.cos(a * SWING) * (LEN + BOB)]);
  fit(C, ext, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  // a point (x, z) in the upright plane, turned by a about (cx, cz), at depth y
  const T = (pts, a, cx, cz, y) => {
    const c = Math.cos(a), s = Math.sin(a);
    return pts.map(([x, z]) => P(cx + x * c - z * s, y, cz + x * s + z * c));
  };
  const wheelPts = [];
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2, b = ((i + 0.8) / N) * Math.PI * 2;
    wheelPts.push([WT * Math.cos(a), WT * Math.sin(a)], [WR * Math.cos(b), WR * Math.sin(b)]);
  }
  const ring = (r, n = 40) => circ(r, n).map((q) => [q.u, q.v]);
  const anc = fillet(ANCHOR, ANCHOR.map(() => 1.6), 3);
  const rodPts = [[-1.6, 0], [1.6, 0], [1.6, -LEN], [-1.6, -LEN]];

  // a thin upright plate: its back line for the thickness, then its face
  const plate = (cls) => ({ back: mk("path", { class: "lo" }, g), face: mk("path", { class: cls }, g) });
  const wheel = plate("sil"), wheelIn = mk("path", { class: "nf lo" }, g);
  const anchor = plate("sil"), rod = plate("sil"), bob = plate("sil");
  const pin = flatDot(g, C, 1.8, "dot m");
  place(pin, P(0, 6, PZ));
  const hub = mk("path", { class: "nf lo" }, g);
  const sw = spring(REST, { k: 100, c: 18 });
  let drawn = NaN, side = 0;

  function draw() {
    const th = sw.x;
    if (Math.abs(th - drawn) < 1e-4) return;
    drawn = th;
    const wa = -th * 1.1;
    wheel.back.setAttribute("d", poly(T(wheelPts, wa, 0, WZ, -3)));
    wheel.face.setAttribute("d", poly(T(wheelPts, wa, 0, WZ, 0)));
    let spokes = poly(T(ring(WT - 5), wa, 0, WZ, 0));
    for (let k = 0; k < 4; k++) {
      const a = (k * Math.PI) / 2;
      spokes += seg(...T([[4 * Math.cos(a), 4 * Math.sin(a)], [(WT - 5) * Math.cos(a), (WT - 5) * Math.sin(a)]], wa, 0, WZ, 0));
    }
    wheelIn.setAttribute("d", spokes);
    hub.setAttribute("d", poly(T(ring(4, 16), 0, 0, WZ, 0)));
    anchor.back.setAttribute("d", poly(T(anc, th, 0, PZ, 1)));
    anchor.face.setAttribute("d", poly(T(anc, th, 0, PZ, 3)));
    rod.back.setAttribute("d", poly(T(rodPts, th, 0, PZ, 4)));
    rod.face.setAttribute("d", poly(T(rodPts, th, 0, PZ, 5)));
    const bp = ring(BOB, 32).map(([x, z]) => [x, z - LEN]);
    bob.back.setAttribute("d", poly(T(bp, th, 0, PZ, 3.5)));
    bob.face.setAttribute("d", poly(T(bp, th, 0, PZ, 6.5)));
  }
  const B = register(stage, (dt) => { const m = stepS(sw, dt); draw(); return m; });
  bag.add(B.unregister);

  const px = P(0, 0, PZ)[0];
  function aim(s) {
    side = s;
    sw.t = s ? -s * SWING * amp : REST;
    const lit = [bob.face, anchor.face];
    lit[0].classList.toggle("hi", true);
    lit[1].classList.toggle("hi", false);
    read.textContent = s ? (s < 0 ? "tick" : "tock") : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const dx = p[0] - px; aim(Math.abs(dx) > 150 ? 0 : dx < 0 ? -1 : 1); },
    leave: () => aim(0),
  }));
  bag.add(() => svg.replaceChildren());
  aim(0);
  return { set: (v) => { amp = clamp(v, 0, 1.3); aim(side); }, destroy: bag.dispose };
}

hairline({
  name: "escapement",
  means: "An anchor escapement: the pointer pushes the pendulum away, the anchor rocks on its pivot and the escape wheel lets a tooth go.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.3],
  tour: [[168, 257], [264, 175], [150, 120], null],
  mount,
});
