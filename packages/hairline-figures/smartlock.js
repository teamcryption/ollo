/**
 * Smart lock: a square backplate with a round motor drum and a broad
 * thumb-turn standing on it, a status light at its corner. The pointer over
 * the lock turns the thumb-turn round on the drum, as a hand unlocking it.
 * At rest the turn sits a little off square and the light is bright. The
 * slider is how far it turns.
 *
 * The pattern: one part turning on its axis; the hit is the plate's rest
 * top, which never moves.
 */
const {
  Cam, circ, clamp, fit, facing, poly, prism, proj, rings, rrect, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, flatDot,
} = HL;

const B0 = 46, PZ = 8, DZ = 18, TZ = 40, REST = 18;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-B0, -B0, 0], [B0, B0, 0], [B0, -B0, 0], [-B0, B0, 0], [-30, 0, TZ], [30, 0, TZ], [0, 30, TZ], [0, -30, TZ]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-B0, -B0, B0, B0, 14, 2);
  put(solid(g), prism(P, front, pr, pi, 0, PZ));
  const led = mk("circle", { r: 3, class: "dot" }, g);
  const lp = P(B0 - 9, B0 - 9, PZ); led.setAttribute("cx", lp[0]); led.setAttribute("cy", lp[1]);
  put(solid(g), prism(P, front, circ(30, 56), circ(28, 56), PZ, DZ));
  // a ring of index marks round the drum's top
  for (let i = 0; i < 4; i++) {
    const t = (i / 4) * Math.PI * 2 + Math.PI / 4, a = P(24 * Math.cos(t), 24 * Math.sin(t), DZ), b = P(27 * Math.cos(t), 27 * Math.sin(t), DZ);
    mk("path", { d: "M" + a.join(",") + "L" + b.join(","), class: "nf lo" }, g);
  }
  const turn = solid(g);
  turn.sil.setAttribute("class", "sil");
  const base = rrect(-30, -7, 30, 7, 7, 4), inner = rrect(-28.4, -5.4, 28.4, 5.4, 5.4, 4);
  const spin = (ring, a) => {
    const c = Math.cos(a), s = Math.sin(a);
    return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
  };
  const ang = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = (deg * Math.PI) / 180;
    put(turn, prism(P, front, spin(base, a), spin(inner, a), DZ, TZ));
  }
  const L = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(L.unregister);

  let on = null;
  function setActive(a, force) {
    if (a === on && !force) return;
    on = a;
    tset(ang, a ? REST + 30 + 110 * max : REST, performance.now(), 0);
    turn.sil.classList.toggle("hi", a);
    led.setAttribute("class", a ? "dot off" : "dot");
    read.textContent = a ? "turn " + Math.round(30 + 110 * max) + "°" : "rest";
    L.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, PZ); return Math.abs(x) < B0 + 4 && Math.abs(y) < B0 + 4; };
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = clamp(v, 0, 1); if (on) setActive(true, true); }, destroy: bag.dispose };
}

hairline({
  name: "smartlock",
  means: "A smart lock on its backplate: the pointer over it turns the broad thumb-turn on its drum, as far as the slider says.",
  rules: [1, 4, 5, 9],
  range: [0, 0.6, 1],
  tour: [[200, 169], [200, 120], [200, 225], null],
  mount,
});
