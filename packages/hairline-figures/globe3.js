/**
 * Armillary sphere: a cage of rings on a stand, two meridians, a tilted
 * ecliptic band and a fixed equator round a small earth on its axis. The
 * pointer's side is where the sphere turns: the cage swivels on a spring
 * about its axis. At rest it is turned a little, the ecliptic bright. The
 * slider is how far one sweep of the pointer turns it.
 *
 * The pattern: a continuous aim (a spring on one angle); the hit is the
 * pointer's screen x, which never moves.
 */
const {
  Cam, circ, facing, fit, poly, prism, proj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 44, CZ = 64, REST = 0.5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-R, -R, CZ], [R, R, CZ], [R, -R, CZ], [-R, R, CZ], [0, 0, CZ + R + 6], [-26, -26, 0], [26, 26, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(26, 56), circ(23.8, 56), 0, 5));
  put(solid(g), prism(P, front, circ(3, 16), null, 5, CZ - R - 2));
  put(solid(g), prism(P, front, circ(8, 32), circ(6.6, 32), CZ - R - 6, CZ - R - 2));
  // a ring of radius r, tilted about x by tilt, turned about z by rot
  const ring = (r, tilt, rot) => {
    const pts = [], ct = Math.cos(tilt), st = Math.sin(tilt), cr = Math.cos(rot), sr = Math.sin(rot);
    for (let i = 0; i < 72; i++) {
      const t = (i / 72) * Math.PI * 2, x = r * Math.cos(t), y0 = r * Math.sin(t);
      const y = y0 * ct, z = y0 * st;
      pts.push(P(x * cr - y * sr, x * sr + y * cr, CZ + z));
    }
    return poly(pts);
  };
  const back = mk("g", {}, g);
  mk("path", { class: "nf lo", d: "M" + P(0, 0, CZ - R - 2).join(",") + "L" + P(0, 0, CZ + R + 6).join(",") }, back);
  put(solid(back), prism(P, front, circ(9, 36), circ(7.6, 36), CZ - 6, CZ + 6));
  mk("path", { class: "nf", d: ring(R, 0, 0) }, g);
  const m1 = mk("path", { class: "nf sil" }, g), m2 = mk("path", { class: "nf" }, g), ec = mk("path", { class: "nf sil hi" }, g);
  const sp = spring(REST);
  let last = NaN;
  function draw(a) {
    if (Math.abs(a - last) < 1e-4) return;
    last = a;
    m1.setAttribute("d", ring(R, Math.PI / 2, a));
    m2.setAttribute("d", ring(R - 3, Math.PI / 2, a + Math.PI / 2));
    ec.setAttribute("d", ring(R - 6, 0.41 + Math.PI / 2 * 0.0 + 0.55, a + 0.4));
  }
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function aim(p) {
    if (!p) { sp.t = REST; read.textContent = "rest"; }
    else {
      const u = Math.max(-1, Math.min(1, (p[0] - 200) / 150));
      sp.t = REST + u * Math.PI * 0.9 * reach;
      read.textContent = Math.round(((sp.t * 180) / Math.PI + 360) % 360) + "°";
    }
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "globe3",
  means: "An armillary sphere on a stand: its cage of meridian and ecliptic rings swivels about the axis toward the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.4],
  tour: [[140, 120], [260, 170], [200, 210], null],
  mount,
});
