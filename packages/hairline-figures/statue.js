/**
 * Statue plinth: a stepped stone plinth with a cornice, and on it a robed
 * figure holding a torch out at arm's length. The figure turns on the plinth
 * to hold its torch toward the pointer, on a spring. At rest it holds it out
 * to the front and the torch is bright. The slider raises the arm.
 *
 * The pattern: one part turning to face the pointer (aim).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, spring, stepS, unproj, clamp, lerp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BZ = 44, SH = 76, REST = 1.1;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let raise = value / 100;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[-21, -21, 0], [21, 21, 0], [21, -21, 0], [-21, 21, 0], [-26, -26, 104], [26, 26, 104]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (h, b, z0, z1) => { const [o, i] = rings(-h, -h, h, h, 3, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  box(21, 1.6, 0, 6);
  box(15, 1.4, 6, 40);
  box(17.5, 1.4, 40, BZ);
  const back = mk("g", {}, g);
  // the robed body: a tapered hull from hem to shoulders, then the head
  const body = solid(g);
  body.sil.setAttribute("d", poly(hull(ringAt(P, disc(0, 0, 9), BZ).concat(ringAt(P, disc(0, 0, 6), SH)))));
  body.cr.setAttribute("d", open(ringAt(P, run(disc(0, 0, 6.6), front), SH - 6)));
  const head = solid(g);
  head.sil.setAttribute("d", poly(hull(ringAt(P, disc(0, 0, 3.6), SH + 2).concat(ringAt(P, disc(0, 0, 3.6), SH + 10)))));
  const fore = mk("g", {}, g);
  const arm = mk("g", {}, fore), rod = mk("path", { class: "sil" }, arm), torch = mk("path", { class: "sil" }, arm), cup = mk("path", { class: "nf lo" }, arm);

  const ang = spring(REST);
  let lastA = NaN, lastR = NaN, act = false;
  function draw(a) {
    if (a === lastA && raise === lastR) return;
    lastA = a; lastR = raise;
    const c = Math.cos(a), s = Math.sin(a), hz = SH - 4 + lerp(-6, 22, raise), hx = 23 * c, hy = 23 * s;
    rod.setAttribute("d", poly(hull(ringAt(P, disc(5 * c, 5 * s, 2.2, 12), SH - 4).concat(ringAt(P, disc(hx, hy, 2, 12), hz)))));
    torch.setAttribute("d", poly(hull(ringAt(P, disc(hx, hy, 1.4, 12), hz - 6).concat(ringAt(P, disc(hx, hy, 3, 16), hz + 6)))));
    cup.setAttribute("d", poly(ringAt(P, disc(hx, hy, 3, 16), hz + 6)));
    const near = hx + hy > 0;
    (near ? fore : back).appendChild(arm);
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function aim(p) {
    const [wx, wy] = unproj(C, p[0], p[1], 0);
    if (Math.hypot(wx, wy) < 4) return;
    let t = Math.atan2(wy, wx);
    while (t - ang.t > Math.PI) t -= 2 * Math.PI;
    while (t - ang.t < -Math.PI) t += 2 * Math.PI;
    ang.t = t;
    if (!act) { act = true; rod.classList.add("hi"); torch.classList.remove("hi"); }
    let deg = Math.round(((t * 180) / Math.PI) % 360); if (deg < 0) deg += 360;
    read.textContent = deg + "°";
    B.wake();
  }
  function rest() {
    act = false;
    let t = REST; while (t - ang.t > Math.PI) t -= 2 * Math.PI; while (t - ang.t < -Math.PI) t += 2 * Math.PI;
    ang.t = t;
    rod.classList.remove("hi"); torch.classList.add("hi");
    read.textContent = "rest";
    B.wake();
  }
  rest();
  bag.add(pointer(stage, { move: aim, leave: rest }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { raise = clamp(v / 100, 0, 1); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "statue",
  means: "A torch-bearing statue on a stepped plinth: the figure turns on its plinth to hold the torch out toward the pointer.",
  rules: [3, 4, 5, 8],
  range: [0, 50, 100],
  tour: [[262, 239], [140, 200], null],
  mount,
});
