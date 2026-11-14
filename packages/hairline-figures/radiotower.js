/**
 * Radio mast: a tapering mast on a footing, three dishes clamped up its front
 * at different heights. The pointer picks a dish by its rest height, and that
 * dish turns on its clamp to face the pointer's spot on the ground. At rest
 * the middle dish is bright, turned a little off the others.
 *
 * The pattern: parts that turn to face the pointer, picked by rest pose.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, rrect, ringAt, clamp, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H = 120, DR = 11, DISHES = [{ z: 52, r: 10 }, { z: 78, r: 11 }, { z: 102, r: 9 }];
const REST = [0.2, -0.45, 0.35];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let range = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-30, -30, 0], [30, 30, 0], [30, -30, 0], [-30, 30, 0], [0, 0, H + 8], [20, 20, 110]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-28, -28, 28, 28, 6, 2);
  put(solid(g), prism(P, front, fr, fi, 0, 5));
  // the mast: a solid whose top is smaller than its foot
  const foot = rrect(-9, -9, 9, 9, 3, 4), top = rrect(-3, -3, 3, 3, 1.4, 4), inner = rrect(-2.2, -2.2, 2.2, 2.2, 0.8, 4);
  const mast = solid(g);
  mast.sil.setAttribute("d", poly(hull(ringAt(P, foot, 5).concat(ringAt(P, top, H)))));
  mast.cr.setAttribute("d", poly(ringAt(P, inner, H)));
  for (const z of [30, 60, 90]) {
    const w = 9 - 6 * ((z - 5) / (H - 5));
    put(solid(g), prism(P, front, ...rings(-w - 1, -w - 1, w + 1, w + 1, 1.5, 0.6), z, z + 2));
  }
  put(solid(g), prism(P, front, ...rings(-1, -1, 1, 1, 0.8, 0.3), H, H + 8));

  const dishes = DISHES.map((d, k) => {
    const grp = mk("g", {}, g);
    const off = 9 - 6 * ((d.z - 5) / (H - 5)) + 4;
    const cx = off * 0.7071, cy = off * 0.7071;
    put(solid(grp), prism(P, front, ...rings(cx - 2, cy - 2, cx + 2, cy + 2, 1, 0.5), d.z - 3, d.z + 3));
    const body = mk("path", { class: "sil" }, grp), face = mk("path", { class: "nf lo" }, grp);
    return { ...d, k, cx, cy, grp, body, face, sp: spring(REST[k] * 1.0), last: NaN };
  });

  function ring(d, th, along, r) {
    const nx = Math.cos(th), ny = Math.sin(th), tx = -ny, ty = nx, pts = [];
    for (let i = 0; i < 32; i++) {
      const f = (i / 32) * 2 * Math.PI;
      pts.push(P(d.cx + nx * along + tx * r * Math.cos(f), d.cy + ny * along + ty * r * Math.cos(f), d.z + r * Math.sin(f)));
    }
    return pts;
  }
  function draw(d) {
    const th = Math.PI / 4 + d.sp.x;
    if (th === d.last) return;
    d.last = th;
    d.body.setAttribute("d", poly(hull(ring(d, th, 2, 3).concat(ring(d, th, 7, d.r)))));
    d.face.setAttribute("d", poly(ring(d, th, Math.cos(th - Math.PI / 4 - 0.0) >= 0 ? 7 : 2, d.r - 1.5)));
  }

  const B = register(stage, (dt) => {
    let moving = false;
    for (const d of dishes) { if (stepS(d.sp, dt)) moving = true; draw(d); }
    return moving;
  });
  bag.add(B.unregister);

  const mids = dishes.map((d) => P(d.cx, d.cy, d.z));
  let act = -2;
  function setActive(a, pt) {
    dishes.forEach((d, k) => {
      if (k === a && pt) {
        const [wx, wy] = unproj(C, pt[0], pt[1], d.z);
        const want = Math.atan2(wy - d.cy, wx - d.cx) - Math.PI / 4;
        d.sp.t = clamp(want, -range, range);
      } else if (a < 0 || k !== a) d.sp.t = a < 0 ? REST[k] : d.sp.t;
      d.body.classList.toggle("hi", k === (a < 0 ? 1 : a));
    });
    if (a !== act) read.textContent = a < 0 ? "rest" : "dish " + (a + 1);
    act = a;
    B.wake();
  }
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(sx - mids[best][0]) < 110 ? best : -1;
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p), p), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { range = v; }, destroy: bag.dispose };
}

hairline({
  name: "radiotower",
  means: "A radio mast with three dishes up its front: the dish level with the pointer turns on its clamp to face it.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1.0, 1.4],
  tour: [[110, 173], [294, 130], [280, 90], null],
  mount,
});
