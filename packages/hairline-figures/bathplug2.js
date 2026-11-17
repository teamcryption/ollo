/**
 * Bath tap: a single-lever bath mixer on the tub's deck, a round foot, a
 * column, a spout reaching out and the lever on top. At rest the lever sits
 * closed, bright. Over the tap the lever swings round and lifts to run the
 * water. The slider is how far it swings.
 */
const { Cam, circ, fit, hull, poly, proj, prism, rings, rrect, facing, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid } = HL;

const ZT = 34, LL = 34;
const toR = (d) => (d * Math.PI) / 180;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.9);
  fit(C, [[-14, -14, 0], [36, 0, 0], [0, LL + 2, ZT + 6], [0, -LL, ZT + 22], [LL, 0, ZT + 20], [-8, 14, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, 13, 40), disc(0, 0, 11.5, 40), 0, 2.5));
  put(solid(g), prism(P, front, disc(0, 0, 6.5), disc(0, 0, 5.5), 2.5, ZT));
  const [sr, si] = rings(0, -3.4, 34, 3.4, 3.2, 1);
  put(solid(g), prism(P, front, sr, si, ZT - 10, ZT - 4));
  put(solid(g), prism(P, front, disc(31, 0, 3.4, 20), null, ZT - 15, ZT - 10));
  put(solid(g), prism(P, front, disc(0, 0, 7, 32), disc(0, 0, 6, 32), ZT, ZT + 5));
  const lever = solid(g);
  lever.sil.classList.add("hi");
  const lr = rrect(-4, -3.2, LL, 3.2, 3, 6), li = rrect(-2.5, -1.8, LL - 1.5, 1.8, 1.6, 6);
  const sw = tween(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const psi = toR(90 - t), phi = toR(8 + t * 0.3);
    const cp = Math.cos(phi), sp = Math.sin(phi), cs = Math.cos(psi), ss = Math.sin(psi);
    const Tf = (u, v, w) => { const lx = u * cp - w * sp, lz = u * sp + w * cp; return [lx * cs - v * ss, lx * ss + v * cs, ZT + 5 + lz]; };
    const a = lr.map((q) => P(...Tf(q.u, q.v, 0))), b = lr.map((q) => P(...Tf(q.u, q.v, 3.5)));
    put(lever, { sil: poly(hull(a.concat(b))), crease: poly(li.map((q) => P(...Tf(q.u, q.v, 3.5)))) });
  }
  const B = register(stage, (_dt, now) => { draw(tval(sw, now)); return !tdone(sw, now); });
  bag.add(B.unregister);
  const mid = P(8, 8, ZT / 2);
  let on = false;
  function setOn(v) {
    on = v;
    tset(sw, on ? reach : 0, performance.now(), 0);
    read.textContent = on ? "on" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: ([x, y]) => { const v = Math.abs(x - mid[0]) < 140 && Math.abs(y - mid[1]) < 120; if (v !== on) setOn(v); },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) setOn(true); }, destroy: bag.dispose };
}

hairline({
  name: "bathplug2",
  means: "A single-lever bath mixer on the tub deck: over it, the lever swings round and lifts to run the water.",
  rules: [1, 3, 5, 8],
  range: [40, 90, 110],
  tour: [[145, 152], [283, 199], [233, 243], null],
  mount,
});
