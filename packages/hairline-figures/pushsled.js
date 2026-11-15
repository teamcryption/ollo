/**
 * Push sled: a weight sled on two runners, plates stacked on its post and a
 * pair of tall push handles, standing on a dashed turf lane. The pointer is
 * where the sled is pushed to: it slides down the lane on a spring and its
 * handle is bright. At rest it waits a little way up the lane.
 */
const { Cam, circ, facing, fit, prism, proj, rings, unproj, spring, stepS, disposer, flatDot, mk, place, pointer, put, register, solid } = HL;

const REST = -22, LO = -42, HI = 42;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-64, -18, 0], [64, 18, 0], [-64, 18, 0], [64, -18, 0], [HI - 18, 0, 40], [LO - 18, 0, 40]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  mk("path", { class: "dash nf", d: "M" + P(-64, -18, 0) + "L" + P(64, -18, 0) + "M" + P(-64, 18, 0) + "L" + P(64, 18, 0) }, g);
  place(flatDot(g, C, 1.6, "dot off"), P(60, 0, 0));
  const S = Array.from({ length: 9 }, () => solid(g));
  const box = (s, x0, y0, x1, y1, z0, z1, r = 1.5) => {
    const [a, b] = rings(x0, y0, x1, y1, r, Math.min(1, Math.min(x1 - x0, y1 - y0) / 4));
    put(s, prism(P, front, a, b, z0, z1));
  };
  const disc = (s, x, R, z0, z1) => {
    const m = (q) => ({ ...q, u: q.u + x, v: q.v });
    put(s, prism(P, front, circ(R, 40).map(m), circ(R - 1.4, 40).map(m), z0, z1));
  };
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    const X = sp.x;
    if (Math.abs(X - drawn) < 1e-3) return;
    drawn = X;
    box(S[0], X - 20, -15, X + 20, -10, 0, 3, 1.5);
    box(S[1], X - 18, -16, X - 14, -8, 3, 38, 1);
    box(S[2], X - 20, -12, X - 12, 12, 36, 40, 1.5);
    box(S[3], X - 22, -13, X + 22, 13, 3, 7, 2.5);
    box(S[4], X - 18, 8, X - 14, 16, 3, 38, 1);
    disc(S[5], X + 4, 12, 7, 11);
    disc(S[6], X + 4, 11, 11, 15);
    disc(S[7], X + 4, 3, 15, 24);
    box(S[8], X - 20, 10, X + 20, 15, 0, 3, 1.5);
    // the far runner first, the near one last
    S[8].g.parentNode.insertBefore(S[0].g, S[1].g);
    S[2].sil.classList.add("hi");
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (Math.abs(y) > 40 || Math.abs(x) > 80) { sp.t = REST; read.textContent = "rest"; }
      else { sp.t = Math.max(LO, Math.min(HI, x)); read.textContent = Math.round(sp.t - LO) + "m"; }
      B.wake();
    },
    leave: () => { sp.t = REST; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest";
  draw();
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "pushsled",
  means: "A weight push sled on a turf lane: it slides down the lane to wherever the pointer pushes it.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[249, 209], [132, 151], [268, 219], null],
  mount,
});
