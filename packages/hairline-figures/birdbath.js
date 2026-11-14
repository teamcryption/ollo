/**
 * Bird bath: a basin on a pedestal over a round foot. The basin tips toward
 * the pointer, its water lying level inside, as if a bird had landed on that
 * rim. At rest it leans a little, its water bright. The slider is the reach.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, ringAt, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H = 44, R0 = 12, R1 = 30, D = 9;
const disc = (r, n = 40) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-R1 - 4, -R1 - 4, 0], [R1 + 4, R1 + 4, 0], [R1 + 4, -R1 - 4, H + D + 8], [-R1 - 4, R1 + 4, H + D + 8]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(20), disc(18), 0, 4));
  put(solid(g), prism(P, front, disc(7), disc(6), 4, H - 4));
  const s = solid(g), water = mk("path", { class: "nf" }, g);
  const tx = spring(0.06), ty = spring(0.03);
  let last = "";
  const tip = (ring, z, a, b) => ring.map((q) => { const p = P(q.u, q.v, z + a * q.u + b * q.v); return p; });
  function draw() {
    const key = tx.x.toFixed(4) + ty.x.toFixed(4);
    if (key === last) return;
    last = key;
    const a = tx.x, b = ty.x;
    s.sil.setAttribute("d", poly(hull(tip(disc(R0), H - 4, a * 0.3, b * 0.3).concat(tip(disc(R1), H + D, a, b)))));
    s.cr.setAttribute("d", poly(tip(disc(R1 - 2), H + D, a, b)));
    s.cr.setAttribute("class", "nf lo");
    water.setAttribute("d", poly(ringAt(P, disc(R1 - 7 - 10 * Math.hypot(a, b)), H + D - 3)));
  }
  draw();
  const B = register(stage, (dt) => { const m = stepS(tx, dt) | stepS(ty, dt); draw(); return !!m; });
  bag.add(B.unregister);

  let act = null;
  function aim(p) {
    const on = !!p;
    let a = 0.06, b = 0.03;
    if (on) {
      const [x, y] = unproj(C, p[0], p[1], 0), d = Math.hypot(x, y) || 1, m = clamp(d / 80, 0.3, 1) * 0.16 * (0.4 + 0.6 * reach);
      a = -(x / d) * m; b = -(y / d) * m;
      read.textContent = Math.round(((Math.atan2(y, x) * 180) / Math.PI + 360) % 360) + "°";
    } else read.textContent = "rest";
    tx.t = a; ty.t = b;
    if (on !== act) { act = on; water.classList.toggle("hi", !on); s.sil.classList.toggle("hi", on); }
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "birdbath",
  means: "A basin on a pedestal: it tips toward the pointer, the water lying level inside, as if a bird had landed on that rim.",
  rules: [3, 4, 5, 8],
  range: [0, 70, 100],
  tour: [[150, 150], [250, 150], [200, 230], null],
  mount,
});
