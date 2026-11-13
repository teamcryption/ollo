/**
 * Bar stools: five round stools in front of a bar counter, each a floor
 * disc, a column, a round seat and a low back on a short post. The pointer
 * is what the bar turns to: every seat swivels on its own spring to face it,
 * and the stool nearest it is bright and rises a little. At rest the seats
 * face the counter, each a little askew, one bright. The slider is how
 * quickly the seats follow (a stiffer or softer spring).
 *
 * The pattern: a continuous aim (officechairs); the hit is on the plane of
 * the seats' rest tops, which never moves.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, unproj, spring, stepS, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 34, SY = 18, SEAT = 30, RISE = 8, FAV = 3;
const SKEW = [-20, 14, -6, 24, -14];
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const turn = (ring, a, cx, cy) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.62);
  fit(C, [[-10, -30, 0], [150, 30, 0], [150, -30, 0], [-10, 30, 0], [-10, -30, 48], [150, -30, 48], [0, SY, SEAT + RISE + 16]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the counter: a body under an overhanging top, a foot rail line along its front
  { const [r, i] = rings(-6, -26, 146, -8, 3, 1.2); put(solid(g), prism(P, front, r, i, 0, 42)); }
  { const [r, i] = rings(-10, -30, 150, -3, 3, 1.4); put(solid(g), prism(P, front, r, i, 42, 46)); }
  { const [r, i] = rings(-4, -6.5, 144, -4.5, 1, 0.4); put(solid(g), prism(P, front, r, i, 8, 9.6)); }

  const SEATR = [disc(0, 0, 10, 40), disc(0, 0, 8.6, 40)];
  const POST = rings(-9.6, -1.4, -7.4, 1.4, 0.7, 0.3), BACK = rings(-11, -7.5, -8.4, 7.5, 1.2, 0.6);
  const stools = [];
  for (let k = 0; k < N; k++) {
    const cx = 6 + k * STEP, cy = SY, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(cx, cy, 8, 36), disc(cx, cy, 6.8, 36), 0, 1.6));
    put(solid(grp), prism(P, front, disc(cx, cy, 1.8, 16), null, 1.6, SEAT));
    put(solid(grp), prism(P, front, disc(cx, cy, 6.5, 32), null, 12, 13.2));
    const rest = -Math.PI / 2 + SKEW[k] * (Math.PI / 180);
    const st = { k, cx, cy, rest, sp: spring(rest, { k: 100 * value, c: 18 * Math.sqrt(value) }), up: tween(0), drawn: "" };
    st.col = solid(grp); st.seat = solid(grp); st.back = mk("g", {}, grp); st.post = solid(st.back); st.plate = solid(st.back); st.backFirst = null;
    stools.push(st);
  }

  function draw(st, now) {
    const a = st.sp.x, u = tval(st.up, now), key = a.toFixed(4) + "," + u.toFixed(2);
    if (key === st.drawn) return;
    st.drawn = key;
    const T = (r) => turn(r, a, st.cx, st.cy), z = SEAT + u;
    put(st.col, prism(P, front, disc(st.cx, st.cy, 1.8, 16), null, SEAT - 1, z));
    put(st.seat, prism(P, front, T(SEATR[0]), T(SEATR[1]), z, z + 4));
    put(st.post, prism(P, front, T(POST[0]), null, z + 1, z + 9));
    put(st.plate, prism(P, front, T(BACK[0]), T(BACK[1]), z + 8, z + 15));
    const backFirst = Math.cos(a) + Math.sin(a) > 0;
    if (backFirst !== st.backFirst) {
      st.backFirst = backFirst;
      if (backFirst) st.back.after(st.col.g); else st.seat.g.after(st.back);
    }
  }

  const B = register(stage, (dt, now) => {
    let m = false;
    for (const st of stools) { if (stepS(st.sp, dt) || !tdone(st.up, now)) m = true; draw(st, now); }
    return m;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    const now = performance.now();
    let near = null, bd = Infinity;
    for (const st of stools) {
      if (over) {
        const d = Math.hypot(over[0] - st.cx, over[1] - st.cy);
        if (d < bd) { bd = d; near = st; }
        const aim = d < 4 ? st.sp.t : Math.atan2(over[1] - st.cy, over[0] - st.cx);
        st.sp.t = st.sp.t + wrap(aim - st.sp.t);
      } else st.sp.t = st.sp.t + wrap(st.rest - st.sp.t);
    }
    for (const st of stools) {
      const on = over ? st === near : st.k === FAV;
      tset(st.up, over && st === near ? RISE : 0, now, 0);
      st.plate.sil.classList.toggle("hi", on);
      st.seat.sil.classList.toggle("hi", on);
    }
    read.textContent = near ? "stool " + (near.k + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], SEAT + 4);
      over = x < -24 || x > 166 || y < -16 || y > 52 ? null : [x, y];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { for (const st of stools) { st.sp.k = 100 * v; st.sp.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "barstools",
  means: "Five bar stools at a counter: every seat swivels to face the pointer, and the nearest one is bright and rises a little.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[106, 128], [184, 167], [262, 206], null],
  mount,
});
