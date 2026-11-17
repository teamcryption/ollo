/**
 * Lug wrench: a cross wrench seated on a wheel's hub, five lug nuts round it.
 * At rest the cross sits askew on its nut, bright. The pointer on the wheel
 * turns the cross a sixth of a turn and backs it up off the nut, as if it
 * cracked the nut loose; leaving turns it back. The slider is how far it turns.
 *
 * The hit is on the ground plane, which never moves; which state is a tween.
 */
const { Cam, fit, proj, facing, rings, circ, prism, mk, solid, put, flatDot, place, tween, tset, tval, tdone, register, pointer, disposer, unproj, rad } = HL;

const RW = 42, RH = 15, AR = 66, REST = 20;
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.05);
  const ext = [[-AR, -AR, 0], [AR, AR, 0], [0, 0, 40], [-AR, AR, 30], [AR, -AR, 30]];
  fit(C, ext, 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(RW, 64), circ(RW - 2, 64), 0, 9));
  put(solid(g), prism(P, front, circ(RH, 48), circ(RH - 1.4, 48), 9, 14));
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + 0.3;
    place(flatDot(g, C, 1.6, "dot m"), P(9.5 * Math.cos(a), 9.5 * Math.sin(a), 14));
  }
  const sock = solid(g), barA = solid(g), barB = solid(g);
  const BAR = rings(-AR, -3.4, AR, 3.4, 3.4, 1);
  const tw = tween(0);
  let drawn = NaN, amt = 60 * value;
  function draw(now) {
    const t = tval(tw, now);
    if (Math.abs(t - drawn) < 1e-4) return;
    drawn = t;
    const a = rad(REST + t * amt), z = 22 + t * 9;
    put(sock, prism(P, front, circ(4.5, 24), null, 14, z));
    put(barA, prism(P, front, turn(BAR[0], a), turn(BAR[1], a), z, z + 4));
    put(barB, prism(P, front, turn(BAR[0], a + Math.PI / 2), turn(BAR[1], a + Math.PI / 2), z, z + 4));
  }
  const B = register(stage, (dt, now) => { draw(now); return !tdone(tw, now); });
  bag.add(B.unregister);
  let on = false;
  function set() {
    tset(tw, on ? 1 : 0, performance.now(), 0);
    barA.sil.classList.add("hi"); barB.sil.classList.add("hi");
    read.textContent = on ? "loose" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); on = Math.hypot(x, y) < AR + 12; set(); },
    leave: () => { on = false; set(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw(performance.now()); set();
  return { set: (v) => { amt = 60 * v; drawn = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "tirechanger",
  means: "A cross lug wrench on a wheel hub: the pointer turns it a sixth of a turn and backs it off the nut.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.4],
  tour: [[235, 159], [142, 61], [322, 77], null],
  mount,
});
