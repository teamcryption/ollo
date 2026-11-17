/**
 * Hoof stand: a farrier's stand, a heavy foot plate and a post carrying a
 * cradle with raised lips that the hoof rests in. The pointer tips the
 * cradle on its pivot away from the side it comes from, on a spring. At
 * rest the cradle leans a little, bright. The slider is the tilt.
 *
 * The pattern: a part that tilts on a pivot.
 */
const {
  Cam, clamp, fit, hull, poly, proj, rad, spring, stepS,
  disposer, mk, pointer, register,
} = HL;

const Z0 = 84, REST = 10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-34, -34, 0], [34, 34, 0], [-40, 0, Z0 + 26], [40, 0, Z0 + 26], [-40, 0, Z0 - 10], [40, 0, Z0 - 10]], 200, 165);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const cube = (x0, x1, y0, y1, z0, z1, R) => { const p = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) p.push(R(x, y, z)); return poly(hull(p)); };
  mk("path", { d: cube(-34, 34, -34, 34, 0, 6, P) }, g);
  mk("path", { d: cube(-6, 6, -6, 6, 6, 12, P) }, g);
  mk("path", { d: cube(-4, 4, -4, 4, 12, Z0, P), class: "sil" }, g);
  const yoke = mk("path", {}, g), lipA = mk("path", { class: "sil" }, g), bed = mk("path", { class: "sil hi" }, g), pad = mk("path", { class: "nf lo" }, g), lipB = mk("path", { class: "sil" }, g);
  const ang = spring(REST, { k: 80, c: 12 });
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const R = (x, y, z) => { const dz = z - Z0; return P(x * c - dz * s, y, Z0 + x * s + dz * c); };
    yoke.setAttribute("d", cube(-6, 6, -7, 7, Z0 - 6, Z0 + 2, R));
    lipA.setAttribute("d", cube(-34, -26, -16, 16, Z0 + 2, Z0 + 18, R));
    bed.setAttribute("d", cube(-30, 30, -16, 16, Z0 + 2, Z0 + 8, R));
    pad.setAttribute("d", poly([R(-24, -12, Z0 + 8), R(24, -12, Z0 + 8), R(24, 12, Z0 + 8), R(-24, 12, Z0 + 8)]));
    lipB.setAttribute("d", cube(26, 34, -16, 16, Z0 + 2, Z0 + 18, R));
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  const mid = P(0, 0, Z0 + 6);
  function move([sx, sy]) {
    if (sy < 20 || sy > 300) return leave();
    const dx = sx - mid[0];
    ang.t = -max * Math.sign(dx || 1) * clamp(1 - Math.abs(dx) / 160, 0.3, 1);
    read.textContent = Math.round(Math.abs(ang.t)) + "°";
    B.wake();
  }
  function leave() { ang.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  draw(REST);
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "horseshoe",
  means: "A farrier's hoof stand: the pointer tips the cradle on its post away from the side it comes from, on a spring.",
  rules: [1, 3, 5, 8],
  range: [15, 30, 40],
  tour: [[207, 91], [260, 110], [140, 110], null],
  mount,
});
