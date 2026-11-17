/**
 * Banner pole: a heraldic banner with a swallowtail hanging from the side of
 * a pole on a stepped foot. The pointer is the wind: the banner swings round
 * the pole away from it, and leaving lets it drift back. At rest the banner
 * streams to the right, bright. The slider is how far it can swing.
 *
 * The pattern: one part turning about an axis (aim).
 */
const { Cam, fit, facing, circ, poly, prism, proj, rings, rad, clamp, spring, stepS, disposer, mk, pointer, put, register, solid, flatDot, place } = HL;

const PH = 124, Z0 = 62, Z1 = 116, L = 58, REST = -25;
const disc = (r, n = 32) => circ(r, n);
const OUT = [[0, Z1], [L, Z1], [L - 12, (Z0 + Z1) / 2], [L, Z0], [0, Z0]];
const INN = [[4, Z1 - 5], [L - 7, Z1 - 5], [L - 18, (Z0 + Z1) / 2], [L - 7, Z0 + 5], [4, Z0 + 5]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-22, -22, 0], [22, 22, 0], [L, 0, Z0], [0, -L, Z1], [-L * 0.7, -L * 0.7, Z1], [L * 0.9, -L * 0.4, Z1], [0, 0, PH + 4]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(20), disc(18), 0, 5));
  put(solid(g), prism(P, front, disc(12), disc(10.5), 5, 10));
  const pole = solid(g);
  put(pole, prism(P, front, disc(2.6, 20), disc(2, 20), 10, PH));
  const top = flatDot(g, C, 3, "dot m");
  place(top, P(0, 0, PH + 3));
  const ban = mk("g", {}, g);
  const flag = mk("path", { class: "sil hi" }, ban), edge = mk("path", { class: "nf lo" }, ban);
  const th = spring(REST, { k: 60, c: 14 });
  let last = NaN, behind = null;
  function draw(a) {
    if (Math.abs(a - last) < 0.01) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const pt = ([r, z]) => P(r * c, r * s, z);
    flag.setAttribute("d", poly(OUT.map(pt)));
    edge.setAttribute("d", poly(INN.map(pt)));
    const b = c + s < 0;
    if (b !== behind) { behind = b; if (b) pole.g.before(ban); else top.after(ban); }
  }
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(th.x); return m; });
  bag.add(B.unregister);
  const px = P(0, 0, 80)[0];
  function aim(p) {
    const f = p ? clamp((p[0] - px + 30) / 110, 0, 1) : -1;
    th.t = f < 0 ? REST : REST - swing * f;
    read.textContent = f < 0 ? "rest" : Math.round(-th.t) + "°";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { swing = v; }, destroy: bag.dispose };
}

hairline({
  name: "chainmail",
  means: "A heraldic banner on a pole: the pointer is the wind, swinging the swallowtail banner round the pole away from it.",
  rules: [3, 5, 6, 8],
  range: [30, 90, 100],
  tour: [[200, 126], [244, 120], [150, 160], null],
  mount,
});
