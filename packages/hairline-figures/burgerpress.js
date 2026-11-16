/**
 * Burger press: a round dish holding a patty, and a press plate on a handle
 * above it. The pointer over the press brings the plate down onto the patty.
 * At rest the plate hangs high, bright. The slider is how far it goes.
 */
const { Cam, circ, fit, facing, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const R = 26, DH = 10, LIFT = 40, REST = 0;
const disc = (x, y, r, n = 48) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.9);
  const box = [[-R - 8, -R - 8, 0], [R + 8, R + 8, 0], [R + 8, -R - 8, 0], [-R - 8, R + 8, 0], [0, 0, DH + 6 + LIFT + 8 + 26 + 8]];
  fit(C, box, 200, 160);
  const P = proj(C), front = facing(C);
  const cyl = (s, r, z0, z1, b = 1.6) => put(s, prism(P, front, disc(0, 0, r), disc(0, 0, r - b), z0, z1));
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-R - 8, -R - 8, R + 8, R + 8, 10, 2);
  put(solid(g), prism(P, front, br, bi, 0, 3));
  cyl(solid(g), R, 3, 3 + DH, 3);
  cyl(solid(g), R - 6, 3 + DH - 3, 3 + DH + 1, 1.2);
  const plate = solid(g), rod = solid(g), knob = solid(g);
  plate.sil.classList.add("hi");

  const tw = tween(REST);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const z = 3 + DH + 1 + LIFT * (1 - v);
    cyl(plate, R - 4, z, z + 6, 2);
    cyl(rod, 3, z + 6, z + 30);
    cyl(knob, 9, z + 30, z + 37, 2);
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const sp = box.map((p) => P(...p));
  const xs = sp.map((p) => p[0]), ys = sp.map((p) => p[1]);
  const inside = ([sx, sy]) => sx > Math.min(...xs) - 8 && sx < Math.max(...xs) + 8 && sy > Math.min(...ys) - 8 && sy < Math.max(...ys) + 8;
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(tw, a ? reach : REST, performance.now(), 0);
    read.textContent = a ? "press" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act) { tset(tw, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "burgerpress",
  means: "A burger press over its dish: the pointer brings the handled plate down onto the patty.",
  rules: [1, 3, 5, 6],
  range: [0.4, 1, 1],
  tour: [[200, 160], [210, 150], [190, 170], null],
  mount,
});
