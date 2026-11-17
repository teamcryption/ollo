/**
 * Hygrometer: a hair hygrometer's round dial on a post and foot, its face
 * ringed with ticks and a long needle. The pointer turns the whole dial on
 * its post to face it, and the needle swings with it across the scale. At
 * rest the dial is turned a little aside, the needle bright mid-scale.
 * The slider is how far the dial may turn.
 */
const { Cam, clamp, facing, fit, hull, poly, prism, proj, rings, rad, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const R = 40, T = 9, ZC = 64, BASE = 57, REST = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-30, -30, 0], [30, 30, 0], [-R, R, ZC + R], [R, -R, ZC + R], [0, 0, ZC + R]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const foot = solid(g), [fr, fi] = rings(-24, -24, 24, 24, 12, 1.6);
  put(foot, prism(P, front, fr, fi, 0, 7));
  const post = solid(g), [pr, pi] = rings(-3.5, -3.5, 3.5, 3.5, 3.5, 0.8);
  put(post, prism(P, front, pr, pi, 7, ZC - R + 6));
  const dial = solid(g);
  const ticks = mk("path", { class: "nf lo" }, dial.g);
  const needle = mk("path", { class: "sil hi" }, dial.g);

  function at(a, r, t, d) {
    const ux = -Math.sin(a), uy = Math.cos(a), nx = Math.cos(a), ny = Math.sin(a);
    return P(ux * r * Math.cos(t) + nx * d, uy * r * Math.cos(t) + ny * d, ZC + r * Math.sin(t));
  }
  function circle(a, r, d) { const o = []; for (let i = 0; i < 40; i++) o.push(at(a, r, (i / 40) * Math.PI * 2, d)); return o; }
  let last = NaN;
  function draw(off) {
    if (off === last) return;
    last = off;
    const a = rad(BASE + off), f = T / 2;
    dial.sil.setAttribute("d", poly(hull(circle(a, R, f).concat(circle(a, R, -f)))));
    dial.cr.setAttribute("d", poly(circle(a, R - 4, f)));
    let tk = "";
    for (let i = 0; i <= 12; i++) { const t = rad(210 - 20 * i); tk += seg(at(a, R - 8, t, f), at(a, R - (i % 3 ? 11 : 14), t, f)); }
    ticks.setAttribute("d", tk);
    const h = clamp(0.5 + off / 140, 0.04, 0.96), t = rad(210 - 240 * h), w = rad(90);
    needle.setAttribute("d", poly([at(a, 2.2, t + w, f + 0.5), at(a, R - 9, t, f + 0.5), at(a, 2.2, t - w, f + 0.5), at(a, 7, t + Math.PI, f + 0.5)]));
    read.textContent = "rh " + Math.round(h * 100) + "%";
  }
  const sp = spring(REST);
  let resting = true;
  const B = register(stage, (dt) => {
    const m = stepS(sp, dt);
    draw(sp.x);
    if (!m && resting) read.textContent = "rest";
    return m;
  });
  bag.add(B.unregister);
  function aim(p) {
    resting = !p;
    sp.t = p ? clamp((p[0] - 200) / 90, -1, 1) * reach : REST;
    B.wake();
  }
  draw(REST);
  read.textContent = "rest";
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "hygrometer",
  means: "A hair hygrometer: the round dial turns on its post to face the pointer and its needle swings across the scale.",
  rules: [1, 3, 5, 8],
  range: [20, 60, 70],
  tour: [[291, 121], [109, 102], [250, 115], null],
  mount,
});
