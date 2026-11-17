/**
 * Pet fountain: a wide drinking dish with a water ring, a pump in the middle
 * and a round reservoir on it, a flower plate on top where the water bubbles.
 * The pointer slides the reservoir up off its pump, further the nearer it is,
 * and a little toward you. At rest it sits down, its top plate bright.
 */
const { Cam, circ, fit, facing, prism, proj, clamp, spring, stepS, unproj, disposer, mk, pointer, put, register, solid, flatDot, place } = HL;

const RD = 40, RR = 22, H = 30, LIFT = 26;
const shift = (ring, dx, dy) => ring.map((q) => ({ ...q, u: q.u + dx, v: q.v + dy }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-RD, -RD, 0], [RD, RD, 0], [RD, -RD, 0], [-RD, RD, 0], [0, 0, H + LIFT + 10]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(RD, 72), circ(RD - 2, 72), 0, 7));
  mk("path", { class: "lo nf", d: prism(P, front, circ(RD - 7, 72), null, 5, 5).sil }, g);
  put(solid(g), prism(P, front, circ(6, 24), circ(5, 24), 5, 14));
  const res = solid(g), plate = solid(g);
  const drops = [0, 1, 2].map(() => flatDot(g, C, 1.2, "dot m"));
  const amt = spring(0, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN, over = null;

  function draw() {
    if (Math.abs(amt.x - drawn) < 1e-4) return;
    drawn = amt.x;
    const z0 = 5 + LIFT * amt.x, s = 5 * amt.x;
    put(res, prism(P, front, shift(circ(RR, 64), s, s), shift(circ(RR - 1.6, 64), s, s), z0, z0 + H));
    put(plate, prism(P, front, shift(circ(11, 40), s, s), shift(circ(9.5, 40), s, s), z0 + H, z0 + H + 3));
    drops.forEach((d, i) => { const a = 0.6 + i * 0.9; place(d, P(s + 5 * Math.cos(a), s + 5 * Math.sin(a), z0 + H + 3)); });
  }

  const B = register(stage, (dt) => { const m = stepS(amt, dt); draw(); return m; });
  bag.add(B.unregister);

  function retarget() {
    amt.t = over ? clamp(1.2 - over / 80, 0.35, 1) : 0;
    res.sil.classList.toggle("hi", !!over);
    plate.sil.classList.toggle("hi", !over);
    read.textContent = over ? "up " + Math.round(amt.t * LIFT) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      over = r > RD + 40 ? null : Math.max(r, 1);
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { amt.k = 100 * v; amt.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "waterfountain",
  means: "A pet water fountain: the pointer slides its reservoir up off the pump and toward you, more the nearer it is.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[200, 178], [200, 128], [200, 283], null],
  mount,
});
