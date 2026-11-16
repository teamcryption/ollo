/**
 * Ball maze: a square tray walled round, with a few inner walls making the
 * maze, a hole in one lane and a steel ball in the top lane. The pointer
 * presses the tray down where it stands: the tray tilts toward it on two
 * springs and the ball rolls along its lane to the low side. At rest the tray
 * sits a little askew and the ball is the bright mark. The slider is the
 * greatest tilt.
 */
const {
  Cam, fit, facing, hull, open, poly, proj, rad, rings, run, unproj, clamp, spring, stepS,
  disposer, flatDot, mk, place, pointer, register, solid,
} = HL;

const H = 45, FZ = 3, WZ = 9, BR = 3.6, BY = -32.5;
const BACK = [[-45, -45, 45, -41], [-45, -41, -41, 45]];
const FRONT = [[-30, -24, 41, -20], [-41, -6, 22, -2], [-24, 28, -20, 41], [-8, 12, 41, 16], [-41, 41, 41, 45], [41, -41, 45, 45]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxT = value;
  const C = Cam(45, 0.5, 1.95);
  const lean = H * 2 * Math.sin(rad(16));
  fit(C, [[-H, -H, -lean], [H, H, -lean], [H, -H, -lean], [-H, H, -lean], [-H, -H, WZ + lean], [H, -H, WZ + lean], [-H, H, WZ + lean]], 200, 160);
  const P = proj(C), front = facing(C);
  const ta = spring(rad(4)), tb = spring(rad(-3)), bx = spring(-26);
  let sa = 0, ca = 1, sb = 0, cb = 1;
  const T = (x, y, z) => P(x * ca, y * cb, z - x * sa - y * sb);
  const g = mk("g", {}, svg);
  const block = ([x0, y0, x1, y1], z0, z1, r, b) => ({ s: solid(g), rr: rings(x0, y0, x1, y1, r, b), z0, z1 });
  const parts = [block([-H, -H, H, H], 0, FZ, 6, 2)];
  const hole = flatDot(g, C, 2.6, "dot off");
  for (const w of BACK) parts.push(block(w, FZ, WZ, 1.6, 0.8));
  const ball = mk("ellipse", { class: "sil hi" }, g);
  for (const w of FRONT) parts.push(block(w, FZ, WZ, 1.6, 0.8));
  const R = Math.abs(P(BR / Math.SQRT2, -BR / Math.SQRT2, 0)[0] - P(0, 0, 0)[0]);
  ball.setAttribute("rx", R.toFixed(2));
  ball.setAttribute("ry", R.toFixed(2));

  let last = "";
  function draw() {
    const key = [ta.x, tb.x, bx.x].map((v) => v.toFixed(4)).join();
    if (key === last) return;
    last = key;
    sa = Math.sin(ta.x); ca = Math.cos(ta.x); sb = Math.sin(tb.x); cb = Math.cos(tb.x);
    for (const p of parts) {
      const [ring, inner] = p.rr;
      const pts = ring.map((q) => T(q.u, q.v, p.z0)).concat(ring.map((q) => T(q.u, q.v, p.z1)));
      p.s.sil.setAttribute("d", poly(hull(pts)));
      p.s.cr.setAttribute("d", open(run(inner, front).map((q) => T(q.u, q.v, p.z1))));
    }
    place(hole, T(30, 28, FZ));
    const [cx, cy] = T(bx.x, BY, FZ + BR);
    ball.setAttribute("cx", cx.toFixed(2));
    ball.setAttribute("cy", cy.toFixed(2));
  }
  const B = register(stage, (dt) => {
    let m = false;
    for (const s of [ta, tb, bx]) if (stepS(s, dt)) m = true;
    draw();
    return m;
  });
  bag.add(B.unregister);

  function aim(p) {
    if (p) {
      const fx = clamp(p[0] / H, -1, 1), fy = clamp(p[1] / H, -1, 1);
      ta.t = rad(maxT * fx); tb.t = rad(maxT * fy); bx.t = clamp(p[0], -36, 36);
      read.textContent = "tilt " + Math.round(maxT * Math.hypot(fx, fy) / Math.SQRT2) + "°";
    } else {
      ta.t = rad(4); tb.t = rad(-3); bx.t = -26;
      read.textContent = "rest";
    }
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, 0); aim(Math.abs(x) < H + 25 && Math.abs(y) < H + 25 ? [x, y] : null); },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxT = v; }, destroy: bag.dispose };
}

hairline({
  name: "skiball2",
  means: "A tilt ball maze: the tray dips toward the pointer on two springs and the steel ball rolls along its lane to the low side.",
  rules: [1, 3, 5, 8],
  range: [6, 12, 16],
  tour: [[297, 159], [150, 130], [205, 205], null],
  mount,
});
