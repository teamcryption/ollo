/**
 * Video wall: nine thin screens stacked three by three on a plinth. The
 * pointer picks a screen by its rest face; that screen slides out of the
 * wall toward the viewer, and the screens around it ease out a little,
 * staggered from it. At rest one screen stands proud, bright. The slider is
 * the stagger.
 *
 * The pattern: grid on a face plane, pick by rest centre.
 */
const {
  Cam, fit, facing, fillet, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const COLS = 3, ROWS = 3, W = 34, H = 22, D = 4, G = 2, ZB = 5, SL = 14, FAV = 4;
const X1 = COLS * W + (COLS - 1) * G;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  const ZT = ZB + ROWS * H + (ROWS - 1) * G;
  fit(C, [[-6, -8, 0], [X1 + 6, D + SL + 4, 0], [X1 + 6, -8, 0], [-6, D + SL + 4, 0], [0, 0, ZT], [X1, D + SL, ZT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-6, -8, X1 + 6, D + 12, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, ZB));

  const items = [];
  for (let r = 0; r < ROWS; r++) {
    const row = mk("g", {}, g);
    for (let c = 0; c < COLS; c++) {
      const k = r * COLS + c, x0 = c * (W + G), z0 = ZB + r * (H + G);
      const grp = mk("g", {}, row), s = solid(grp);
      s.sil.classList.add("sil");
      const face = mk("path", { class: "nf lo" }, grp);
      items.push({ k, r, c, x0, z0, row, grp, s, face, y: tween(k === FAV ? SL * 0.6 : 0), last: NaN });
    }
  }

  function draw(it, y) {
    if (y === it.last) return;
    it.last = y;
    const [ring, inner] = rings(it.x0, y, it.x0 + W, y + D, 1.6, 0.8);
    put(it.s, prism(P, front, ring, inner, it.z0, it.z0 + H));
    const fy = y + D, q = [[it.x0 + 2.5, it.z0 + 2.5], [it.x0 + W - 2.5, it.z0 + 2.5], [it.x0 + W - 2.5, it.z0 + H - 2.5], [it.x0 + 2.5, it.z0 + H - 2.5]];
    it.face.setAttribute("d", poly(fillet(q.map(([x, z]) => P(x, fy, z)), [2, 2, 2, 2])));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.y, now)); if (!tdone(it.y, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x0 + W / 2, D, it.z0 + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.hypot(m[0] - sx, (m[1] - sy) * 1.2); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const on = a < 0 ? FAV : a, A = items[on];
    items.forEach((it) => {
      const dd = Math.max(Math.abs(it.r - A.r), Math.abs(it.c - A.c));
      const y = a < 0 ? (it.k === FAV ? SL * 0.6 : 0) : dd === 0 ? SL : dd === 1 ? 3 : 0;
      const F = from >= 0 ? items[from] : A;
      tset(it.y, y, now, Math.max(Math.abs(it.r - F.r), Math.abs(it.c - F.c)) * stag);
      it.s.sil.classList.toggle("hi", it.k === on);
    });
    A.row.appendChild(A.grp);
    read.textContent = a < 0 ? "rest" : "scr " + (A.c + 1) + "·" + (A.r + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "videowall",
  means: "Nine screens stacked on a plinth: the screen under the pointer slides out of the wall, and the ones around it ease forward.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[159, 170], [204, 156], [248, 142], null],
  mount,
});
