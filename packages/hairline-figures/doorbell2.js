/**
 * Video doorbell: a slim unit on a wall plate, a camera eye at the top and a
 * ring button below. The pointer on it presses the button: the button sinks
 * into the face and three chime rings spread out round the unit, behind it.
 * At rest the button ring is bright. The slider is how far the rings reach.
 */
const {
  Cam, circ, facing, fit, poly, prism, proj, rings, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 26, T = 9, H = 66, BZ = 17, LZ = 52, BR = 7;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.7);
  fit(C, [[-26, T, BZ - 24], [W + 26, T, BZ + 50], [-26, T, BZ + 50], [W + 26, T, BZ - 24], [-6, -5, -6], [W + 6, T, -6]], 200, 180);
  const P = proj(C), front = facing(C);
  const onFace = (y) => (q) => P(q.u, y, q.v);

  const g = mk("g", {}, svg);
  const waves = mk("path", { class: "nf" }, g);
  const plate = solid(g);
  const [pr, pi] = rings(-5, -5, W + 5, 0, 2, 1);
  put(plate, prism(P, front, pr, pi, -5, H + 5));
  const unit = solid(g);
  const [ur, ui] = rings(0, 0, W, T, 4, 1.4);
  put(unit, prism(P, front, ur, ui, 0, H));
  const eye = mk("path", { class: "nf" }, unit.g);
  const ring = (cx, cz, r, y) => poly(circ(r, 24).map((q) => P(cx + q.u, y, cz + q.v)));
  eye.setAttribute("d", ring(W / 2, LZ, 7, T) + ring(W / 2, LZ, 3.6, T) + poly(rrect(4, H - 6, W - 4, H - 4, 1, 2).map(onFace(T))));
  const btn = mk("path", { class: "nf" }, unit.g);

  const st = tween(0), last = [NaN];
  function draw(s) {
    const y = T - s * 1.6;
    btn.setAttribute("d", ring(W / 2, BZ, BR, T) + ring(W / 2, BZ, BR - 2.2, y) + ring(W / 2, BZ, 1.2, y));
    let d = "";
    if (s > 0.02) for (let i = 0; i < 5; i++) {
      const r = (10 + i * 6.5) * s * (0.5 + reach / 200);
      d += ring(W / 2, BZ + 14, r, T);
    }
    waves.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    const s = tval(st, now);
    if (s !== last[0]) { draw(s); last[0] = s; }
    return !tdone(st, now);
  });
  bag.add(B.unregister);
  btn.classList.add("hi");

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(st, a ? 1 : 0, performance.now(), 0);
    read.textContent = a ? "ding" : "rest";
    B.wake();
  }
  setActive(0);
  bag.add(pointer(stage, { move: () => setActive(1), leave: () => setActive(0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last[0] = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "doorbell2",
  means: "A video doorbell on its wall plate: under the pointer the button sinks in and chime rings spread out round the unit.",
  rules: [3, 4, 5, 6],
  range: [20, 60, 100],
  tour: [[200, 222], [200, 110], [190, 247], null],
  mount,
});
