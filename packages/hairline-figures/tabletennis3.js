/**
 * Table tennis net: a strip of table with a post clamped at each end and the
 * meshed net strung between them from its top cord. The pointer is a ball
 * clipping the net: the net swings on its cord, away from the side the
 * pointer is on. At rest the net hangs a little swung and the left post's
 * clamp is bright. The slider is how far the net swings.
 */
const { Cam, fit, hull, open, poly, proj, rrect, circ, tdone, tset, tval, tween, rad, disposer, mk, pointer, register } = HL;

const W = 130, H = 34, REST = 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-16, -30, -14], [W + 16, 30, -14], [-16, 30, H + 4], [W + 16, -30, H + 4]], 200, 166);
  const P = proj(C), g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r) => {
    const a = rrect(x0, y0, x1, y1, r, 4), b = rrect(x0 + 1, y0 + 1, x1 - 1, y1 - 1, Math.max(0.3, r - 1), 4);
    mk("path", { class: "sil", d: poly(hull(a.map((q) => P(q.u, q.v, z0)).concat(a.map((q) => P(q.u, q.v, z1))))) }, g);
    return mk("path", { class: "nf lo", d: poly(b.map((q) => P(q.u, q.v, z1))) }, g);
  };
  box(-16, -26, W + 16, 26, -6, 0, 4);
  const posts = [-6, W + 6].map((x) => {
    const clamp = mk("path", { class: "sil", d: poly(hull(rrect(x - 5, -7, x + 5, 7, 2.5, 4).flatMap((q) => [P(q.u, q.v, -12), P(q.u, q.v, 3)]))) }, g);
    mk("path", { class: "sil", d: poly(hull(circ(1.8, 16).flatMap((q) => [P(x + q.u, q.v, 3), P(x + q.u, q.v, H + 3)]))) }, g);
    return { x, clamp };
  });
  const net = mk("path", { class: "sil" }, g), mesh = mk("path", { class: "nf lo" }, g), cord = mk("path", { class: "nf" }, g);
  cord.setAttribute("d", open([P(-6, 0, H + 1), P(W + 6, 0, H + 1)]));
  const a = tween(REST);
  let last = NaN;
  function draw(ang) {
    if (ang === last) return;
    last = ang;
    const s = Math.sin(rad(ang)), c = Math.cos(rad(ang));
    const T = (x, z) => P(x, -(H - z) * s, H - (H - z) * c);
    net.setAttribute("d", poly([T(0, H), T(W, H), T(W, 4), T(0, 4)]));
    const m = [];
    for (let x = 10; x < W; x += 10) m.push(open([T(x, H - 3), T(x, 4)]));
    for (let z = 10; z < H; z += 7) m.push(open([T(0, z), T(W, z)]));
    mesh.setAttribute("d", m.join(" "));
  }
  const B = register(stage, (_dt, now) => { draw(tval(a, now)); return !tdone(a, now); });
  bag.add(B.unregister);
  const mid = P(W / 2, 0, H / 2);
  let act = -3;
  function setActive(k) {
    if (k === act) return;
    act = k;
    tset(a, k < 0 ? REST : k === 0 ? -50 * swing : 50 * swing, performance.now(), 0);
    posts[0].clamp.classList.toggle("hi", k < 0);
    net.classList.toggle("hi", k >= 0);
    read.textContent = k < 0 ? "rest" : k === 0 ? "near" : "far";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const dx = sx - mid[0], dy = sy - mid[1];
      setActive(Math.abs(dx) > 170 || Math.abs(dy) > 110 ? -1 : dy > (dx * -0.5) ? 0 : 1);
    },
    leave: () => setActive(-1),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { swing = v; const k = act; act = -3; setActive(k); }, destroy: bag.dispose };
}

hairline({
  name: "tabletennis3",
  means: "A table tennis net clamped between two posts: the pointer clips it, and the net swings on its cord away from that side.",
  rules: [1, 3, 4, 5],
  range: [0.4, 1, 1.4],
  tour: [[170, 162], [235, 120], [200, 200], null],
  mount,
});
