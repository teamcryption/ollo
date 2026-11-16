/**
 * Ride on toy: a little push car on a play mat, a chunky body, a seat at the
 * back, four fat wheels and a tall push handle. The pointer is where the car
 * is pushed to: it rolls along the mat on a spring to stand under it. At rest
 * it waits a third of the way along, its handle bright. The slider is how
 * quickly it rolls.
 *
 * The pattern: a continuous aim on the ground plane, which never moves.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, ringAt, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X0 = 26, X1 = 104, REST = 46, W = 24;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-8, -12, 0], [134, W + 12, 0], [134, -12, 0], [-8, W + 12, 0], [X0 - 24, W / 2, 52], [X1 + 24, W / 2, 30]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [mr, mi] = rings(-8, -12, 134, W + 12, 6, 2);
  put(solid(g), prism(P, front, mr, mi, 0, 2));
  const car = mk("g", {}, g);
  const wheel = (x, y) => {
    const a = [], b = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; a.push(P(x + 7 * Math.cos(t), y, 9 + 7 * Math.sin(t))); b.push(P(x + 7 * Math.cos(t), y + 4, 9 + 7 * Math.sin(t))); }
    return [poly(hull(a.concat(b))), poly(y < W / 2 ? b : a)];
  };
  const wf = [mk("path", { class: "sil" }, car), mk("path", { class: "sil" }, car)];
  const hub = [mk("path", { class: "nf lo" }, car), mk("path", { class: "nf lo" }, car)];
  const handle = mk("path", { class: "nf sil" }, car);
  const body = solid(car), seat = solid(car);
  const wn = [mk("path", { class: "sil" }, car), mk("path", { class: "sil" }, car)];
  const hn = [mk("path", { class: "nf lo" }, car), mk("path", { class: "nf lo" }, car)];
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let last = NaN;
  function draw(x) {
    if (Math.abs(x - last) < 1e-3) return;
    last = x;
    [[x - 14, -2, wf, hub, 0], [x + 14, -2, wf, hub, 1], [x - 14, W - 2, wn, hn, 0], [x + 14, W - 2, wn, hn, 1]].forEach(([wx, wy, s, h, i]) => {
      const [d, c] = wheel(wx, wy); s[i].setAttribute("d", d); h[i].setAttribute("d", c);
    });
    const hd = [P(x - 20, 3, 20), P(x - 26, 3, 50), P(x - 26, W - 3, 50), P(x - 20, W - 3, 20)];
    handle.setAttribute("d", "M" + hd.map((p) => p.join(",")).join("L"));
    const [br, bi] = rings(x - 24, 0, x + 24, W, 9, 2);
    put(body, prism(P, front, br, bi, 8, 22));
    const [sr, si] = rings(x - 20, 3, x - 2, W - 3, 5, 1.6);
    put(seat, prism(P, front, sr, si, 22, 28));
  }
  draw(REST);
  handle.classList.add("hi");

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function aim(x) {
    sp.t = x == null ? REST : Math.max(X0, Math.min(X1, x));
    read.textContent = x == null ? "rest" : "push " + Math.round(((sp.t - X0) / (X1 - X0)) * 9);
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); aim(x > -30 && x < 160 && y > -40 && y < W + 40 ? x : null); },
    leave: () => aim(null),
  }));
  read.textContent = "rest";
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "kidscar",
  means: "A push car on a play mat: it rolls along the mat to stand under the pointer, its push handle bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[134, 136], [200, 190], [258, 232], null],
  mount,
});
