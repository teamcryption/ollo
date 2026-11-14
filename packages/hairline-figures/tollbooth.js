/**
 * Toll booth: three islands across a road, each with a booth under a flat
 * roof, and a barrier arm swinging from it across its lane to a rest post.
 * The pointer picks a lane on the road: its arm swings up, the others settle
 * down, staggered from it. At rest the arms sit at uneven angles, the first
 * one half open, bright. The slider is the stagger.
 *
 * The pattern: one of many along a row; the hit is the pointer on the
 * ground plane, the lane by world x.
 */
const {
  Cam, clamp, facing, fit, hull, poly, prism, proj, rings, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, GAP = 32, L = 22, PZ = 12, AY = 10, UP = 1.35;
const REST = [0.6, 0.1, 0], FAV = 0;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.95);
  const xe = (N - 1) * GAP + 32;
  fit(C, [[-2, -14, 0], [xe, 16, 0], [-2, 16, 0], [xe, -14, 0], [8, AY, PZ + L], [(N - 1) * GAP + 8, AY, PZ + L], [0, -8, 24]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg), ga = mk("g", {}, svg);
  const box = (parent, x0, y0, x1, y1, r, b, z0, z1) => {
    const s = solid(parent), [o, i] = rings(x0, y0, x1, y1, r, b);
    put(s, prism(P, front, o, i, z0, z1));
    return s;
  };

  const arms = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * GAP;
    box(g, x0, -14, x0 + 8, 16, 3, 1, 0, 2);
    box(g, x0 + 1, -6, x0 + 7, 4, 1.5, 0.8, 2, 22);
    const win = solid(g);
    mk("path", { class: "nf lo", d: seg(P(x0 + 7, -4, 12), P(x0 + 7, -4, 19)) + seg(P(x0 + 7, -4, 19), P(x0 + 7, 2, 19)) + seg(P(x0 + 7, 2, 19), P(x0 + 7, 2, 12)) + seg(P(x0 + 7, 2, 12), P(x0 + 7, -4, 12)) }, win.g);
    const roof = box(g, x0 - 1, -8, x0 + 9, 6, 1.5, 0.8, 22, 24.5);
    box(g, x0 + 6, AY - 2, x0 + 10, AY + 2, 1.4, 0.6, 2, PZ + 2);
    box(g, x0 + 29, AY - 1.5, x0 + 32, AY + 1.5, 1.2, 0.5, 0, PZ - 1.4);
    const grp = mk("g", {}, ga);
    arms.push({ k, x: x0 + 8, sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp), a: tween(REST[k]), last: NaN });
  }

  // the arm: a capsule, two rounded ends hulled, swinging in the x–z plane
  function draw(s, a) {
    if (a === s.last) return;
    s.last = a;
    const dx = Math.cos(a), dz = Math.sin(a), pts = [];
    [0, L].forEach((t) => {
      for (let i = 0; i < 12; i++) {
        const q = (i / 12) * Math.PI * 2, ny = 1.9 * Math.cos(q), nn = 1.9 * Math.sin(q);
        pts.push(P(s.x + t * dx - nn * dz, AY + ny, PZ + t * dz + nn * dx));
      }
    });
    s.sil.setAttribute("d", poly(hull(pts)));
    s.cr.setAttribute("d", seg(P(s.x + 1.5 * dx - 1 * dz, AY - 0.6, PZ + 1.5 * dz + 1 * dx), P(s.x + (L - 1.5) * dx - 1 * dz, AY - 0.6, PZ + (L - 1.5) * dz + 1 * dx)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    arms.forEach((s) => { draw(s, tval(s.a, now)); if (!tdone(s.a, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: the pointer on the ground, the lane by world x
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (x < -4 || x > xe + 2 || y < -22 || y > 30) return -1;
    return clamp(Math.floor((x - 4) / GAP), 0, N - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    arms.forEach((s, k) => {
      const t = a < 0 ? REST[k] : k === a ? UP : 0.05 * Math.abs(k - a);
      tset(s.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "lane " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "tollbooth",
  means: "A row of toll booths: the barrier arm of the lane under the pointer swings up, the others settle down after it.",
  rules: [1, 2, 5, 6],
  range: [0, 60, 120],
  tour: [[137, 167], [204, 201], [271, 234], null],
  mount,
});
