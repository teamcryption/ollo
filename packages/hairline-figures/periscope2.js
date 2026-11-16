/**
 * Periscope: a toy periscope, a tall square tube with a head at each end
 * facing opposite ways. The pointer is what it looks at: the whole tube turns
 * on a spring until its top window faces the pointer. At rest it looks off to
 * one side, its top window bright.
 */
const {
  Cam, facing, fit, prism, proj, rings, unproj, spring, stepS, fillet,
  disposer, mk, poly, pointer, put, register, solid,
} = HL;

const H = 96, REST = -0.35;
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.3);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([30 * Math.cos(a), 30 * Math.sin(a), 0], [30 * Math.cos(a), 30 * Math.sin(a), H + 20]); }
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C);
  const TUBE = rings(-8, -8, 8, 8, 2.5, 1.2), LOW = rings(-28, -10, 8, 10, 3, 1.4), TOP = rings(-8, -10, 28, 10, 3, 1.4);
  const g = mk("g", {}, svg);
  const foot = solid(g), low = solid(g), lowWin = mk("path", { class: "nf sil" }, g);
  const tube = solid(g), top = solid(g), win = mk("path", { class: "nf sil hi" }, g);
  const sp = spring(REST);
  let drawn = NaN;

  const window = (a, u, z0, z1) => {
    const c = Math.cos(a), s = Math.sin(a);
    const pts = [[-7, z0], [7, z0], [7, z1], [-7, z1]].map(([v, z]) => P(u * c - v * s, u * s + v * c, z));
    return poly(fillet(pts, [1.5, 1.5, 1.5, 1.5]));
  };

  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const T = (r) => turn(r, a);
    const fwd = Math.cos(a) + Math.sin(a) > 0;
    put(foot, prism(P, front, T(rings(-30, -14, 10, 14, 4, 1.6)[0]), T(rings(-30, -14, 10, 14, 4, 1.6)[1]), 0, 3));
    put(low, prism(P, front, T(LOW[0]), T(LOW[1]), 3, 24));
    put(tube, prism(P, front, T(TUBE[0]), T(TUBE[1]), 24, H));
    put(top, prism(P, front, T(TOP[0]), T(TOP[1]), H, H + 20));
    win.setAttribute("d", fwd ? window(a, 28, H + 5, H + 15) : "");
    lowWin.setAttribute("d", fwd ? "" : window(a, -28, 8, 19));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    const aim = over ? Math.atan2(over[1], over[0]) : REST;
    const want = over ? REST + wrap(aim - REST) * Math.min(1, value) : REST;
    sp.t = sp.t + wrap(want - sp.t);
    read.textContent = over ? Math.round(((aim * 180) / Math.PI + 360) % 360) + "°" : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      over = r < 6 || r > 140 ? null : [x, y];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { value = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "periscope2",
  means: "A toy periscope with a head at each end: the tube turns until its top window faces the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[86, 300], [135, 210], [300, 260], null],
  mount,
});
