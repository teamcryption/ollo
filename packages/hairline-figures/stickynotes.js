/**
 * Sticky notes: a framed cork board standing on two posts and feet, with a
 * 3×3 grid of square notes stuck to its face, two faint lines on each. The
 * pointer is a field on the board: notes near it lift their bottom edge and
 * curl out on springs, the one under it most, bright. At rest a few notes are
 * already curling, one bright. The slider is how far a note curls.
 *
 * The pattern: a field on springs (terrain); the hit is on the board's own
 * plane, which never moves.
 */
const {
  Cam, clamp, fillet, fit, hull, open, poly, prism, proj, rings, seg, spring, stepS, facing,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 84, ZB = 14, HB = 74, YF = 2, SQ = 18, PITCH = 24, LMAX = 11;
const REST = [0, 2, 0, 1, 0, 3, 0, 5, 0], FAV = 7;
const X0 = (W - (2 * PITCH + SQ)) / 2, ZT0 = ZB + HB - (HB - (2 * PITCH + SQ)) / 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, -14, 0], [W, 14, 0], [0, 14, 0], [W, -14, 0], [0, 0, ZB + HB], [W, 0, ZB + HB], [X0, YF + LMAX * 1.6, ZB]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the stand: two feet along y, two posts up into the board
  for (const x of [10, W - 10]) {
    const [fr, fi] = rings(x - 3, -14, x + 3, 14, 2.5, 0.8);
    put(solid(g), prism(P, front, fr, fi, 0, 3));
    const [pr] = rings(x - 1.8, -1.8, x + 1.8, 1.8, 1.6, 0.5);
    put(solid(g), prism(P, front, pr, null, 3, ZB + 4));
  }
  // the board: a rounded plate in the x–z plane, a thickness along y, the frame's inner edge as its crease
  const face = (y, ins) => fillet([[ins, ZB + ins], [W - ins, ZB + ins], [W - ins, ZB + HB - ins], [ins, ZB + HB - ins]], [4 - ins / 2, 4 - ins / 2, 4 - ins / 2, 4 - ins / 2], 4).map(([x, z]) => P(x, y, z));
  const board = solid(g);
  board.sil.setAttribute("d", poly(hull(face(YF, 0).concat(face(-YF, 0)))));
  board.cr.setAttribute("d", poly(face(YF, 4)));

  const notes = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    const k = r * 3 + c, grp = mk("g", {}, g);
    notes.push({ k, r, c, grp, x0: X0 + c * PITCH, zt: ZT0 - r * PITCH, sp: spring(REST[k]), sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp), last: NaN });
  }
  // a note: its top edge stuck to the board, its bottom curling out by L
  const pt = (n, x, t, L) => P(n.x0 + x, YF + 0.3 + L * t ** 2.4, n.zt - SQ * t + L * 0.35 * t ** 3);
  function draw(n) {
    const L = n.sp.x;
    if (Math.abs(L - n.last) < 1e-3) return;
    n.last = L;
    const left = [], right = [];
    for (let i = 0; i <= 8; i++) { left.push(pt(n, 0, i / 8, L)); right.unshift(pt(n, SQ, i / 8, L)); }
    n.sil.setAttribute("d", poly(left.concat(right)));
    n.cr.setAttribute("d", seg(pt(n, 3.5, 0.32, L), pt(n, SQ - 3.5, 0.32, L)) + seg(pt(n, 3.5, 0.52, L), pt(n, SQ - 7, 0.52, L)));
  }

  let order = "";
  const B = register(stage, (dt) => {
    let m = false;
    for (const n of notes) { if (stepS(n.sp, dt)) m = true; draw(n); }
    // a curled note is nearer than a flat one; on a tie the upper note's curl lies over the lower
    const sorted = notes.slice().sort((a, b) => a.sp.x - a.r * 0.01 - (b.sp.x - b.r * 0.01));
    const key = sorted.map((n) => n.k).join();
    if (key !== order) { order = key; for (const n of sorted) g.appendChild(n.grp); }
    return m;
  });
  bag.add(B.unregister);

  // the hit: the pointer on the board's face plane y = YF, solved from P's two axes
  const o = P(0, YF, 0), ex = P(1, YF, 0), ez = P(0, YF, 1);
  const ax = [ex[0] - o[0], ex[1] - o[1]], az = [ez[0] - o[0], ez[1] - o[1]], det = ax[0] * az[1] - ax[1] * az[0];
  function onBoard([sx, sy]) {
    const dx = sx - o[0], dy = sy - o[1];
    return [(dx * az[1] - dy * az[0]) / det, (ax[0] * dy - ax[1] * dx) / det];
  }

  let over = null;
  function retarget() {
    let near = -1, bd = PITCH * 0.75;
    for (const n of notes) {
      if (over) {
        const d = Math.hypot(over[0] - (n.x0 + SQ / 2), over[1] - (n.zt - SQ / 2));
        if (d < bd) { bd = d; near = n.k; }
        n.sp.t = clamp(Math.max(REST[n.k] * 0.4, LMAX * reach * Math.exp(-((d / 20) ** 2))), 0, LMAX * 1.6);
      } else n.sp.t = REST[n.k];
    }
    for (const n of notes) n.sil.classList.toggle("hi", n.k === (over ? near : FAV));
    if (over && near >= 0) notes[near].sp.t = LMAX * reach;
    read.textContent = over && near >= 0 ? "note " + (notes[near].r + 1) + "·" + (notes[near].c + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, z] = onBoard(p);
      over = x > -2 && x < W + 2 && z > ZB - 2 && z < ZB + HB + 2 ? [x, z] : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { reach = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "stickynotes",
  means: "A cork board of sticky notes: notes near the pointer lift their bottom edge and curl out, the one under it most.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[160, 110], [200, 150], [240, 190], null],
  mount,
});
