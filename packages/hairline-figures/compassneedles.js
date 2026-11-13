/**
 * Compass needles: a lab bench with twelve small compasses in a grid, four
 * across and three deep, and a bar magnet lying beside them. The pointer is a
 * second magnet: every needle swings on its own spring to point at it, and the
 * compass under it is bright. At rest every needle points at the bar magnet,
 * each at its own angle, and the magnet is bright. The slider is how quickly
 * the needles follow (a stiffer or softer spring).
 *
 * The pattern: a continuous aim per part (officechairs); the hit is on the
 * compasses' top plane, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, poly, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NC = 4, NR = 3, GAP = 22, RC = 8, TOP = 3, X0 = -42, Y0 = -22, LN = 7, LS = 4.6, NW = 2;
const TB = [-58, -36, 64, 36], MAG = [42, 54, -17, 17];
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[TB[0], TB[1], -7], [TB[2], TB[3], -7], [TB[2], TB[1], -7], [TB[0], TB[3], -7], [TB[0], TB[1], 0], [TB[2], TB[1], 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(TB[0], TB[1], TB[2], TB[3], 4, 1.8);
  put(solid(g), prism(P, front, tr, ti, -7, 0));

  // the magnet's north end is the far one (smaller y); every needle points at it at rest
  const north = [(MAG[0] + MAG[1]) / 2, MAG[2] + 4];
  const items = [];
  for (let c = 0; c < NC; c++) for (let r = 0; r < NR; r++) {
    const cx = X0 + c * GAP, cy = Y0 + r * GAP, rest = Math.atan2(north[1] - cy, north[0] - cx);
    items.push({ c, r, cx, cy, rest, sp: spring(rest, { k: 100 * value, c: 18 * Math.sqrt(value) }), drawn: NaN });
  }
  const magnet = { mag: true, cx: (MAG[0] + MAG[1]) / 2, cy: 0 };
  let magEl = null;
  for (const it of [...items, magnet].sort((p, q) => p.cx + p.cy - (q.cx + q.cy))) {
    if (it.mag) {
      magEl = solid(g);
      const [mr, mi] = rings(MAG[0], MAG[2], MAG[1], MAG[3], 1.6, 0.8);
      put(magEl, prism(P, front, mr, mi, 0, 6));
      mk("path", { class: "nf lo", d: seg(P(MAG[0] + 0.8, 0, 6), P(MAG[1] - 0.8, 0, 6)) }, magEl.g);
      continue;
    }
    const grp = mk("g", {}, g);
    it.case = solid(grp);
    put(it.case, prism(P, front, disc(it.cx, it.cy, RC), disc(it.cx, it.cy, RC - 1.3), 0, TOP));
    it.needle = mk("path", { class: "sil" }, grp);
    it.mid = mk("path", { class: "nf lo" }, grp);
  }

  function draw(it) {
    const a = it.sp.x;
    if (Math.abs(a - it.drawn) < 1e-4) return;
    it.drawn = a;
    const c = Math.cos(a), s = Math.sin(a), at = (l, w) => P(it.cx + l * c - w * s, it.cy + l * s + w * c, TOP);
    it.needle.setAttribute("d", poly([at(LN, 0), at(0, NW), at(-LS, 0), at(0, -NW)]));
    it.mid.setAttribute("d", seg(at(0, NW), at(0, -NW)));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const it of items) { if (stepS(it.sp, dt)) m = true; draw(it); }
    return m;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    let near = null, bd = Infinity;
    for (const it of items) {
      if (over) {
        const d = Math.hypot(over[0] - it.cx, over[1] - it.cy);
        if (d < bd) { bd = d; near = it; }
        const aim = d < 2 ? it.sp.t : Math.atan2(over[1] - it.cy, over[0] - it.cx);
        it.sp.t = it.sp.t + wrap(aim - it.sp.t);
      } else it.sp.t = it.sp.t + wrap(it.rest - it.sp.t);
    }
    for (const it of items) {
      const on = it === near;
      it.case.sil.classList.toggle("hi", on);
      it.needle.classList.toggle("hi", on);
    }
    magEl.sil.classList.toggle("hi", !near);
    read.textContent = near ? `compass ${near.c + 1}·${near.r + 1}` : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], TOP);
      const out = x < TB[0] - 12 || x > TB[2] + 12 || y < TB[1] - 12 || y > TB[3] + 12;
      over = out ? null : [clamp(x, TB[0], TB[2]), clamp(y, TB[1], TB[3])];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { for (const it of items) { it.sp.k = 100 * v; it.sp.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "compassneedles",
  means: "Twelve compasses on a lab bench beside a bar magnet: every needle swings to point at the pointer, and the compass under it is bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[165, 136], [238, 233], [162, 86], null],
  mount,
});
