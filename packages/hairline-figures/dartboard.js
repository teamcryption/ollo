/**
 * Dartboard: a round board on a post, its face cut by rings and wires, the
 * bull at its centre. The board swings on its post to face the pointer, a
 * spring on the pointer's screen x. At rest it is turned a little aside and
 * the bull is the bright mark; while the pointer aims, the rim takes it.
 * The slider is how far the board may swing.
 *
 * The pattern: one part turning to face the pointer (aim).
 */
const {
  Cam, fit, hull, open, poly, prism, proj, facing, rings, clamp, spring, stepS, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 40, T = 5, Z = 62, REST = -18;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-R, -R, 0], [R, R, 0], [-R, R, Z + R], [R, -R, Z + R], [0, 0, Z - R]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-22, -22, 22, 22, 10, 2);
  put(solid(g), prism(P, front, fr, fi, 0, 4));
  const [pr, pi] = rings(-4, -4, 4, 4, 3, 1);
  put(solid(g), prism(P, front, pr, pi, 4, Z - 10));
  const body = mk("path", { class: "sil" }, g);
  const face = mk("path", { class: "nf lo" }, g);
  const wires = mk("path", { class: "nf lo" }, g);
  const bull = mk("path", { class: "nf" }, g);
  const yaw = spring(REST);
  let last = NaN;

  function pt(phi, r, s, d) {
    const n = [Math.cos(phi), Math.sin(phi)], h = [-Math.sin(phi), Math.cos(phi)];
    return P(r * Math.cos(s) * h[0] + d * n[0], r * Math.cos(s) * h[1] + d * n[1], Z + r * Math.sin(s));
  }
  const ring = (phi, r, d, n = 48) => Array.from({ length: n }, (_, i) => pt(phi, r, (i / n) * 2 * Math.PI, d));

  function draw(a) {
    if (a === last) return;
    last = a;
    const phi = rad(45 + a);
    body.setAttribute("d", poly(hull(ring(phi, R, 0).concat(ring(phi, R, -T)))));
    face.setAttribute("d", poly(ring(phi, R, 0)));
    let w = "";
    for (const r of [R * 0.78, R * 0.7, R * 0.46, R * 0.38]) w += poly(ring(phi, r, 0.1, 40));
    for (let i = 0; i < 10; i++) { const s = (i / 10) * 2 * Math.PI + Math.PI / 20; w += open([pt(phi, R * 0.14, s, 0.1), pt(phi, R * 0.78, s, 0.1)]); }
    wires.setAttribute("d", w);
    bull.setAttribute("d", poly(ring(phi, R * 0.1, 0.2, 20)));
  }

  const B = register(stage, (dt) => { const m = stepS(yaw, dt); draw(yaw.x); return m; });
  bag.add(B.unregister);

  let on = null;
  function aim(p) {
    const act = !!p;
    const a = act ? clamp(((p[0] - 200) / 160) * reach, -reach, reach) : REST;
    yaw.t = a;
    if (on !== act) { on = act; body.classList.toggle("hi", act); bull.classList.toggle("hi", !act); }
    read.textContent = act ? (a >= 0 ? "+" : "") + Math.round(a) + "°" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "dartboard",
  means: "A dartboard on a post that swings to face the pointer; at rest it sits turned aside with the bull lit.",
  rules: [1, 3, 5, 8],
  range: [15, 35, 55],
  tour: [[285, 151], [115, 151], [200, 160], null],
  mount,
});
