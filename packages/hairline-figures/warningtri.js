/**
 * Warning triangle: a folding road triangle on its weighted foot. At rest the
 * frame lies half folded back over the foot, bright. The pointer near it
 * swings the frame up on its hinge to stand; leaving folds it back down. The
 * slider is how far it stands.
 *
 * The hit is on the ground plane, which never moves; the tilt is a spring.
 */
const { Cam, fit, proj, facing, rings, prism, poly, mk, solid, put, spring, stepS, register, pointer, disposer, unproj, rad, clamp } = HL;

const L = 52, H = 88, T = 9, HY = -5, HZ = 4, REST = 24;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.2);
  const tri = (a, w) => {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const r = (L * H) / (L + Math.hypot(L, H)), f = w ? (r - T) / r : 1;
    const pts = [[-L, 0], [L, 0], [0, H]].map(([u, h]) => [u * f, r + (h - r) * f]);
    return pts.map(([u, h]) => [u, HY - h * c, HZ + h * s]);
  };
  const ext = [[-L, HY - H, 0], [L, 12, 0], [0, HY, HZ + H], [0, HY - H, HZ]];
  fit(C, ext, 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const frame = mk("g", {}, g);
  const outer = mk("path", { class: "sil" }, frame);
  const inner = mk("path", { class: "lo" }, frame);
  const FOOT = rings(-L * 0.7, -9, L * 0.7, 10, 4, 1.4);
  put(solid(g), prism(P, front, FOOT[0], FOOT[1], 0, HZ));
  const legs = mk("path", { class: "sil nf" }, g);
  legs.setAttribute("d", poly([P(-L * 0.6, HY, HZ), P(-L * 0.6, HY, HZ + 1.5), P(L * 0.6, HY, HZ + 1.5), P(L * 0.6, HY, HZ)]));
  const sp = spring(REST);
  let drawn = NaN, open = clamp(50 + 32 * value, 40, 88);
  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-3) return;
    drawn = a;
    outer.setAttribute("d", poly(tri(a, 0).map((q) => P(...q))));
    inner.setAttribute("d", poly(tri(a, 1).map((q) => P(...q))));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  let on = false;
  function set() {
    sp.t = on ? open : REST;
    outer.classList.toggle("hi", true);
    read.textContent = on ? "up" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); on = Math.abs(x) < L + 30 && y > HY - H - 30 && y < 40; set(); },
    leave: () => { on = false; set(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw(); set();
  return { set: (v) => { open = clamp(50 + 32 * v, 40, 88); set(); }, destroy: bag.dispose };
}

hairline({
  name: "warningtri",
  means: "A folding warning triangle: the frame swings up on its hinge to stand when the pointer comes near.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1.2],
  tour: [[154, 140], [256, 94], [212, 240], null],
  mount,
});
