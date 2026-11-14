/**
 * Menu stand: a table top with a round weighted holder and a tall menu card
 * standing in its clip. The card turns on its clip to face the pointer, as
 * far as its stop allows. At rest it stands a little turned, bright.
 */
const {
  Cam, circ, fit, facing, fillet, hull, open, poly, prism, proj, rings, unproj, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const T = 90, CX = 45, CY = 45, HW = 22, HZ = 64, Z0 = 12;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[0, 0, 0], [T, T, 0], [T, 0, 0], [0, T, 0], [CX - HW, CY + HW, Z0 + HZ], [CX + HW, CY - HW, Z0 + HZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(0, 0, T, T, 10, 2);
  put(solid(g), prism(P, front, tr, ti, 0, 4));
  put(solid(g), prism(P, front, disc(CX, CY, 12), disc(CX, CY, 10), 4, 9));
  const back = mk("path", { class: "nf lo" }, g);
  const card = mk("path", { class: "sil hi" }, g), clip = mk("path", { class: "nf" }, g);

  const ang = spring(rad(-20));
  let last = NaN;
  function rad(d) { return d * Math.PI / 180; }
  function face(th, off) {
    const c = Math.cos(th), s = Math.sin(th), nx = -s * off, ny = c * off;
    const pt = (u, z) => P(CX + c * u + nx, CY + s * u + ny, z);
    return [pt(-HW, Z0), pt(HW, Z0), pt(HW, Z0 + HZ), pt(-HW, Z0 + HZ)];
  }
  function draw() {
    if (ang.x === last) return;
    last = ang.x;
    const a = face(ang.x, 1.2), b = face(ang.x, -1.2);
    card.setAttribute("d", poly(hull(fillet(a, [3, 3, 3, 3]).concat(fillet(b, [3, 3, 3, 3])))));
    back.setAttribute("d", poly(fillet(b, [3, 3, 3, 3])));
    const c = Math.cos(ang.x), s = Math.sin(ang.x), q = (u, n, z) => P(CX + c * u - s * n, CY + s * u + c * n, z);
    clip.setAttribute("d", poly(hull([q(-6, -3, 9), q(6, -3, 9), q(6, 3, 9), q(-6, 3, 9), q(-6, -3, 17), q(6, -3, 17), q(6, 3, 17), q(-6, 3, 17)])) + " " + open([q(-6, 3.2, 17), q(6, 3.2, 17)]).replace(/^/, ""));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);
  draw();

  function rest() { ang.t = rad(-20); read.textContent = "rest"; B.wake(); }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    const dx = x - CX, dy = y - CY;
    if (Math.hypot(dx, dy) < 4) return;
    // the card's face normal is (-sin, cos): turn it toward the pointer, clamped to the stop
    let th = Math.atan2(dy, dx) - Math.PI / 2;
    th = Math.atan2(Math.sin(th), Math.cos(th));
    const lim = rad(30 + reach);
    ang.t = clamp(th, -lim, lim);
    read.textContent = Math.round(ang.t * 180 / Math.PI) + "°";
    B.wake();
  }
  rest();
  bag.add(pointer(stage, { move, leave: rest }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "menuholder",
  means: "A menu card standing in a round table holder: the card turns on its clip to face the pointer, up to its stop.",
  rules: [3, 5, 8, 9],
  range: [0, 30, 60],
  tour: [[321, 198], [267, 252], [79, 198], null],
  mount,
});
