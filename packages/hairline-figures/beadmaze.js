/**
 * Bead maze: a wooden base with three wire arches, three beads on each.
 * The pointer picks a wire by where it stands on the base; that wire's
 * beads slide along it to follow the pointer, and the wire goes bright.
 * At rest the beads sit bunched unevenly, the middle wire bright.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, unproj, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 110, W = 48, BZ = 7, BR = 6.4, GAP = 13.5, X0 = 10, X1 = L - 10;
const WIRES = [{ y: 12, h: 30 }, { y: 24, h: 44 }, { y: 36, h: 22 }];
const REST = [[22, 35, 80], [30, 66, 79], [20, 34, 48]], FAV = 1;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const wz = (w, x) => BZ + 3 + w.h * Math.sin(Math.PI * clamp((x - X0) / (X1 - X0), 0, 1));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let pull = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[0, 0, 0], [L, W, 0], [L, 0, 0], [0, W, 0], [L / 2, 24, BZ + 52]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, L, W, 7, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));

  const wires = WIRES.map((w, j) => {
    const grp = mk("g", {}, g), pts = [];
    for (let i = 0; i <= 40; i++) { const x = X0 + ((X1 - X0) * i) / 40; pts.push(P(x, w.y, wz(w, x))); }
    put(solid(grp), prism(P, front, disc(X0, w.y, 2.2, 12), disc(X0, w.y, 1.4, 12), BZ, BZ + 3));
    put(solid(grp), prism(P, front, disc(X1, w.y, 2.2, 12), disc(X1, w.y, 1.4, 12), BZ, BZ + 3));
    const wire = mk("path", { d: open(pts), class: "nf sil" }, grp);
    const beads = REST[j].map((x) => ({ s: spring(x), el: mk("path", { class: "sil" }, grp), last: NaN }));
    return { ...w, j, wire, beads };
  });

  function drawBead(w, b) {
    const x = b.s.x;
    if (x === b.last) return;
    b.last = x;
    const z = wz(w, x), pts = [];
    for (let i = -3; i <= 3; i++) { const t = (i / 3) * (Math.PI / 2); pts.push(...ringAt(P, disc(x, w.y, BR * Math.cos(t), 16), z + BR * Math.sin(t))); }
    b.el.setAttribute("d", poly(hull(pts)));
  }

  const B = register(stage, (dt) => {
    let moving = false;
    for (const w of wires) for (const b of w.beads) { if (stepS(b.s, dt)) moving = true; drawBead(w, b); }
    return moving;
  });
  bag.add(B.unregister);

  let act = -2, lastX = NaN;
  function aim(a, px) {
    wires.forEach((w, j) => {
      w.wire.classList.toggle("hi", j === (a < 0 ? FAV : a));
      const base = a === j ? clamp(px, X0 + BR + GAP, X1 - BR - GAP) : null;
      w.beads.forEach((b, i) => {
        if (base == null) b.s.t = REST[j][i];
        else b.s.t = REST[j][i] + (base + (i - 1) * GAP - REST[j][i]) * pull;
      });
    });
    read.textContent = a < 0 ? "rest" : "wire " + (a + 1) + "·" + Math.round(((px - X0) / (X1 - X0)) * 9);
    B.wake();
  }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    let a = -1;
    if (x > -4 && x < L + 4 && y > -4 && y < W + 4) { let bd = Infinity; WIRES.forEach((w, j) => { const d = Math.abs(w.y - y); if (d < bd) { bd = d; a = j; } }); }
    const px = clamp(x, X0, X1);
    if (a === act && (a < 0 || Math.abs(px - lastX) < 0.3)) return;
    act = a; lastX = px;
    aim(a, px);
  }
  aim(-1, 0);
  bag.add(pointer(stage, { move, leave: () => { act = -1; aim(-1, 0); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { pull = v; if (act >= 0) aim(act, lastX); }, destroy: bag.dispose };
}

hairline({
  name: "beadmaze",
  means: "A bead maze with three wire arches: the wire under the pointer goes bright and its beads slide along it to follow.",
  rules: [1, 3, 5, 8],
  range: [0.2, 0.8, 1],
  tour: [[170, 180], [243, 236], [225, 165], null],
  mount,
});
