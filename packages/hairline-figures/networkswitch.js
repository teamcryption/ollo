/**
 * Network switch: a flat rack switch with a row of eight ports along its
 * front face, a patch plug seated in each, a link light above every port.
 * The pointer picks a port by where it is along the switch: that plug slides
 * out of its socket and its light goes bright, its neighbours ease out a
 * little after it. At rest the plugs sit at uneven depths, one pulled, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row; the hit is on a fixed plane
 * through the plugs' resting middles.
 */
const {
  Cam, clamp, facing, fit, open, poly, prism, proj, rings, ringAt, rrect, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 8, STEP = 11, X0 = 10, X1 = X0 + (N - 1) * STEP + 10, Y1 = 34, H = 14, PZ = [3.5, 9], PL = 9, PULL = 14;
const REST = [0.6, 0, 1.2, 0.2, 4, 0.4, 0, 1], FAV = 4, LIT = [1, 1, 0, 1, 1, 0, 1, 1];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[0, 0, 0], [X1, 0, 0], [X1, Y1 + PL + PULL + 6, 0], [0, Y1 + PL + PULL + 6, 0], [0, 0, H], [X1, Y1, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the body: one long low solid, vents on the lid, sockets on the front face
  const [outer, inner] = rings(0, 0, X1, Y1, 4, 1.4);
  const body = solid(g);
  put(body, prism(P, front, outer, inner, 0, H));
  let deco = "";
  for (let k = 0; k < 6; k++) deco += seg(P(8 + k * 5, 8, H), P(8 + k * 5, 20, H));
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP;
    deco += poly([P(x - 3.6, Y1, PZ[0] - 1), P(x + 3.6, Y1, PZ[0] - 1), P(x + 3.6, Y1, PZ[1] + 1), P(x - 3.6, Y1, PZ[1] + 1)]);
  }
  mk("path", { class: "nf lo", d: deco }, body.g);
  const leds = [];
  for (let k = 0; k < N; k++) {
    const c = mk("circle", { class: LIT[k] ? "dot m" : "dot off", r: 1.3 }, body.g);
    const [sx, sy] = P(X0 + k * STEP, Y1, H - 2.4);
    c.setAttribute("cx", sx); c.setAttribute("cy", sy);
    leds.push(c);
  }

  // a plug: a short boot along y with its cable dropping to the floor
  const plugs = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    plugs.push({ k, x: X0 + k * STEP, cab: mk("path", { class: "nf" }, grp), s: solid(grp), o: tween(REST[k]), last: NaN });
  }
  function draw(p, o) {
    if (o === p.last) return;
    p.last = o;
    const y0 = Y1 - 1 + o, y1 = y0 + PL;
    const [r, i] = rings(p.x - 2.8, y0, p.x + 2.8, y1, 1.4, 0.7);
    put(p.s, prism(P, front, r, i, PZ[0], PZ[1]));
    const zc = (PZ[0] + PZ[1]) / 2, pts = [];
    for (let t = 0; t <= 8; t++) { const u = t / 8; pts.push(P(p.x, y1 + u * 8, zc * (1 - u) * (1 - u))); }
    p.cab.setAttribute("d", open(pts));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    plugs.forEach((p) => { draw(p, tval(p.o, now)); if (!tdone(p.o, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, (PZ[0] + PZ[1]) / 2);
    if (x < -4 || x > X1 + 4 || y < Y1 - 14 || y > Y1 + PL + PULL + 8) return -1;
    return clamp(Math.round((x - X0) / STEP), 0, N - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    plugs.forEach((p, k) => {
      const o = a < 0 ? REST[k] : k === a ? PULL : Math.max(0, 2.4 - Math.abs(k - a) * 0.8);
      tset(p.o, o, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      p.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
      leds[k].setAttribute("class", k === (a < 0 ? FAV : a) ? "dot" : LIT[k] ? "dot m" : "dot off");
    });
    read.textContent = a < 0 ? "rest" : "port " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "networkswitch",
  means: "A network switch: the plug in the port under the pointer slides out and its light goes bright, its neighbours easing after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[109, 139], [173, 171], [258, 214], null],
  mount,
});
