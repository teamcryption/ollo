/**
 * Stretch wrapper: a round turntable with a wrapped pallet load on it, the
 * mast and film carriage standing behind. The pointer turns the turntable so
 * the load's corner faces it. At rest the load sits a little turned and the
 * film carriage is bright. The slider is how far the load follows.
 */
const { Cam, facing, fit, open, prism, proj, rings, ringAt, rrect, run, unproj, disposer, mk, pointer, put, register, solid, spring, stepS } = HL;
const RT = 36, ZT = 6, ZP = 12, ZL = 54, REST = 0.3;
function rot(ring, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: c * q.u - s * q.v, v: s * q.u + c * q.v, nu: c * q.nu - s * q.nv, nv: s * q.nu + c * q.nv }));
}
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gain = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-RT, -RT, 0], [RT, RT, 0], [RT, -RT, 0], [-RT, RT, 0], [-5, -62, 96], [0, 0, ZL]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const mast = solid(g), [mr, mi] = rings(-5, -64, 5, -54, 2.5, 1);
  put(mast, prism(P, front, mr, mi, 0, 96));
  const car = solid(g), [cr, ci] = rings(-9, -55, 9, -47, 2, 0.8);
  put(car, prism(P, front, cr, ci, 34, 46));
  const table = solid(g);
  put(table, prism(P, front, rrect(-RT, -RT, RT, RT, RT, 14), rrect(-RT + 1.6, -RT + 1.6, RT - 1.6, RT - 1.6, RT - 1.6, 14), 0, ZT));
  const [pr, pi] = rings(-25, -25, 25, 25, 2, 1), [lr, li] = rings(-22, -22, 22, 22, 4, 1.4);
  const pal = solid(g), load = solid(g), bands = mk("path", { class: "nf lo" }, load.g);
  const ang = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    put(pal, prism(P, front, rot(pr, a), rot(pi, a), ZT, ZP));
    const L = rot(lr, a);
    put(load, prism(P, front, L, rot(li, a), ZP, ZL));
    const fr = run(L, front);
    bands.setAttribute("d", [22, 32, 42].map((z) => open(ringAt(P, fr, z))).join(""));
  }
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  function wrap(d) { const q = Math.PI / 2; return d - q * Math.round(d / q); }
  function set(p) {
    let act = false, t = REST;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 30), r = Math.hypot(x, y);
      if (r < 70) { act = true; t = REST + wrap(Math.atan2(y, x) - Math.PI / 4 - REST) * gain; }
    }
    ang.t = t;
    load.sil.classList.toggle("hi", act);
    car.sil.classList.toggle("hi", !act);
    read.textContent = act ? Math.round(((t * 180) / Math.PI) % 90 + 90) % 90 + "°" : "rest";
    B.wake();
  }
  set(null);
  bag.add(pointer(stage, { move: (p) => set(p), leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gain = v; }, destroy: bag.dispose };
}

hairline({
  name: "stretchwrap",
  means: "A pallet stretch wrapper: the turntable turns the wrapped load to face the pointer, the film carriage waiting on its mast.",
  rules: [1, 3, 5, 8],
  range: [0.2, 1, 1],
  tour: [[151, 214], [239, 236], [167, 167], null],
  mount,
});
