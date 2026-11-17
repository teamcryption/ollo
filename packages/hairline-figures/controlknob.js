/**
 * Vision mixer lever: the T-bar of a vision mixer, standing in a slot on a
 * low console block. The pointer's place across the console throws the bar
 * along its slot, from one source to the other; leaving lets it settle back
 * to its resting lean. The slider is the throw.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, rrect, ringAt, clamp, rad, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const PX = 22, PY = 17, PZ = 2, L = 66, REST = -26, MAX = 40;
const ball = (x, y, z, r) => { const o = []; for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2, c = Math.cos(a) * r, s = Math.sin(a) * r; o.push([x + c, y + s, z], [x + c, y, z + s], [x, y + c, z + s]); } return o; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.55);
  const tipAt = (deg) => [PX + L * Math.sin(rad(deg)), PY, PZ + L * Math.cos(rad(deg))];
  const ext = [];
  for (const d of [-MAX, MAX]) { const t = tipAt(d); ext.push([t[0], t[1] - 20, t[2] + 4], [t[0], t[1] + 20, t[2] + 4]); }
  fit(C, [[0, 0, 0], [44, 34, 0], [44, 0, 0], [0, 34, 0], ...ext], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [o, i] = rings(0, 0, 44, 34, 5, 2);
  put(solid(g), prism(P, front, o, i, 0, 12));
  mk("path", { d: poly(ringAt(P, rrect(5, PY - 2.2, 39, PY + 2.2, 2, 4), 12)), class: "nf lo" }, g);
  const rod = mk("path", { class: "sil" }, g), bar = mk("path", { class: "sil hi" }, g), cap = mk("path", { class: "nf lo" }, g);
  const sp = spring(REST);
  let last = NaN;
  function draw(deg) {
    const k = Math.round(deg * 50) / 50;
    if (k === last) return;
    last = k;
    const t = tipAt(deg), z0 = [PX + (12 - PZ) * Math.tan(rad(deg)), PY, 12];
    const pts = [];
    for (const [x, y, z] of ball(z0[0], z0[1], z0[2], 2.4).concat(ball(t[0], t[1], t[2], 2.4))) pts.push(P(x, y, z));
    rod.setAttribute("d", poly(hull(pts)));
    const bp = [];
    for (const [x, y, z] of ball(t[0], t[1] - 18, t[2] + 2, 4).concat(ball(t[0], t[1] + 18, t[2] + 2, 4))) bp.push(P(x, y, z));
    bar.setAttribute("d", poly(hull(bp)));
    cap.setAttribute("d", poly(ringAt(P, circ(3, 16).map((q) => ({ ...q, u: q.u + z0[0], v: q.v + PY })), 12.2)));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const cx = P(PX, PY, 40)[0], lo = P(0, 34, 0), hi2 = P(44, 0, 0), top = P(PX, PY, PZ + L + 8)[1], bot = P(44, 34, 0)[1];
  function move([sx, sy]) {
    const inside = sx > lo[0] - 30 && sx < hi2[0] + 30 && sy > top - 10 && sy < bot + 8;
    if (!inside) return leave();
    const f = clamp((sx - cx) / 70, -1, 1);
    sp.t = f * MAX * reach;
    read.textContent = "mix " + Math.round((f + 1) * 50);
    B.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "controlknob",
  means: "A vision mixer's T-bar in its slot: the pointer's place across the console throws the bar from one source to the other.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[240, 236], [150, 170], [205, 200], null],
  mount,
});
