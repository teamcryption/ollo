/**
 * Security gate: a barred panel on a ground track between a wall and a
 * latch post. The pointer's place along the track slides the gate open or
 * shut, sprung. At rest it stands part open, its edge bright. The slider is
 * how far it rests open.
 *
 * The pattern: one part following the pointer along a line.
 */
const {
  Cam, clamp, fit, facing, open, poly, prism, proj, rings, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 96, H = 50, Z0 = 3, GMIN = -88, GMAX = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let restOpen = value / 100;
  const C = Cam(45, 0.5, 1.45);
  fit(C, [[-104, -14, 0], [116, 12, 0], [-104, 12, 0], [116, -14, 0], [-104, -14, Z0 + H + 6], [116, 12, Z0 + H + 8]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-104, -14, 116, 12, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, Z0));
  // the back wall the gate slides along
  const [wr, wi] = rings(-100, -10, 0, -5, 1.5, 1);
  put(solid(g), prism(P, front, wr, wi, Z0, Z0 + H - 6));
  // the track, painted under the gate
  mk("path", { d: seg(P(-96, 2, Z0), P(104, 2, Z0)), class: "lo nf" }, g);
  mk("path", { d: seg(P(-96, 3.5, Z0), P(104, 3.5, Z0)), class: "lo nf" }, g);

  const gate = solid(g), bars = mk("path", { class: "lo nf" }, gate.g);
  gate.sil.classList.add("sil");
  // the latch post, nearest, so appended last
  const post = solid(g);
  const [pr, pi] = rings(102, -3, 110, 7, 2, 1);
  put(post, prism(P, front, pr, pi, Z0, Z0 + H + 8));
  post.sil.classList.add("sil");
  const latch = mk("path", { class: "nf" }, g);
  latch.setAttribute("d", poly([P(102, 4, Z0 + 26), P(102, 4, Z0 + 31), P(102, 6, Z0 + 31), P(102, 6, Z0 + 26)]));

  const restG = () => GMAX + (GMIN - GMAX) * restOpen;
  const sp = spring(restG());
  let last = NaN;
  function draw(x) {
    if (x === last) return;
    last = x;
    const [r, i] = rings(x, 0, x + W, 4, 1.5, 1);
    put(gate, prism(P, front, r, i, Z0 + 1, Z0 + H));
    let d = "";
    for (let b = x + 8; b < x + W - 4; b += 11) d += seg(P(b, 4, Z0 + 5), P(b, 4, Z0 + H - 5));
    d += seg(P(x + 3, 4, Z0 + 9), P(x + W - 3, 4, Z0 + 9)) + seg(P(x + 3, 4, Z0 + H - 9), P(x + W - 3, 4, Z0 + H - 9));
    bars.setAttribute("d", d);
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  let on = null;
  function aim(p) {
    if (!p) { on = null; sp.t = restG(); }
    else {
      const [wx, wy] = unproj(C, p[0], p[1], 0);
      if (Math.abs(wy) > 70 || wx < -110 || wx > 125) return aim(null);
      on = wx;
      sp.t = clamp(wx - W, GMIN, GMAX);
    }
    const pct = Math.round(((GMAX - sp.t) / (GMAX - GMIN)) * 100);
    gate.sil.classList.toggle("hi", on !== null);
    post.sil.classList.toggle("hi", on === null);
    read.textContent = on === null ? "rest" : "open " + pct + "%";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { restOpen = v / 100; if (on === null) aim(null); }, destroy: bag.dispose };
}

hairline({
  name: "securitygate",
  means: "A barred gate on a ground track: it slides open toward the wall as the pointer moves along the track, and shuts at the latch.",
  rules: [1, 3, 5, 8],
  range: [0, 30, 60],
  tour: [[297, 217], [252, 195], [109, 123], null],
  mount,
});
