/**
 * Mirrorarm: a round shaving mirror on a scissor arm fixed to a wall plate.
 * The pointer's place along the wall draws the arm out: the scissor links
 * open and the mirror slides toward the viewer. At rest the arm is half
 * folded and the mirror's rim is bright. The slider is the arm's reach.
 */
const { Cam, circ, fit, hull, open, poly, proj, rings, prism, facing, put, solid, spring, stepS, clamp, lerp, mk, pointer, register, disposer, seg } = HL;

const PZ = 60, R = 30, REST = 30;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[-6, -16, PZ - 26], [-6, 16, PZ + 26], [104, -R, PZ - R], [104, R, PZ + R], [0, 0, 40]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [wr, wi] = rings(-8, -16, 0, 16, 3, 1.2);
  // wall plate: a thin upright block
  const plate = solid(g);
  plate.sil.setAttribute("d", poly(hull([[-8, -16], [0, -16], [0, 16], [-8, 16]].flatMap(([x, y]) => [P(x, y, PZ - 26), P(x, y, PZ + 26)]))));
  plate.cr.setAttribute("d", open([P(0, -14, PZ + 24), P(0, 14, PZ + 24), P(0, 14, PZ - 24)]));
  plate.cr.setAttribute("class", "nf lo");
  const arm = mk("path", { class: "nf" }, g);
  const back = mk("path", {}, g), glass = mk("path", { class: "nf lo" }, g);
  back.setAttribute("class", "sil hi");
  const ring = circ(R, 48);
  const E = spring(REST);
  let last = NaN;
  function draw(e) {
    if (e === last) return;
    last = e;
    const n = 3, w = 10 * (1 - (e - 12) / 110) + 2;
    let d = "";
    for (let i = 0; i < n; i++) {
      const x0 = 6 + ((e - 10) * i) / n, x1 = 6 + ((e - 10) * (i + 1)) / n;
      d += seg(P(x0, -w, PZ), P(x1, w, PZ)) + seg(P(x0, w, PZ), P(x1, -w, PZ));
    }
    d += seg(P(0, 0, PZ), P(6, 0, PZ)) + seg(P(e - 4, 0, PZ), P(e, 0, PZ));
    arm.setAttribute("d", d);
    const face = (dx, r) => ring.map((q) => P(e + dx, (q.u * r) / R, PZ + (q.v * r) / R));
    back.setAttribute("d", poly(hull(face(0, R).concat(face(4, R)))));
    glass.setAttribute("d", poly(face(4, R - 3)));
  }
  const B = register(stage, (dt) => { const m = stepS(E, dt); draw(E.x); return m; });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: ([sx]) => { const t = clamp((sx - 90) / 200, 0, 1); E.t = lerp(REST, lerp(REST, 100, reach), t); read.textContent = "reach " + Math.round(E.t); B.wake(); },
    leave: () => { E.t = REST; read.textContent = "rest"; B.wake(); },
  }));
  read.textContent = "rest";
  draw(REST);
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "mirrorarm",
  means: "A round mirror on a scissor arm: the pointer draws the arm out from the wall and the mirror slides toward you.",
  rules: [3, 5, 8],
  range: [0, 100, 100],
  tour: [[149, 143], [287, 213], [220, 178], null],
  mount,
});
