/**
 * CCTV cameras: the inside corner of a building, two walls meeting over a
 * paved plot, with three box cameras on wall arms. The pointer is what they
 * watch: every camera turns on its own springs to face the point on the
 * ground under it, and the camera nearest it is bright. At rest each camera
 * looks at its own patch of ground, one bright. The slider is how quickly
 * they follow.
 *
 * The pattern: a continuous aim (spotlights); the hit is on the ground plane.
 */
const {
  Cam, clamp, facing, fit, hull, poly, prism, proj, rings, rrect, circ, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const G = 92, WH = 74, T = 6, LEN = 24;
const CAMS = [[22, 58, 58, 0, 58], [18, 18, 64, 0, 0], [58, 22, 58, 58, 0]];
const REST = [[30, 74], [46, 40], [74, 28]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-T, -T, 0], [G, G, -4], [G, -T, -4], [-T, G, -4], [-T, -T, WH], [G, -T, WH], [-T, G, WH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  { const [r, i] = rings(-T, -T, G, G, 3, 1.4); put(solid(g), prism(P, front, r, i, -4, 0)); }
  { const [r, i] = rings(-T, -T, G, 0, 2, 1); put(solid(g), prism(P, front, r, i, 0, WH)); }
  { const [r, i] = rings(-T, 0, 0, G, 2, 1); put(solid(g), prism(P, front, r, i, 0, WH)); }
  mk("path", { class: "nf lo", d: seg(P(0, 1, 8), P(G - 2, 1, 8)) + seg(P(1, 0, 8), P(1, G - 2, 8)) }, g);
  const sec = rrect(-4.6, -3.6, 4.6, 3.6, 1.6, 3), lensR = circ(2.6, 16);
  const cams = CAMS.map(([x, y, z, wx, wy], k) => {
    const grp = mk("g", {}, g);
    mk("path", { class: "nf sil", d: seg(P(wx, wy, z + 4), P(x, y, z + 4)) + seg(P(x, y, z + 4), P(x, y, z + 2.4)) }, grp);
    const body = mk("path", { class: "sil" }, grp), lens = mk("path", { class: "nf" }, grp), hood = mk("path", { class: "nf lo" }, grp);
    const o = { k, c: [x, y, z], body, lens, hood, last: "" };
    o.sx = spring(REST[k][0], { k: 100 * value, c: 18 * Math.sqrt(value) });
    o.sy = spring(REST[k][1], { k: 100 * value, c: 18 * Math.sqrt(value) });
    return o;
  });

  function draw(o) {
    const key = o.sx.x.toFixed(2) + "," + o.sy.x.toFixed(2);
    if (key === o.last) return;
    o.last = key;
    const [cx, cy, cz] = o.c, d0 = [o.sx.x - cx, o.sy.x - cy, -cz], n = Math.hypot(...d0), d = d0.map((q) => q / n);
    const hn = Math.hypot(d[0], d[1]) || 1, u = [-d[1] / hn, d[0] / hn, 0];
    const v = [u[1] * d[2] - u[2] * d[1], u[2] * d[0] - u[0] * d[2], u[0] * d[1] - u[1] * d[0]];
    const at = (off, a, b) => P(cx + d[0] * off + a * u[0] + b * v[0], cy + d[1] * off + a * u[1] + b * v[1], cz + d[2] * off + a * u[2] + b * v[2]);
    const back = sec.map((q) => at(-LEN * 0.35, q.u, q.v)), fr = sec.map((q) => at(LEN * 0.65, q.u * 1.12, q.v * 1.12));
    o.body.setAttribute("d", poly(hull(back.concat(fr))));
    const sees = d[0] * 0.61 + d[1] * 0.61 + d[2] * 0.5 > 0;
    o.lens.setAttribute("d", sees ? poly(lensR.map((q) => at(LEN * 0.65, q.u, q.v))) : "");
    o.hood.setAttribute("d", seg(at(-LEN * 0.35, -4.4, 3.4), at(LEN * 0.65, -4.9, 3.8)) + seg(at(-LEN * 0.35, 4.4, 3.4), at(LEN * 0.65, 4.9, 3.8)));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const o of cams) { if (stepS(o.sx, dt)) m = true; if (stepS(o.sy, dt)) m = true; draw(o); }
    return m;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    let near = null, bd = Infinity;
    cams.forEach((o, k) => {
      const [x, y] = over ?? REST[k];
      o.sx.t = x; o.sy.t = y;
      if (over) { const dd = Math.hypot(o.c[0] - x, o.c[1] - y); if (dd < bd) { bd = dd; near = o; } }
    });
    cams.forEach((o) => o.body.classList.toggle("hi", over ? o === near : o.k === 1));
    read.textContent = near ? "cam " + (near.k + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      over = x < -4 || y < -4 || x > G + 20 || y > G + 20 ? null : [clamp(x, 6, G - 4), clamp(y, 6, G - 4)];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { for (const o of cams) for (const s of [o.sx, o.sy]) { s.k = 100 * v; s.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "cctvcameras",
  means: "Three security cameras on a building corner: every camera turns to face the pointer, and the nearest one is bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[120, 215], [200, 240], [280, 215], null],
  mount,
});
