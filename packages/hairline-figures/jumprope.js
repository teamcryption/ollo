/**
 * Jump rope: two handles held up at either end, a long rope hanging between
 * them in a deep loop. The pointer over the figure turns the rope: it swings
 * up and over the handles' line, as in a skip, and the handle nearer the
 * pointer is the one turning it, bright. At rest the rope hangs, the left
 * handle bright. The slider is how far over the rope swings.
 */
const { Cam, circ, fit, hull, open, poly, proj, rad, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const L = 110, HZ = 46, R = 40, HL0 = 30, REST = -110;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[0, -R, HZ - R], [L, R, HZ - R], [L / 2, 0, HZ + R], [0, 0, HZ + HL0 + 4], [L, 0, HZ + HL0 + 4]], 200, 166);
  const P = proj(C), g = mk("g", {}, svg);
  const rope = mk("path", { class: "nf sil" }, g);
  const hands = [0, L].map((x) => {
    const cyl = (r, z0, z1) => hull(circ(r, 20).map((q) => P(x + q.u, q.v, z0)).concat(circ(r, 20).map((q) => P(x + q.u, q.v, z1))));
    const grp = mk("g", {}, g);
    const sil = mk("path", { class: "sil", d: poly(cyl(4.2, HZ + 4, HZ + HL0)) }, grp);
    mk("path", { class: "nf lo", d: poly(circ(3, 20).map((q) => P(x + q.u, q.v, HZ + HL0))) }, grp);
    mk("path", { class: "sil", d: poly(cyl(2.4, HZ, HZ + 5)) }, grp);
    return { x, sil };
  });
  const a = tween(REST);
  let last = NaN;
  function draw(ang) {
    if (ang === last) return;
    last = ang;
    const pts = [], c = Math.cos(rad(ang)), s = Math.sin(rad(ang));
    for (let i = 0; i <= 40; i++) { const t = i / 40, r = R * Math.sin(Math.PI * t); pts.push(P(t * L, r * c, HZ + r * s)); }
    rope.setAttribute("d", open(pts));
  }
  const B = register(stage, (_dt, now) => { draw(tval(a, now)); return !tdone(a, now); });
  bag.add(B.unregister);
  const ends = hands.map((h) => P(h.x, 0, HZ + 10)), mid = P(L / 2, 0, HZ);
  function hit([sx, sy]) {
    if (Math.hypot(sx - mid[0], sy - mid[1]) > 150) return -1;
    return Math.abs(sx - ends[0][0]) + Math.abs(sy - ends[0][1]) < Math.abs(sx - ends[1][0]) + Math.abs(sy - ends[1][1]) ? 0 : 1;
  }
  let act = -2;
  function setActive(k) {
    if (k === act) return;
    act = k;
    tset(a, k < 0 ? REST : REST + 190 * reach, performance.now(), 0);
    hands.forEach((h, i) => h.sil.classList.toggle("hi", i === (k < 0 ? 0 : k)));
    read.textContent = k < 0 ? "rest" : k === 0 ? "left" : "right";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; const k = act; act = -2; setActive(k); }, destroy: bag.dispose };
}

hairline({
  name: "jumprope",
  means: "A jump rope held up by its two handles: the pointer turns the rope up and over, from the handle nearer it.",
  rules: [1, 3, 4, 5],
  range: [0.5, 1, 1],
  tour: [[138, 81], [250, 185], [200, 160], null],
  mount,
});
