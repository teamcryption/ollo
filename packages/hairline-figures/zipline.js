/**
 * Zip line: a cable strung down from a tall post to a short one, a trolley
 * riding it and a round seat hung from the trolley on two ropes. The pointer
 * along the cable slides the trolley there on a spring, seat and all. At rest
 * the trolley waits near the high end, the seat bright. The slider is how far
 * the trolley rides towards the pointer.
 *
 * The pattern: a continuous aim on one number; the hit is the pointer's screen
 * x against the cable's fixed ends.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, open, spring, stepS, clamp, lerp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X0 = -70, X1 = 70, Z0 = 74, Z1 = 44, DROP = 34, SR = 9, REST = -34, LO = -56, HI = 52;
const cz = (x) => lerp(Z0, Z1, (x - X0) / (X1 - X0));
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[X0 - 8, -8, 0], [X1 + 8, 8, 0], [X0, 0, Z0 + 4], [X1, 0, Z1 + 4], [HI, SR, cz(HI) - DROP - 2], [LO, -SR, cz(LO) - DROP]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const post = (x, h) => {
    const [r0, r1] = rings(x - 7, -7, x + 7, 7, 3, 1.2);
    put(solid(g), prism(P, front, r0, r1, 0, 3));
    put(solid(g), prism(P, front, disc(x, 0, 2.4, 16), null, 3, h));
    put(solid(g), prism(P, front, disc(x, 0, 3.4, 16), disc(x, 0, 2.4, 16), h, h + 2.5));
  };
  post(X0, Z0 + 1.5);
  mk("path", { class: "nf sil", d: open([P(X0, 0, Z0), P(X1, 0, Z1)]) }, g);
  const rig = mk("g", {}, g);
  const ropes = mk("path", { class: "nf sil" }, rig);
  const seat = solid(rig), trolley = solid(rig);
  seat.sil.classList.add("hi");
  post(X1, Z1 + 1.5);

  const sp = spring(REST);
  let drawn = NaN;
  function draw() {
    const x = sp.x;
    if (Math.abs(x - drawn) < 1e-3) return;
    drawn = x;
    const z = cz(x), sz = z - DROP;
    const [t0, t1] = rings(x - 5, -3, x + 5, 3, 1.6, 0.7);
    put(trolley, prism(P, front, t0, t1, z - 4, z + 1.5));
    put(seat, prism(P, front, disc(x, 0, SR), disc(x, 0, SR - 1.6), sz - 2.2, sz));
    ropes.setAttribute("d", open([P(x - 2, 0, z - 4), P(x - SR + 2, 0, sz)]) + open([P(x + 2, 0, z - 4), P(x + SR - 2, 0, sz)]));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  const A = P(X0, 0, Z0), Bp = P(X1, 0, Z1);
  let over = null;
  function retarget() {
    sp.t = over === null ? REST : REST + amt * (over - REST);
    read.textContent = over === null ? "rest" : "ride " + Math.round(((sp.t - LO) / (HI - LO)) * 100) + "%";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const t = (sx - A[0]) / (Bp[0] - A[0]), ly = lerp(A[1], Bp[1], t);
      over = t < -0.1 || t > 1.1 || sy < ly - 30 || sy > ly + 110 ? null : clamp(lerp(X0, X1, t), LO, HI);
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { amt = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "zipline",
  means: "A zip line between two posts: the trolley and its hanging seat ride along the cable to the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[273, 176], [130, 80], [205, 130], null],
  mount,
});
