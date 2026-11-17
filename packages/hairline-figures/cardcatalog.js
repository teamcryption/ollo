/**
 * Card catalogue: a library cabinet of six drawers, two across and three
 * high, each with a label plate. The pointer picks a drawer on the cabinet's
 * face and that drawer slides out, long, showing its sides and the cards
 * standing in it; the rest slide home. At rest one drawer stands half open,
 * bright. The slider is how far the drawer comes out.
 */
const {
  Cam, fit, prism, proj, rings, seg, clamp, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid, facing,
} = HL;

const X = 14, Y = 22, H = 60, OUT = 30, FAV = 2;
const REST = [2, 3.5, 12, 1.5, 3, 2];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.8);
  let out = OUT * value;
  fit(C, [[-X, -Y, H + 3], [X, Y, 0], [X + OUT * 1.2, -Y, H], [X + OUT * 1.2, Y, 0], [-X, Y, 0]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-X, -Y, X, Y, 1.5, 1);
  put(solid(g), prism(P, front, cr, ci, 0, H));
  const [tr, ti] = rings(-X - 2, -Y - 2, X + 2, Y + 2, 1.5, 1.2);
  put(solid(g), prism(P, front, tr, ti, H, H + 3));
  const dr = [];
  for (const row of [0, 1, 2]) for (const col of [0, 1]) {
    const i = row * 2 + col, y0 = col ? 1.5 : -Y + 2, y1 = col ? Y - 2 : -1.5, z0 = 4 + row * 18, z1 = z0 + 15;
    dr.push({ i, row, col, y0, y1, z0, z1, tw: tween(REST[i]), drawn: NaN });
  }
  // lower rows first, so a drawer out from above covers the ones beneath it
  for (const d of dr) {
    d.g = mk("g", {}, g);
    d.s = solid(d.g);
    d.lab = mk("path", { class: "nf sil", d: "" }, d.g);
  }
  function draw(d, now) {
    const o = tval(d.tw, now);
    if (Math.abs(o - d.drawn) < 1e-3) return;
    d.drawn = o;
    const [r, inn] = rings(X - 0.5, d.y0, X + o, d.y1, 1, 0.8);
    put(d.s, prism(P, front, r, inn, d.z0, d.z1));
    const fx = X + o, ym = (d.y0 + d.y1) / 2, zm = (d.z0 + d.z1) / 2;
    const cards = [];
    if (o > 6) for (let k = 1; k * 4 < o - 2; k++) cards.push(seg(P(fx - k * 4, d.y0 + 2, d.z1 + 2), P(fx - k * 4, d.y1 - 2, d.z1 + 2)));
    d.lab.setAttribute("d", seg(P(fx + 0.1, ym - 4, zm + 2), P(fx + 0.1, ym + 4, zm + 2)) + seg(P(fx + 0.1, ym - 2, zm - 3), P(fx + 0.1, ym + 2, zm - 3)) + cards.join(""));
  }
  const B = register(stage, (dt, now) => {
    let m = false;
    for (const d of dr) { draw(d, now); if (!tdone(d.tw, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);
  g.append(...[...dr].sort((a, b) => a.row - b.row || a.col - b.col).map((d) => d.g));

  const o = P(X, 0, 0), ey = P(X, 1, 0), ez = P(X, 0, 1);
  const ay = [ey[0] - o[0], ey[1] - o[1]], az = [ez[0] - o[0], ez[1] - o[1]], det = ay[0] * az[1] - ay[1] * az[0];
  let pick = null;
  function retarget() {
    const now = performance.now();
    for (const d of dr) {
      const t = pick === null ? REST[d.i] : d === pick ? out : 1.5;
      tset(d.tw, t, now, pick ? Math.abs(d.i - pick.i) * 40 : 0);
      d.s.sil.classList.toggle("hi", pick ? d === pick : d.i === FAV);
    }
    read.textContent = pick ? "drawer " + "ABCDEF"[pick.i] : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const sx = p[0] - o[0], sy = p[1] - o[1];
      const y = (sx * az[1] - sy * az[0]) / det, z = (ay[0] * sy - ay[1] * sx) / det;
      pick = Math.abs(y) < Y + 4 && z > 0 && z < H + 6 ? dr[clamp(Math.floor((z - 4) / 18), 0, 2) * 2 + (y > 0 ? 1 : 0)] : null;
      retarget();
    },
    leave: () => { pick = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { out = OUT * v; retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "cardcatalog",
  means: "A card catalogue of six drawers: the drawer under the pointer slides out long to show its cards, and it is bright.",
  rules: [1, 2, 3, 5],
  range: [0.5, 1, 1.2],
  tour: [[214, 108], [170, 219], [190, 150], null],
  mount,
});
