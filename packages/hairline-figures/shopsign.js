/**
 * Hanging shop sign: a wall plate with a bracket arm, a plate sign hung from
 * it on two short links. The sign swings on the arm toward the side the
 * pointer comes from. At rest it hangs at a slight swing, bright.
 * The slider is how far it can swing.
 */
const { Cam, fit, facing, proj, unproj, rings, prism, put, solid, mk, poly, seg, fillet, spring, stepS, clamp, rad, register, pointer, disposer } = HL;

const BX = 74, BZ = 100, SX0 = 16, SX1 = 70, D0 = 8, D1 = 50, REST = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-4, -14, 66], [-4, 14, 114], [BX + 3, 0, BZ], [SX1, 44, BZ - 34], [SX1, -44, BZ - 34], [SX0, 0, BZ - D1], [SX1, 0, BZ - D1]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [wr, wi] = rings(-5, -14, 0, 14, 2, 1);
  put(solid(g), prism(P, front, wr, wi, 66, 114));
  mk("path", { d: seg(P(0, 0, BZ - 34), P(42, 0, BZ - 2)), class: "nf" }, g);
  const [br, bi] = rings(0, -1.6, BX, 1.6, 1.4, 0.6);
  put(solid(g), prism(P, front, br, bi, BZ - 3.2, BZ));
  const [fr, fi] = rings(BX - 1, -3, BX + 5, 3, 3, 1);
  put(solid(g), prism(P, front, fr, fi, BZ - 4.6, BZ + 1.4));
  const links = mk("path", { class: "nf lo" }, g);
  const back = mk("path", {}, g), face = mk("path", { class: "sil hi" }, g), inner = mk("path", { class: "nf lo" }, g);

  const sw = spring(REST);
  let last = NaN;
  const pt = (x, d, a, o) => P(x, -Math.sin(rad(a)) * d + Math.cos(rad(a)) * o, BZ - 3 - Math.cos(rad(a)) * d - Math.sin(rad(a)) * o);
  const plate = (x0, x1, d0, d1, a, o, r) => {
    const q = [pt(x0, d0, a, o), pt(x1, d0, a, o), pt(x1, d1, a, o), pt(x0, d1, a, o)];
    return poly(fillet(q, [r, r, r, r]));
  };
  function draw(a) {
    if (a === last) return;
    last = a;
    links.setAttribute("d", seg(pt(SX0 + 4, 0, a, 0), pt(SX0 + 4, D0, a, 0)) + seg(pt(SX1 - 4, 0, a, 0), pt(SX1 - 4, D0, a, 0)));
    back.setAttribute("d", plate(SX0, SX1, D0, D1, a, -1.4, 4));
    face.setAttribute("d", plate(SX0, SX1, D0, D1, a, 1.4, 4));
    inner.setAttribute("d", plate(SX0 + 5, SX1 - 5, D0 + 5, D1 - 5, a, 1.5, 2));
  }
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(sw, dt); draw(sw.x); return m; });
  bag.add(B.unregister);
  const mid = P(BX / 2, 0, BZ - 30);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const t = clamp((sx - mid[0]) / 110, -1, 1);
      sw.t = t * amp;
      read.textContent = Math.round(Math.abs(sw.t)) + "°";
      B.wake();
    },
    leave: () => { sw.t = REST; read.textContent = "rest"; B.wake(); },
  }));
  read.textContent = "rest";
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "shopsign",
  means: "A shop sign hung from a wall bracket: it swings on its arm toward the side the pointer comes from.",
  rules: [3, 4, 5, 8],
  range: [15, 35, 50],
  tour: [[314, 198], [38, 207], [185, 207], null],
  mount,
});
