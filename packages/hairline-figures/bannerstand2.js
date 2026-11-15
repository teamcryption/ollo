/**
 * A-frame chalkboard: two boards hinged at the top, standing on the
 * pavement. The pointer's screen x swings the front board open about the
 * hinge, its feet lifting off the ground. At rest the front board stands a
 * little wider than the back, bright. The slider is how far it can swing.
 */
const { Cam, fit, proj, poly, open, clamp, rad, spring, stepS, mk, pointer, register, disposer } = HL;

const W = 46, H = 69, L = 72, BACK = 16, REST = 24;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[0, -22, 0], [W, -22, 0], [0, 72, H], [W, 72, H], [W, 30, 0], [0, 0, H + 3]], 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  const at = (u, s, a, sg) => P(u, sg * s * Math.sin(rad(a)), H - s * Math.cos(rad(a)));
  const quad = (u0, u1, s0, s1, a, sg) => poly([at(u0, s0, a, sg), at(u1, s0, a, sg), at(u1, s1, a, sg), at(u0, s1, a, sg)]);

  // the back board, fixed
  mk("path", { d: quad(0, W, 0, L, BACK, -1) }, g);
  mk("path", { d: quad(4, W - 4, 5, L - 6, BACK, -1), class: "nf lo" }, g);
  // the hinge bar
  mk("path", { d: open([P(-2, 0, H + 1), P(W + 2, 0, H + 1)]), class: "nf" }, g);
  // the front board, swinging
  const fb = mk("path", { class: "sil" }, g), fin = mk("path", { class: "nf lo" }, g);
  const chalk = mk("path", { class: "nf" }, g), tray = mk("path", { class: "nf" }, g);
  const ang = spring(REST, { k: 90, c: 16 });

  function draw(a) {
    fb.setAttribute("d", quad(0, W, 0, L, a, 1));
    fin.setAttribute("d", quad(4, W - 4, 5, L - 6, a, 1));
    // chalk: a few strokes of different lengths, and a little box, no text
    let d = "";
    for (const [u0, u1, s] of [[9, 37, 14], [9, 30, 22], [9, 34, 30], [9, 24, 38]]) d += "M" + at(u0, s, a, 1).join(",") + "L" + at(u1, s, a, 1).join(",");
    d += poly([at(10, 46, a, 1), at(22, 46, a, 1), at(22, 58, a, 1), at(10, 58, a, 1)]);
    d += "M" + at(26, 50, a, 1).join(",") + "L" + at(37, 50, a, 1).join(",") + "M" + at(26, 55, a, 1).join(",") + "L" + at(33, 55, a, 1).join(",");
    chalk.setAttribute("d", d);
    tray.setAttribute("d", open([at(2, L - 3, a, 1), at(W - 2, L - 3, a, 1)]));
  }
  draw(REST);

  const B = register(stage, (dt) => {
    const m = stepS(ang, dt);
    draw(ang.x);
    read.textContent = Math.abs(ang.x - REST) < 0.5 && ang.t === REST ? "rest" : Math.round(ang.x) + "°";
    return m;
  });
  bag.add(B.unregister);
  fb.classList.add("hi");

  function move([sx]) {
    const t = clamp((sx - 70) / 260, 0, 1);
    ang.t = BACK + 2 + t * max;
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave: () => { ang.t = REST; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "bannerstand2",
  means: "A chalkboard A-frame on the pavement: the pointer swings its front board open on the hinge, feet lifting.",
  rules: [1, 3, 4, 5],
  range: [30, 55, 80],
  tour: [[179, 210], [79, 119], [321, 224], null],
  mount,
});
