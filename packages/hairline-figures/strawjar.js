/**
 * Straw dispenser: a round glass jar with a rim collar, a bunch of straws
 * standing in it. The pointer over the jar pushes the straws up out of it,
 * the front ones highest, staggered outward. At rest one straw stands
 * proud, bright. The slider is how far they rise.
 *
 * The pattern: one part rising out of a fixed body (toaster).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const CX = 30, CY = 30, R = 24, H = 30, SR = 1.8, SL = 26, FAV = 4;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const SPOTS = [[-12, -8], [0, -15], [12, -9], [-16, 4], [-4, -2], [8, 1], [16, 8], [-9, 12], [3, 13]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.45);
  fit(C, [[CX - R, CY - R, 0], [CX + R, CY + R, 0], [CX - R, CY + R, 0], [CX + R, CY - R, 0], [CX, CY - 11, H + SL + 20], [CX + 12, CY + 6, H + SL + 20]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [jr, ji] = rings(CX - R, CY - R, CX + R, CY + R, R, 2);
  put(solid(g), prism(P, front, jr, ji, 0, H));
  const [cr, ci] = rings(CX - R - 1.5, CY - R - 1.5, CX + R + 1.5, CY + R + 1.5, R + 1.5, 1.2);
  put(solid(g), prism(P, front, cr, ci, H - 5, H));
  mk("path", { d: poly(ringAt(P, disc(CX, CY, R - 2), H)), class: "nf lo" }, g);
  const order = SPOTS.map((s, i) => i).sort((a, b) => SPOTS[a][0] + SPOTS[a][1] - SPOTS[b][0] - SPOTS[b][1]);
  const straws = order.map((i) => {
    const [dx, dy] = SPOTS[i], el = mk("path", { class: "sil" }, g);
    return { i, x: CX + dx, y: CY + dy, el, w: 0.55 + 0.45 * ((dx + dy + 20) / 40), last: NaN };
  });
  const sp = spring(0);
  function draw(s) {
    for (const st of straws) {
      const up = st.i === FAV ? Math.max(s, 0.35) : s;
      const top = H + SL - 14 + up * 32 * st.w;
      if (top === st.last) continue;
      st.last = top;
      st.el.setAttribute("d", poly(hull(ringAt(P, disc(st.x, st.y, SR, 12), H - 1).concat(ringAt(P, disc(st.x, st.y, SR, 12), top)))));
    }
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  draw(0);
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    sp.t = v ? reach : 0;
    straws.forEach((st) => st.el.classList.toggle("hi", v ? st.i === 7 : st.i === FAV));
    read.textContent = v ? "push" : "rest";
    B.wake();
  }
  setOn(false);
  function hit([sx, sy]) {
    const m = P(CX, CY, H * 0.7);
    return Math.abs(sx - m[0]) < 70 && Math.abs(sy - m[1]) < 90;
  }
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) { sp.t = v; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "strawjar",
  means: "A straw dispenser jar: the pointer over it pushes the straws up out of the rim, the front ones highest.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.2],
  tour: [[200, 161], [188, 150], [214, 176], null],
  mount,
});
