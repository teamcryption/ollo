/**
 * Shop counter: a counter with a lift-up flap and a swing gate under it.
 * The pointer over the counter swings the flap up on its hinge and the gate
 * open. At rest the flap sits cracked open, bright. The slider is the reach.
 */
const { Cam, fit, hull, poly, proj, seg, unproj, tdone, tset, tval, tween, disposer, mk, pointer, register, solid } = HL;

const HX = 34, L = 60, D = 16, H = 30, T = 2.5;
function bx(x0, y0, z0, x1, y1, z1) {
  return [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.7);
  fit(C, [[0, 0, 0], [L, D, 0], [0, D, 0], [L, 0, 0], [HX - 4, 0, H + 30], [HX - 4, D, H + 30], [HX + 1, D + 25, 0], [HX + 1, D + 25, H]], 200, 165);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const draw = (s, pts) => {
    const q = pts.map((p) => P(...p));
    s.sil.setAttribute("d", poly(hull(q)));
    let k = 0;
    for (let i = 1; i < 4; i++) if (pts[i][0] + pts[i][1] > pts[k][0] + pts[k][1]) k = i;
    s.cr.setAttribute("d", poly(q.slice(4)) + seg(q[k], q[k + 4]));
    s.cr.setAttribute("class", "nf lo");
  };
  mk("path", { class: "nf lo dash", d: poly([P(HX, 0, 0), P(L, 0, 0), P(L, D, 0), P(HX, D, 0)]) }, g);
  const back = solid(g), body = solid(g), top = solid(g), end = solid(g), gate = solid(g), flap = solid(g);
  draw(back, bx(HX, 0, 0, L, 2, H));
  draw(body, bx(0, 0, 0, HX, D, H));
  draw(top, bx(-2, -1, H, HX, D + 1, H + T));
  draw(end, bx(L - 2, 0, 0, L, D, H));
  const t = tween(0.12);

  function pose(o) {
    const a = o * reach * Math.PI / 180, b = o * 1.1 * Math.PI / 2 * Math.min(1, reach / 90);
    const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
    draw(flap, bx(HX, -1, H, L, D + 1, H + T).map(([x, y, z]) => {
      const dx = x - HX, dz = z - H;
      return [HX + dx * ca - dz * sa, y, H + dx * sa + dz * ca];
    }));
    draw(gate, bx(HX + 1, D - 1.5, 2, L - 3, D, H - 3).map(([x, y, z]) => {
      const dx = x - HX - 1, dy = y - D;
      return [HX + 1 + dx * cb - dy * sb, D + dx * sb + dy * cb, z];
    }));
  }
  let last = NaN;
  const B = register(stage, (_dt, now) => {
    const o = tval(t, now);
    if (o !== last) { last = o; pose(o); }
    return !tdone(t, now);
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    return x > -4 && x < L + 4 && y > -4 && y < D + 30 ? 1 : 0;
  }
  let act = -1;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a ? 1 : 0.12, performance.now(), 0);
    flap.sil.classList.toggle("hi", true);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  setActive(0);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "shopcounter",
  means: "A shop counter: the pointer swings its flap up on the hinge and the gate beneath it open.",
  rules: [1, 3, 5, 6],
  range: [40, 95, 100],
  tour: [[244, 161], [230, 150], [142, 96], null],
  mount,
});
