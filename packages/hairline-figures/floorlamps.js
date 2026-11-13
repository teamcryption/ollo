/**
 * Floor lamps: four lamps in a row, each its own kind: an arc lamp reaching
 * over, a tripod with a drum shade, a straight pole with a tall cone, and a
 * reading lamp on a bent arm. The pointer is what they light: every shade
 * tilts toward it on its own spring, and the lamp nearest it is bright. At
 * rest the shades hang a little askew, the third lamp bright. The slider is
 * how quickly the shades follow (a stiffer or softer spring).
 *
 * The pattern: a continuous aim (spotlights' can, on a tilt per lamp); the hit
 * is on the floor's plane, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const XS = [-66, -22, 22, 66], TMAX = 0.75, FAV = 2;
// per lamp: pivot height, shade length, top and bottom radius, rest tilt
const KIND = [
  { h: 70, len: 11, rb: 3, rf: 9, rest: [0.1, 0.25] },
  { h: 56, len: 13, rb: 9, rf: 10, rest: [-0.12, 0.05] },
  { h: 66, len: 16, rb: 4, rf: 10, rest: [0.2, -0.1] },
  { h: 52, len: 9, rb: 3, rf: 6, rest: [-0.3, 0.2] },
];
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-90, 24, 0], [-90, 24, 96], [80, 12, 0], [-80, 12, 0], [80, -12, 0], [-80, -16, 80], [70, 0, 70]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const opt = { k: 100 * value, c: 18 * Math.sqrt(value) };

  const lamps = XS.map((x, k) => {
    const K = KIND[k], piv = [x, 0, K.h], grp = mk("g", {}, g);
    if (k === 0) {
      const bx = x - 22, by = 22, pts = [];
      put(solid(grp), prism(P, front, disc(bx, by, 7), disc(bx, by, 5.8), 0, 2));
      for (let i = 0; i <= 16; i++) { const t = i / 16, a = t * Math.PI * 0.8; pts.push(P(lerpN(bx, x, t), lerpN(by, 0, t), 2 + Math.sin(a) * 76 + t * (K.h + 2 - 2 - Math.sin(Math.PI * 0.8) * 76))); }
      mk("path", { class: "nf sil", d: open(pts) }, grp);
    } else if (k === 1) {
      let d = "";
      for (let i = 0; i < 3; i++) { const a = 0.5 + (i / 3) * Math.PI * 2; d += seg(P(x, 0, 36), P(x + 13 * Math.cos(a), 13 * Math.sin(a), 0)); }
      mk("path", { class: "nf sil", d: d + seg(P(x, 0, 36), P(x, 0, K.h)) }, grp);
    } else if (k === 2) {
      put(solid(grp), prism(P, front, disc(x, 0, 8), disc(x, 0, 6.8), 0, 1.8));
      put(solid(grp), prism(P, front, disc(x, 0, 1.1, 12), null, 1.8, K.h));
    } else {
      put(solid(grp), prism(P, front, disc(x, 0, 6.5), disc(x, 0, 5.4), 0, 2));
      mk("path", { class: "nf sil", d: seg(P(x, 0, 2), P(x - 4, 0, 40)) + seg(P(x - 4, 0, 40), P(x, 0, K.h)) }, grp);
    }
    const body = mk("path", { class: "sil" }, grp), rim = mk("path", { class: "nf lo" }, grp);
    return { k, K, piv, body, rim, sx: spring(K.rest[0], opt), sy: spring(K.rest[1], opt), key: "" };
  });

  function lerpN(a, b, t) { return a + (b - a) * t; }

  function draw(l) {
    const key = l.sx.x.toFixed(3) + "," + l.sy.x.toFixed(3);
    if (key === l.key) return;
    l.key = key;
    const n = Math.hypot(l.sx.x, l.sy.x, 1), d = [l.sx.x / n, l.sy.x / n, -1 / n];
    let u = [d[1], -d[0], 0];
    const un = Math.hypot(...u);
    u = un < 1e-6 ? [1, 0, 0] : u.map((x) => x / un);
    const v = [u[1] * d[2] - u[2] * d[1], u[2] * d[0] - u[0] * d[2], u[0] * d[1] - u[1] * d[0]];
    const ring = (off, r) => Array.from({ length: 28 }, (_, i) => {
      const t = (i / 28) * Math.PI * 2, q = (j) => l.piv[j] + d[j] * off + r * (Math.cos(t) * u[j] + Math.sin(t) * v[j]);
      return P(q(0), q(1), q(2));
    });
    const top = ring(0, l.K.rb), bot = ring(l.K.len, l.K.rf);
    l.body.setAttribute("d", poly(hull(top.concat(bot))));
    l.rim.setAttribute("d", poly(ring(l.K.len - 1.2, l.K.rf - 0.4)));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const l of lamps) { const a = stepS(l.sx, dt), b = stepS(l.sy, dt); if (a || b) m = true; draw(l); }
    return m;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    let near = null, bd = Infinity;
    for (const l of lamps) {
      if (!over) { l.sx.t = l.K.rest[0]; l.sy.t = l.K.rest[1]; continue; }
      const dx = over[0] - l.piv[0], dy = over[1] - l.piv[1], dd = Math.hypot(dx, dy);
      if (dd < bd) { bd = dd; near = l; }
      const t = Math.min(TMAX, dd / l.K.h) / (dd || 1);
      l.sx.t = dx * t; l.sy.t = dy * t;
    }
    for (const l of lamps) l.body.classList.toggle("hi", over ? l === near : l.k === FAV);
    read.textContent = near ? "lamp " + (near.k + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      over = Math.abs(x) > 110 || Math.abs(y) > 70 ? null : [clamp(x, -90, 90), clamp(y, -40, 40)];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { for (const l of lamps) for (const s of [l.sx, l.sy]) { s.k = 100 * v; s.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "floorlamps",
  means: "Four floor lamps of different kinds: every shade tilts toward the pointer, and the nearest lamp is bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[110, 190], [226, 252], [300, 270], null],
  mount,
});
