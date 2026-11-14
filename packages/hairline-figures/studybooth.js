/**
 * Study carrels: four library desks in a row under one back panel, split by
 * low dividers, a stool tucked at each. The pointer picks a carrel by screen x
 * and its stool slides out and turns, as if someone sat down; neighbours ease
 * out less, by distance. At rest the stools sit unevenly tucked, one bright.
 * The slider is how far the stools come out.
 */
const {
  Cam, fit, prism, proj, rings, facing, tween, tset, tval, tdone, unproj,
  disposer, mk, pointer, put, register, solid, clamp,
} = HL;

const N = 4, WD = 30, Y0 = -60, DT = 26, FAV = 2;
const REST = [5, 1, 8, 3], RTURN = [-6, 4, 10, -3];
const yc = (i) => Y0 + WD * i + WD / 2;
const turn = (ring, a, cx, cy) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-24, Y0, 0], [-24, -Y0, 52], [58, Y0, 0], [58, -Y0, 0], [-24, Y0, 52], [10, -Y0, 0]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const R = (x0, y0, x1, y1, r, b) => rings(x0, y0, x1, y1, r, b);
  // the back panel, then dividers and desk tops, far to near
  let [a, b] = R(-24, Y0 - 1, -21, -Y0 + 1, 1.2, 0.5);
  put(solid(g), prism(P, front, a, b, 0, 52));
  const desks = [];
  for (let i = 0; i <= N; i++) {
    const y = Y0 + WD * i;
    [a, b] = R(-21, y - 1, 0, y + 1, 0.9, 0.4);
    put(solid(g), prism(P, front, a, b, 0, i === 0 || i === N ? 44 : 40));
    if (i < N) {
      [a, b] = R(-21, y + 1, 1, y + WD - 1, 1.5, 1);
      const d = solid(g);
      put(d, prism(P, front, a, b, DT, DT + 2));
      desks.push(d);
    }
  }
  // stools, local footprints: a seat and a post
  const [SR, SI] = R(-7, -7, 7, 7, 3, 1.2), [PR] = R(-2, -2, 2, 2, 1.5, 0.5), [FR, FI] = R(-6, -6, 6, 6, 2.5, 1);
  const stools = [];
  for (let i = 0; i < N; i++) {
    const s = { i, foot: solid(g), post: solid(g), seat: solid(g), x: tween(REST[i]), t: tween(RTURN[i] * Math.PI / 180), drawn: "" };
    stools.push(s);
  }
  function draw(s, now) {
    const x = 12 + tval(s.x, now), a = tval(s.t, now), key = x.toFixed(3) + a.toFixed(4);
    if (key === s.drawn) return;
    s.drawn = key;
    const T = (r) => turn(r, a, x, yc(s.i));
    put(s.foot, prism(P, front, T(FR), T(FI), 0, 1.5));
    put(s.post, prism(P, front, T(PR), null, 1.5, 17));
    put(s.seat, prism(P, front, T(SR), T(SI), 17, 20));
  }
  const B = register(stage, (dt, now) => {
    let m = false;
    for (const s of stools) { draw(s, now); if (!tdone(s.x, now) || !tdone(s.t, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  let amp = value, sel = null;
  const FALL = [1, 0.4, 0.16, 0.07];
  function retarget() {
    const now = performance.now();
    for (const s of stools) {
      let x = REST[s.i], t = RTURN[s.i];
      if (sel !== null) {
        const f = FALL[Math.abs(s.i - sel)];
        x += clamp(amp * 30, 0, 42) * f;
        t += 34 * f * (s.i % 2 ? -1 : 1);
      }
      const dl = Math.abs(s.i - (sel ?? FAV)) * 45;
      tset(s.x, x, now, dl); tset(s.t, t * Math.PI / 180, now, dl);
      s.seat.sil.classList.toggle("hi", sel === null ? s.i === FAV : s.i === sel);
    }
    read.textContent = sel === null ? "rest" : "desk " + (sel + 1);
    B.wake();
  }
  // hit: a fixed plane at seat height, which never moves; the carrel is the band of y under the pointer
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 18);
      if (x < -50 || x > 60 || y < Y0 - 12 || y > -Y0 + 12) { sel = null; return retarget(); }
      sel = clamp(Math.floor((y - Y0) / WD), 0, N - 1); retarget();
    },
    leave: () => { sel = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { amp = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "studybooth",
  means: "Four study carrels in a row: the stool at the pointer's carrel slides out and turns, the neighbours easing out less.",
  rules: [1, 2, 3, 5, 8],
  range: [0.5, 1, 1.4],
  tour: [[257, 143], [214, 164], [129, 207], null],
  mount,
});
