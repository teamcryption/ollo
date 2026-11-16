/**
 * Document camera: a base plate with a post, and an arm carrying the camera head that swings over the plate to aim at the pointer. The head is the bright mark.
 */
const { Cam, fit, hull, poly, proj, rrect, circ, unproj, clamp, rad, spring, stepS, disposer, mk, pointer, register, solid } = HL;

const R = (x0, y0, x1, y1, r, b) => [rrect(x0, y0, x1, y1, r, 4), rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(r - b, 0.5), 4)];
const D = (x, y, r, b) => [r, r - b].map((rr) => circ(rr, 28).map((q) => ({ ...q, u: q.u + x, v: q.v + y })));
// [ring, inner, z0, z1, moves, bright]
const PARTS = [R(-50,-50,50,50,8,2).concat([0,4,false,false]), R(-30,-30,30,30,2,1).concat([4,4.6,false,false]), R(-44,-44,-32,-32,4,1.5).concat([4,52,false,false]), R(-8,-6,58,6,5,1.5).concat([52,58,true,false]), R(40,-12,62,12,6,2).concat([42,52,true,true])];
const XF = (x, y, z, v) => { const a = rad(45 + v), c = Math.cos(a), s = Math.sin(a); return [-38 + x * c - y * s, -38 + x * s + y * c, z]; };
const REST = -12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-50,-50,0],[50,50,0],[50,-50,0],[-50,50,0],[-38,-38,62],[50,50,62],[60,-10,62],[-10,60,62]], 200, 160);
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
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, 0); aim(clamp((Math.atan2(y + 38, x + 38) * 180 / Math.PI) - 45, -reach, reach)); },
    leave: () => aim(REST),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "booklamp",
  means: "A document camera: the arm on its post swings the camera head over the base plate to aim at the pointer.",
  rules: [1, 3, 5, 8],
  range: [20, 40, 40],
  tour: [[143, 224], [121, 191], [279, 202], null],
  mount,
});
