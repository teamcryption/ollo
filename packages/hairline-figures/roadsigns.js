/**
 * Road signs: a street corner, a kerbed pavement round a bend, with four sign
 * posts carrying plain plates of four shapes: a circle, a triangle, a square
 * and an octagon. The pointer is what the corner turns to: every plate turns
 * on its post, on its own spring, to face it, and the nearest is bright. At
 * rest the plates face the road at uneven angles, one bright. The slider is
 * how quickly they follow.
 *
 * The pattern: a continuous aim per part (officechairs); the pick is the
 * plate whose fixed centre on screen is nearest the pointer.
 */
const {
  Cam, fillet, fit, poly, prism, proj, rings, circ, facing, unproj, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const POSTS = [[-30, -6, 44], [-6, -26, 52], [18, -8, 40], [-8, 20, 48]];
const SHAPE = ["circle", "triangle", "square", "octagon"], REST = [40, 70, 20, 55], FAV = 1, PR = 9;
const outline = (s) => {
  const n = s === "circle" ? 24 : s === "triangle" ? 3 : s === "square" ? 4 : 8;
  const off = s === "triangle" ? Math.PI / 2 : s === "square" ? Math.PI / 4 : s === "octagon" ? Math.PI / 8 : 0;
  const R = s === "triangle" ? PR * 1.25 : s === "square" ? PR * 1.15 : PR;
  const pts = [];
  for (let i = 0; i < n; i++) { const a = off + (i / n) * Math.PI * 2; pts.push([R * Math.cos(a), R * Math.sin(a)]); }
  return s === "circle" ? pts : fillet(pts, pts.map(() => 1.2), 3);
};
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-44, -40, 0], [32, -40, 0], [-44, 34, 0], [32, 34, 0], [-6, -26, 52 + PR + 2], [-30, -6, 44 + PR + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the corner: a pavement slab with a kerb crease, the roads beyond it left open
  const [kr, ki] = rings(-44, -40, 32, 34, 14, 3);
  put(solid(g), prism(P, front, kr, ki, 0, 2.5));

  const signs = POSTS.map(([x, y, h], k) => ({ k, x, y, h, shape: outline(SHAPE[k]), rest: REST[k] * Math.PI / 180 }))
    .sort((a, b) => a.x + a.y - (b.x + b.y));
  for (const s of signs) {
    s.grp = mk("g", {}, g);
    place(flatDot(s.grp, C, 1.6, "dot off"), P(s.x, s.y, 2.5));
    s.post = solid(s.grp);
    put(s.post, prism(P, front, circ(0.9, 12).map((q) => ({ ...q, u: q.u + s.x, v: q.v + s.y })), null, 2.5, s.h + PR * 0.6));
    s.plate = mk("g", {}, s.grp);
    s.far = mk("path", { class: "lo" }, s.plate);
    s.near = mk("path", { class: "sil" }, s.plate);
    s.sp = spring(s.rest, { k: 100 * value, c: 18 * Math.sqrt(value) });
    s.drawn = NaN; s.postFirst = null;
    s.mid = P(s.x, s.y, s.h);
  }
  function draw(s) {
    const a = s.sp.x;
    if (Math.abs(a - s.drawn) < 1e-4) return;
    s.drawn = a;
    const dx = Math.cos(a), dy = Math.sin(a), tx = -dy, ty = dx;
    const face = (o) => poly(s.shape.map(([u, v]) => P(s.x + dx * o + tx * u, s.y + dy * o + ty * u, s.h + v)));
    const facesUs = dx + dy > 0;
    s.far.setAttribute("d", face(facesUs ? 1.2 : 2.4));
    s.near.setAttribute("d", face(facesUs ? 2.4 : 1.2));
    if (facesUs !== s.postFirst) { s.postFirst = facesUs; if (facesUs) s.post.g.after(s.plate); else s.plate.after(s.post.g); }
  }
  const B = register(stage, (dt) => {
    let m = false;
    for (const s of signs) { if (stepS(s.sp, dt)) m = true; draw(s); }
    return m;
  });
  bag.add(B.unregister);

  function aim(p) {
    let near = null, bd = Infinity;
    const w = p && unproj(C, p[0], p[1], 30);
    for (const s of signs) {
      if (p) {
        const d = Math.hypot(p[0] - s.mid[0], p[1] - s.mid[1]);
        if (d < bd) { bd = d; near = s; }
        const r = Math.hypot(w[0] - s.x, w[1] - s.y);
        const to = r < 3 ? s.sp.t : Math.atan2(w[1] - s.y, w[0] - s.x);
        s.sp.t = s.sp.t + wrap(to - s.sp.t);
      } else s.sp.t = s.sp.t + wrap(s.rest - s.sp.t);
    }
    if (bd > 60) near = null;
    for (const s of signs) s.near.classList.toggle("hi", p ? s === near : s.k === FAV);
    read.textContent = !p ? "rest" : near ? "sign " + (near.k + 1) : "turn";
    B.wake();
  }
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  for (const s of signs) draw(s);
  return {
    set: (v) => { for (const s of signs) { s.sp.k = 100 * v; s.sp.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "roadsigns",
  means: "Four sign posts on a street corner: every plain plate turns on its post to face the pointer, and the nearest is bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[150, 120], [250, 140], [200, 200], null],
  mount,
});
