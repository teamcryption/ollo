/**
 * Bilboquet: a cup on a turned stick standing in its foot, a ball tied to the
 * stick by a string. The pointer over the toy swings the ball up on its
 * string and drops it into the cup; leaving lets it fall back to hang. At
 * rest the ball hangs a little to one side, bright. The slider is its lean.
 */
const { Cam, circ, fit, hull, open, poly, prism, proj, ringAt, facing, lerp, clamp, tween, tset, tval, tdone, mk, pointer, put, register, solid, disposer } = HL;

const S = 3.7, TIE = 40, L = 34, BR = 8, CZ0 = 58, CZ1 = 70, SEAT = 75;
const ring = (r, n = 40) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lean = value;
  const C = Cam(45, 0.5, S);
  fit(C, [[-16, -16, 0], [16, 16, 0], [L + BR, 0, TIE], [0, 0, SEAT + BR + 2], [-14, 0, CZ1]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ring(16), ring(14), 0, 3));
  put(solid(g), prism(P, front, ring(3, 16), ring(2, 16), 3, CZ0 - 6));
  put(solid(g), prism(P, front, ring(4.5, 20), ring(3.5, 20), TIE - 2, TIE + 2));
  const cup = mk("path", { class: "sil" }, g);
  cup.setAttribute("d", poly(hull(ringAt(P, ring(3, 20), CZ0 - 6).concat(ringAt(P, ring(13), CZ1)))));
  mk("path", { d: poly(ringAt(P, ring(11), CZ1)), class: "nf lo" }, g);
  const str = mk("path", { class: "nf lo" }, g);
  const ball = mk("ellipse", { class: "sil hi", rx: BR * S, ry: BR * S }, g);
  const t = tween(0);
  let last = "";

  function pos(u) {
    const a0 = -Math.PI / 2 + lean, a1 = 0.6;
    const arc = (a) => [L * Math.cos(a) + 4.5, 0, TIE + L * Math.sin(a)];
    if (u < 0.6) return arc(lerp(a0, a1, u / 0.6));
    const s = (u - 0.6) / 0.4, p0 = arc(a1), c = [16, 0, 104], p1 = [0, 0, SEAT];
    return [0, 2].reduce((q, k) => (q[k] = (1 - s) * (1 - s) * p0[k] + 2 * s * (1 - s) * c[k] + s * s * p1[k], q), [0, 0, 0]);
  }
  function draw(u) {
    const key = u.toFixed(4) + lean;
    if (key === last) return;
    last = key;
    const b = pos(clamp(u, 0, 1)), tie = [4.5, 0, TIE], sb = P(...b);
    ball.setAttribute("cx", sb[0]); ball.setAttribute("cy", sb[1]);
    const dx = b[0] - tie[0], dz = b[2] - tie[2], slack = Math.max(0, L - Math.hypot(dx, dz));
    const pts = [];
    for (let i = 0; i <= 12; i++) {
      const s = i / 12;
      pts.push(P(lerp(tie[0], b[0], s), 0, lerp(tie[2], b[2], s) - slack * 1.1 * Math.sin(Math.PI * s)));
    }
    str.setAttribute("d", open(pts));
  }

  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  draw(0);

  const c0 = P(10, 0, 38);
  let on = null;
  function set(v) {
    if (v === on) return;
    on = v;
    tset(t, v ? 1 : 0, performance.now(), 0);
    read.textContent = v ? "catch" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: ([sx, sy]) => set(Math.abs(sx - c0[0]) < 110 && Math.abs(sy - c0[1]) < 130),
    leave: () => set(false),
  }));
  set(false);
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lean = v; last = ""; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "bilboquet",
  means: "A cup-and-ball toy: the pointer swings the ball up on its string and drops it into the cup; leaving lets it fall to hang.",
  rules: [3, 5, 8],
  range: [0, 0.3, 0.6],
  tour: [[163, 51], [205, 160], [163, 270], null],
  mount,
});
