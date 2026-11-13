/**
 * Office chairs: five swivel chairs round a meeting table, each a five-legged
 * star base on casters, a gas column, a seat and a backrest on its spine. The
 * pointer is what the room turns to: every chair swivels on its own spring to
 * face it, and the chair nearest it is bright. At rest the chairs face the
 * table, each left a little askew, one bright. The slider is how quickly the
 * chairs follow (a stiffer or softer spring).
 *
 * The pattern: a continuous aim (terrain's spring, on an angle per chair); the
 * hit is on the floor's plane, which never moves.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const N = 5, RC = 46, RT = 23, TT = 27, SEAT = 17, LEG = 9;
const SKEW = [-16, 12, 0, -24, 18], FAV = 2;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const turn = (ring, a, cx, cy) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.25);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([(RC + 13) * Math.cos(a), (RC + 13) * Math.sin(a), 0], [(RC + 11) * Math.cos(a), (RC + 11) * Math.sin(a), SEAT + 24]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // local footprints, facing +x: the seat, the spine behind it, the backrest on the spine
  const SEATR = rings(-9, -9, 9, 9, 3.5, 1.2), SPINE = rings(-12, -1.6, -9, 1.6, 0.8, 0.4), BACKR = rings(-13.5, -9, -10.5, 9, 1.4, 0.6);

  const chairs = [];
  for (let k = 0; k < N; k++) {
    const a = (18 + k * 72) * (Math.PI / 180), cx = RC * Math.cos(a), cy = RC * Math.sin(a);
    const rest = a + Math.PI + SKEW[k] * (Math.PI / 180);
    chairs.push({ k, cx, cy, rest, sp: spring(rest, { k: 100 * value, c: 18 * Math.sqrt(value) }), drawn: NaN });
  }
  const table = { cx: 0, cy: 0 };
  const order = [...chairs, table].sort((p, q) => p.cx + p.cy - (q.cx + q.cy));

  for (const it of order) {
    if (it === table) {
      put(solid(g), prism(P, front, circ(10, 48), circ(8.8, 48), 0, 1.5));
      put(solid(g), prism(P, front, circ(2.6, 24), null, 1.5, TT));
      put(solid(g), prism(P, front, circ(RT, 72), circ(RT - 1.6, 72), TT, TT + 2));
      continue;
    }
    const ch = it, grp = mk("g", {}, g), legs = [];
    for (let i = 0; i < 5; i++) {
      const b = ch.k * 0.5 + (i / 5) * Math.PI * 2, tx = ch.cx + LEG * Math.cos(b), ty = ch.cy + LEG * Math.sin(b);
      legs.push(seg(P(ch.cx, ch.cy, 3), P(tx, ty, 1.6)));
      place(flatDot(grp, C, 1.1, "dot off"), P(tx, ty, 0));
    }
    mk("path", { class: "nf sil", d: legs.join("") }, grp);
    put(solid(grp), prism(P, front, disc(ch.cx, ch.cy, 1.5, 16), null, 2.4, SEAT));
    ch.seat = solid(grp);
    ch.back = mk("g", {}, grp);
    ch.spine = solid(ch.back);
    ch.plate = solid(ch.back);
    ch.backFirst = null;
  }

  function draw(ch) {
    const a = ch.sp.x;
    if (Math.abs(a - ch.drawn) < 1e-4) return;
    ch.drawn = a;
    const T = (r) => turn(r, a, ch.cx, ch.cy);
    put(ch.seat, prism(P, front, T(SEATR[0]), T(SEATR[1]), SEAT, SEAT + 3.2));
    put(ch.spine, prism(P, front, T(SPINE[0]), null, SEAT + 0.5, SEAT + 10));
    put(ch.plate, prism(P, front, T(BACKR[0]), T(BACKR[1]), SEAT + 9, SEAT + 24));
    // the backrest is painted before the seat when it stands on the far side
    const backFirst = Math.cos(a) + Math.sin(a) > 0;
    if (backFirst !== ch.backFirst) {
      ch.backFirst = backFirst;
      if (backFirst) ch.back.after(ch.seat.g); else ch.seat.g.after(ch.back);
    }
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const ch of chairs) { if (stepS(ch.sp, dt)) m = true; draw(ch); }
    return m;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    let near = null, bd = Infinity;
    for (const ch of chairs) {
      if (over) {
        const d = Math.hypot(over[0] - ch.cx, over[1] - ch.cy);
        if (d < bd) { bd = d; near = ch; }
        const aim = d < 4 ? ch.sp.t : Math.atan2(over[1] - ch.cy, over[0] - ch.cx);
        ch.sp.t = ch.sp.t + wrap(aim - ch.sp.t);
      } else ch.sp.t = ch.sp.t + wrap(ch.rest - ch.sp.t);
    }
    for (const ch of chairs) {
      const on = over ? ch === near : ch.k === FAV;
      ch.plate.sil.classList.toggle("hi", on);
      ch.seat.sil.classList.toggle("hi", on);
    }
    read.textContent = near ? "chair " + (near.k + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y), k = Math.min(1, (RC + 14) / r);
      over = r > RC + 34 ? null : [x * k, y * k];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { for (const ch of chairs) { ch.sp.k = 100 * v; ch.sp.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "officechairs",
  means: "Five office chairs round a table: every chair swivels to face the pointer, and the nearest one is bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[108, 142], [127, 202], [248, 251], null],
  mount,
});
