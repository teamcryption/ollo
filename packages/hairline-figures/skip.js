/**
 * Skip: a builder's skip, its walls flaring out from a narrow floor, its
 * lifting lug on its front end. The pointer along the ground tips it forward on
 * its front edge, as a lorry's arms would, the further back the steeper.
 * At rest it leans a little, bright. The slider is the most it tips.
 *
 * The pattern: one part answering a position (spring).
 */
const {
  Cam, fit, clamp, hull, poly, proj, rad, rrect, spring, stepS, unproj,
  disposer, mk, pointer, register,
} = HL;

const X1 = 90, Y1 = 46, H = 30, FL = 12, REST = 6;
const foot = rrect(FL, 5, X1 - FL, Y1 - 5, 4, 4);
const top = rrect(0, 0, X1, Y1, 5, 4);
const inner = rrect(2.2, 2.2, X1 - 2.2, Y1 - 2.2, 3, 4);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let most = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[-6, -6, 0], [X1 + 6, Y1 + 6, 0], [X1, -6, 0], [-6, Y1, 0], [0, Y1 / 2, H + 50]], 200, 170);
  const P = proj(C);
  const g = mk("g", {}, svg);
  mk("path", { d: poly(hull([P(-6, -6, 0), P(X1 + 8, -6, 0), P(X1 + 8, Y1 + 6, 0), P(-6, Y1 + 6, 0)])), class: "dash nf" }, g);
  const body = mk("path", { class: "sil" }, g), rim = mk("path", { class: "nf lo" }, g), floor = mk("path", { class: "nf lo" }, g);
  const lugB = mk("path", { class: "nf" }, g);
  const sp = spring(REST);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const R = (x, y, z) => P(X1 - (X1 - x) * c + z * s, y, (X1 - x) * s + z * c);
    const ring = (rg, z) => rg.map((q) => R(q.u, q.v, z));
    body.setAttribute("d", poly(hull(ring(foot, 0).concat(ring(top, H)))));
    rim.setAttribute("d", poly(ring(inner, H)));
    floor.setAttribute("d", poly(ring(rrect(FL + 2, 7, X1 - FL - 2, Y1 - 7, 3, 4), 1.5)));
    const lug = (x) => poly(hull([R(x, Y1 / 2 - 5, H - 4), R(x, Y1 / 2 + 5, H - 4), R(x, Y1 / 2 + 5, H - 12), R(x, Y1 / 2 - 5, H - 12)]));
    lugB.setAttribute("d", lug(X1 - 1.2));
    body.classList.toggle("hi", true);
  }

  const B = register(stage, (dt) => {
    const m = stepS(sp, dt);
    draw(sp.x);
    return m;
  });
  bag.add(B.unregister);

  function aim(p) {
    const [wx, wy] = unproj(C, p[0], p[1], 0);
    if (wy < -30 || wy > Y1 + 30 || wx < -30 || wx > X1 + 20) return leave();
    const a = Math.round(REST + clamp((X1 - wx) / X1, 0, 1) * (most - REST));
    sp.t = a;
    read.textContent = a + "°";
    B.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  draw(REST);
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { most = v; }, destroy: bag.dispose };
}

hairline({
  name: "skip",
  means: "A builder's skip with flared walls: the pointer along the ground tips it forward on its front edge, steeper further back.",
  rules: [1, 3, 5, 8],
  range: [20, 32, 42],
  tour: [[258, 266], [200, 237], [150, 212], null],
  mount,
});
