/**
 * Monitors: a desk with three monitors on round stands, a keyboard and a
 * mouse in front. The pointer is what the desk looks at: every screen swivels
 * on its own spring toward the pointer, and the nearest one is bright, a few
 * dim lines on its face. At rest the screens stand a little askew, the middle
 * one lit. The slider is how quickly the screens follow.
 *
 * The pattern: a continuous aim (officechairs); the hit is on the desk's
 * plane, which never moves, read along the row.
 */
const {
  Cam, circ, clamp, facing, fit, open, prism, proj, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const Q = -Math.PI / 4, cQ = Math.cos(Q), sQ = Math.sin(Q);
const W = (u, v) => [u * cQ - v * sQ, u * sQ + v * cQ];
const turn = (ring, a, cx, cy) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
const N = 3, GAP = 42, MV = -12, TOP = 3, PZ0 = 15, PZ1 = 37, HW = 16, A0 = Math.PI / 4, REACH = 0.9;
const SKEW = [0.34, -0.06, -0.3], FAV = 1;
const LINES = [[31, 9], [27, 13], [23, 3], [19, 7]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.05);
  const ext = [];
  for (const [u, v] of [[-70, -34], [70, -34], [-70, 30], [70, 30]]) ext.push([...W(u, v), -28], [...W(u, v), TOP]);
  for (const u of [-GAP - HW, GAP + HW]) for (const v of [MV - HW, MV + HW]) ext.push([...W(u, v), PZ1]);
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const R = (r) => turn(r, Q, 0, 0);

  // the desk: four legs, then the top over them
  for (const [u, v] of [[-64, -28], [64, -28], [-64, 24], [64, 24]]) {
    const [x, y] = W(u, v), [r] = rings(x - 2, y - 2, x + 2, y + 2, 1.2, 0.5);
    put(solid(g), prism(P, front, r, null, -28, 0));
  }
  const [dr, di] = rings(-70, -34, 70, 30, 5, 1.6);
  put(solid(g), prism(P, front, R(dr), R(di), 0, TOP));

  const PANEL = rings(-1.6, -HW, 1.6, HW, 1.2, 0.6);
  const mons = [];
  for (let k = 0; k < N; k++) {
    const u = (k - 1) * GAP, [cx, cy] = W(u, MV), rest = A0 + SKEW[k];
    const grp = mk("g", {}, g);
    const base = circ(7, 32).map((q) => ({ ...q, u: q.u + cx, v: q.v + cy }));
    put(solid(grp), prism(P, front, base, circ(5.8, 32).map((q) => ({ ...q, u: q.u + cx, v: q.v + cy })), TOP, TOP + 1.6));
    put(solid(grp), prism(P, front, circ(1.7, 16).map((q) => ({ ...q, u: q.u + cx, v: q.v + cy })), null, TOP + 1.6, PZ0 + 4));
    const m = { k, u, cx, cy, rest, panel: solid(grp), drawn: NaN, lit: false };
    m.lines = mk("path", { class: "nf lo" }, grp);
    m.sp = spring(rest, { k: 100 * value, c: 18 * Math.sqrt(value) });
    mons.push(m);
  }
  // the keyboard and the mouse, nearest the viewer
  const [kr, ki] = rings(-25, 8, 25, 22, 2.4, 0.9);
  const kb = solid(g);
  put(kb, prism(P, front, R(kr), R(ki), TOP, TOP + 2));
  const rows = [12, 15, 18].map((v) => open([P(...W(-21, v), TOP + 2), P(...W(21, v), TOP + 2)])).join("");
  mk("path", { class: "nf lo", d: rows }, kb.g);
  const [mr, mi] = rings(33, 11, 40, 21, 3.4, 1);
  put(solid(g), prism(P, front, R(mr), R(mi), TOP, TOP + 2.6));

  function draw(m) {
    const a = m.sp.x;
    if (Math.abs(a - m.drawn) < 1e-4 && m.lit === m.panel.sil.classList.contains("hi")) return;
    m.drawn = a; m.lit = m.panel.sil.classList.contains("hi");
    put(m.panel, prism(P, front, turn(PANEL[0], a, m.cx, m.cy), turn(PANEL[1], a, m.cx, m.cy), PZ0, PZ1));
    const c = Math.cos(a), s = Math.sin(a), at = (v, z) => P(m.cx + 1.7 * c - v * s, m.cy + 1.7 * s + v * c, z);
    const show = m.lit && front({ u: 0, v: 0, nu: c, nv: s });
    m.lines.setAttribute("d", show ? LINES.map(([z, e]) => open([at(-12, z), at(e, z)])).join("") : "");
  }

  const B = register(stage, (dt) => {
    let mv = false;
    for (const m of mons) { if (stepS(m.sp, dt)) mv = true; draw(m); }
    return mv;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    let near = null, bd = Infinity;
    for (const m of mons) {
      if (over === null) { m.sp.t = m.rest; continue; }
      const d = Math.abs(over - m.u);
      if (d < bd) { bd = d; near = m; }
      m.sp.t = clamp(Q + Math.atan2(46, over - m.u), A0 - REACH, A0 + REACH);
    }
    for (const m of mons) { m.panel.sil.classList.toggle("hi", near ? m === near : m.k === FAV); m.drawn = NaN; }
    read.textContent = near ? "screen " + (near.k + 1) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [x, y] = unproj(C, sx, sy, TOP), u = x * cQ + y * sQ, v = -x * sQ + y * cQ;
      over = Math.abs(u) < 84 && v > -90 && v < 44 ? u : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { for (const m of mons) { m.sp.k = 100 * v; m.sp.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "monitors",
  means: "Three monitors on a desk: every screen swivels toward the pointer, and the nearest one lights up with a few lines on it.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[114, 95], [200, 110], [286, 110], null],
  mount,
});
