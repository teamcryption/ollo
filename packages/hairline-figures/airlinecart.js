/**
 * Drinks trolley: a half-size airline cart on four casters, standing in the
 * aisle on a runner of carpet. Drawers line its side, doors close its end and
 * a tray rims its top. The pointer is where the crew wants it: the trolley
 * rolls along the aisle to that row on a spring. At rest it stands a little
 * way in, its tray rim bright. The slider is how far down the aisle it goes.
 */
const {
  Cam, circ, clamp, fit, facing, poly, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 40, W = 18, H = 46, RUN = 92, REST = 14;
const disc = (x, y, r, n = 12) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-8, -10, 0], [L + RUN + 8, W + 10, 0], [L + RUN + 8, -10, 0], [-8, W + 10, 0], [0, 0, H + 3], [L + RUN, W, H + 3]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [ar, ai] = rings(-8, -10, L + RUN + 8, W + 10, 6, 2);
  put(solid(g), prism(P, front, ar, ai, -2, 0));
  for (let x = 6; x < L + RUN; x += 22) mk("path", { d: seg(P(x, -6, 0), P(x, W + 6, 0)), class: "lo dash" }, g);
  const cart = mk("g", {}, g);
  const wheels = [0, 1, 2, 3].map(() => solid(cart));
  const body = solid(cart), tray = solid(cart);
  const marks = mk("path", { class: "lo nf" }, cart), latch = mk("path", { class: "nf" }, cart);
  const tx = spring(REST);
  let last = NaN;

  function draw(o) {
    if (o === last) return;
    last = o;
    [[3, 3], [L - 3, 3], [3, W - 3], [L - 3, W - 3]].forEach(([x, y], k) => {
      put(wheels[k], prism(P, front, disc(o + x, y, 2.6), disc(o + x, y, 1.6), 0, 4));
    });
    const [br, bi] = rings(o, 0, o + L, W, 3, 1.4);
    put(body, prism(P, front, br, bi, 4, H));
    const [tr, ti] = rings(o - 1.5, -1.5, o + L + 1.5, W + 1.5, 3.5, 1.6);
    put(tray, prism(P, front, tr, ti, H, H + 3));
    let d = "";
    for (const z of [14, 24, 34]) d += seg(P(o + 3, W, z), P(o + L - 3, W, z));
    d += seg(P(o + L, W / 2, 8), P(o + L, W / 2, H - 4));
    for (const z of [9, 19, 29, 39]) d += seg(P(o + L / 2 - 4, W, z), P(o + L / 2 + 4, W, z));
    marks.setAttribute("d", d);
    const c = P(o + L, W / 2 + 2.5, H - 10), q = P(o + L, W / 2 + 2.5, H - 16);
    latch.setAttribute("d", poly([[c[0] - 1, c[1]], [c[0] + 1, c[1]], [q[0] + 1, q[1]], [q[0] - 1, q[1]]]));
  }

  const B = register(stage, (dt) => {
    const m = stepS(tx, dt);
    draw(tx.x);
    return m;
  });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) {
      tx.t = REST;
      body.sil.classList.remove("hi"); tray.sil.classList.add("hi");
      read.textContent = "rest";
    } else {
      const [wx, wy] = unproj(C, p[0], p[1], 0);
      if (wy < -14 || wy > W + 14 || wx < -16 || wx > L + RUN + 16) return aim(null);
      const f = clamp((wx - L / 2) / RUN, 0, 1);
      tx.t = f * RUN * reach;
      body.sil.classList.add("hi"); tray.sil.classList.remove("hi");
      read.textContent = "row " + (10 + Math.round(f * 18));
    }
    B.wake();
  }
  aim(null);
  draw(REST);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "airlinecart",
  means: "An airline drinks trolley in the aisle: it rolls down the aisle to the row under the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.3, 0.65, 1],
  tour: [[155, 175], [211, 203], [261, 228], null],
  mount,
});
