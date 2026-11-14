/**
 * Soldering station: a control box with a large dial on top, and beside it
 * a weighted holder whose flared sleeve cradles the iron, tilted up toward
 * the viewer. The pointer's place across the station turns the dial on a
 * spring, from cold to hot, and the read-out gives the set temperature. At
 * rest the dial sits at 320, its notch bright. The slider is the top heat.
 *
 * The pattern: one continuous control (dial).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, clamp, lerp, rad, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 40, BY = 36, BZ = 22, DR = 11, HX = 64, HY = 18;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const A0 = rad(-135), A1 = rad(135);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value;
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[0, 0, 0], [BX, BY, 0], [0, BY, 0], [HX + 12, HY + 12, 0], [HX + 12, HY - 12, 0], [HX + 30, HY, 78], [BX / 2, BY / 2, BZ + 6]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, BX, BY, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const cx = BX / 2, cy = BY / 2;
  put(solid(g), prism(P, front, disc(cx, cy, DR + 2), disc(cx, cy, DR), BZ, BZ + 1.2));
  const knob = solid(g);
  put(knob, prism(P, front, disc(cx, cy, DR - 1), disc(cx, cy, DR - 2.4), BZ + 1.2, BZ + 6));
  const notch = mk("path", { class: "nf" }, g);
  // the holder: a round weighted foot, then a sleeve that flares toward its mouth
  put(solid(g), prism(P, front, disc(HX, HY, 12), disc(HX, HY, 10.5), 0, 4));
  const foot = disc(HX, HY, 4.5), mouth = disc(HX, HY, 8.5), lip = disc(HX, HY, 7.2);
  mk("path", { d: poly(hull(ringAt(P, foot, 4).concat(ringAt(P, mouth, 30)))) }, g);
  mk("path", { d: poly(ringAt(P, lip, 30)), class: "nf lo" }, g);
  // the iron, out of the sleeve's mouth: barrel, then a fatter grip
  let up = 0;
  const ax = (s) => [HX + (s + up) * 0.42, HY, 30 + (s + up) * 0.9];
  const rod = (s0, s1, r) => { const a = ax(s0), b = ax(s1); return poly(hull(ringAt(P, disc(a[0], a[1], r, 20), a[2]).concat(ringAt(P, disc(b[0], b[1], r, 20), b[2])))); };
  const tip = mk("path", {}, g), grip = mk("path", { class: "sil" }, g);
  function iron(u) {
    up = u;
    tip.setAttribute("d", rod(Math.max(-14, -u - 2), 10, 2.2));
    grip.setAttribute("d", rod(10, 34, 4.4));
  }

  const REST = 0.55, sp = spring(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    iron(clamp((t - 0.6) / 0.4, 0, 1) * 20);
    const a = lerp(A0, A1, t) - rad(45), r0 = 2.5, r1 = DR - 3, z = BZ + 6;
    notch.setAttribute("d", open([P(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, z), P(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1, z)]));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  const xl = P(0, BY, 0)[0], xr = P(HX + 12, HY - 12, 0)[0];
  const temp = (t) => Math.round(lerp(150, 250 + top * 2.5, t) / 10) * 10;
  function move([sx]) {
    const t = clamp((sx - xl) / (xr - xl), 0, 1);
    sp.t = t;
    notch.classList.add("hi");
    read.textContent = t > 0.6 ? "iron" : temp(t) + "°";
    B.wake();
  }
  function leave() { sp.t = REST; notch.classList.add("hi"); read.textContent = "rest"; B.wake(); }
  leave();
  draw(REST);
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { top = v; }, destroy: bag.dispose };
}

hairline({
  name: "solderstation",
  means: "A soldering station: the pointer's place across it turns the big dial from cold to hot, and the read-out gives the heat.",
  rules: [1, 3, 5, 8],
  range: [0, 50, 100],
  tour: [[130, 180], [190, 170], [263, 145], null],
  mount,
});
