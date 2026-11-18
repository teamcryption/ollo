/**
 * Barrel organ: a street organ, a tall rounded case on four short feet with
 * a lid, a row of pipes rising in an arch on its front panel, and the crank
 * on its side that turns the barrel. The pointer winds the crank: the
 * further right it moves across the organ, the further the handle turns
 * round its hub. At rest the crank hangs half down, its handle bright. The
 * slider is how far the crank winds.
 */
const { Cam, circ, clamp, facing, fillet, fit, hull, poly, prism, proj, rings, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const X = 18, Y = 15, Z0 = 7, Z1 = 50, HUB = [X + 1, 0, 30], ARM = 22, HL_ = 20, A0 = -0.7, MAX = 3.6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[-X, -Y, 0], [X, Y, 0], [-X, Y, Z1 + 4], [X, -Y, Z1 + 4], [X + 8 + HL_, -ARM - 4, HUB[2]], [X + 8 + HL_, ARM + 4, HUB[2]], [X + 8 + HL_, 0, HUB[2] + ARM + 4], [X + 8 + HL_, 0, HUB[2] - ARM - 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const [x, y] of [[-X + 4, -Y + 4], [X - 4, -Y + 4], [-X + 4, Y - 4], [X - 4, Y - 4]]) put(solid(g), prism(P, front, ...rings(x - 2.5, y - 2.5, x + 2.5, y + 2.5, 1.2, 0.5), 0, Z0));
  put(solid(g), prism(P, front, ...rings(-X, -Y, X, Y, 6, 1.4), Z0, Z1));
  put(solid(g), prism(P, front, ...rings(-X - 2, -Y - 2, X + 2, Y + 2, 7, 1), Z1, Z1 + 3));
  let pd = "";
  for (let i = 0; i < 9; i++) {
    const x = -14 + i * 3.5, h = 26 - Math.abs(i - 4) * 3.5, z0 = 15;
    pd += poly(fillet([P(x - 1.2, Y, z0), P(x + 1.2, Y, z0), P(x + 1.2, Y, z0 + h), P(x - 1.2, Y, z0 + h)], [0.4, 0.4, 1.1, 1.1], 3));
  }
  pd += poly(fillet([P(-16, Y, 12), P(16, Y, 12), P(16, Y, 45), P(-16, Y, 45)], [2, 2, 2, 2], 3));
  mk("path", { class: "nf lo", d: pd }, g);
  const boss = mk("path", {}, g), arm = mk("path", { class: "sil" }, g), handle = mk("path", { class: "sil hi" }, g);
  const sp = spring(A0);
  let lim = MAX * value, last = NaN, over = null;
  function draw() {
    const a = sp.x;
    if (Math.abs(a - last) < 1e-4) return;
    last = a;
    const [hx, hy, hz] = HUB, ey = hy + ARM * Math.cos(a), ez = hz + ARM * Math.sin(a);
    boss.setAttribute("d", poly(hull(circ(4.5, 20).flatMap((q) => [P(hx - 1, hy + q.u, hz + q.v), P(hx + 4, hy + q.u, hz + q.v)]))));
    arm.setAttribute("d", poly(hull(circ(3.5, 20).flatMap((q) => [P(hx + 4, hy + q.u, hz + q.v), P(hx + 7, hy + q.u, hz + q.v), P(hx + 4, ey + q.u, ez + q.v), P(hx + 7, ey + q.u, ez + q.v)]))));
    handle.setAttribute("d", poly(hull(circ(4.5, 20).flatMap((q) => [P(hx + 7, ey + q.u, ez + q.v), P(hx + 7 + HL_, ey + q.u, ez + q.v)]))));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  function turn(t) {
    sp.t = t === null ? A0 : A0 + t * lim;
    read.textContent = t === null ? "rest" : Math.round(((sp.t - A0) * 180) / Math.PI) + "°";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { over = clamp((p[0] - 90) / 240, 0, 1); turn(over); },
    leave: () => { over = null; turn(null); },
  }));
  bag.add(() => svg.replaceChildren());
  draw(); turn(null);
  return { set: (v) => { lim = MAX * v; if (over !== null) turn(over); }, destroy: bag.dispose };
}

hairline({
  name: "barrelorgan",
  means: "A street barrel organ: moving the pointer across it winds the crank on its side round and round its hub.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.5],
  tour: [[60, 160], [271, 204], [350, 160], null],
  mount,
});
