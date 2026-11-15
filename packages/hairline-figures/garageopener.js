/**
 * Garage door: a garage block with an up-and-over door on its front face.
 * The pointer's height over the door tilts it up on its top hinge into a
 * canopy, on a spring. At rest the door hangs a little open and its handle
 * is bright. The slider is how far the door can swing.
 *
 * The pattern: one continuous value from the pointer's screen y, measured
 * against the closed door's fixed edges, so the moving panel never shifts it.
 */
const {
  Cam, clamp, facing, fit, lerp, poly, prism, proj, rad, rings, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X0 = 10, X1 = 52, FY = 70, DH = 32, REST = 16;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[0, 0, 0], [62, 0, 0], [0, 72, 0], [62, 72, 0], [0, 0, 50], [62, 72, 50], [X0, FY + DH, DH], [X1, FY + DH, DH]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, 62, FY, 3, 1.4);
  put(solid(g), prism(P, front, br, bi, 0, 44));
  const [rr, ri] = rings(-2, -2, 64, FY + 2, 3, 1.2);
  put(solid(g), prism(P, front, rr, ri, 44, 49));
  // the opening: its frame, and the far back wall line seen through it
  const hole = mk("path", { class: "nf lo" }, g);
  hole.setAttribute("d", poly([P(X0, FY, 0), P(X1, FY, 0), P(X1, FY, DH), P(X0, FY, DH)])
    + seg(P(X0 + 4, FY - 1, DH - 4), P(X1 - 4, FY - 1, DH - 4)) + seg(P(X1 - 4, FY - 1, 0), P(X1 - 4, FY - 1, DH - 4)));
  // a drive slab in front of the door
  const drive = mk("path", { class: "dash" }, g);
  drive.setAttribute("d", seg(P(X0, FY + 2, 0), P(X0, FY + 44, 0)) + seg(P(X1, FY + 2, 0), P(X1, FY + 44, 0)));

  const door = mk("path", { class: "sil" }, g);
  const ribs = mk("path", { class: "nf lo" }, g);
  const handle = mk("circle", { class: "dot", r: 3 }, g);

  // a point on the panel: s from its top hinge down (0..DH), swung by a degrees
  const at = (x, s, a) => P(x, FY + 0.6 + s * Math.sin(rad(a)), DH - s * Math.cos(rad(a)));
  let last = null;
  function draw(a) {
    const k = a.toFixed(2);
    if (k === last) return;
    last = k;
    door.setAttribute("d", poly([at(X0, 0, a), at(X1, 0, a), at(X1, DH, a), at(X0, DH, a)]));
    let d = "";
    for (let i = 1; i < 5; i++) d += seg(at(X0 + 1.5, (DH * i) / 5, a), at(X1 - 1.5, (DH * i) / 5, a));
    ribs.setAttribute("d", d);
    const h = at((X0 + X1) / 2, DH - 3.5, a);
    handle.setAttribute("cx", h[0]); handle.setAttribute("cy", h[1]);
  }

  const s = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(s, dt); draw(s.x); return m; });
  bag.add(B.unregister);
  draw(REST);

  // hit: the closed door's fixed screen box; height within it sets the swing
  const bot = Math.max(P(X0, FY, 0)[1], P(X1, FY, 0)[1]), topY = Math.min(P(X0, FY, DH)[1], P(X1, FY, DH)[1]);
  const lx = P(X1, FY, 0)[0], rx = P(X0, FY, 0)[0];
  const xa = Math.min(lx, rx) - 20, xb = Math.max(lx, rx) + 20;
  function move([sx, sy]) {
    if (sx < xa || sx > xb || sy < topY - 60 || sy > bot + 30) return leave();
    const t = clamp((bot + 10 - sy) / (bot + 10 - (topY - 30)), 0, 1);
    s.t = lerp(0, reach, t);
    door.setAttribute("class", "sil hi");
    handle.setAttribute("class", "dot off");
    read.textContent = Math.round(s.t) + "°";
    B.wake();
  }
  function leave() {
    s.t = REST;
    door.setAttribute("class", "sil");
    handle.setAttribute("class", "dot");
    read.textContent = "rest";
    B.wake();
  }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "garageopener",
  means: "A garage with an up-and-over door: raise the pointer over it and the door tilts up into a canopy.",
  rules: [1, 3, 5, 8],
  range: [50, 88, 90],
  tour: [[164, 235], [164, 190], [164, 150], null],
  mount,
});
