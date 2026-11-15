/**
 * Pole transformer: a wooden pole with a cross arm and three insulators, and a
 * round transformer can hung on its bracket, two bushings on its lid wired up
 * to the arm. The pointer swings the can out from the pole on its bracket
 * hinge. At rest it hangs slightly out, its lid bright.
 */
const { Cam, circ, facing, fit, prism, proj, rings, unproj, hull, poly, seg, tween, tset, tval, tdone, disposer, mk, pointer, put, register, solid } = HL;

const HZ = 66, RC = 13, DX = 18, H = 30, REST = 5, YS = [-34, 0, 34];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-6, -40, 0], [6, 40, 0], [0, -40, 96], [0, 40, 96], [4 + DX + RC + 30, 0, 40]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(9, 32), circ(8, 32), 0, 1.5));
  put(solid(g), prism(P, front, circ(4, 24), null, 1.5, 94));
  const A = rings(-2.5, -40, 2.5, 40, 1.5, 0.8);
  put(solid(g), prism(P, front, A[0], A[1], 84, 88));
  for (const y of YS) put(solid(g), prism(P, front, circ(2, 16).map((q) => ({ ...q, v: q.v + y })), null, 88, 95));
  const wires = mk("path", { class: "nf lo", d: "" }, g);
  const can = solid(g), b1 = solid(g), b2 = solid(g);
  const ring = circ(RC, 48), inner = circ(RC - 1.5, 48);
  const at = (a, u, v, z) => { const c = Math.cos(a), s = Math.sin(a), x = u + DX; return P(4 + x * c + z * s, v, HZ - x * s + z * c); };
  const cyl = (a, cu, cv, r, z0, z1) => { const pts = []; for (const q of circ(r, 16)) pts.push(at(a, cu + q.u, cv + q.v, z0), at(a, cu + q.u, cv + q.v, z1)); return poly(hull(pts)); };
  const tw = tween(REST);
  let drawn = NaN;
  function draw(now) {
    const a = tval(tw, now) * Math.PI / 180;
    if (a !== drawn) {
      drawn = a;
      const pts = [];
      for (const q of ring) pts.push(at(a, q.u, q.v, 0), at(a, q.u, q.v, -H));
      can.sil.setAttribute("d", poly(hull(pts)));
      can.cr.setAttribute("d", poly(inner.map((q) => at(a, q.u, q.v, 0))));
      b1.sil.setAttribute("d", cyl(a, 2, -6, 2, 0, 7));
      b2.sil.setAttribute("d", cyl(a, 2, 6, 2, 0, 7));
      wires.setAttribute("d", seg(at(a, 2, -6, 7), P(0, -34, 95)) + seg(at(a, 2, 6, 7), P(0, 34, 95)));
    }
    return !tdone(tw, now);
  }
  const B = register(stage, (dt, now) => draw(now));
  bag.add(B.unregister);
  let on = false, amt = 32 * value;
  function retarget() {
    tset(tw, on ? amt : REST, performance.now(), 0);
    can.sil.classList.toggle("hi", on);
    can.cr.classList.toggle("hi", !on);
    read.textContent = on ? "can" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (q) => { const [x, y] = unproj(C, q[0], q[1], HZ - H / 2); on = x > -10 && x < 60 && Math.abs(y) < 30; retarget(); },
    leave: () => { on = false; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { amt = 32 * v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "transformer2",
  means: "A pole-mounted transformer: the pointer swings the round can out from the pole on its bracket hinge, wires following.",
  rules: [1, 4, 5, 8],
  range: [0.6, 1, 1.3],
  tour: [[230, 138], [185, 160], [250, 193], null],
  mount,
});
