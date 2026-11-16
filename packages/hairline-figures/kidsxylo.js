/**
 * Sorting box: a toy box whose lid has a round, a square and a triangular
 * hole and a coin slot. The pointer over the box swings the lid open on its
 * back hinge. At rest the lid stands a little ajar, bright. The slider is
 * how far the lid swings.
 */
const { Cam, circ, rrect, fit, fillet, hull, poly, proj, unproj, tset, tval, tdone, tween, disposer, mk, pointer, register, solid } = HL;

const W = 64, D = 56, H = 30, LT = 6;
const rot = (p, c, k, a) => {
  const x = p[0] - c[0], y = p[1] - c[1], z = p[2] - c[2], cs = Math.cos(a), sn = Math.sin(a), d = k[0] * x + k[1] * y;
  return [c[0] + x * cs + k[1] * z * sn + k[0] * d * (1 - cs), c[1] + y * cs - k[0] * z * sn + k[1] * d * (1 - cs), c[2] + z * cs + (k[0] * y - k[1] * x) * sn];
};
const at = (ring, z) => ring.map((q) => [q.u, q.v, z]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, -8, H + D], [W, -8, H + D]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const body = solid(g);
  body.sil.setAttribute("d", poly(hull(at(rrect(0, 0, W, D, 7, 4), 0).concat(at(rrect(0, 0, W, D, 7, 4), H)).map((p) => P(...p)))));
  body.cr.setAttribute("d", poly(at(rrect(3, 3, W - 3, D - 3, 5, 4), H).map((p) => P(...p))));
  const lid = solid(g);
  const holes = [
    at(circ(7, 24).map((q) => ({ u: q.u + 16, v: q.v + 16 })), H + LT),
    at(rrect(36, 9, 51, 24, 1.5, 3), H + LT),
    fillet([[12, 46], [25, 46], [18.5, 34]], [1.5, 1.5, 1.5], 3).map(([u, v]) => [u, v, H + LT]),
    at(rrect(36, 38, 54, 41.5, 1.2, 3), H + LT),
  ];
  const hp = holes.map(() => mk("path", { class: "nf" }, g));
  const ring = at(rrect(0, 0, W, D, 7, 4), H).concat(at(rrect(0, 0, W, D, 7, 4), H + LT));
  const inner = at(rrect(2.5, 2.5, W - 2.5, D - 2.5, 5, 4), H + LT);
  const hinge = [0, 0, H], K = [1, 0];
  const tw = tween(0.12);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const a = t * open * Math.PI / 180, T = (p) => P(...rot(p, hinge, K, a));
    lid.sil.setAttribute("d", poly(hull(ring.map(T))));
    lid.cr.setAttribute("d", poly(inner.map(T)));
    holes.forEach((h, i) => hp[i].setAttribute("d", poly(h.map(T))));
  }
  lid.sil.classList.add("hi");
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? 1 : 0.12, performance.now(), 0);
    read.textContent = on ? "lid" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H + LT);
    return x > -8 && x < W + 8 && y > -8 && y < D + 8;
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "kidsxylo",
  means: "A shape-sorting toy box with a coin slot: the pointer over it swings the lid open on its back hinge.",
  rules: [1, 4, 5, 8],
  range: [50, 80, 100],
  tour: [[193, 184], [170, 160], null],
  mount,
});
