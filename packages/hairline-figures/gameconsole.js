/**
 * Game console: a low grey box with a round top-loading lid hinged at its
 * far edge, a disc in the well under it and two buttons beside. At rest the
 * lid sits just ajar, its rim bright. The pointer over the console swings
 * the lid up and back to show the disc. The slider is how far it opens.
 *
 * The pattern: one part swinging on a hinge.
 */
const {
  Cam, fit, hull, poly, proj, rrect, rings, prism, facing, circ, clamp, lerp, rad,
  tween, tset, tval, tdone, disposer, mk, pointer, put, register, solid, unproj,
} = HL;

const W = 66, L = 56, H = 10, RL = 24, CX = 29, CY = 29, T = 2.6, REST = 14, MAX = 112;
const HY = CY - RL;
const VIEW = [0.612, 0.612, 0.5];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.1);
  const tip = [CX, HY + 2 * RL * Math.cos(rad(MAX)), H + 2 * RL * Math.sin(rad(MAX))];
  fit(C, [[0, 0, 0], [W, 0, 0], [0, L, 0], [W, L, 0], [W, 0, H], [0, 0, H], tip, [CX - RL, HY, H + RL], [CX + RL, HY, H + RL]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // body
  const [ring, inner] = rings(0, 0, W, L, 9, 1.6);
  put(solid(g), prism(P, front, ring, inner, 0, H));
  // ports on the front face
  for (const x0 of [14, 30]) {
    mk("path", { d: poly([P(x0, L, 3), P(x0 + 9, L, 3), P(x0 + 9, L, 6), P(x0, L, 6)]), class: "nf lo" }, g);
  }
  // well and disc
  const well = circ(RL - 1.2, 28), disc = circ(RL - 4, 28), hub = circ(3.2, 12);
  const at = (rg, z) => rg.map((q) => P(CX + q.u, CY + q.v, z));
  mk("path", { d: poly(at(well, H)), class: "nf lo" }, g);
  mk("path", { d: poly(at(disc, H)), class: "nf lo" }, g);
  mk("path", { d: poly(at(hub, H)), class: "nf lo" }, g);
  // buttons
  for (const by of [16, 34]) {
    const [r1, r2] = rings(56, by, 62, by + 6, 3, 0.8);
    put(solid(g), prism(P, front, r1, r2, H, H + 1.6));
  }

  // lid: a round slab swinging about the hinge line y = HY, z = H
  const lidG = mk("g", {}, g), lid = solid(lidG);
  lid.sil.classList.add("hi");
  const outer = circ(RL, 28), crease = circ(RL - 2, 28), knob = rrect(-4, 2 * RL - 3.2, 4, 2 * RL - 1.4, 0.8, 2);

  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const map = (u, v, w) => [CX + u, HY + v * c - w * s, H + v * s + w * c];
    const ring2 = (rg, w, dv) => rg.map((q) => P(...map(q.u, q.v + dv, w)));
    const a0 = ring2(outer, 0, RL), b0 = ring2(outer, T, RL);
    const up = 0 * VIEW[0] - s * VIEW[1] + c * VIEW[2] > 0;
    const wf = up ? T : 0;
    put(lid, { sil: poly(hull(a0.concat(b0))), crease: poly(ring2(crease, wf, RL)) + poly(knob.map((q) => P(...map(q.u, q.v, wf)))) });
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(ang, v ? lerp(REST, MAX, reach) : REST, performance.now(), 0);
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [x, y] = unproj(C, sx, sy, H);
      setOn(x > -6 && x < W + 6 && y > -10 && y < L + 6);
    },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = clamp(v, 0, 1); if (on) { tset(ang, lerp(REST, MAX, reach), performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "gameconsole",
  means: "A game console with a round top-loading lid: the pointer swings the lid up and back to show the disc.",
  rules: [1, 3, 5, 6],
  range: [0.3, 0.8, 1],
  tour: [[165, 214], [211, 259], [236, 212], null],
  mount,
});
