/**
 * Vial tray: a lab rack tray holding twelve small vaccine vials in four
 * columns and three rows, each a glass body with a shoulder line and a
 * crimped cap. The pointer works as a field: vials near it rise out of the
 * tray, each on its own spring, the one under it highest and bright. At rest
 * a few vials sit proud, one picked out bright. The slider is the reach.
 *
 * The pattern: a continuous field (terrain) over a grid; the hit is on the
 * plane through the vials' resting middles, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, open, prism, proj, rings, ringAt, run, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NX = 4, NY = 3, PIT = 14, R = 4.4, H = 18, CR = 4.9, CH = 5, LIFT = 14, TZ = 3;
const X1 = NX * PIT, Y1 = NY * PIT;
const REST = [0, 2, 0, 0, 0, 0, 5, 0, 3, 0, 0, 1], FAV = 6;
const falloff = (u) => (u <= 0 ? 1 : u <= 0.42 ? 1 - (u / 0.42) * 0.69 : u <= 1 ? 0.31 - ((u - 0.42) / 0.58) * 0.31 : 0);
const at = (ring, cx, cy) => ring.map((q) => ({ ...q, u: q.u + cx, v: q.v + cy }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value * PIT, over = null;
  const C = Cam(45, 0.5, 2.95);
  fit(C, [[-3, -3, -2], [X1 + 3, Y1 + 3, -2], [X1 + 3, -3, -2], [-3, Y1 + 3, -2], [PIT / 2, PIT / 2, TZ + H + CH + LIFT], [X1 - PIT / 2, PIT / 2, TZ + H + CH + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the tray: a shallow rounded base with a raised lip line
  const [tr, ti] = rings(-3, -3, X1 + 3, Y1 + 3, 4, 1.6);
  const tray = solid(g);
  put(tray, prism(P, front, tr, ti, -2, TZ));

  // vials far to near: body, then cap, per vial in one group
  const vials = [];
  for (let s = 0; s <= NX + NY - 2; s++) for (let i = 0; i < NX; i++) {
    const j = s - i; if (j < 0 || j >= NY) continue;
    const k = j * NX + i, cx = PIT / 2 + i * PIT, cy = PIT / 2 + j * PIT;
    const grp = mk("g", {}, g), body = solid(grp), sh = mk("path", { class: "nf lo" }, grp), cap = solid(grp);
    vials[k] = { k, i, j, cx, cy, body, sh, cap, rest: REST[k], sp: spring(REST[k], { eps: 0.02 }), drawn: NaN,
      br: at(circ(R, 24), cx, cy), bi: at(circ(R - 0.9, 24), cx, cy), cr: at(circ(CR, 24), cx, cy), ci: at(circ(CR - 0.8, 24), cx, cy), sr: at(circ(R, 24), cx, cy) };
  }

  function draw(v) {
    const z = clamp(v.sp.x, 0, LIFT);
    if (z === v.drawn) return;
    v.drawn = z;
    const z0 = TZ + z;
    put(v.body, prism(P, front, v.br, v.bi, z0, z0 + H));
    v.sh.setAttribute("d", open(ringAt(P, run(v.sr, front), z0 + H - 4.5)));
    put(v.cap, prism(P, front, v.cr, v.ci, z0 + H, z0 + H + CH));
  }
  const B = register(stage, (dt) => {
    let m = false;
    for (const v of vials) { if (stepS(v.sp, dt)) m = true; draw(v); }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    let hit = null;
    if (over) {
      const i = clamp(Math.floor(over[0] / PIT), 0, NX - 1), j = clamp(Math.floor(over[1] / PIT), 0, NY - 1);
      hit = vials[j * NX + i];
    }
    for (const v of vials) {
      if (!over) v.sp.t = v.rest;
      else v.sp.t = v === hit ? LIFT : LIFT * 0.7 * falloff(Math.hypot(v.cx - over[0], v.cy - over[1]) / RAD);
      const on = over ? v === hit : v.k === FAV;
      v.body.sil.classList.toggle("hi", on); v.cap.sil.classList.toggle("hi", on);
    }
    read.textContent = hit ? "vial " + (hit.i + 1) + "\u00b7" + (hit.j + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], TZ + H / 2);
      over = x > -3 && x < X1 + 3 && y > -3 && y < Y1 + 3 ? [clamp(x, 0, X1 - 0.01), clamp(y, 0, Y1 - 0.01)] : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { RAD = v * PIT; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "vialtray",
  means: "A rack tray of twelve capped vaccine vials: the vials near the pointer rise, the one under it highest.",
  rules: [1, 3, 5, 9],
  range: [1, 2, 3.5],
  tour: [[160, 160], [185, 170], [225, 195], null],
  mount,
});
