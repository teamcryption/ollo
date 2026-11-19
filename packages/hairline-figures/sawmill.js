/**
 * Sawmill: a long bed with a toothed round blade standing in it, and a
 * carriage carrying a log on rails. The pointer feeds the log: the carriage
 * runs along the bed past the blade. At rest the carriage waits at the far
 * end, its log bright. The slider is how far the carriage runs.
 *
 * The pattern: one part answering a discrete choice (a tween on a slide).
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const BX = 66, BR = 24, BZ = 12, BY = 7, LR = 9, LL = 46, X0 = -56, RUN = 52;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-BX, -16, 0], [BX, 16, 0], [BX, -16, 0], [-BX, 16, 0], [8, BY, BZ + BR], [X0, -4, 30], [X0 + LL + RUN * 1.5, -4, 30]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-BX, -16, BX, 16, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, 6));
  const [rl, rli] = rings(-BX + 4, -12, BX - 4, -9, 1, 0.5), [rn, rni] = rings(-BX + 4, 1, BX - 4, 4, 1, 0.5);
  put(solid(g), prism(P, front, rl, rli, 6, 8));
  put(solid(g), prism(P, front, rn, rni, 6, 8));
  const car = mk("g", {}, g);
  const deck = solid(car), log = mk("path", { class: "sil hi" }, car), end = mk("path", { class: "nf lo" }, car), rings2 = mk("path", { class: "nf lo" }, car);
  // the blade: a toothed disc standing on the near side of the log's path
  const teeth = [];
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2, r = i % 2 ? BR : BR - 2.6;
    teeth.push(P(8 + r * Math.cos(a), BY, BZ + r * Math.sin(a)));
  }
  const [gr, gi] = rings(-4, BY - 3, 20, BY + 3, 2, 1);
  put(solid(g), prism(P, front, gr, gi, 6, 10));
  mk("path", { class: "sil", d: poly(teeth) }, g);
  mk("path", { class: "nf lo", d: poly(circ(BR - 7, 36).map((q) => P(8 + q.u, BY, BZ + q.v))) }, g);
  mk("path", { class: "", d: poly(circ(3, 16).map((q) => P(8 + q.u, BY, BZ + q.v))) }, g);

  const tw = tween(0);
  let last = NaN;
  function draw(s) {
    const x = X0 + s * amp * RUN;
    if (x === last) return;
    last = x;
    const [dr, di] = rings(x, -14, x + LL, 6, 2, 1.2);
    put(deck, prism(P, front, dr, di, 8, 12));
    const at = (xx, r) => circ(r, 28).map((q) => P(xx, -4 + q.u, 12 + LR + q.v));
    log.setAttribute("d", poly(hull(at(x + 3, LR).concat(at(x + LL - 3, LR)))));
    end.setAttribute("d", poly(at(x + LL - 3, LR)));
    rings2.setAttribute("d", poly(at(x + LL - 3, LR * 0.55)) + poly(at(x + LL - 3, LR * 0.15)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, 14);
  let on = null;
  function choose(v) {
    if (v === on) return;
    on = v;
    tset(tw, v ? 1 : 0, performance.now(), 0);
    read.textContent = v ? `feed ${Math.round(amp * RUN)}` : "rest";
    B.wake();
  }
  choose(false);
  bag.add(pointer(stage, { move: (p) => choose(Math.hypot(p[0] - mid[0], (p[1] - mid[1]) * 1.6) < 150), leave: () => choose(false) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { amp = v; last = NaN; if (on) read.textContent = `feed ${Math.round(amp * RUN)}`; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "sawmill",
  means: "A sawmill bed with a round blade: the pointer feeds the log, and its carriage runs along the rails past the blade.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1.5],
  tour: [[158, 107], [200, 140], [236, 176], null],
  mount,
});
