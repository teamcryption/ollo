/**
 * Chess clock: a long case with two round dials on its face and a rocker bar
 * on top carrying two plungers. The pointer picks a side: the rocker see-saws
 * down on that side, and that player's hand sweeps round its dial. At rest the
 * rocker leans to the left, its plunger bright.
 *
 * The pattern: a discrete choice between two sides (tween); the hit is the
 * plungers' rest screen x, which never moves.
 */
const {
  Cam, circ, facing, fit, hull, open, poly, prism, proj, rings, run, seg,
  tween, tset, tval, tdone, disposer, mk, pointer, put, register, solid,
} = HL;

const H = 34, PZ = H + 4, A = 0.1, BX = 28;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-40, -16, 0], [40, 16, 0], [-40, -16, H], [40, 16, H], [-36, 0, PZ + 16], [36, 0, PZ + 16]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const T = (x, y, z, th) => {
    const dz = z - PZ, c = Math.cos(th), s = Math.sin(th);
    return P(x * c - dz * s, y, PZ + x * s + dz * c);
  };
  const tilted = (sd, ring, inner, z0, z1, ox, th) => {
    const pts = [];
    for (const q of ring) pts.push(T(q.u + ox, q.v, z0, th), T(q.u + ox, q.v, z1, th));
    put(sd, { sil: poly(hull(pts)), crease: inner ? open(run(inner, front).map((q) => T(q.u + ox, q.v, z1, th))) : "" });
  };

  const [body, bodyIn] = rings(-40, -16, 40, 16, 6, 1.6);
  put(solid(g), prism(P, front, body, bodyIn, 0, H));
  // dials on the front face, y = 16
  const dials = [-20, 20].map((cx, i) => {
    const ring = (R) => Array.from({ length: 40 }, (_, k) => { const t = (k / 40) * Math.PI * 2; return P(cx + R * Math.cos(t), 16, 17 + R * Math.sin(t)); });
    mk("path", { class: "sil", d: poly(ring(12)) }, g);
    mk("path", { class: "nf lo", d: poly(ring(10)) }, g);
    const ticks = [];
    for (let k = 0; k < 12; k++) { const t = (k / 12) * Math.PI * 2; ticks.push(seg(P(cx + 8.4 * Math.cos(t), 16, 17 + 8.4 * Math.sin(t)), P(cx + 9.6 * Math.cos(t), 16, 17 + 9.6 * Math.sin(t)))); }
    mk("path", { class: "nf lo", d: ticks.join("") }, g);
    const hand = mk("path", { class: "nf" }, g);
    const flag = mk("path", { class: "nf lo", d: open([P(cx + 2, 16, 27.5), P(cx + 4.5, 16, 31), P(cx, 16, 31.5)]) }, g);
    return { cx, hand, flag, tw: tween(i ? 0.6 : 0.25), drawn: NaN };
  });
  put(solid(g), prism(P, front, rings(-5, -6, 5, 6, 2, 0.8)[0], null, H, PZ));
  const rock = solid(g);
  const [rr, ri] = rings(-38, -6, 38, 6, 3, 1);
  const btns = [-BX, BX].map(() => solid(g));
  const bring = circ(7.5, 24), binner = circ(6.3, 24);
  const tilt = tween(A), state = { drawn: NaN }, sw = { v: value };

  function draw(now) {
    const th = tval(tilt, now);
    if (th !== state.drawn) {
      state.drawn = th;
      tilted(rock, rr, ri, PZ, PZ + 3, 0, th);
      tilted(btns[0], bring, binner, PZ + 3, PZ + 12, -BX, th);
      tilted(btns[1], bring, binner, PZ + 3, PZ + 12, BX, th);
    }
    for (const d of dials) {
      const a = tval(d.tw, now) * Math.PI * 2;
      if (a === d.drawn) continue;
      d.drawn = a;
      d.hand.setAttribute("d", seg(P(d.cx - 2 * Math.sin(a), 16, 17 - 2 * Math.cos(a)), P(d.cx + 9 * Math.sin(a), 16, 17 + 9 * Math.cos(a))));
    }
  }
  const B = register(stage, (dt, now) => { draw(now); return !tdone(tilt, now) || dials.some((d) => !tdone(d.tw, now)); });
  bag.add(B.unregister);

  let side = -1;
  const bx = [P(-BX, 0, PZ)[0], P(BX, 0, PZ)[0]];
  function choose(s) {
    if (s === side) return;
    side = s;
    const now = performance.now();
    tset(tilt, s === 1 ? -A : A, now, 0);
    dials.forEach((d, i) => tset(d.tw, s === i ? (i ? 0.6 : 0.25) + 0.42 * sw.v : i ? 0.6 : 0.25, now, 60));
    btns[0].sil.classList.toggle("hi", s !== 1);
    btns[1].sil.classList.toggle("hi", s === 1);
    read.textContent = s === 0 ? "white" : s === 1 ? "black" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      if (p[1] < 40 || p[1] > 300 || Math.abs(p[0] - 200) > 150) return choose(-1);
      choose(Math.abs(p[0] - bx[0]) < Math.abs(p[0] - bx[1]) ? 0 : 1);
    },
    leave: () => choose(-1),
  }));
  bag.add(() => svg.replaceChildren());
  side = -2; choose(-1); draw(performance.now());
  return { set: (v) => { sw.v = v; const s = side; side = -2; choose(s); }, destroy: bag.dispose };
}

hairline({
  name: "chessclock",
  means: "A chess clock: the rocker see-saws down on the pointer's side and that player's hand sweeps round its dial.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1.4],
  tour: [[250, 140], [150, 90], [171, 193], null],
  mount,
});
