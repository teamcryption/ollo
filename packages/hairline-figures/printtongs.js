/**
 * Print washer: a deep darkroom tray on a rocker cradle. The pointer's place
 * along the tray rocks it end to end, as a hand would to keep the wash
 * moving; leaving lets it settle back to a slight tilt. The slider is the
 * rock.
 */
const { Cam, fit, hull, poly, prism, proj, facing, rings, rrect, clamp, rad, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const PZ = 16, H = 13, MAX = 16, REST = 6;
const outer = rrect(-44, -30, 44, 30, 6, 4), inner = rrect(-40, -26, 40, 26, 4, 4), floor = rrect(-36, -22, 36, 22, 3, 4);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-46, -32, 0], [46, 32, 0], [46, -32, 0], [-46, 32, 0], [-44, 0, PZ + 30], [44, 0, PZ + 30]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [bo, bi] = rings(-12, -26, 12, 26, 5, 1.6);
  put(solid(g), prism(P, front, bo, bi, 0, 6));
  const [co, ci] = rings(-5, -22, 5, 22, 3, 1.2);
  put(solid(g), prism(P, front, co, ci, 6, PZ));
  const tray = solid(g), rim = mk("path", { class: "nf lo" }, g), bed = mk("path", { class: "nf lo" }, g);
  tray.sil.classList.add("hi");
  const sp = spring(REST);
  let last = NaN;
  const at = (q, z, a) => { const c = Math.cos(a), s = Math.sin(a); return P(q.u * c - z * s, q.v, PZ + q.u * s + z * c); };
  function draw(deg) {
    const k = Math.round(deg * 50) / 50;
    if (k === last) return;
    last = k;
    const a = rad(deg), pts = [];
    for (const q of outer) pts.push(at(q, 0, a), at(q, H, a));
    tray.sil.setAttribute("d", poly(hull(pts)));
    rim.setAttribute("d", poly(inner.map((q) => at(q, H, a))));
    bed.setAttribute("d", poly(floor.map((q) => at(q, H - 1.5, a))));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const L = P(-44, 30, 0)[0] - 10, R = P(44, -30, 0)[0] + 10, top = P(-44, -30, PZ + 26)[1], bot = P(44, 30, 0)[1] + 8;
  const cx = P(0, 0, PZ)[0];
  function move([sx, sy]) {
    if (sx < L || sx > R || sy < top || sy > bot) return leave();
    const f = clamp((sx - cx) / 80, -1, 1);
    sp.t = f * MAX * reach;
    read.textContent = f < 0 ? "tilt L" : "tilt R";
    B.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "printtongs",
  means: "A darkroom print washer tray on a rocker cradle: the pointer's place along the tray rocks it from end to end.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[121, 100], [280, 190], [200, 165], null],
  mount,
});
