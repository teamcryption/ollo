/**
 * Airboat: a flat swamp hull with a raised driver's seat, and at its stern a
 * tall round fan cage with three rudder vanes behind it. The pointer's side of
 * the boat steers: the whole cage and its rudders swing round their post to
 * throw the wind that way, the propeller turning inside. At rest the cage
 * stands a little askew, its rim bright. The slider is how far it can swing.
 *
 * The pattern: one part turning to follow the pointer (spring).
 */
const {
  Cam, clamp, fit, facing, open, poly, prism, proj, rings, circ, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PX = -30, CZ = 30, CR = 19, REST = 0.22;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxT = (value * Math.PI) / 180;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-44, -24, 0], [40, 24, 0], [-44, 24, 52], [-44, -24, 52], [40, 0, 6]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [hr, hi] = rings(-38, -16, 38, 16, 10, 2);
  put(solid(g), prism(P, front, hr, hi, 0, 8));
  const [br, bi] = rings(18, -14, 38, 14, 9, 2);
  put(solid(g), prism(P, front, br, bi, 8, 10));
  const post = mk("path", { class: "nf" }, g);
  post.setAttribute("d", open([P(PX, 0, 8), P(PX, 0, CZ)]));
  const rudG = mk("g", {}, g);
  const rud = [0, 1, 2].map(() => mk("path", {}, rudG));
  const cageG = mk("g", {}, g);
  const back = mk("path", { class: "nf" }, cageG), rim = mk("path", { class: "nf hi" }, cageG);
  const spokes = mk("path", { class: "nf" }, cageG), prop = mk("path", { class: "nf" }, cageG);
  const [sr, si] = rings(-6, -7, 6, 7, 3, 1.5);
  const seatG = mk("g", {}, g);
  const leg = mk("path", { class: "nf" }, seatG);
  leg.setAttribute("d", open([P(-10, -5, 8), P(-10, -5, 24)]) + open([P(-10, 5, 8), P(-10, 5, 24)]));
  put(solid(seatG), prism(P, front, sr.map((q) => ({ ...q, u: q.u - 10 })), si.map((q) => ({ ...q, u: q.u - 10 })), 24, 27));
  const sb = mk("path", {}, seatG);
  sb.setAttribute("d", poly([P(-16, -7, 27), P(-16, 7, 27), P(-17, 7, 38), P(-17, -7, 38)]));

  const th = spring(REST);
  let last = NaN;
  function draw(a) {
    if (Math.abs(a - last) < 0.002) return;
    last = a;
    const c = Math.cos(a), s = Math.sin(a);
    const W = (ax, b, z) => P(PX + ax * c - b * s, ax * s + b * c, z);
    const ring = (ax, r) => circ(r, 28).map((q) => W(ax, q.u, CZ + q.v));
    back.setAttribute("d", poly(ring(-3, CR)));
    rim.setAttribute("d", poly(ring(2, CR)));
    let sp = "";
    for (let k = 0; k < 4; k++) { const t = k * Math.PI / 4; sp += open([W(2, CR * Math.cos(t), CZ + CR * Math.sin(t)), W(2, -CR * Math.cos(t), CZ - CR * Math.sin(t))]); }
    spokes.setAttribute("d", sp);
    const pa = a * 4 + 0.6, pc = Math.cos(pa) * (CR - 3), ps = Math.sin(pa) * (CR - 3);
    prop.setAttribute("d", poly([W(-1, pc, CZ + ps), W(-1, -ps * 0.12, CZ + pc * 0.12), W(-1, -pc, CZ - ps), W(-1, ps * 0.12, CZ - pc * 0.12)]));
    [-11, 0, 11].forEach((b, i) => {
      rud[i].setAttribute("d", poly([W(-7, b, CZ - 15), W(-19, b, CZ - 13), W(-19, b, CZ + 14), W(-7, b, CZ + 16)]));
    });
  }
  draw(REST);

  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(th.x); return m; });
  bag.add(B.unregister);

  let lastP = null;
  function aim(p) {
    const w = p && unproj(C, p[0], p[1], 0);
    if (!w || Math.abs(w[0]) > 70 || Math.abs(w[1]) > 60) { th.t = REST; read.textContent = "rest"; }
    else {
      th.t = clamp(-w[1] / 30, -1, 1) * maxT;
      const d = Math.round((th.t * 180) / Math.PI);
      read.textContent = "rud " + (d > 0 ? "+" : "") + d;
    }
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: (p) => { lastP = p; aim(p); }, leave: () => { lastP = null; aim(null); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxT = (v * Math.PI) / 180; if (lastP) aim(lastP); }, destroy: bag.dispose };
}

hairline({
  name: "airboat",
  means: "An airboat in the swamp: its fan cage and rudders swing round on their post to steer toward the pointer's side.",
  rules: [1, 3, 5, 8],
  range: [10, 50, 70],
  tour: [[198, 245], [244, 222], [290, 199], null],
  mount,
});
