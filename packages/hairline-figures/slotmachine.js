/**
 * Slot machine: a cabinet with three reel windows on its face and a lever on
 * its side. The pointer on the cabinet pulls the lever down, and the reels
 * roll their marks, staggered out from the lever. At rest the lever stands
 * back, its knob bright. The slider is the stagger.
 *
 * The pattern: one press that ripples along a row.
 */
const {
  Cam, circ, fit, facing, hull, lerp, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 48, D = 34, H = 84, WZ0 = 44, WZ1 = 62, LY = D / 2;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, 0, 0], [W, D, 0], [W + 14, D, 0], [0, D, H], [W + 6, LY, H + 4], [0, 0, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // the tray at the foot of the face
  mk("path", { d: poly([P(8, D, 10), P(W - 8, D, 10), P(W - 8, D, 18), P(8, D, 18)]), class: "nf lo" }, g);
  const reels = [];
  for (let i = 0; i < 3; i++) {
    const x0 = 6 + i * 13, x1 = x0 + 10;
    mk("path", { d: poly([P(x0, D, WZ0), P(x1, D, WZ0), P(x1, D, WZ1), P(x0, D, WZ1)]), class: "nf" }, g);
    const marks = mk("path", { class: "nf lo" }, g);
    reels.push({ x0, x1, marks, s: tween(i * 0.3), last: NaN });
  }
  // the lever: a pivot on the side, an arm and a knob
  put(solid(g), prism(P, front, disc(W + 2, LY, 4), disc(W + 2, LY, 3), 40, 48));
  const arm = mk("path", { class: "nf" }, g), knob = mk("path", { class: "sil hi" }, g);
  const lev = tween(0), last = { a: NaN };

  function drawReel(r, s) {
    if (s === r.last) return;
    r.last = s;
    let d = "";
    for (let k = 0; k < 3; k++) {
      const f = ((k / 3 + s) % 1 + 1) % 1, z = lerp(WZ0 + 2, WZ1 - 2, f);
      d += seg(P(r.x0 + 2, D, z), P(r.x1 - 2, D, z));
    }
    r.marks.setAttribute("d", d);
  }
  function drawLever(a) {
    if (a === last.a) return;
    last.a = a;
    const t = (-20 + a * 95) * Math.PI / 180, L = 34;
    const tip = [W + 9, LY + Math.sin(t) * L, 44 + Math.cos(t) * L];
    arm.setAttribute("d", poly(hull(ringAt(P, disc(W + 8, LY, 1.4, 10), 44).concat(ringAt(P, disc(tip[0], tip[1], 1.4, 10), tip[2])))));
    knob.setAttribute("d", poly(hull(ringAt(P, disc(tip[0], tip[1], 4.5, 20), tip[2] - 3).concat(ringAt(P, disc(tip[0], tip[1], 4.5, 20), tip[2] + 3)))));
  }
  const B = register(stage, (_dt, now) => {
    let moving = !tdone(lev, now);
    drawLever(tval(lev, now));
    for (const r of reels) { drawReel(r, tval(r.s, now)); if (!tdone(r.s, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const box = hull([P(0, 0, 0), P(W, 0, 0), P(W, D, 0), P(0, D, 0), P(0, 0, H), P(W, 0, H), P(W, D, H), P(0, D, H), P(W + 9, LY, 80)]);
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const inside = ([sx, sy]) => sx > Math.min(...xs) && sx < Math.max(...xs) && sy > Math.min(...ys) && sy < Math.max(...ys);

  let on = null, spins = 0;
  function setOn(v) {
    if (v === on) return;
    on = v;
    const now = performance.now();
    tset(lev, v ? 1 : 0, now, 0);
    if (v) { spins++; reels.forEach((r, i) => tset(r.s, i * 0.3 + spins * (1 + i / 3), now, (2 - i) * stag)); }
    read.textContent = v ? "pull " + spins : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(inside(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "slotmachine",
  means: "A slot machine: the pointer on the cabinet pulls the lever down and the three reels roll their marks, one after another.",
  rules: [2, 5, 6, 8],
  range: [0, 60, 120],
  tour: [[181, 158], [198, 60], [243, 200], null],
  mount,
});
