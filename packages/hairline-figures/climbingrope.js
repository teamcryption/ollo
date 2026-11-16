/**
 * Rope climb: a gym climbing rope hanging from a beam over a mat, a knot
 * at its foot. The rope swings toward where the pointer stands on the
 * floor, its foot trailing in a soft bend. At rest it hangs with a slight
 * lean, bright. The slider is the reach of the swing.
 */
const { Cam, fit, circ, hull, poly, prism, proj, rings, ringAt, clamp, spring, stepS, unproj, disposer, mk, pointer, put, register, solid } = HL;

const Z = 150, L = 124, N = 24;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.5);
  fit(C, [[-60, -40, 0], [60, 40, 0], [-60, 40, 0], [60, -40, 0], [0, 0, Z + 8]], 200, 162);
  const P = proj(C), front = facing0(C);
  const g = mk("g", {}, svg);
  const [mr, mi] = rings(-44, -32, 44, 32, 8, 2);
  put(solid(g), prism(P, front, mr, mi, 0, 6));
  const rope = mk("path", { class: "sil hi" }, g), twist = mk("path", { class: "nf lo" }, g), knot = solid(g);
  const [br, bi] = rings(-56, -6, 56, 6, 3, 1.2);
  put(solid(g), prism(P, front, br, bi, Z, Z + 8));
  const ax = spring(0.12), ay = spring(-0.05);
  let last = "";
  function draw() {
    const key = ax.x.toFixed(4) + ay.x.toFixed(4);
    if (key === last) return;
    last = key;
    const c = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N, b = Math.pow(t, 1.4);
      c.push([L * Math.sin(ax.x) * b, L * Math.sin(ay.x) * b, Z - L * t * (1 - 0.25 * (ax.x * ax.x + ay.x * ay.x))]);
    }
    const s = c.map((q) => P(q[0], q[1], q[2])), lft = [], rgt = [], w = 3.6;
    for (let i = 0; i <= N; i++) {
      const a = s[Math.max(0, i - 1)], b = s[Math.min(N, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1;
      lft.push([s[i][0] - (dy / m) * w, s[i][1] + (dx / m) * w]);
      rgt.push([s[i][0] + (dy / m) * w, s[i][1] - (dx / m) * w]);
    }
    rope.setAttribute("d", poly(lft.concat(rgt.reverse())));
    rgt.reverse();
    let d = "";
    for (let i = 1; i < N - 2; i += 2) d += "M" + lft[i][0].toFixed(2) + " " + lft[i][1].toFixed(2) + "L" + rgt[i + 1][0].toFixed(2) + " " + rgt[i + 1][1].toFixed(2);
    twist.setAttribute("d", d);
    const f = c[N - 3];
    knot.sil.setAttribute("d", poly(hull(ringAt(P, disc(f[0], f[1], 6), f[2] + 6).concat(ringAt(P, disc(f[0], f[1], 6), f[2] - 6)))));
    knot.sil.classList.add("hi");
  }
  const B = register(stage, (dt) => { const m = stepS(ax, dt) | stepS(ay, dt); draw(); return !!m; });
  bag.add(B.unregister);
  function aim(p) {
    if (!p) { ax.t = 0.12; ay.t = -0.05; read.textContent = "rest"; B.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], 0);
    ax.t = clamp(x / 100, -reach, reach); ay.t = clamp(y / 100, -reach, reach);
    read.textContent = "lean " + Math.round(Math.hypot(ax.t, ay.t) * 57.3) + "°";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}
function facing0(C) { return HL.facing(C); }

hairline({
  name: "climbingrope",
  means: "A gym climbing rope under a beam: it swings toward where the pointer stands on the floor, its knotted foot trailing.",
  rules: [1, 3, 5, 8],
  range: [0.2, 0.45, 0.7],
  tour: [[232, 296], [179, 185], [221, 291], null],
  mount,
});
