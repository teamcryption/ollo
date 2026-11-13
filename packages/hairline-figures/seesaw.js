/**
 * Seesaw: a long plank on a pivot over a play mat, a seat pad and a handle
 * at each end. The plank tips down toward the side the pointer is on, on a
 * spring, the further out the more, and the handle on the low end is bright.
 * At rest it lies tipped a little to the left, its low handle bright. The
 * slider is how far it may tip.
 *
 * The pattern: a continuous lean (terrain's spring) on one solid; the hit is
 * on the floor's plane, which never moves.
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, rrect, ringAt, run, clamp, rad, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 66, W = 8, PZ = 17, TH = 2.6, MAX = 16, REST = -7;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-L - 6, -W - 14, 0], [L + 6, W + 14, 0], [-L, 0, PZ + L * Math.sin(rad(MAX)) + 16], [L, 0, PZ + L * Math.sin(rad(MAX)) + 16]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [mr, mi] = rings(-L - 6, -W - 14, L + 6, W + 14, 8, 2);
  put(solid(g), prism(P, front, mr, mi, 0, 1.4));
  // the pivot: a wide foot tapering to a narrow top under the plank
  const foot = rrect(-11, -W - 3, 11, W + 3, 3, 4), top = rrect(-3, -W + 1, 3, W - 1, 1.5, 4), inner = rrect(-2, -W + 2, 2, W - 2, 0.8, 4);
  put(solid(g), { sil: poly(hull(ringAt(P, foot, 1.4).concat(ringAt(P, top, PZ - TH / 2)))), crease: open(ringAt(P, run(inner, front), PZ - TH / 2)) });

  // a part of the plank, given in its own frame (u along, v across, w up from the plank's middle)
  const parts = [
    { ring: rings(-L, -W, L, W, 3, 1.4), w0: -TH / 2, w1: TH / 2 },
    { ring: rings(-L + 2, -W + 1.5, -L + 16, W - 1.5, 3, 1.2), w0: TH / 2, w1: TH / 2 + 2.4 },
    { ring: rings(L - 16, -W + 1.5, L - 2, W - 1.5, 3, 1.2), w0: TH / 2, w1: TH / 2 + 2.4 },
    { ring: rings(-L + 19, -1.6, -L + 22, 1.6, 1.2, 0.5), w0: TH / 2, w1: TH / 2 + 13, end: -1 },
    { ring: rings(-L + 18, -W + 1, -L + 23, W - 1, 1.8, 0.8), w0: TH / 2 + 11, w1: TH / 2 + 14, end: -1 },
    { ring: rings(L - 22, -1.6, L - 19, 1.6, 1.2, 0.5), w0: TH / 2, w1: TH / 2 + 13, end: 1 },
    { ring: rings(L - 23, -W + 1, L - 18, W - 1, 1.8, 0.8), w0: TH / 2 + 11, w1: TH / 2 + 14, end: 1 },
  ];
  for (const p of parts) p.s = solid(g);
  const sp = spring(REST * amp);
  let drawn = NaN, side = 0;

  function draw() {
    const a = rad(sp.x);
    if (Math.abs(sp.x - drawn) < 1e-3) return;
    drawn = sp.x;
    const c = Math.cos(a), s = Math.sin(a);
    const at = (q, w) => P(q.u * c - w * s, q.v, PZ + q.u * s + w * c);
    for (const p of parts) {
      const [ring, inner] = p.ring;
      const pts = ring.map((q) => at(q, p.w0)).concat(ring.map((q) => at(q, p.w1)));
      put(p.s, { sil: poly(hull(pts)), crease: open(run(inner, front).map((q) => at(q, p.w1))) });
    }
  }
  function mark() {
    const low = side !== 0 ? side : Math.sign(REST);
    for (const p of parts) if (p.end) p.s.sil.classList.toggle("hi", p.end === low);
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    if (over === null) { sp.t = REST * amp; side = 0; read.textContent = "rest"; }
    else {
      const t = -clamp(over / (L * 0.8), -1, 1) * MAX * amp;
      sp.t = t; side = over >= 0 ? 1 : -1;
      read.textContent = "tilt " + Math.round(Math.abs(t)) + "°";
    }
    mark();
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      over = Math.abs(x) > L + 30 || Math.abs(y) > 50 ? null : x;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  retarget();
  return { set: (v) => { amp = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "seesaw",
  means: "A seesaw on its pivot: the plank tips down toward the pointer's side, and the handle on the low end is bright.",
  rules: [1, 3, 5, 8],
  range: [0.3, 0.75, 1],
  tour: [[110, 150], [280, 210], [210, 180], null],
  mount,
});
