/**
 * Pencil sharpener: a small block with a pencil hole on its face and a crank
 * on its side, a hub, a flat arm and a long round knob. The pointer's x turns
 * the crank about its axle, on a spring. At rest the crank stands raised,
 * bright. The slider is how far the crank turns.
 */
const {
  Cam, fit, proj, facing, rings, prism, rrect, circ, hull, poly, clamp, lerp, rad,
  spring, stepS, mk, solid, put, register, pointer, disposer,
} = HL;

const BW = 32, BD = 30, BH = 32, AY = 15, AZ = 20, REST = 60;
const ARM = rrect(-5, -4, 26, 4, 3.8, 3), KNOB = circ(4.5, 20);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 4.0);
  fit(C, [[0, AY - 32, 0], [BW + 26, AY + 32, 0], [0, AY - 32, AZ + 32], [BW + 26, AY + 32, AZ + 32]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, BW, BD, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, BH));
  mk("path", { d: poly(circ(5, 24).map((s) => P(BW / 2 + s.u, BD, 18 + s.v))), class: "nf" }, g);
  mk("path", { d: poly(circ(2, 16).map((s) => P(BW / 2 + s.u, BD, 18 + s.v))), class: "nf lo" }, g);
  const hub = [BW, BW + 4].flatMap((x) => circ(6, 20).map((s) => P(x, AY + s.u, AZ + s.v)));
  mk("path", { d: poly(hull(hub)) }, g);
  const arm = mk("path", { class: "sil hi" }, g), knob = mk("path", { class: "sil hi" }, g);

  function draw(th) {
    const c = Math.cos(rad(th)), s = Math.sin(rad(th));
    const R = (x, r, w) => P(x, AY + r * c - w * s, AZ + r * s + w * c);
    arm.setAttribute("d", poly(hull(ARM.flatMap((q) => [R(BW + 4, q.u, q.v), R(BW + 7.5, q.u, q.v)]))));
    knob.setAttribute("d", poly(hull(KNOB.flatMap((q) => [R(BW + 7.5, 22 + q.u, q.v), R(BW + 26, 22 + q.u, q.v)]))));
  }
  const sp = spring(REST);
  let last = NaN;
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); if (sp.x !== last) { last = sp.x; draw(sp.x); } return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    if (sx < 50 || sx > 350 || sy < 20 || sy > 300) return leave();
    const a = lerp(REST, REST + amp, clamp((sx - 110) / 180, 0, 1));
    sp.t = a;
    read.textContent = "crank " + Math.round(a - REST);
    B.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "recorderflute",
  means: "A crank pencil sharpener: the pointer turns the crank arm and its knob round the axle on the side.",
  rules: [1, 3, 5, 8],
  range: [0, 200, 300],
  tour: [[259, 147], [251, 170], [211, 263], null],
  mount,
});
