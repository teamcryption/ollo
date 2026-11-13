/**
 * VR headsets: three headsets on display stands, each a rounded visor with
 * two tracking lenses on its front and a head strap looped behind, held up
 * on a round base and a post. The pointer is what they look at: every
 * headset turns on its own spring to face it, and the one nearest it is
 * bright. At rest they face the reader, each a little askew, one bright.
 * The slider is how quickly they follow (a stiffer or softer spring).
 *
 * The pattern: a continuous aim (a spring per headset's angle); the hit is
 * on the visors' rest plane, which never moves.
 */
const {
  Cam, circ, facing, fit, open, poly, prism, proj, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const POST = 26, VZ = 30, VH = 11, FAV = 1;
const SPOTS = [[-34, 30, -22], [0, 0, 8], [34, -30, 28]];
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const turn = (ring, a, cx, cy) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.6);
  const ext = [];
  for (const [x, y] of SPOTS) for (const [dx, dy] of [[-16, -16], [16, 16], [-16, 16], [16, -16]]) ext.push([x + dx, y + dy, 0], [x + dx, y + dy, VZ + VH]);
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // local footprints, facing +x: the visor, and the strap's loop behind it
  const VIS = rings(-4, -11, 5, 11, 4, 1.2);
  const STRAP = [];
  for (let k = 0; k <= 24; k++) { const t = Math.PI / 2 + (k / 24) * Math.PI; STRAP.push({ u: -4 + 14 * Math.cos(t), v: 10 * Math.sin(t) }); }
  const lens = circ(1.6, 12);

  const sets = SPOTS.map(([cx, cy, sk], k) => {
    const rest = Math.PI / 4 + sk * (Math.PI / 180);
    return { k, cx, cy, rest, sp: spring(rest, { k: 100 * value, c: 18 * Math.sqrt(value) }), drawn: NaN };
  }).sort((p, q) => p.cx + p.cy - (q.cx + q.cy));

  for (const s of sets) {
    const grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, ...rings(s.cx - 9, s.cy - 9, s.cx + 9, s.cy + 9, 9, 1.2), 0, 2));
    put(solid(grp), prism(P, front, disc(s.cx, s.cy, 1.8, 16), null, 2, POST));
    put(solid(grp), prism(P, front, disc(s.cx, s.cy, 4, 24), null, POST, VZ));
    s.strap = mk("path", { class: "nf sil" }, grp);
    s.vis = solid(grp);
    s.lenses = mk("path", { class: "nf lo" }, s.vis.g);
    s.strapFirst = null;
  }

  function draw(s) {
    const a = s.sp.x;
    if (Math.abs(a - s.drawn) < 1e-4) return;
    s.drawn = a;
    const T = (r) => turn(r, a, s.cx, s.cy);
    put(s.vis, prism(P, front, T(VIS[0]), T(VIS[1]), VZ, VZ + VH));
    s.strap.setAttribute("d", open(T(STRAP).map((q) => P(q.u, q.v, VZ + 6))));
    const c = Math.cos(a), sn = Math.sin(a);
    // two lenses on the front face, only while that face is toward the reader
    const faceOn = c + sn > 0;
    s.lenses.setAttribute("d", faceOn ? [-5.5, 5.5].map((o) => poly(lens.map((q) => P(s.cx + 5 * c - (o + q.u) * sn, s.cy + 5 * sn + (o + q.u) * c, VZ + 6 + q.v)))).join("") : "");
    // the strap loops behind the visor: paint it first while it is on the far side
    const strapFirst = c + sn > 0;
    if (strapFirst !== s.strapFirst) {
      s.strapFirst = strapFirst;
      if (strapFirst) s.vis.g.before(s.strap); else s.vis.g.after(s.strap);
    }
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const s of sets) { if (stepS(s.sp, dt)) m = true; draw(s); }
    return m;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    let near = null, bd = Infinity;
    for (const s of sets) {
      if (over) {
        const d = Math.hypot(over[0] - s.cx, over[1] - s.cy);
        if (d < bd) { bd = d; near = s; }
        const aim = d < 12 ? Math.PI / 4 : Math.atan2(over[1] - s.cy, over[0] - s.cx);
        s.sp.t = s.sp.t + wrap(aim - s.sp.t);
      } else s.sp.t = s.sp.t + wrap(s.rest - s.sp.t);
    }
    for (const s of sets) s.vis.sil.classList.toggle("hi", over ? s === near : s.k === FAV);
    read.textContent = near ? "set " + (near.k + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], VZ + 6);
      over = Math.hypot(x, y) > 80 ? null : [x, y];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { for (const s of sets) { s.sp.k = 100 * v; s.sp.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "vrheadsets",
  means: "Three VR headsets on display stands: each turns on a spring to face the pointer, and the nearest one is bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[82, 116], [200, 120], [318, 124], null],
  mount,
});
