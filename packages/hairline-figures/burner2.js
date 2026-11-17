/**
 * Spirit lamp: a squat glass lamp with a collar, a wick standing out of it
 * and a tall snuffer cap. The pointer lifts the cap off the wick and swings
 * it to the side the pointer is on (springs); a small flame stands on the
 * wick while the cap is off. At rest the cap sits a little raised, bright.
 * The slider is how high the cap lifts.
 *
 * The pattern: a part lifting to answer the pointer (lift).
 */
const {
  Cam, circ, fit, facing, hull, poly, open, prism, proj, ringAt, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BR = 30, BZ = 22, NR = 9, NZ = 8, CR = 12, CH = 30;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxLift = value;
  const C = Cam(45, 0.5, 2.85);
  fit(C, [[-BR, -BR, 0], [BR, BR, 0], [-26, 26, BZ + NZ + 40 + CH], [26, -26, BZ + NZ + 40 + CH]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // body: a squat bowl, wider at its middle
  const body = solid(g), pts = [];
  for (const [r, z] of [[BR - 6, 0], [BR, 7], [BR - 2, 15], [BR - 10, BZ]]) pts.push(...ringAt(P, disc(0, 0, r), z));
  body.sil.setAttribute("d", poly(hull(pts)));
  body.cr.setAttribute("d", open(ringAt(P, disc(0, 0, BR - 13, 40), BZ).filter((_, i) => i > 4 && i < 36)));
  put(solid(g), prism(P, front, disc(0, 0, NR), disc(0, 0, NR - 2), BZ, BZ + NZ));
  const top = BZ + NZ;
  put(solid(g), prism(P, front, disc(0, 0, 2.2, 16), disc(0, 0, 1.4, 16), top, top + 6));
  const flame = mk("path", { class: "nf lo" }, g);
  const cap = mk("path", { class: "sil" }, g), rim = mk("path", { class: "nf lo" }, g);
  const up = spring(0.18), side = spring(0);
  let last = "";
  function draw() {
    const lz = up.x * maxLift, cx = side.x * 22 * up.x, cy = -side.x * 22 * up.x;
    const key = lz.toFixed(2) + cx.toFixed(2);
    if (key === last) return;
    last = key;
    const base = top - 4 + lz, cp = [];
    for (let i = 0; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); cp.push(...ringAt(P, disc(cx, cy, CR * (0.55 + 0.45 * Math.cos(t)), 24), base + 8 + (CH - 8) * Math.sin(t))); }
    cp.push(...ringAt(P, disc(cx, cy, CR, 24), base));
    cap.setAttribute("d", poly(hull(cp)));
    rim.setAttribute("d", poly(ringAt(P, disc(cx, cy, CR - 1, 24), base + 8)));
    const f = clamp((up.x - 0.45) / 0.4, 0, 1);
    if (f > 0) {
      const fp = ringAt(P, disc(0, 0, 3.2 * f, 12), top + 8).concat([P(0, 0, top + 6 + 14 * f)]);
      flame.setAttribute("d", poly(hull(fp)));
    } else flame.setAttribute("d", "");
  }
  const B = register(stage, (dt) => { const m = stepS(up, dt) | stepS(side, dt); draw(); return !!m; });
  bag.add(B.unregister);
  const mid = P(0, 0, top);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const s = clamp((sx - mid[0]) / 120, -1, 1), near = Math.abs(sx - mid[0]) < 150 && sy > 20 && sy < 300;
      up.t = near ? 1 : 0.18; side.t = near ? s : 0;
      read.textContent = near ? (s < 0 ? "cap left" : "cap right") : "rest";
      B.wake();
    },
    leave: () => { up.t = 0.18; side.t = 0; read.textContent = "rest"; B.wake(); },
  }));
  cap.classList.add("hi");
  read.textContent = "rest";
  draw();
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxLift = v; last = ""; draw(); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "burner2",
  means: "A spirit lamp with a snuffer cap: the pointer lifts the cap off the wick and swings it aside, and a small flame stands up.",
  rules: [3, 4, 5, 8],
  range: [20, 36, 44],
  tour: [[150, 140], [262, 120], [205, 90], null],
  mount,
});
