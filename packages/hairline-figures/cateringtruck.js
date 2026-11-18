/**
 * Catering truck: an airport catering truck, a cab at the front and a tall
 * box body on crossed scissor arms. Over the truck the body rises on the
 * 700ms ease to meet an aircraft door; leaving lowers it onto the chassis,
 * the body bright. The slider is how high it climbs.
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, clamp, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BASE = 14, REST = 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-52, -18, 0], [54, 18, 0], [54, -18, 0], [-52, 18, 0], [-52, -18, BASE + 56 + 35], [28, 18, BASE + 56 + 35]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (par, x0, y0, x1, y1, z0, z1, r = 2, b = 1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(par); put(s, prism(P, front, o, i, z0, z1)); return s; };
  const wheel = (cx, y) => {
    const pts = [];
    for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2; pts.push(P(cx + 7 * Math.cos(a), y, 7 + 7 * Math.sin(a))); }
    mk("path", { d: poly(pts) }, g);
  };
  wheel(-32, -16); wheel(36, -16);
  box(g, -50, -15, 52, 15, 6, BASE, 3, 1.2);
  const back = mk("g", {}, g), fr = mk("g", {}, g);
  const armsB = [mk("path", { class: "lo" }, back), mk("path", { class: "lo" }, back)];
  const armsF = [mk("path", {}, fr), mk("path", {}, fr)];
  const body = solid(g);
  body.sil.classList.add("hi");
  const door = mk("path", { class: "nf lo" }, g);
  box(g, 30, -15, 52, 15, BASE, 40, 5, 1.6);
  box(g, 30, -15, 52, 15, 40, 42, 3, 1);
  wheel(-32, 16); wheel(36, 16);
  const [br, bi] = rings(-50, -17, 27, 17, 3, 1.4);
  const L = 26;
  const strip = (a, b, y) => poly([P(a[0], y, a[1] - 1.6), P(b[0], y, b[1] - 1.6), P(b[0], y, b[1] + 1.6), P(a[0], y, a[1] + 1.6)]);
  const lift = tween(REST);
  let last = NaN;
  function draw(H) {
    if (H === last) return;
    last = H;
    const z0 = BASE, z1 = BASE + H;
    const A = [[-12 - L, z0], [-12 + L, z1]], Bb = [[-12 + L, z0], [-12 - L, z1]];
    armsB[0].setAttribute("d", strip(A[0], A[1], -12)); armsB[1].setAttribute("d", strip(Bb[0], Bb[1], -12));
    armsF[0].setAttribute("d", strip(A[0], A[1], 12)); armsF[1].setAttribute("d", strip(Bb[0], Bb[1], 12));
    const zt = BASE + H + 1;
    put(body, prism(P, front, br, bi, zt, zt + 34));
    door.setAttribute("d", poly([P(27, -10, zt + 6), P(27, 10, zt + 6), P(27, 10, zt + 30), P(27, -10, zt + 30)]));
  }
  const B = register(stage, (dt, now) => { draw(tval(lift, now)); return !tdone(lift, now); });
  bag.add(B.unregister);
  function move([sx, sy]) {
    if (Math.abs(sx - 200) > 130 || sy < 15 || sy > 305) return leave();
    tset(lift, top, performance.now(), 0);
    read.textContent = "up " + Math.round(top);
    B.wake();
  }
  function leave() { tset(lift, REST, performance.now(), 0); read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { top = clamp(v, 30, 56); }, destroy: bag.dispose };
}

hairline({
  name: "cateringtruck",
  means: "An airport catering truck: over it the scissor arms open and lift the box body; the slider sets how high it rises.",
  rules: [3, 5, 8],
  range: [30, 44, 56],
  tour: [[184, 162], [150, 120], [230, 225], null],
  mount,
});
