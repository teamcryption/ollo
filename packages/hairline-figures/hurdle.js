/**
 * Track hurdle: two L feet on the track, two uprights and a top bar. The
 * pointer clips the bar: the whole frame tips forward on its feet, further
 * the further right the pointer sits. At rest it leans a little, bar bright.
 * The slider is how far it can tip.
 */
const { Cam, fit, hull, poly, proj, clamp, lerp, rad, spring, stepS, disposer, mk, pointer, register } = HL;

const W = 100, H = 54, FZ = 3, REST = 8;
const corners = (x0, y0, z0, x1, y1, z1) => { const o = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) o.push([x, y, z]); return o; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-4, -40, 0], [W + 4, 40, 0], [-4, -40, H + 6], [W + 4, 40, H + 6]], 200, 168);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const track = mk("path", { class: "dash nf" }, g);
  track.setAttribute("d", poly([P(-30, -44, 0), P(W + 30, -44, 0), P(W + 30, 44, 0), P(-30, 44, 0)]));
  const feet = [0, W].map(() => mk("path", { class: "sil" }, g));
  const posts = [0, W].map(() => mk("path", { class: "sil" }, g));
  const bar = mk("path", { class: "sil hi" }, g);
  const bline = mk("path", { class: "nf lo" }, g);
  for (const [k, x] of [0, W].entries()) feet[k].setAttribute("d", poly(hull(corners(x - 3, -30, 0, x + 3, 4, FZ).map((p) => P(...p)))));
  const tip = spring(REST);
  // tip about the line y = 0, z = FZ: the frame falls toward +y (down-left on screen)
  const T = ([x, y, z], a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return [x, y * c + (z - FZ) * s, FZ - y * s + (z - FZ) * c]; };
  const hp = (pts, a) => poly(hull(pts.map((p) => P(...T(p, a)))));
  let last = NaN;
  function draw(a) {
    if (a === last) return; last = a;
    for (const [k, x] of [0, W].entries()) posts[k].setAttribute("d", hp(corners(x - 2.5, -2.5, FZ, x + 2.5, 2.5, H - 2), a));
    bar.setAttribute("d", hp(corners(-6, -1.5, H - 12, W + 6, 1.5, H), a));
    const m = [[-6, 1.5, H - 6], [W + 6, 1.5, H - 6]].map((p) => P(...T(p, a)));
    bline.setAttribute("d", "M" + m[0].join(",") + "L" + m[1].join(","));
  }
  const B = register(stage, (dt) => { const mv = stepS(tip, dt); draw(tip.x); return mv; });
  bag.add(B.unregister);
  const L = P(-6, 0, 0)[0], R = P(W + 6, 0, 0)[0], top = P(0, -40, H + 6)[1], bot = P(W, 40, 0)[1];
  function move([sx, sy]) {
    if (sx < L - 20 || sx > R + 20 || sy < top - 20 || sy > bot + 20) return leave();
    const t = clamp((sx - L) / (R - L), 0, 1);
    tip.t = lerp(20, 20 + 60 * reach, t);
    read.textContent = Math.round(tip.t) + "°";
    B.wake();
  }
  function leave() { tip.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "hurdle",
  means: "A track hurdle on its feet: the pointer clips the bar and the frame tips forward, further toward the right.",
  rules: [1, 3, 5],
  range: [0.4, 1, 1],
  tour: [[129, 91], [200, 126], [271, 162], null],
  mount,
});
