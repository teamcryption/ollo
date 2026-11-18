/**
 * Burr coffee grinder: a squat body with a grounds bin in front, a dial
 * collar on top and a tall tapered hopper with a lid. The pointer over the
 * hopper lifts it off the collar and turns it, the way it unlocks; the
 * dial's tick turns with it. At rest the hopper sits a little proud,
 * bright. The slider is the lift.
 *
 * The pattern: one part lifting off its seat (cloches).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, flatDot, place,
} = HL;

const ZB = 34, ZC = 40, HH = 30, REST = 3;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxL = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-24, -24, 0], [24, 24, 0], [24, -24, 0], [-24, 24, 0], [0, 0, ZC + HH + 31], [20, 20, ZC + HH + 30], [-20, -20, ZC + HH + 30]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-23, -23, 23, 23, 9, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, ZB));
  const [dr, di] = rings(10, -13, 24, 13, 3, 1.2);
  put(solid(g), prism(P, front, dr, di, 4, 18));
  put(solid(g), prism(P, front, disc(0, 0, 17), disc(0, 0, 15.4), ZB, ZC));
  const tick = flatDot(g, C, 1.6, "dot m");
  const hop = solid(g), lid = solid(g);
  hop.sil.classList.add("hi");
  const lt = tween(REST);
  let last = NaN;
  function draw(now) {
    const l = tval(lt, now);
    if (l !== last) {
      last = l;
      const z0 = ZC + l, a = (l / 30) * 1.4;
      hop.sil.setAttribute("d", poly(hull(ringAt(P, disc(0, 0, 12), z0).concat(ringAt(P, disc(0, 0, 20, 48), z0 + HH)))));
      hop.cr.setAttribute("d", poly(ringAt(P, disc(0, 0, 18.6, 48), z0 + HH)));
      put(lid, prism(P, front, disc(0, 0, 20.6, 48), disc(0, 0, 18.8, 48), z0 + HH, z0 + HH + 4));
      place(tick, P(17 * Math.cos(0.8 + a), 17 * Math.sin(0.8 + a), ZC));
    }
    return !tdone(lt, now);
  }
  const B = register(stage, (_dt, now) => draw(now));
  bag.add(B.unregister);

  const lo = P(0, 0, ZC)[1], hi = P(0, 0, ZC + HH + 8)[1], cx = P(0, 0, 0)[0];
  const hit = ([sx, sy]) => (Math.abs(sx - cx) < 50 && sy < lo + 10 && sy > hi - 24 ? 0 : -1);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(lt, a < 0 ? REST : maxL, performance.now(), 0);
    read.textContent = a < 0 ? "rest" : "hopper";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxL = v; const a = act; act = -2; setActive(a); }, destroy: bag.dispose };
}

hairline({
  name: "coffeegrinder2",
  means: "A burr coffee grinder: the hopper lifts off its dial collar and turns, and the dial's tick turns with it.",
  rules: [1, 4, 5, 6],
  range: [10, 18, 26],
  tour: [[200, 141], [214, 110], [186, 172], null],
  mount,
});
