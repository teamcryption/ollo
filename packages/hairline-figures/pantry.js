/**
 * Pull-out pantry: a tall narrow cabinet whose shelf unit slides out on its
 * runners, four shelves of jars behind a tall front. The pointer's place on
 * the floor in front of it sets how far the unit is drawn out; a spring
 * follows. At rest it stands a little open, its front bright. The slider is
 * the full pull.
 *
 * The pattern: one unit sliding out of a case (slide).
 */
const {
  Cam, clamp, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 34, D = 60, H = 118, ZS = [10, 38, 66, 94], REST = 16;
const disc = (x, y, r) => circ(r, 16).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let pull = value;
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[0, 0, 0], [W, 0, H], [W, D + 60, 0], [0, D + 60, H], [W, D, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(0, 0, W, D, 2, 1);
  put(solid(g), prism(P, front, cr, ci, 0, H));
  const unit = mk("g", {}, g);
  const shelves = ZS.map(() => ({ s: solid(unit), jars: [0, 1].map(() => solid(unit)) }));
  const face = solid(unit), knob = mk("path", { class: "nf" }, unit);
  face.sil.classList.add("hi");
  const [wr, wi] = rings(W - 2, 0, W, D, 0.8, 0.3);
  put(solid(g), prism(P, front, wr, wi, 0, H));
  const [tr, ti] = rings(0, 0, W, D, 2, 1.4);
  put(solid(g), prism(P, front, tr, ti, H - 4, H));
  const sp = spring(REST);
  let last = NaN;

  function draw(s) {
    if (s === last) return;
    last = s;
    shelves.forEach((sh, i) => {
      const z = ZS[i];
      const [a, b] = rings(3, s + 2, W - 3, s + D - 4, 1.5, 1);
      put(sh.s, prism(P, front, a, b, z, z + 2));
      sh.jars.forEach((j, k) => {
        const x = 11 + k * 12, y = s + 18 + ((i + k) % 2) * 16, h = 8 + ((i * 3 + k * 5) % 4) * 3;
        put(j, prism(P, front, disc(x, y, 4.5), disc(x, y, 3.2), z + 2, z + 2 + h));
      });
    });
    const [fa, fb] = rings(2, s + D - 3, W - 2, s + D, 1.2, 0.8);
    put(face, prism(P, front, fa, fb, 3, H - 6));
    knob.setAttribute("d", poly(hull(ringAt(P, disc(W / 2, s + D + 1, 1.6), H - 26).concat(ringAt(P, disc(W / 2, s + D + 3, 1.6), H - 26)))));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  function move(p) {
    const [x, y] = unproj(C, p[0], p[1], 0);
    const inside = x > -30 && x < W + 30 && y > 0 && y < D + 90;
    sp.t = inside ? clamp(((y - D * 0.5) / 70) * pull, 0, pull) : REST;
    read.textContent = inside ? Math.round((sp.t / pull) * 100) + "%" : "rest";
    B.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  draw(REST);
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { pull = v; }, destroy: bag.dispose };
}

hairline({
  name: "pantry",
  means: "A tall pull-out pantry: the nearer the pointer comes on the floor, the further its unit of jar shelves slides out of the case.",
  rules: [1, 3, 5, 6],
  range: [30, 56, 56],
  tour: [[225, 234], [175, 260], [124, 285], null],
  mount,
});
