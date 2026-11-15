/**
 * Letterbox flap: a door with a brass-plate letterbox, its flap hinged along
 * the top of the slot. As the pointer nears the slot the flap swings up and
 * out, and a letter slides out through the opening under it. At rest the
 * flap hangs just ajar, bright. The slider is the widest swing.
 *
 * The pattern: a single part following the pointer, a swinging answer.
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rad, rings, rrect, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 120, H = 130, T = 6, FY = T + 1.6, X0 = 24, X1 = 96, ZB = 56, ZH = 76, REST = 8, LL = 44;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let wide = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, 0, 0], [W, T + 30, 0], [0, T, H], [W, T + 30, H]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const face = (rg, y) => rg.map((q) => P(q.u, y, q.v));

  const [dr, di] = rings(0, 0, W, T, 2, 1);
  put(solid(g), prism(P, front, dr, di, 0, H));
  // door panels below and above the letterbox
  mk("path", { d: poly(face(rrect(14, 12, W - 14, 42, 3, 3), T)) + poly(face(rrect(14, 92, W - 14, H - 12, 3, 3), T)), class: "nf lo" }, g);
  const [pr, pi] = rings(X0 - 10, T, X1 + 10, FY, 1, 0.5);
  put(solid(g), prism(P, front, pr, pi, ZB - 8, ZH + 6));
  mk("path", { d: poly(face(rrect(X0 - 10, ZB - 8, X1 + 10, ZH + 6, 3, 4), FY)), class: "nf" }, g);
  mk("path", { d: poly(face(rrect(X0, ZB, X1, ZH, 2, 4), FY)), class: "nf lo" }, g);

  const letter = solid(mk("g", {}, g));
  const vee = mk("path", { class: "nf lo" }, letter.g);
  const flap = solid(mk("g", {}, g));
  const fr = rrect(X0 - 2, 0, X1 + 2, ZH - ZB + 2, 2, 4);
  const a = spring(REST);
  let last = NaN;

  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const t = rad(deg), c = Math.cos(t), s = Math.sin(t);
    const lay = (o) => fr.map((q) => P(q.u, FY + 0.3 + q.v * s + o * c, ZH + 1 - q.v * c + o * s));
    const outer = lay(1.6);
    put(flap, { sil: poly(hull(lay(0).concat(outer))), crease: seg(P(X0 + 6, FY + 1.9, ZH + 1), P(X1 - 6, FY + 1.9, ZH + 1)) });
    const f = clamp((deg - REST) / 50, 0, 1), y1 = FY + LL * f;
    if (f < 0.04) { put(letter, { sil: "", crease: "" }); vee.setAttribute("d", ""); return; }
    const [lr, li] = rings(X0 + 8, FY, X1 - 8, y1, 1, 0.5);
    put(letter, prism(P, front, lr, li, ZB + 1, ZB + 2));
    const m = Math.max(FY, y1 - 16);
    vee.setAttribute("d", seg(P(X0 + 9, y1, ZB + 2), P((X0 + X1) / 2, m, ZB + 2)) + seg(P((X0 + X1) / 2, m, ZB + 2), P(X1 - 9, y1, ZB + 2)));
  }

  const B = register(stage, (dt) => {
    const moving = stepS(a, dt);
    draw(a.x);
    return moving;
  });
  bag.add(B.unregister);
  flap.sil.classList.add("hi");

  const mid = P((X0 + X1) / 2, FY, (ZB + ZH) / 2);
  function move([sx, sy]) {
    const d = Math.hypot(sx - mid[0], sy - mid[1]);
    const f = clamp(1 - (d - 20) / 110, 0, 1);
    a.t = REST + (clamp(wide, 30, 80) - REST) * f;
    read.textContent = f > 0 ? Math.round(a.t) + "°" : "rest";
    B.wake();
  }
  function leave() { a.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { wide = v; }, destroy: bag.dispose };
}

hairline({
  name: "mailslot",
  means: "A door letterbox: the flap swings up and out as the pointer nears the slot, and a letter slides through under it.",
  rules: [1, 3, 5, 8],
  range: [30, 70, 80],
  tour: [[216, 154], [157, 40], [280, 269], null],
  mount,
});
