/**
 * Ballista: a giant crossbow on a post. A long stock carries a winch at the
 * back and a frame at the front, two arms spring out of the frame and a
 * string runs from their tips round the nock of a bolt. The pointer is the
 * winch: the further back along the stock it goes, the further the string is
 * drawn and the arms bend back, the bolt sliding with it. At rest the bolt is
 * nocked, bright. The slider is how far the string may be drawn.
 *
 * The pattern: a continuous aim (a spring on one draw), picked on the ground.
 */
const {
  Cam, clamp, facing, fit, hull, lerp, poly, prism, proj, rad, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const SZ = 38, XF = 32, ARM = 50, PHI0 = 10, BOLT = 56, REST = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-52, -64, 0], [44, 64, 0], [-52, 64, 0], [44, -64, 0], [XF + BOLT, 0, SZ + 10], [-40, 0, SZ + 16]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // a round rod from a to b, radius r, as a hull of two rings
  const rod = (a, b, r) => {
    const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], n = Math.hypot(...d);
    d[0] /= n; d[1] /= n; d[2] /= n;
    let u = [d[1], -d[0], 0];
    const un = Math.hypot(...u) || 1;
    u = un < 1e-3 ? [1, 0, 0] : [u[0] / un, u[1] / un, 0];
    const w = [d[1] * u[2] - d[2] * u[1], d[2] * u[0] - d[0] * u[2], d[0] * u[1] - d[1] * u[0]];
    const o = [];
    for (const p of [a, b]) for (let i = 0; i < 18; i++) {
      const f = (i / 18) * Math.PI * 2, c = Math.cos(f) * r, s = Math.sin(f) * r;
      o.push(P(p[0] + u[0] * c + w[0] * s, p[1] + u[1] * c + w[1] * s, p[2] + u[2] * c + w[2] * s));
    }
    return poly(hull(o));
  };

  const [br, bi] = rings(-44, -30, 36, 30, 10, 2);
  put(solid(g), prism(P, front, br, bi, 0, 4));
  const [pr, pi] = rings(-6, -5, 4, 5, 3, 1);
  put(solid(g), prism(P, front, pr, pi, 4, SZ - 3));
  const armB = mk("path", { class: "sil" }, g);
  const [sr, si] = rings(-52, -4.5, XF + 8, 4.5, 2, 1);
  put(solid(g), prism(P, front, sr, si, SZ - 3, SZ + 2));
  mk("path", { d: rod([-46, -12, SZ + 5], [-46, 12, SZ + 5], 4.5), class: "sil" }, g);
  const [fr, fi] = rings(XF - 5, -12, XF + 5, 12, 3, 1.2);
  put(solid(g), prism(P, front, fr, fi, SZ - 4, SZ + 11));
  const string = mk("path", { class: "nf" }, g);
  const bolt = mk("path", { class: "sil hi" }, g);
  const head = mk("path", { class: "sil hi" }, g);
  const armF = mk("path", { class: "sil" }, g);

  let last = NaN;
  function draw(pull) {
    if (pull === last) return;
    last = pull;
    const phi = rad(PHI0 + pull * 0.8), z = SZ + 6;
    const tip = (s) => [XF - ARM * Math.sin(phi), s * (12 + ARM * Math.cos(phi)), z];
    const tb = tip(-1), tf = tip(1), nx = XF - 6 - pull;
    armB.setAttribute("d", rod([XF, -12, z], tb, 2.6));
    armF.setAttribute("d", rod([XF, 12, z], tf, 2.6));
    const nock = P(nx, 0, SZ + 4);
    string.setAttribute("d", seg(P(...tb), nock) + seg(nock, P(...tf)));
    bolt.setAttribute("d", rod([nx, 0, SZ + 4], [nx + BOLT, 0, SZ + 4], 1.8));
    head.setAttribute("d", rod([nx + BOLT - 1, 0, SZ + 4], [nx + BOLT + 6, 0, SZ + 4], 3));
  }

  const a = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(a, dt); draw(a.x); return m; });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { a.t = REST; read.textContent = "rest"; B.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], 0);
    if (x < -80 || x > 90 || Math.abs(y) > 70) return aim(null);
    const u = clamp((40 - x) / 85, 0, 1);
    a.t = lerp(REST, amp, u);
    read.textContent = "draw " + Math.round(u * 9);
    B.wake();
  }
  draw(REST);
  read.textContent = "rest";
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "ballista",
  means: "A giant crossbow: the pointer back along the stock winds the string, bending the arms back and drawing the bolt.",
  rules: [1, 3, 5, 8],
  range: [24, 40, 56],
  tour: [[237, 208], [191, 185], [153, 166], null],
  mount,
});
