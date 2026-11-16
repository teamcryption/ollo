/**
 * Bird cage: a round cage of bars on a stand, with a hinged door. The
 * pointer over the cage swings the door wide and turns the cage on its
 * hook to face it. At rest the door stands ajar, bright. The slider is
 * how far the cage turns.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const R = 30, H = 62, Z0 = 6, NB = 14, DW = 2;
const disc = (r, n = 40) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-R - 18, -R - 18, 0], [R + 18, R + 18, 0], [R + 18, -R - 18, 0], [-R - 18, R + 18, 0], [0, 0, Z0 + H + 22], [R + 30, 0, Z0 + H / 2]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-R - 6, -R - 6, R + 6, R + 6, R + 6, 3);
  put(solid(g), prism(P, front, br, bi, 0, Z0));
  const bars = mk("path", { class: "nf" }, g), top = mk("path", { class: "nf" }, g), door = mk("path", { class: "sil" }, g), hook = mk("path", { class: "nf lo" }, g);
  const turn = tween(0.15), open = tween(0.3);
  let last = "";
  function at(a, r, z) { return P(r * Math.cos(a), r * Math.sin(a), z); }
  function draw(t, o) {
    const k = t + "," + o; if (k === last) return; last = k;
    const rot = t * Math.PI * 0.8;
    let d = "";
    for (let i = 0; i < NB; i++) { if (i > 0 && i < DW) continue; const a = rot + (i / NB) * 2 * Math.PI; d += seg(at(a, R, Z0), at(a, R, Z0 + H)); }
    d += poly(ringAt(P, disc(R), Z0 + 1)) + poly(ringAt(P, disc(R), Z0 + H * 0.5)) ;
    bars.setAttribute("d", d);
    const dome = [];
    for (let i = 0; i <= 5; i++) { const s = (i / 5) * Math.PI / 2; dome.push(...ringAt(P, disc(R * Math.cos(s), 28), Z0 + H + R * 0.6 * Math.sin(s))); }
    top.setAttribute("d", poly(hull(dome)) + poly(ringAt(P, disc(R), Z0 + H)));
    hook.setAttribute("d", poly(hull(ringAt(P, disc(3, 12), Z0 + H + R * 0.6).concat(ringAt(P, disc(3, 12), Z0 + H + R * 0.6 + 10)))));
    // door: hinged at bar 0, spans to bar DW
    const a0 = rot, a1 = rot + (DW / NB) * 2 * Math.PI, w = 2 * R * Math.sin((a1 - a0) / 2);
    const hx = R * Math.cos(a0), hy = R * Math.sin(a0);
    const dir = Math.atan2(R * Math.sin(a1) - hy, R * Math.cos(a1) - hx) - o * Math.PI * 0.7;
    const fx = hx + w * Math.cos(dir), fy = hy + w * Math.sin(dir), zl = Z0 + 6, zh = Z0 + H * 0.5 - 2;
    let dd = poly([P(hx, hy, zl), P(fx, fy, zl), P(fx, fy, zh), P(hx, hy, zh)]);
    for (const f of [0.33, 0.66]) dd += seg(P(hx + (fx - hx) * f, hy + (fy - hy) * f, zl), P(hx + (fx - hx) * f, hy + (fy - hy) * f, zh));
    door.setAttribute("d", dd);
  }
  const B = register(stage, (_dt, now) => { draw(tval(turn, now), tval(open, now)); return !(tdone(turn, now) && tdone(open, now)); });
  bag.add(B.unregister);
  const mid = P(0, 0, Z0 + H / 2);
  let act = null;
  function setActive(a) {
    if (a === act) return; act = a;
    const now = performance.now();
    tset(turn, a ? 0.15 + amp / 90 : 0.15, now, 0);
    tset(open, a ? 1 : 0.3, now, a ? 80 : 0);
    door.classList.add("hi");
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.abs(sx - mid[0]) < 70 && Math.abs(sy - mid[1]) < 90), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "birdcage2",
  means: "A round bird cage on a stand: the pointer swings its door wide and turns the cage on its hook to face you.",
  rules: [1, 4, 5, 6],
  range: [0, 45, 90],
  tour: [[200, 133], [215, 160], [185, 110], null],
  mount,
});
