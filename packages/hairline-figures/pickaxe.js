/**
 * Pickaxe: a miner's pick held over a rock on a slab of ground. The pointer
 * sets the swing: far from the rock the pick rises, over the rock it comes
 * down and its point meets the stone. At rest it hangs half raised, its head
 * bright. The slider is how quickly the swing follows.
 *
 * The pattern: a continuous angle on a spring; the hit is on the ground plane.
 */
const { Cam, fit, proj, facing, rings, prism, put, solid, mk, poly, hull, rrect, spring, stepS, register, pointer, disposer, unproj, clamp, lerp, rad } = HL;

const PV = [-58, 0, 44], LEN = 84, REST = 52, HI = 78, LO = 4;

function beam(P, a, b, w, h, up) {
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], n = Math.hypot(...d) || 1, D = d.map((x) => x / n);
  let s = [D[1] * up[2] - D[2] * up[1], D[2] * up[0] - D[0] * up[2], D[0] * up[1] - D[1] * up[0]];
  const sn = Math.hypot(...s) || 1; s = s.map((x) => x / sn);
  const t = [s[1] * D[2] - s[2] * D[1], s[2] * D[0] - s[0] * D[2], s[0] * D[1] - s[1] * D[0]];
  const ring = rrect(-w / 2, -h / 2, w / 2, h / 2, Math.min(w, h) * 0.45, 3);
  const at = (o) => ring.map((q) => P(...[0, 1, 2].map((j) => o[j] + q.u * s[j] + q.v * t[j])));
  return poly(hull(at(a).concat(at(b))));
}

function pose(th) {
  const c = Math.cos(rad(th)), s = Math.sin(rad(th));
  const H = [PV[0] + LEN * c, 0, PV[2] + LEN * s], n = [-s, 0, c], d = [c, 0, s];
  const tip = (k, L) => [H[0] + n[0] * L * k - d[0] * 7, 0, H[2] + n[2] * L * k - d[2] * 7];
  return { H, A: tip(-1, 30), B: tip(1, 24) };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.7);
  const ex = [[-74, -40, -4], [74, 40, -4], [74, -40, 0], [-74, 40, 0], PV];
  for (const th of [LO, REST, HI]) { const q = pose(th); ex.push(q.A, q.B, q.H); }
  fit(C, ex, 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [gr, gi] = rings(-74, -40, 74, 40, 10, 2);
  put(solid(g), prism(P, front, gr, gi, -4, 0));
  const [rr, ri] = rings(20, -16, 50, 14, 10, 2);
  put(solid(g), prism(P, front, rr, ri, 0, 16));
  const handle = mk("path", { class: "sil" }, g), headA = mk("path", { class: "sil hi" }, g), headB = mk("path", { class: "sil hi" }, g);
  const th = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let last = "";
  function draw() {
    const key = th.x.toFixed(2);
    if (key === last) return;
    last = key;
    const q = pose(th.x), up = [0, 1, 0];
    handle.setAttribute("d", beam(P, PV, q.H, 4, 5, up));
    headA.setAttribute("d", beam(P, [q.H[0], 0, q.H[2]], q.A, 7, 5, up));
    headB.setAttribute("d", beam(P, [q.H[0], 0, q.H[2]], q.B, 7, 5, up));
  }
  const L = register(stage, (dt) => { const m = stepS(th, dt); draw(); return m; });
  bag.add(L.unregister);
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (Math.abs(x) > 100 || Math.abs(y) > 70) { th.t = REST; read.textContent = "rest"; }
      else { th.t = lerp(HI, LO, clamp((x + 60) / 100, 0, 1)); read.textContent = `swing ${Math.round(th.t)}°`; }
      L.wake();
    },
    leave: () => { th.t = REST; read.textContent = "rest"; L.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest";
  draw();
  return { set: (v) => { th.k = 100 * v; th.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "pickaxe",
  means: "A miner's pick over a rock: the pointer sets the swing, and over the stone the point comes down to strike it.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[242, 241], [116, 202], [200, 230], null],
  mount,
});
