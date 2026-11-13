/**
 * Podcast mics: a round pedestal table with three broadcast microphones, each
 * on a boom arm clamped to the table's edge, and a pair of headphones lying
 * on the top. The pointer is whoever is talking: every mic swivels and tilts
 * on its own springs to point at it, and the mic nearest it is bright. At
 * rest each mic points out at its own guest, a little askew, one bright. The
 * slider is how quickly the mics follow (a stiffer or softer spring).
 *
 * The pattern: a continuous aim (terrain's spring, on two angles per mic); the
 * hit is on the table top's plane, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 40, TT = 28.5, POST = 30, MR = 24, MZ = TT + 15, LEN = 20;
const ANG = [225, 105, 345], SKEW = [14, -18, 8], TILT = [-0.12, 0.06, -0.24], FAV = 1;
const V = [0.61, 0.61, 0.5];
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.9);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([(R + 6) * Math.cos(a), (R + 6) * Math.sin(a), 0], [(R + 2) * Math.cos(a), (R + 2) * Math.sin(a), TT + POST + 2]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the table: a foot, a column and a round top
  put(solid(g), prism(P, front, circ(14, 64), circ(12.6, 64), 0, 2));
  put(solid(g), prism(P, front, circ(3.5, 24), null, 2, TT - 2.5));
  put(solid(g), prism(P, front, circ(R, 96), circ(R - 1.8, 96), TT - 2.5, TT));

  // the headphones: two cups on the top, the band standing in an arc between them
  const hx = 7, hy = 7, ax = Q2(1, -1), HW = 9.6;
  const arc = (r, h) => Array.from({ length: 17 }, (_, i) => { const t = (i / 16) * Math.PI; return P(hx + r * Math.cos(t) * ax[0], hy + r * Math.cos(t) * ax[1], TT + 3.2 + h * Math.sin(t)); });
  for (const s of [-1, 1]) put(solid(g), prism(P, front, disc(hx + s * HW * ax[0], hy + s * HW * ax[1], 4.6, 28), disc(hx + s * HW * ax[0], hy + s * HW * ax[1], 3.4, 28), TT, TT + 3.2));
  mk("path", { class: "nf sil", d: open(arc(HW, 13)) }, g);
  mk("path", { class: "nf lo", d: open(arc(HW - 1.4, 11)) }, g);

  const mics = ANG.map((deg, k) => {
    const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    const cx = (R - 2) * c, cy = (R - 2) * s, mx = MR * c, my = MR * s;
    const rest = a + (SKEW[k] * Math.PI) / 180;
    const opts = { k: 100 * value, c: 18 * Math.sqrt(value) };
    return { k, cx, cy, mx, my, rest, yaw: spring(rest, opts), tilt: spring(TILT[k], opts), last: "" };
  }).sort((p, q) => p.cx + p.cy - (q.cx + q.cy));
  for (const m of mics) {
    const top = P(m.cx, m.cy, TT + POST), over = P(m.mx, m.my, MZ + 5);
    mk("path", { class: "nf sil", d: seg(P(m.cx, m.cy, TT), top) + seg(top, over) + seg(over, P(m.mx, m.my, MZ + 2)) }, g);
    put(solid(g), prism(P, front, disc(m.cx, m.cy, 2, 16), null, TT - 3.5, TT + 1.5));
    m.body = mk("path", { class: "sil" }, g);
    m.end = mk("path", { class: "nf lo" }, g);
  }

  function draw(m) {
    const yaw = m.yaw.x, tilt = m.tilt.x, key = yaw.toFixed(4) + "," + tilt.toFixed(4);
    if (key === m.last) return;
    m.last = key;
    const d = [Math.cos(tilt) * Math.cos(yaw), Math.cos(tilt) * Math.sin(yaw), Math.sin(tilt)];
    const u = [-Math.sin(yaw), Math.cos(yaw), 0], v = [u[1] * d[2] - u[2] * d[1], u[2] * d[0] - u[0] * d[2], u[0] * d[1] - u[1] * d[0]];
    const ring = (off, r) => Array.from({ length: 28 }, (_, i) => {
      const t = (i / 28) * Math.PI * 2, q = (j) => [m.mx, m.my, MZ][j] + d[j] * off + r * (Math.cos(t) * u[j] + Math.sin(t) * v[j]);
      return P(q(0), q(1), q(2));
    });
    const back = ring(-LEN * 0.4, 3.6), head = ring(LEN * 0.6, 5.2);
    m.body.setAttribute("d", poly(hull(back.concat(head))));
    const facingUs = d[0] * V[0] + d[1] * V[1] + d[2] * V[2] > 0;
    m.end.setAttribute("d", poly(facingUs ? ring(LEN * 0.6, 3.9) : ring(-LEN * 0.4, 2.5)));
  }

  const B = register(stage, (dt) => {
    let mv = false;
    for (const m of mics) { if (stepS(m.yaw, dt)) mv = true; if (stepS(m.tilt, dt)) mv = true; draw(m); }
    return mv;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    let near = null, bd = Infinity;
    for (const m of mics) {
      let aim = m.rest, tilt = TILT[m.k];
      if (over) {
        const dx = over[0] - m.mx, dy = over[1] - m.my, dd = Math.hypot(dx, dy);
        if (dd < bd) { bd = dd; near = m; }
        aim = dd < 3 ? m.yaw.t : Math.atan2(dy, dx);
        tilt = clamp(Math.atan2(-6, dd), -0.6, 0);
      }
      m.yaw.t = m.yaw.t + wrap(aim - m.yaw.t);
      m.tilt.t = tilt;
    }
    for (const m of mics) m.body.classList.toggle("hi", over ? m === near : m.k === FAV);
    read.textContent = near ? "mic " + (near.k + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], TT), r = Math.hypot(x, y), k = Math.min(1, (R + 14) / r);
      over = r > R + 36 ? null : [x * k, y * k];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { for (const m of mics) for (const s of [m.yaw, m.tilt]) { s.k = 100 * v; s.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

function Q2(a, b) { const n = Math.hypot(a, b); return [a / n, b / n]; }

hairline({
  name: "podcastmics",
  means: "Three podcast mics on boom arms round a table: every mic turns to point at the pointer, the nearest one bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[247, 104], [150, 175], [255, 215], null],
  mount,
});
