/**
 * Archery targets: three round targets stand on tripod easels down a range,
 * each a thick disc with four ring lines on its face, at different
 * distances. The pointer is what the range turns to: every target swivels on
 * its own spring to face it, and the nearest one is bright. At rest the
 * targets face the shooting line, each a little askew, one bright. The
 * slider is how quickly the targets follow (a stiffer or softer spring).
 *
 * The pattern: a continuous aim (office chairs); the hit is on the ground
 * plane, which never moves.
 */
const {
  Cam, circ, facing, fit, hull, poly, proj, seg, unproj, spring, stepS,
  disposer, flatDot, mk, place, pointer, register, solid,
} = HL;

const POS = [[-46, -38], [-6, 2], [38, 34]], R = 15, ZC = 32, TH = 4, FAV = 0;
const SKEW = [-18, 10, 24];
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));
const DISC = circ(1, 40);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.95);
  const ext = [];
  for (const [x, y] of POS) ext.push([x - R, y - R, 0], [x + R, y + R, 0], [x - R, y - R, ZC + R], [x + R, y + R, ZC + R]);
  fit(C, ext, 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the shooting line, dashed, on the ground in front of the range
  mk("path", { class: "nf dash", d: seg(P(-70, 52, 0), P(26, 82, 0)) }, g);

  const t0 = Math.PI / 4;
  const tg = POS.map(([cx, cy], k) => {
    const grp = mk("g", {}, g);
    const tn = [-Math.sin(t0), Math.cos(t0)], nn = [Math.cos(t0), Math.sin(t0)];
    const top = P(cx, cy, ZC + 6), foot = (a, b) => P(cx + tn[0] * a + nn[0] * b, cy + tn[1] * a + nn[1] * b, 0);
    mk("path", { class: "nf sil", d: seg(top, foot(0, -14)) + seg(top, foot(-11, 4)) + seg(top, foot(11, 4)) }, grp);
    for (const [a, b] of [[0, -14], [-11, 4], [11, 4]]) place(flatDot(grp, C, 1.1, "dot off"), foot(a, b));
    const disc = solid(grp), face = mk("path", { class: "nf lo" }, grp);
    const rest = t0 + (SKEW[k] * Math.PI) / 180;
    return { k, cx, cy, rest, disc, face, sp: spring(rest, { k: 100 * value, c: 18 * Math.sqrt(value) }), drawn: NaN };
  });

  function draw(t) {
    const a = t.sp.x;
    if (Math.abs(a - t.drawn) < 1e-4) return;
    t.drawn = a;
    const n = [Math.cos(a), Math.sin(a)], tn = [-Math.sin(a), Math.cos(a)];
    const sgn = front({ u: 0, v: 0, nu: n[0], nv: n[1] }) ? 1 : -1;
    const X = (u, v, w) => P(t.cx + tn[0] * u + n[0] * w, t.cy + tn[1] * u + n[1] * w, ZC + v);
    const ring = (r, w) => DISC.map((q) => X(q.u * r, q.v * r, w));
    t.disc.sil.setAttribute("d", poly(hull(ring(R, TH / 2).concat(ring(R, -TH / 2)))));
    t.disc.cr.setAttribute("d", poly(ring(R - 1.2, (sgn * TH) / 2)));
    t.face.setAttribute("d", [0.76, 0.54, 0.32, 0.12].map((f) => poly(ring(R * f, (sgn * TH) / 2))).join(""));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const t of tg) { if (stepS(t.sp, dt)) m = true; draw(t); }
    return m;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    let near = null, bd = Infinity;
    for (const t of tg) {
      if (over) {
        const d = Math.hypot(over[0] - t.cx, over[1] - t.cy);
        if (d < bd) { bd = d; near = t; }
        const aim = d < 6 ? t.sp.t : Math.atan2(over[1] - t.cy, over[0] - t.cx);
        t.sp.t = t.sp.t + wrap(aim - t.sp.t);
      } else t.sp.t = t.sp.t + wrap(t.rest - t.sp.t);
    }
    for (const t of tg) t.disc.sil.classList.toggle("hi", over ? t === near : t.k === FAV);
    read.textContent = near ? "target " + (near.k + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      over = Math.abs(x) > 95 || Math.abs(y) > 95 ? null : [x, y];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { for (const t of tg) { t.sp.k = 100 * v; t.sp.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "archerytargets",
  means: "Three archery targets on easels down a range: every target turns to face the pointer, and the nearest one is bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[192, 209], [192, 154], [208, 261], null],
  mount,
});
