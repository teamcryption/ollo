/**
 * Monorail: a single beam on T-pylons and one rounded car riding on it. The
 * car slides along the beam to the point under the pointer, on a spring, and
 * the read-out gives its place along the line. At rest it waits at the
 * first third, bright. The slider is the car's length.
 *
 * The pattern: one part sliding along a fixed rail (slide).
 */
const {
  Cam, clamp, fit, facing, prism, proj, rings, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 150, BW = 7, BZ0 = 26, BZ1 = 34, CW = 20, CH = 22, REST = 52;
const PYL = [16, 75, 134];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let len = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[0, -CW / 2, 0], [L, CW / 2, 0], [0, CW / 2, BZ1 + CH], [L, -CW / 2, BZ1 + CH], [L, CW / 2, 0]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  for (const x of PYL) {
    const [r, i] = rings(x - 9, -9, x + 9, 9, 3, 1.2);
    put(solid(g), prism(P, front, r, i, 0, 2));
    const [cr, ci] = rings(x - 3, -3, x + 3, 3, 1.5, 0.8);
    put(solid(g), prism(P, front, cr, ci, 2, BZ0 - 4));
    const [hr, hi] = rings(x - 4, -8, x + 4, 8, 2, 1);
    put(solid(g), prism(P, front, hr, hi, BZ0 - 4, BZ0));
  }
  const [br, bi] = rings(-2, -BW / 2, L + 2, BW / 2, 2, 1);
  put(solid(g), prism(P, front, br, bi, BZ0, BZ1));

  const car = solid(mk("g", {}, g)), win = mk("path", { class: "nf lo" }, car.g), door = mk("path", { class: "nf lo" }, car.g);
  const x = spring(REST);
  let last = NaN, lastLen = NaN;
  function draw(cx) {
    if (cx === last && len === lastLen) return;
    last = cx; lastLen = len;
    const a = cx - len / 2, b = cx + len / 2, y0 = -CW / 2, y1 = CW / 2;
    const [r, i] = rings(a, y0, b, y1, 9, 1.6);
    put(car, prism(P, front, r, i, BZ1, BZ1 + CH));
    // the window band and a door on the near side
    let w = "";
    for (let k = 0; k < 4; k++) {
      const u0 = a + 8 + k * (len - 16) / 4 + 1.5, u1 = a + 8 + (k + 1) * (len - 16) / 4 - 1.5;
      const pts = [[u0, BZ1 + 12], [u1, BZ1 + 12], [u1, BZ1 + 18], [u0, BZ1 + 18]].map(([u, z]) => P(u, y1, z));
      w += seg(pts[0], pts[1]) + seg(pts[1], pts[2]) + seg(pts[2], pts[3]) + seg(pts[3], pts[0]);
    }
    win.setAttribute("d", w);
    const d0 = cx - 3, d1 = cx + 3;
    door.setAttribute("d", seg(P(d0, y1, BZ1 + 1.5), P(d0, y1, BZ1 + 10)) + seg(P(d1, y1, BZ1 + 1.5), P(d1, y1, BZ1 + 10)));
  }
  const B = register(stage, (dt) => { const m = stepS(x, dt); draw(x.x); return m; });
  bag.add(B.unregister);
  car.sil.classList.add("hi");

  let cur = REST;
  function aim(t) {
    cur = t;
    x.t = clamp(t, len / 2, L - len / 2);
    read.textContent = t === REST ? "rest" : "km " + (x.t / L * 9).toFixed(1);
    B.wake();
  }
  aim(REST);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [wx, wy] = unproj(C, sx, sy, BZ1);
      if (Math.abs(wy) < 40 && wx > -20 && wx < L + 20) aim(wx); else aim(REST);
    },
    leave: () => aim(REST),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { len = v; aim(cur); }, destroy: bag.dispose };
}

hairline({
  name: "monorail",
  means: "A monorail car on a single beam: it slides along the line to the point under the pointer, and returns to its stop when left.",
  rules: [1, 3, 5, 8],
  range: [40, 56, 72],
  tour: [[254, 178], [130, 130], [200, 150], null],
  mount,
});
