/**
 * Tourniquet: a strap band standing as a loop, a buckle block on its near
 * side and a windlass rod across the buckle. The pointer over it turns the
 * rod and the loop draws tight; at rest the rod lies half turned, bright.
 * The slider is how tight it draws.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rrect, circ, ringAt, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R0 = 44, R1 = 28, H = 16, REST = 0.2;
const rot = (ring, a, x, y) => { const c = Math.cos(a), s = Math.sin(a); return ring.map((q) => ({ u: x + q.u * c - q.v * s, v: y + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c })); };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let pull = value;
  const C = Cam(45, 0.5, 2.65);
  fit(C, [[-R0, -R0, 0], [R0 + 8, R0 + 8, 0], [R0, -R0, 0], [-R0, R0, 0], [R0, R0, H + 10]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const loop = solid(g), hole = mk("path", { class: "nf" }, loop.g);
  const buckle = solid(g), rod = solid(g), cap = solid(g);
  const t = tween(REST);
  let last = NaN;
  function draw(k) {
    if (k === last) return;
    last = k;
    const R = R0 + (R1 - R0) * k, a = Math.PI / 4;
    put(loop, prism(P, front, circ(R, 56), circ(R - 2, 56), 0, H));
    hole.setAttribute("d", poly(ringAt(P, circ(R - 3, 56), H)));
    const bx = R * Math.cos(a), by = R * Math.sin(a);
    put(buckle, prism(P, front, rot(rrect(-6, -12, 6, 12, 3, 4), a, bx, by), rot(rrect(-4.5, -10.5, 4.5, 10.5, 2, 4), a, bx, by), -1, H + 3));
    const ra = a + 0.4 + k * 2.2;
    put(rod, prism(P, front, rot(rrect(-3, -26, 3, 26, 3, 4), ra, bx, by), rot(rrect(-1.8, -24.8, 1.8, 24.8, 1.8, 4), ra, bx, by), H + 3, H + 8));
    put(cap, prism(P, front, rot(circ(3.4, 16), 0, bx, by), rot(circ(2, 16), 0, bx, by), H + 8, H + 10));
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a ? 0.35 + 0.65 * pull : REST, performance.now(), 0);
    rod.sil.classList.add("hi");
    read.textContent = a ? "tight" : "rest";
    B.wake();
  }
  const hit = ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, H); return Math.hypot(x, y) < R0 + 14; };
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { pull = v; act = null; }, destroy: bag.dispose };
}

hairline({
  name: "tourniquet",
  means: "A tourniquet loop with a buckle: the pointer over it turns the windlass rod and the strap draws tight.",
  rules: [1, 4, 5, 9],
  range: [0.4, 1, 1],
  tour: [[200, 128], [150, 150], [240, 190], null],
  mount,
});
