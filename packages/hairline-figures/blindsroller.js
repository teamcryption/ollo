/**
 * Roller blind: a window in a wall panel, a roller across its head and a
 * blind hanging from it, with a weighted bar and a pull cord. The pointer's
 * height over the window draws the blind down or lets it roll up, on a
 * spring. At rest the blind hangs a third down, its bar bright. The slider is
 * how far the blind can drop.
 *
 * The pattern: one continuous value read from the pointer (pull).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, clamp, lerp, spring, stepS,
  disposer, mk, pointer, put, register, solid, seg,
} = HL;

const W = 110, H = 140, WY = 6, X0 = 18, X1 = 92, Z0 = 26, Z1 = 118, BY = 10, RZ = 124, REST = 0.36;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[0, 0, 0], [W, 0, 0], [0, 22, 0], [W, 22, 0], [0, 0, H], [W, 0, H], [W, 22, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // wall panel and window opening
  const [wr, wi] = rings(0, 0, W, WY, 3, 1.4);
  put(solid(g), prism(P, front, wr, wi, 0, H));
  const quad = (x0, z0, x1, z1, y) => [P(x0, y, z0), P(x1, y, z0), P(x1, y, z1), P(x0, y, z1)];
  mk("path", { d: poly(quad(X0, Z0, X1, Z1, WY)), class: "nf" }, g);
  mk("path", { d: seg(P((X0 + X1) / 2, WY, Z0), P((X0 + X1) / 2, WY, Z1)) + seg(P(X0, WY, (Z0 + Z1) / 2), P(X1, WY, (Z0 + Z1) / 2)), class: "nf lo" }, g);
  // blind, its bar and cord
  const blind = mk("path", { class: "" }, g);
  const bar = mk("path", { class: "sil" }, g);
  const cord = mk("path", { class: "nf lo" }, g);
  const pull = mk("path", { class: "" }, g);
  // roller head: a rounded box across the window top
  const [rr, ri] = rings(X0 - 6, WY, X1 + 6, WY + 9, 4, 1.2);
  put(solid(g), prism(P, front, rr, ri, RZ - 5, RZ + 5));
  // sill
  const [sr, si] = rings(X0 - 8, 0, X1 + 8, 18, 3, 1.4);
  put(solid(g), prism(P, front, sr, si, Z0 - 6, Z0 - 1));

  const tube = (x0, x1, y, z, r) => {
    const pts = [];
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; pts.push(P(x0, y + r * Math.cos(a), z + r * Math.sin(a)), P(x1, y + r * Math.cos(a), z + r * Math.sin(a))); }
    return poly(hull(pts));
  };
  const maxDrop = () => lerp(30, RZ - 5 - Z0 - 6, reach);
  const s = spring(REST);
  let last = NaN;
  function draw(t) {
    const key = t * 1000 + reach;
    if (key === last) return;
    last = key;
    const bz = RZ - 5 - 4 - t * maxDrop();
    blind.setAttribute("d", poly(quad(X0 - 2, bz, X1 + 2, RZ - 4, BY)));
    bar.setAttribute("d", tube(X0 - 3, X1 + 3, BY, bz, 2.4));
    const cx = X1 - 12, cz = bz - 14;
    cord.setAttribute("d", seg(P(cx, BY, bz - 2), P(cx, BY, cz + 2.5)));
    const ring = [];
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; ring.push(P(cx + 2.4 * Math.cos(a), BY, cz + 3 * Math.sin(a))); }
    pull.setAttribute("d", poly(hull(ring)));
  }
  const B = register(stage, (dt) => { const m = stepS(s, dt); draw(s.x); return m; });
  bag.add(B.unregister);

  // static hit: the window's rest rectangle on screen
  const top = P((X0 + X1) / 2, WY, RZ)[1], bot = P((X0 + X1) / 2, WY, Z0 - 6)[1];
  const lx = P(X0 - 8, WY, Z1)[0], rx = P(X1 + 8, WY, Z1)[0];
  function move([sx, sy]) {
    const inside = sx > lx - 14 && sx < rx + 14 && sy > top - 20 && sy < bot + 30;
    if (!inside) return leave();
    s.t = clamp((sy - top) / (bot - top), 0.04, 1);
    bar.classList.add("hi");
    read.textContent = Math.round(s.t * 100) + "%";
    B.wake();
  }
  function leave() { s.t = REST; bar.classList.add("hi"); read.textContent = "rest"; B.wake(); }
  leave();
  draw(REST);
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "blindsroller",
  means: "A roller blind in a window: the pointer's height pulls the blind down or lets it roll up.",
  rules: [1, 3, 5, 8],
  range: [30, 100, 100],
  tour: [[245, 128], [201, 179], [166, 199], null],
  mount,
});
