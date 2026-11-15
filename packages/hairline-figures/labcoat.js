/**
 * Fume hood: a bench cabinet with a hood above it, the hood's front cut by
 * an opening and a glass sash on runners. The pointer's height over the hood
 * slides the sash up or down; leaving brings it back to half open. The sash
 * is the bright mark. The slider is how far the sash can rise.
 *
 * The pattern: one part following the pointer (slide).
 */
const {
  Cam, fit, facing, prism, proj, rings, clamp, lerp, poly, spring, stepS, r2,
  disposer, mk, pointer, put, register, solid,
} = HL;

const D = 55, W = 90, CAB = 40, TOP = 140, O0 = 50, O1 = 100, SH = 48;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.5);
  fit(C, [[0, 0, 0], [D + 6, W, 0], [D + 6, 0, TOP + 2], [0, W, TOP], [D + 6, W, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1, par = g) => { const [a, i] = rings(x0, y0, x1, y1, r, b); const s = solid(par); put(s, prism(P, front, a, i, z0, z1)); return s; };
  box(0, 0, D, W, 4, 2, 0, CAB);
  box(-2, -2, D + 3, W + 2, 3, 1.5, CAB, CAB + 4);
  box(0, 0, D, W, 4, 2, CAB + 4, TOP);
  // the opening on the front face, and the work surface inside it
  const F = D + 0.2, face = (y0, y1, z0, z1) => [P(F, y0, z0), P(F, y1, z0), P(F, y1, z1), P(F, y0, z1)];
  mk("path", { d: poly(face(8, W - 8, O0, O1)), class: "nf lo" }, g);
  mk("path", { d: poly(face(14, W - 14, O0 + 2, O0 + 2)) + poly([P(F, 14, O0 + 2), P(D - 18, 20, O0 + 2), P(D - 18, W - 20, O0 + 2), P(F, W - 14, O0 + 2)]), class: "nf lo" }, g);
  // the runners the sash rides in
  for (const y of [5, W - 5]) mk("path", { d: poly([P(D + 3, y, O0 - 2), P(D + 3, y, TOP - 4)]), class: "nf lo" }, g);
  const sg = mk("g", {}, g);
  const sash = solid(sg), frame = mk("path", { class: "nf lo" }, sg), handle = mk("path", { class: "nf" }, sg);
  const REST = 0.45, sp = spring(REST);
  let last = NaN;
  function draw(t) {
    const v = r2(t);
    if (v === last) return;
    last = v;
    const z0 = lerp(O0 - 1, O0 - 1 + (TOP - 6 - SH - O0) * reach, v), z1 = z0 + SH;
    const [a, i] = rings(D + 2, 4, D + 5, W - 4, 1.2, 0.6);
    put(sash, prism(P, front, a, i, z0, z1));
    const X = D + 5.1;
    frame.setAttribute("d", poly([P(X, 9, z0 + 5), P(X, W - 9, z0 + 5), P(X, W - 9, z1 - 4), P(X, 9, z1 - 4)]));
    const [ha, hi] = rings(D + 5, 20, D + 8, W - 20, 1.4, 0.6);
    handle.setAttribute("d", prism(P, front, ha, hi, z0 + 1, z0 + 3.5).sil);
  }
  sash.sil.classList.add("hi");
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const yTop = P(D, W / 2, TOP)[1], yBot = P(D, W / 2, O0)[1], xs = [P(0, 0, 0)[0], P(D, W, 0)[0], P(0, W, 0)[0], P(D, 0, 0)[0]];
  const xl = Math.min(...xs), xr = Math.max(...xs);
  function move([sx, sy]) {
    const inside = sx > xl - 10 && sx < xr + 10 && sy > yTop - 30 && sy < yBot + 30;
    sp.t = inside ? clamp((yBot - sy) / (yBot - yTop), 0, 1) : REST;
    read.textContent = inside ? "sash " + Math.round(sp.t * 100) + "%" : "rest";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave: () => { sp.t = REST; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last = NaN; draw(sp.x); }, destroy: bag.dispose };
}

hairline({
  name: "labcoat",
  means: "A fume hood on a bench cabinet: the pointer's height over the hood slides its glass sash up or down; leaving sets it half open.",
  rules: [3, 5, 8, 9],
  range: [0.4, 1, 1],
  tour: [[228, 100], [228, 191], [228, 81], null],
  mount,
});
