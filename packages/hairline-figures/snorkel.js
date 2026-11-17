/**
 * Snorkel: a dive mask, its soft skirt round a two-lobed lens with the nose
 * pocket below, and the snorkel tube clipped up its side with a mouthpiece
 * at the foot. The pointer turns the whole mask to look toward it. At rest
 * the mask is turned a little aside, its lens bright.
 * The slider is how far the mask may turn.
 */
const { Cam, clamp, fillet, fit, hull, poly, proj, rad, spring, stepS, disposer, mk, pointer, register, solid } = HL;

const ZC = 70, T = 12, BASE = 45, REST = 16;
const RIM = fillet([[-32, 16], [32, 16], [32, -8], [9, -16], [0, -7], [-9, -16], [-32, -8]], [12, 12, 9, 5, 3, 5, 9], 4);
const LENS = fillet([[-26, 11], [26, 11], [26, -5], [8, -10], [0, -3], [-8, -10], [-26, -5]], [8, 8, 6, 4, 2, 4, 6], 4);
const TUBE = fillet([[-44, 62], [-37, 62], [-37, -12], [-26, -20], [-26, -28], [-44, -22]], [3, 3, 6, 2, 2, 6], 4);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-36, 36, ZC + 62], [36, -36, ZC + 62], [-36, 36, ZC - 30], [36, -36, ZC - 30], [0, 0, ZC + 64]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const tube = solid(g), mask = solid(g);
  const lens = mk("path", { class: "nf sil hi" }, mask.g);
  function at(a, s, z, d) {
    const ux = -Math.sin(a), uy = Math.cos(a), nx = Math.cos(a), ny = Math.sin(a);
    return P(ux * s + nx * d, uy * s + ny * d, ZC + z);
  }
  const shape = (a, pts, d) => pts.map(([s, z]) => at(a, s, z, d));
  let last = NaN;
  function draw(off) {
    if (off === last) return;
    last = off;
    const a = rad(BASE + off);
    tube.sil.setAttribute("d", poly(hull(shape(a, TUBE, -T / 2 - 3).concat(shape(a, TUBE, -T / 2 - 6)))));
    tube.cr.setAttribute("d", poly(shape(a, TUBE, -T / 2 - 3)));
    mask.sil.setAttribute("d", poly(hull(shape(a, RIM, T / 2).concat(shape(a, RIM, -T / 2)))));
    mask.cr.setAttribute("d", poly(shape(a, RIM, T / 2)));
    lens.setAttribute("d", poly(shape(a, LENS, T / 2 + 0.5)));
    read.textContent = (off >= 0 ? "+" : "") + Math.round(off) + "°";
  }
  const sp = spring(REST);
  let resting = true;
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); if (!m && resting) read.textContent = "rest"; return m; });
  bag.add(B.unregister);
  function aim(p) {
    resting = !p;
    sp.t = p ? clamp((p[0] - 200) / 90, -1, 1) * reach : REST;
    B.wake();
  }
  draw(REST);
  read.textContent = "rest";
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "snorkel",
  means: "A dive mask with its snorkel clipped on: the whole mask turns to look toward the pointer.",
  rules: [1, 3, 5, 8],
  range: [20, 55, 65],
  tour: [[324, 206], [76, 188], [260, 200], null],
  mount,
});
