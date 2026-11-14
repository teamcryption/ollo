/**
 * Treadmill: a long deck between two uprights that carry the console. The
 * pointer walks along the deck: the nearer it stands to the console, the
 * higher the deck's front end rises, tilting the belt into an incline. At
 * rest the deck sits at a slight incline and the console is bright.
 *
 * The pattern: one continuous value read from the ground (terrain).
 */
const {
  Cam, clamp, fit, facing, hull, open, poly, prism, proj, rings, run, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 130, W = 44, MAX = 22, REST = 5, PH = 62;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.55);
  fit(C, [[-8, -10, 0], [L, W + 10, 0], [L, -10, 0], [-8, W + 10, 0], [-8, -10, PH + 8], [-8, W + 10, PH + 8], [0, W / 2, MAX + 10]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // far upright, then the deck, then the near upright, then the console
  const post = (y, parent) => { const [r, i] = rings(-2, y - 3, 4, y + 3, 3, 1); put(solid(parent), prism(P, front, r, i, 0, PH)); };
  post(-6, g);
  const deck = solid(g);
  const belt = mk("path", { class: "nf lo" }, g);
  post(W + 6, g);
  const con = solid(g);
  const [cr, ci] = rings(-8, -10, 8, W + 10, 4, 1.5);
  put(con, prism(P, front, cr, ci, PH, PH + 7));
  const [kr, ki] = rings(-6, W / 2 - 10, 2, W / 2 + 10, 3, 1);
  put(solid(g), prism(P, front, kr, ki, PH + 7, PH + 10));

  const [dr, di] = rings(0, -2, L, W + 2, 6, 2);
  const zAt = (u, z, h) => z + h * (1 - u / L);
  const at = (ring, z, h) => ring.map((q) => P(q.u, q.v, zAt(q.u, z, h)));
  let last = NaN;
  function draw(h) {
    h = Math.round(h * 20) / 20;
    if (h === last) return;
    last = h;
    deck.sil.setAttribute("d", poly(hull(at(dr, 0, h).concat(at(dr, 9, h)))));
    deck.cr.setAttribute("d", open(at(run(di, front), 9, h)));
    let d = "";
    for (let x = 14; x < L - 6; x += 14) d += seg(P(x, 4, zAt(x, 9, h)), P(x, W - 4, zAt(x, 9, h)));
    belt.setAttribute("d", d);
  }

  const sp = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  let on = null;
  function aim(p) {
    let h = REST, hit = false;
    if (p) {
      const [wx, wy] = unproj(C, p[0], p[1], 0);
      hit = wx > -10 && wx < L + 10 && wy > -16 && wy < W + 16;
      if (hit) h = clamp((L - wx) / L, 0, 1) * max;
    }
    sp.t = h;
    if (hit !== on) { on = hit; deck.sil.classList.toggle("hi", hit); con.sil.classList.toggle("hi", !hit); }
    read.textContent = hit ? Math.round(Math.atan2(h, L) * 180 / Math.PI) + "°" : "rest";
    B.wake();
  }
  draw(REST);
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "treadmill",
  means: "A treadmill deck between two uprights: the closer the pointer walks to the console, the steeper the belt inclines.",
  rules: [1, 3, 5, 8],
  range: [8, 22, 30],
  tour: [[144, 185], [199, 212], [265, 245], null],
  mount,
});
