/**
 * Sleeve board: a long tapered board with a smaller sleeve board standing
 * over it on a post at the heel. The sleeve board swings on its post to aim
 * at the pointer. At rest it is swung out to one side, bright.
 * The slider is how stiffly it follows.
 */
const { Cam, fit, proj, hull, poly, clamp, spring, stepS, unproj, disposer, mk, pointer, register } = HL;
const BL = 132, TL = 112, PX = 12, TZ = 26, REST = 0.75;
const board = (u0, len, w0, w1) => {
  const o = [[u0, -w0 / 2]];
  for (let i = 0; i <= 10; i++) { const t = -Math.PI / 2 + (i / 10) * Math.PI; o.push([len - w1 / 2 + (w1 / 2) * Math.cos(t), (w1 / 2) * Math.sin(t)]); }
  o.push([u0, w0 / 2]);
  return o;
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.0);
  const ext = [[-6, -24, 0], [BL, 24, 0], [BL, -24, 0], [-6, 24, 0]];
  for (let k = 0; k < 12; k++) { const a = -1 + (k / 11) * 2; ext.push([PX + TL * Math.cos(a), TL * Math.sin(a), TZ + 4]); }
  fit(C, ext, 200, 160);
  const P = proj(C);
  const L = (pts) => poly(hull(pts.map((p) => P(p[0], p[1], p[2]))));
  const at = (ring, z) => ring.map((q) => [q[0], q[1], z]);
  const g = mk("g", {}, svg);
  const B0 = board(-6, BL, 44, 26);
  mk("path", { d: L([...at(B0, 0), ...at(B0, 5)]) }, g);
  mk("path", { class: "nf lo", d: poly(B0.map((q) => P(q[0], q[1], 5))) }, g);
  const post = [];
  for (const x of [PX - 3, PX + 3]) for (const y of [-6, 6]) for (const z of [5, TZ]) post.push([x, y, z]);
  mk("path", { d: L(post) }, g);
  const T0 = board(-10, TL, 28, 16);
  const top = mk("path", { class: "sil hi" }, g), topc = mk("path", { class: "nf lo" }, g);
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let last = NaN;
  function draw() {
    const a = sp.x;
    if (Math.abs(a - last) < 1e-4) return;
    last = a;
    const c = Math.cos(a), s = Math.sin(a);
    const R = T0.map((q) => [PX + q[0] * c - q[1] * s, q[0] * s + q[1] * c]);
    top.setAttribute("d", L([...at(R, TZ), ...at(R, TZ + 4)]));
    topc.setAttribute("d", poly(R.map((q) => P(q[0], q[1], TZ + 4))));
  }
  const Bk = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(Bk.unregister);
  function aim(t, r) { sp.t = t; read.textContent = r ? "rest" : Math.round((t * 180) / Math.PI) + " deg"; Bk.wake(); }
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [x, y] = unproj(C, sx, sy, 5), d = Math.hypot(x - PX, y);
      if (d < 20 || d > TL + 40) return aim(REST, 1);
      aim(clamp(Math.atan2(y, x - PX), -1, 1));
    },
    leave: () => aim(REST, 1),
  }));
  aim(REST, 1);
  draw();
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "ironingstand",
  means: "A sleeve board on its post over a long board: it swings round to aim at the pointer, and rests swung out to one side.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[278, 218], [242, 144], [101, 215], null],
  mount,
});
