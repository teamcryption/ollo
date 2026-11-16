/**
 * Date stamp: a rotary date stamp standing on its ink pad, its frame holding a band of wheels. The pointer tilts the stamp toward it; the frame is the bright mark.
 */
const { Cam, fit, hull, poly, proj, rrect, circ, unproj, clamp, rad, spring, stepS, disposer, mk, pointer, register, solid } = HL;

const R = (x0, y0, x1, y1, r, b) => [rrect(x0, y0, x1, y1, r, 4), rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(r - b, 0.5), 4)];
const D = (x, y, r, b) => [r, r - b].map((rr) => circ(rr, 28).map((q) => ({ ...q, u: q.u + x, v: q.v + y })));
// [ring, inner, z0, z1, moves, bright]
const PARTS = [R(-40,-30,40,30,6,2).concat([0,6,false,false]), R(-32,-22,32,22,3,1.5).concat([6,7,false,false]), R(-22,-14,22,14,3,1.5).concat([7,13,true,false]), R(-18,-10,18,10,4,1.5).concat([13,40,true,true]), R(-12,-12,12,12,2,1).concat([22,30,true,false]), R(-5,-5,5,5,3,1).concat([40,58,true,false]), D(0,0,12,3).concat([58,70,true,false])];
const XF = (x, y, z, v) => { const a = rad(v), c = Math.cos(a), s = Math.sin(a), h = z - 7; return [x * c + h * s, y, 7 + h * c - x * s]; };
const REST = -10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.98);
  fit(C, [[-40,-30,0],[40,30,0],[40,-30,0],[-40,30,0],[-45,0,80],[45,0,80],[0,0,82]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const lift = (r, z, v, m) => r.map((q) => P(...(m ? XF(q.u, q.v, z, v) : [q.u, q.v, z])));
  const parts = PARTS.map(([r, i, z0, z1, m, hi]) => {
    const s = solid(g);
    if (hi) s.sil.classList.add("hi");
    return { r, i, z0, z1, m, s };
  });
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    const first = last !== last;
    last = v;
    for (const p of parts) {
      if (!p.m && !first) continue;
      p.s.sil.setAttribute("d", poly(hull(lift(p.r, p.z0, v, p.m).concat(lift(p.r, p.z1, v, p.m)))));
      p.s.cr.setAttribute("d", poly(lift(p.i, p.z1, v, p.m)));
    }
  }
  draw(REST);
  const sp = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function aim(v) { sp.t = v; read.textContent = v === REST ? "rest" : Math.round(v) + "°"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, 0); aim(clamp(x - y, -reach, reach)); },
    leave: () => aim(REST),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "inkstamp",
  means: "A rotary date stamp on its ink pad: the stamp rocks on the pad toward the pointer, frame and handle together.",
  rules: [1, 3, 5, 8],
  range: [10, 24, 30],
  tour: [[242, 241], [102, 213], [298, 227], null],
  mount,
});
