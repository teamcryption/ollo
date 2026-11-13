/**
 * Cinema seats: two rows of five folding seats on a stepped floor, the back
 * row up a riser, each seat a backrest and a seat bottom hinged between two
 * armrest standards. The pointer is someone finding a place: the seat bottoms
 * near it flip down on their own springs, the one under it fully down and
 * bright. At rest the seats stand folded, a few left part-way, one down and
 * bright. The slider is the reach.
 *
 * The pattern: a continuous field (terrain) over two rows at different
 * heights; the hit is on each row's own resting seat plane, which never moves.
 */
const {
  Cam, clamp, facing, fit, hull, poly, prism, proj, rings, rrect, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, SP = 16, RISE = 10, SH = 11, SL = 12, ST = 2.2;
const ROWS = [{ id: "B", y0: -12, zf: RISE }, { id: "A", y0: 15, zf: 0 }];
const REST = { B: [86, 90, 0, 90, 70], A: [90, 76, 90, 84, 90] }, FAV = "B3";
const X1 = N * SP;
const V = [0.61, 0.61, 0.5];
const falloff = (u) => (u <= 0 ? 1 : u <= 0.45 ? 1 - (u / 0.45) * 0.62 : u <= 1 ? 0.38 - ((u - 0.45) / 0.55) * 0.38 : 0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value, over = null;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-4, -24, -3], [X1 + 4, -24, -3], [-4, 26, -3], [X1 + 4, 26, -3], [-4, -24, RISE + 30], [X1 + 4, -24, RISE + 30]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };

  // the floor: the back row's riser, then the front row's floor before it
  block(-4, -24, X1 + 4, 0, 2.5, 1.2, -3, RISE);
  block(-4, 0, X1 + 4, 26, 2.5, 1.2, -3, 0);

  const seats = [];
  for (const row of ROWS) {
    const { y0, zf } = row;
    for (let k = 0; k <= N; k++) {
      block(k * SP - 1.3, y0 - 7, k * SP + 1.3, y0 + 4, 1, 0.5, zf, zf + 14);
      if (k === N) break;
      const x0 = k * SP + 2, x1 = (k + 1) * SP - 2;
      block(x0, y0 - 7.5, x1, y0 - 4.5, 1.2, 0.6, zf + 8, zf + 29);
      const el = solid(g), rest = REST[row.id][k];
      seats.push({ id: row.id + (k + 1), k, row, x0, x1, cx: (x0 + x1) / 2, cy: y0 + 2, el, rest, sp: spring(rest, { eps: 0.05 }), drawn: NaN });
    }
  }

  function draw(s) {
    const deg = clamp(s.sp.x, 0, 90);
    if (deg === s.drawn) return;
    s.drawn = deg;
    const a = (deg * Math.PI) / 180, c = Math.cos(a), sn = Math.sin(a), yp = s.row.y0 - 3.8, zp = s.row.zf + SH;
    const ring = rrect(s.x0, 0, s.x1, SL, 1.6, 4), inner = rrect(s.x0 + 1, 1, s.x1 - 1, SL - 1, 0.8, 4);
    const at = (q, t) => P(q.u, yp + q.v * c + t * sn, zp + q.v * sn - t * c);
    const top = ring.map((q) => at(q, 0)), bot = ring.map((q) => at(q, ST));
    // the face turned to the viewer gets the crease: the top when down, the underside when folded
    const upFace = -V[1] * sn + V[2] * c > 0;
    put(s.el, { sil: poly(hull(top.concat(bot))), crease: poly(inner.map((q) => at(q, upFace ? 0 : ST))) });
  }
  const B = register(stage, (dt) => {
    let m = false;
    for (const s of seats) { if (stepS(s.sp, dt)) m = true; draw(s); }
    return m;
  });
  bag.add(B.unregister);

  // each row is tested on its own seat plane at rest; the nearer row's middle wins
  function under(sx, sy) {
    let best = null, bd = 1;
    for (const row of ROWS) {
      const [x, y] = unproj(C, sx, sy, row.zf + SH), d = Math.abs(y - (row.y0 + 1)) / 10;
      if (x < -3 || x > X1 + 3 || d >= bd) continue;
      bd = d; best = seats.find((s) => s.row === row && s.k === clamp(Math.floor(x / SP), 0, N - 1));
    }
    return best;
  }

  function retarget() {
    for (const s of seats) {
      if (!over) s.sp.t = s.rest;
      else s.sp.t = s === over ? 0 : 90 - 90 * 0.8 * falloff(Math.hypot(s.cx - over.cx, s.cy - over.cy) / RAD);
      s.el.sil.classList.toggle("hi", over ? s === over : s.id === FAV);
    }
    read.textContent = over ? "seat " + over.id : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { const h = under(p[0], p[1]); if (h !== over) { over = h; retarget(); } },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { RAD = v; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "cinemaseats",
  means: "Two rows of folding cinema seats on a stepped floor: seats near the pointer flip down, the one under it fully down.",
  rules: [1, 3, 5, 6],
  range: [20, 40, 64],
  tour: [[164, 125], [172, 198], [228, 225], null],
  mount,
});
