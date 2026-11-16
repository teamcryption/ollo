/**
 * Letter tray: two stacked trays on corner risers. The pointer slides the upper tray out toward it; the upper tray is the bright mark.
 */
const { Cam, fit, hull, poly, proj, rrect, circ, unproj, clamp, rad, spring, stepS, disposer, mk, pointer, register, solid } = HL;

const R = (x0, y0, x1, y1, r, b) => [rrect(x0, y0, x1, y1, r, 4), rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(r - b, 0.5), 4)];
const D = (x, y, r, b) => [r, r - b].map((rr) => circ(rr, 28).map((q) => ({ ...q, u: q.u + x, v: q.v + y })));
// [ring, inner, z0, z1, moves, bright]
const PARTS = [R(-40,-30,40,30,5,2.2).concat([0,9,false,false]), R(-34,-24,34,24,2,1).concat([9,9.6,false,false]), R(-38,-28,-33,-23,1.5,1).concat([9,22,false,false]), R(-38,23,-33,28,1.5,1).concat([9,22,false,false]), R(33,-28,38,-23,1.5,1).concat([9,22,false,false]), R(33,23,38,28,1.5,1).concat([9,22,false,false]), R(-40,-30,40,30,5,2.2).concat([22,31,true,true]), R(-33,-23,33,23,2,1).concat([31,31.6,true,false]), R(-30,-20,30,20,1,1).concat([31.6,32.2,true,false])];
const XF = (x, y, z, v) => [x + v, y, z];
const REST = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-40,-30,0],[40,30,0],[40,-30,0],[-40,30,0],[-40,-30,34],[70,30,34],[40,30,34]], 200, 160);
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
  function aim(v) { sp.t = v; read.textContent = v === REST ? "rest" : Math.round(v) + " mm"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, 0); aim(clamp((x + 40) * reach / 80, 0, reach)); },
    leave: () => aim(REST),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "pigeonholes",
  means: "Two stacked letter trays on corner risers: the upper tray slides out toward the pointer.",
  rules: [1, 3, 5, 8],
  range: [10, 30, 30],
  tour: [[264, 225], [89, 185], [311, 201], null],
  mount,
});
