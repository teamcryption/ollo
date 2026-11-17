/**
 * Torque wrench: a long click wrench seated on a nut on a block. At rest it
 * lies a little off square, its grip bright. The pointer on it pulls the
 * handle round through its swing until it clicks, the dot on the head going
 * from dim to medium; leaving swings it back. The slider is the swing.
 *
 * The hit is on the ground plane, which never moves; which state is a tween.
 */
const { Cam, fit, proj, facing, rings, circ, prism, mk, solid, put, flatDot, place, tween, tset, tval, tdone, register, pointer, disposer, unproj, rad } = HL;

const LEN = 100, REST = 15;
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.7);
  const ext = [[-22, -22, 0], [22, 22, 0], [LEN * Math.cos(rad(15)), LEN * Math.sin(rad(15)), 40], [LEN * Math.cos(rad(70)), LEN * Math.sin(rad(70)), 40], [-22, -22, 30]];
  fit(C, ext, 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const BLK = rings(-22, -22, 22, 22, 5, 1.4);
  put(solid(g), prism(P, front, BLK[0], BLK[1], 0, 26));
  put(solid(g), prism(P, front, circ(8, 6), null, 26, 29));
  const head = solid(g), bar = solid(g), grip = solid(g);
  const dot = flatDot(g, C, 1.8, "dot off");
  const BAR = rings(9.5, -2.8, LEN - 20, 2.8, 2.8, 0.9), GR = rings(LEN - 34, -4.6, LEN, 4.6, 4.6, 1.2);
  const tw = tween(0);
  let drawn = NaN, amt = 55 * value;
  function draw(now) {
    const t = tval(tw, now);
    if (Math.abs(t - drawn) < 1e-4) return;
    drawn = t;
    const a = rad(REST + t * amt);
    put(head, prism(P, front, circ(9, 32), circ(7.8, 32), 29, 35));
    put(bar, prism(P, front, turn(BAR[0], a), turn(BAR[1], a), 30, 34));
    put(grip, prism(P, front, turn(GR[0], a), turn(GR[1], a), 29, 35));
    place(dot, P(0, 0, 35));
    dot.setAttribute("class", t > 0.85 ? "dot m" : "dot off");
  }
  const B = register(stage, (dt, now) => { draw(now); return !tdone(tw, now); });
  bag.add(B.unregister);
  let on = false;
  function set() {
    tset(tw, on ? 1 : 0, performance.now(), 0);
    grip.sil.classList.add("hi");
    read.textContent = on ? "click" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 32); on = Math.hypot(x, y) < LEN + 14; set(); },
    leave: () => { on = false; set(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw(performance.now()); set();
  return { set: (v) => { amt = 55 * v; drawn = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "sparkplug2",
  means: "A torque wrench on a nut: the pointer pulls its handle round its swing until it clicks, then it swings back.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.07],
  tour: [[302, 218], [200, 200], [106, 203], null],
  mount,
});
