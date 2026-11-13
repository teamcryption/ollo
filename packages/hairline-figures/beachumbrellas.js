/**
 * Beach umbrellas: four umbrellas on a strip of sand, each on its pole beside
 * a sun lounger with a raised backrest, the water's edge running along the
 * near side. The pointer is the sun: every canopy tilts on its own spring to
 * face it, leaning further the nearer it is, and the nearest is bright. At
 * rest the canopies lean each their own way, one bright. The slider is how
 * quickly they follow (a stiffer or softer spring).
 *
 * The pattern: a continuous aim (terrain's spring, two tilt components per
 * canopy); the hit is on the plane of the canopy hubs, which never moves.
 */
const {
  Cam, clamp, fillet, fit, facing, hull, open, poly, prism, proj, rad, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const SPOTS = [[0, 0], [48, -10], [96, 4], [144, -6]], HT = 38, RC = 20, NS = 8, MAXT = rad(28), FAV = 2;
const REST = [[-0.25, 0.2], [0.15, 0.3], [0.3, -0.1], [-0.1, -0.3]];
const rnd = (pts, r) => poly(fillet(pts, pts.map(() => r), 3));
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.5);
  const ext = [[-26, -30, 0], [170, -30, 0], [-26, 48, 0], [170, 48, 0]];
  for (const [x, y] of SPOTS) ext.push([x - RC - 6, y - RC - 6, HT + 4], [x + RC + 6, y + RC + 6, HT - 8]);
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const O = P(0, 0, 0), ax = [0, 1, 2].map((i) => { const q = P(i === 0, i === 1, i === 2); return [q[0] - O[0], q[1] - O[1]]; });
  let view = cross(ax.map((a) => a[0]), ax.map((a) => a[1]));
  if (view[2] < 0) view = view.map((v) => -v);

  const [sr, si] = rings(-26, -30, 170, 48, 6, 2);
  put(solid(g), prism(P, front, sr, si, 0, 2));
  const shore = [];
  for (let x = -18; x <= 162; x += 6) shore.push(P(x, 38 + 2.2 * Math.sin(x / 9), 2));
  mk("path", { d: open(shore), class: "nf lo" }, g);

  const ums = SPOTS.map(([cx, cy], k) => {
    const grp = mk("g", {}, g);
    // the lounger: a low frame, its backrest raised at the head
    const [lr, li] = rings(cx - 6, cy - 4, cx + 6, cy + 24, 2, 1);
    put(solid(grp), prism(P, front, lr, li, 0, 5));
    const bk = [[cx - 5.5, cy + 4, 5], [cx + 5.5, cy + 4, 5], [cx + 5.5, cy - 4, 15], [cx - 5.5, cy - 4, 15]];
    const bp = bk.map((p) => P(...p)).concat(bk.map((p) => P(p[0], p[1] - 1.2, p[2] - 0.6)));
    mk("path", { d: rnd(hull(bp), 1), class: "sil" }, grp);
    mk("path", { d: seg(P(cx - 4.5, cy + 3.4, 5.6), P(cx + 4.5, cy + 3.4, 5.6)), class: "nf lo" }, grp);
    const hub = [cx + 10, cy - 2, HT];
    put(solid(grp), prism(P, front, rings(hub[0] - 1, hub[1] - 1, hub[0] + 1, hub[1] + 1, 1, 0.4)[0], null, 0, HT));
    const r0 = REST[k];
    return {
      k, hub, grp,
      sil: mk("path", { class: "sil" }, grp), ribs: mk("path", { class: "nf lo" }, grp),
      tx: spring(r0[0], { k: 100 * value, c: 18 * Math.sqrt(value) }), ty: spring(r0[1], { k: 100 * value, c: 18 * Math.sqrt(value) }), drawn: "",
    };
  });

  function draw(u) {
    const tx = u.tx.x, ty = u.ty.x, key = tx.toFixed(4) + ty.toFixed(4);
    if (key === u.drawn) return;
    u.drawn = key;
    const a = Math.min(Math.hypot(tx, ty), MAXT), kx = a ? -ty / Math.hypot(tx, ty) : 1, ky = a ? tx / Math.hypot(tx, ty) : 0;
    const ca = Math.cos(a), sa = Math.sin(a), K = [kx, ky, 0];
    const R = (v) => { const kv = cross(K, v), d = dot(K, v); return v.map((c, i) => c * ca + kv[i] * sa + K[i] * d * (1 - ca) + u.hub[i]); };
    const apex = R([0, 0, 3]), rim = [];
    for (let i = 0; i < NS; i++) { const b = (i / NS) * Math.PI * 2 + 0.2; rim.push(R([RC * Math.cos(b), RC * Math.sin(b), -6])); }
    const sp = [apex, ...rim].map((p) => P(...p));
    u.sil.setAttribute("d", rnd(hull(sp), 1.5));
    const sub = (p, q) => p.map((v, i) => v - q[i]);
    const vis = rim.map((v, i) => dot(cross(sub(v, apex), sub(rim[(i + 1) % NS], apex)), view) > 0);
    let d = "";
    for (let i = 0; i < NS; i++) if (vis[i] || vis[(i + NS - 1) % NS]) d += seg(sp[0], sp[i + 1]);
    u.ribs.setAttribute("d", d);
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const u of ums) { if (stepS(u.tx, dt)) m = true; if (stepS(u.ty, dt)) m = true; draw(u); }
    return m;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    let near = null, bd = Infinity;
    for (const u of ums) {
      let t = REST[u.k];
      if (over) {
        const dx = over[0] - u.hub[0], dy = over[1] - u.hub[1], dd = Math.hypot(dx, dy);
        if (dd < bd) { bd = dd; near = u; }
        const m = MAXT * (0.45 + 0.55 * clamp(1 - dd / 120, 0, 1));
        t = dd > 2 ? [(dx / dd) * m, (dy / dd) * m] : [u.tx.t, u.ty.t];
      }
      u.tx.t = t[0]; u.ty.t = t[1];
    }
    for (const u of ums) u.sil.classList.toggle("hi", over ? u === near : u.k === FAV);
    read.textContent = near ? "umbrella " + (near.k + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], HT);
      over = Math.hypot(x - 82, y + 3) > 150 ? null : [x, y];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { for (const u of ums) for (const sp of [u.tx, u.ty]) { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "beachumbrellas",
  means: "Four beach umbrellas over sun loungers: every canopy tilts on a spring to face the pointer like the sun, and the nearest is bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[150, 110], [243, 157], [292, 201], null],
  mount,
});
