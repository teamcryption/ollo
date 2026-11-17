/**
 * Ice tongs: a pair of bar tongs standing on their claws round an ice cube,
 * joined at a hinge loop on top. The pointer opens them: the further it
 * stands from the hinge, sideways, the wider the arms swing apart. At rest
 * they grip the cube, which is bright. The slider is how far they may open.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H = 66, CUBE = 8, REST = 0.08, RR = 2.6;
const disc = (x, y, r, n = 16) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-40, -14, 0], [40, 14, 0], [0, 0, H + 8], [-40, 0, 30], [40, 0, 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-34, -16, 34, 16, 6, 2);
  put(solid(g), prism(P, front, pr, pi, 0, 3));
  const back = mk("path", { class: "sil" }, g), backClaw = mk("path", { class: "sil" }, g);
  const [cr, ci] = rings(-CUBE, -CUBE, CUBE, CUBE, 3, 1.4);
  const cube = solid(g);
  put(cube, prism(P, front, cr, ci, 3, 3 + 2 * CUBE));
  const fr = mk("path", { class: "sil" }, g), frClaw = mk("path", { class: "sil" }, g);
  const hinge = mk("path", { class: "sil" }, g);
  const rod = (a, b, r) => poly(hull(ringAt(P, disc(a[0], 0, r), a[1]).concat(ringAt(P, disc(b[0], 0, r), b[1]))));

  const op = spring(REST);
  let last = NaN;
  function draw(o) {
    if (o === last) return;
    last = o;
    for (const [s, arm, claw] of [[-1, back, backClaw], [1, fr, frClaw]]) {
      const top = [s * 4, H - 4], elbow = [s * (CUBE + 6 + o * 18), 34], tip = [s * (CUBE + 3 + o * 24), 10];
      arm.setAttribute("d", rod(top, elbow, RR) + " " + rod(elbow, tip, RR));
      claw.setAttribute("d", rod(tip, [tip[0] - s * 5, 6], RR - 0.4));
    }
    const ring = [];
    for (const zz of [-5, -3, 0, 3, 5]) ring.push(...ringAt(P, disc(0, 0, Math.sqrt(30 - zz * zz) + 0.5), H + zz));
    hinge.setAttribute("d", poly(hull(ring)));
  }
  const B = register(stage, (dt) => { const m = stepS(op, dt); draw(op.x); return m; });
  bag.add(B.unregister);

  const hx = P(0, 0, H)[0], mid = P(0, 0, H / 2);
  let on = null;
  function aim(p) {
    const inside = p && Math.abs(p[0] - hx) < 110 && Math.abs(p[1] - mid[1]) < 110;
    const o = inside ? clamp(Math.abs(p[0] - hx) / 80, 0.15, 1) * reach : REST;
    op.t = o;
    const act = !!inside;
    if (act !== on) {
      on = act;
      cube.sil.classList.toggle("hi", !act);
      for (const el of [back, backClaw, fr, frClaw, hinge]) el.classList.toggle("hi", act);
    }
    read.textContent = act ? Math.round((o / reach) * 100) + "%" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "icetongs",
  means: "A pair of ice tongs gripping a cube: the arms swing open wider the further the pointer stands from the hinge.",
  rules: [1, 3, 4, 5],
  range: [40, 80, 100],
  tour: [[232, 172], [278, 195], [122, 118], null],
  mount,
});
