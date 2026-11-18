/**
 * Chest fly machine: a seat and backrest under a tall frame, with two pad
 * arms hung from the ends of its top beam. The nearer the pointer comes to the
 * middle, the further the fly is squeezed: both arms swing round their pivots on springs
 * until the pads close in front of the chest. The near pad is bright.
 */
const { Cam, circ, facing, fit, prism, proj, rings, spring, stepS, clamp, rad, disposer, mk, pointer, put, register, solid } = HL;

const PX = -23, PY = 24, L = 28, A0 = 100, SPAN = 120, RESTS = [0.22, 0.12];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[-34, -16, 0], [8, 16, 0], [-36, -56, 30], [-36, 56, 30], [-36, 0, 78], [4, 0, 30], [-36, -56, 66], [-36, 56, 66]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (s, x0, y0, x1, y1, z0, z1, r = 1.5) => {
    const [a, b] = rings(x0, y0, x1, y1, r, Math.min(1, Math.min(x1 - x0, y1 - y0) / 4));
    put(s, prism(P, front, a, b, z0, z1));
  };
  const turn = (ring, cx, cy, al) => {
    const c = Math.cos(al), s = Math.sin(al);
    return ring.map((q) => ({ ...q, u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
  };
  const rbox = (s, cx, cy, al, hl, hw, z0, z1, r) => {
    const [a, b] = rings(-hl, -hw, hl, hw, r, Math.min(0.8, hw / 2.5));
    put(s, prism(P, front, turn(a, cx, cy, al), turn(b, cx, cy, al), z0, z1));
  };
  const disc = (s, x, y, R, z0, z1) => {
    const m = (q) => ({ ...q, u: q.u + x, v: q.v + y });
    put(s, prism(P, front, circ(R, 24).map(m), circ(R - 0.8, 24).map(m), z0, z1));
  };
  box(solid(g), -34, -16, 8, 16, 0, 3, 3);
  const mkArm = () => { const a = mk("g", {}, g); return { g: a, pad: solid(a), bar: solid(a), piv: solid(a) }; };
  const far = mkArm();
  const col = solid(g); box(col, -32, -4, -25, 4, 3, 76, 2);
  box(solid(g), -8, -2, -4, 2, 3, 22, 1);
  box(solid(g), -27, -27, -19, 27, 72, 77, 2.5);
  box(solid(g), -20, -10, -15, 10, 28, 66, 2.5);
  const seat = solid(g); box(seat, -15, -10, 3, 10, 22, 27, 4);
  const near = mkArm();
  near.pad.sil.classList.add("hi");
  const arms = [far, near], sps = RESTS.map((r) => spring(r)), drawn = [NaN, NaN];
  const ang = (t, side) => side * rad(A0 - SPAN * t * amp);
  function drawArm(i) {
    const t = sps[i].x;
    if (Math.abs(t - drawn[i]) < 1e-4) return;
    drawn[i] = t;
    const side = i ? 1 : -1, py = PY * side, al = ang(t, side);
    const dx = Math.cos(al), dy = Math.sin(al), A = arms[i];
    rbox(A.bar, PX + dx * L / 2, py + dy * L / 2, al, L / 2 + 2, 1.6, 63, 67, 1.2);
    rbox(A.pad, PX + dx * L, py + dy * L, al, 5, 2, 34, 63, 1.6);
    disc(A.piv, PX, py, 2, 63, 72);
    if (i === 0) {
      if (PX + dx * L > -16) seat.g.after(far.g); else col.g.before(far.g);
    }
  }
  const draw = () => { drawArm(0); drawArm(1); };
  const B = register(stage, (dt) => { const m0 = stepS(sps[0], dt), m1 = stepS(sps[1], dt); draw(); return m0 || m1; });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (p) => {
      const c = P(-6, 0, 40)[0], w = Math.abs(P(PX, PY + L, 40)[0] - c);
      const t = clamp(1.25 - Math.abs(p[0] - c) / w, 0, 1);
      sps[0].t = t; sps[1].t = t;
      read.textContent = "fly " + Math.round(t * 100) + "%"; B.wake();
    },
    leave: () => { sps.forEach((s, i) => { s.t = RESTS[i]; }); read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest"; draw();
  return { set: (v) => { amp = v; drawn[0] = drawn[1] = NaN; draw(); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "pecdeck",
  means: "A chest fly machine: both pad arms swing round their pivots and close in front of the seat as the pointer nears the middle.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.25],
  tour: [[139, 153], [215, 180], [250, 169], null],
  mount,
});
