/**
 * Porch swing: a bench hung by four chains from a beam on two posts. The
 * pointer's place along the swing's arc pushes the bench forward or back,
 * on a spring. At rest it hangs a little forward, bright. The slider is the
 * widest swing.
 */
const {
  Cam, fit, facing, open, prism, proj, rings, clamp, rad, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const TOP = 62, LEN = 42, REST = 10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 3.2);
  fit(C, [[-30, -4, 0], [30, 54, 0], [0, -4, TOP + 5], [0, 54, TOP + 5]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const post = (y) => { const [r, i] = rings(-3, y - 3, 3, y + 3, 1.5, 0.6); put(solid(g), prism(P, front, r, i, 0, TOP)); };
  post(0);
  const chains = mk("path", { class: "nf lo" }, g);
  const seat = solid(g), back = solid(g);
  seat.sil.classList.add("hi");
  post(50);
  const [br, bi] = rings(-3, -4, 3, 54, 1.5, 0.6);
  put(solid(g), prism(P, front, br, bi, TOP, TOP + 5));
  const ang = spring(REST);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const dx = LEN * Math.sin(rad(a)), z = TOP - LEN * Math.cos(rad(a));
    let d = "";
    for (const y of [10, 40]) for (const ox of [-7, 7]) d += seg(P(0, y, TOP), P(dx + ox, y, z + 3));
    chains.setAttribute("d", d);
    const [sr, si] = rings(dx - 9, 6, dx + 9, 44, 2.5, 1.2);
    put(seat, prism(P, front, sr, si, z, z + 3));
    const [kr, ki] = rings(dx - 9, 6, dx - 5.5, 44, 1.5, 0.6);
    put(back, prism(P, front, kr, ki, z + 3, z + 17));
  }
  draw(REST);

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [wx] = unproj(C, sx, sy, TOP - LEN);
    ang.t = Math.round(clamp(wx / 30, -1, 1) * max);
    read.textContent = "swing " + ang.t + "°";
    B.wake();
  }
  function leave() { ang.t = REST; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "porchswing",
  means: "A bench hung by chains from a beam on two posts: the pointer swings it forward or back along its arc.",
  rules: [3, 5, 6, 8],
  range: [15, 30, 40],
  tour: [[155, 150], [257, 201], [200, 175], null],
  mount,
});
