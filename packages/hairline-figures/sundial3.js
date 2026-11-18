/**
 * Garden sundial: a stone pedestal with a round dial on top and a tall
 * triangular gnomon. The gnomon swings round the dial to face the pointer,
 * its dashed shadow falling opposite; the slider is how far it swings.
 */
const {
  Cam, fit, facing, fillet, poly, prism, proj, rings, rrect, clamp,
  spring, stepS, disposer, mk, pointer, put, register, solid, flatDot, place, unproj, seg,
} = HL;

const DR = 30, ZT = 38, GH = 30, REST = 200;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.4);
  fit(C, [[-DR, -DR, 0], [DR, DR, 0], [DR, -DR, ZT], [-DR, DR, ZT], [0, 0, ZT + GH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-20, -20, 20, 20, 6, 1.6);
  put(solid(g), prism(P, front, pr, pi, 0, 6));
  const [cr, ci] = rings(-11, -11, 11, 11, 5, 1.2);
  put(solid(g), prism(P, front, cr, ci, 6, ZT - 6));
  const [hr, hi] = rings(-16, -16, 16, 16, 6, 1.4);
  put(solid(g), prism(P, front, hr, hi, ZT - 6, ZT - 3));
  const dr = rrect(-DR, -DR, DR, DR, DR, 14), di = rrect(-DR + 2, -DR + 2, DR - 2, DR - 2, DR - 2, 14);
  put(solid(g), prism(P, front, dr, di, ZT - 3, ZT));
  for (let i = 0; i < 12; i++) {
    const t = (i / 12) * Math.PI * 2;
    place(flatDot(g, C, 0.9, i % 3 ? "dot off" : "dot m"), P(Math.cos(t) * (DR - 6), Math.sin(t) * (DR - 6), ZT));
  }
  const shadow = mk("path", { class: "dash nf" }, g);
  const gno = mk("path", { class: "sil hi" }, g), edge = mk("path", { class: "lo nf" }, g);
  const ang = spring(REST);
  let last = NaN;
  function draw(a) {
    const ar = Math.round(a * 10) / 10;
    if (ar === last) return;
    last = ar;
    const t = (ar * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
    const at = (r, w, z) => P(r * c - w * s, r * s + w * c, z);
    const tri = (w) => fillet([at(-6, w, ZT), at(DR - 4, w, ZT), at(-6, w, ZT + GH)], [1, 1.5, 1.5]);
    shadow.setAttribute("d", seg(P(0, 0, ZT), P(-c * (DR - 4), -s * (DR - 4), ZT)));
    gno.setAttribute("d", poly(tri(-1.4)) + poly(tri(1.4)));
    edge.setAttribute("d", poly(tri(1.4)));
  }
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  function aim(p) {
    const [x, y] = unproj(C, p[0], p[1], ZT);
    const r = Math.hypot(x, y);
    if (r > DR + 14) return leave();
    let d = (Math.atan2(y, x) * 180) / Math.PI - REST;
    d = ((d % 360) + 540) % 360 - 180;
    ang.t = REST + d * (0.3 + 0.7 * reach);
    const h = Math.round((((ang.t % 360) + 360) % 360) / 30) % 12 || 12;
    read.textContent = "h " + h;
    B.wake();
  }
  function leave() { ang.t = REST; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  let lastP = null;
  bag.add(pointer(stage, { move: (p) => { lastP = p; aim(p); }, leave: () => { lastP = null; leave(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (lastP) aim(lastP); }, destroy: bag.dispose };
}

hairline({
  name: "sundial3",
  means: "A garden sundial on a pedestal: the gnomon swings round the dial to face the pointer, its dashed shadow falling opposite.",
  rules: [1, 3, 5, 8, 9],
  range: [0, 1, 1],
  tour: [[253, 145], [137, 149], [200, 172], null],
  mount,
});
