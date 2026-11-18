/**
 * Speed bag: a wall board, a bracket and a round rebound platform, with the
 * teardrop bag hanging from its swivel underneath. The pointer's side of the
 * bag is where it swings: it tilts on the swivel toward the pointer on a
 * spring. At rest it hangs a little off true, and the bag is bright. The
 * slider sets how wide a swing goes.
 */
const { Cam, fit, facing, prism, proj, rings, circ, hull, poly, open, spring, stepS, clamp, rad, disposer, mk, pointer, put, register, solid, seg } = HL;

const REST = -0.3, MAXA = 62, L = 44, HX = 2, HZ = 88;
const U = [Math.SQRT1_2, -Math.SQRT1_2];
const rOf = (s) => (s < 3 ? 2.2 : Math.max(2.2, 14 * Math.pow(Math.sin(Math.PI * Math.pow((s - 3) / (L - 3), 0.75)), 0.65)));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.7);
  const end = (k) => [HX + U[0] * k * 40, U[1] * k * 40, HZ - 30];
  fit(C, [[-36, -24, 56], [-36, 24, 102], [24, 0, 94], [2, 22, 94], [2, -22, 94], end(1), end(-1), [HX, 0, HZ - L]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (s, x0, y0, x1, y1, z0, z1, r = 1.5) => {
    const [a, b] = rings(x0, y0, x1, y1, r, Math.min(1, Math.min(x1 - x0, y1 - y0) / 4));
    put(s, prism(P, front, a, b, z0, z1));
  };
  box(solid(g), -38, -24, -33, 24, 56, 102, 2);
  mk("path", { class: "nf lo", d: seg(P(-33, 0, 66), P(-14, 0, 88)) }, g);
  const bg = solid(g);
  bg.sil.classList.add("hi");
  box(solid(g), -33, -3, 0, 3, 87, 90, 1);
  const m = (q) => ({ ...q, u: q.u + HX, v: q.v });
  put(solid(g), prism(P, front, circ(22, 48).map(m), circ(20.8, 48).map(m), 90, 94));
  const sp = spring(REST);
  let gain = value / 1.4, drawn = NaN;
  function draw() {
    const t = sp.x * gain;
    if (Math.abs(t - drawn) < 1e-4) return;
    drawn = t;
    const a = rad(MAXA * t), d = [Math.sin(a) * U[0], Math.sin(a) * U[1], -Math.cos(a)];
    const e1 = [Math.cos(a) * U[0], Math.cos(a) * U[1], Math.sin(a)], e2 = [Math.SQRT1_2, Math.SQRT1_2, 0];
    const pts = [], crease = [];
    for (let s = 0; s <= L; s += 1.5) {
      const r = rOf(s), c = [HX + d[0] * s, d[1] * s, HZ + d[2] * s];
      for (let k = 0; k < 24; k++) {
        const q = (k / 24) * Math.PI * 2, cs = Math.cos(q), sn = Math.sin(q);
        const p = P(c[0] + r * (cs * e1[0] + sn * e2[0]), c[1] + r * (cs * e1[1] + sn * e2[1]), c[2] + r * (cs * e1[2] + sn * e2[2]));
        pts.push(p);
        if (Math.abs(s - 21) < 0.1 && sn > -0.05) crease.push(p);
      }
    }
    bg.sil.setAttribute("d", poly(hull(pts)));
    bg.cr.setAttribute("d", open(crease.sort((p, q) => p[0] - q[0])));
  }
  const B = register(stage, (dt) => { const mv = stepS(sp, dt); draw(); return mv; });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (p) => {
      sp.t = clamp((p[0] - P(HX, 0, HZ - 20)[0]) / 30, -1, 1);
      read.textContent = Math.round(sp.t * MAXA * gain) + "°"; B.wake();
    },
    leave: () => { sp.t = REST; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest"; draw();
  return { set: (v) => { gain = v / 1.4; drawn = NaN; draw(); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "speedbag",
  means: "A speed bag: the teardrop bag swings on its swivel under the round platform toward the side the pointer comes from.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.4],
  tour: [[236, 189], [160, 190], [293, 201], null],
  mount,
});
