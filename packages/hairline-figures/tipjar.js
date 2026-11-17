/**
 * Tip jar: a round glass jar on a coaster, a lid with a coin standing in its
 * slot. The pointer on the counter tips the jar toward it, rocking on the
 * edge of its foot, further the further the pointer is. At rest the jar
 * leans a little and the coin is bright. The slider is the most it tips.
 *
 * The pattern: a continuous aim (a spring per tilt component).
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 22, Z0 = 3, H = 50, NR = 17, LR = 19, REST = [5, -4];
const disc = (r, z, n = 40) => circ(r, n).map((q) => [q.u, q.v, z]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let MAX = value;
  const C = Cam(45, 0.5, 2.6);
  const ext = [];
  for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) ext.push([a * 32, b * 32, 0], [a * 38, b * 38, Z0 + H + 10]);
  fit(C, ext, 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(32, 48), circ(30, 48), 0, Z0));

  const body = mk("path", { class: "sil" }, g), shoulder = mk("path", { class: "nf lo" }, g);
  const lid = mk("path", { class: "sil" }, g), lidTop = mk("path", { class: "nf lo" }, g);
  const slot = mk("path", { class: "nf lo" }, g), coin = mk("path", { class: "sil" }, g);
  const tx = spring(REST[0]), ty = spring(REST[1]);

  function xf(p) {
    const a = Math.hypot(tx.x, ty.x) * Math.PI / 180;
    if (a < 1e-4) return P(p[0], p[1], p[2]);
    const dx = tx.x / Math.hypot(tx.x, ty.x), dy = ty.x / Math.hypot(tx.x, ty.x);
    const px = dx * R, py = dy * R, qx = p[0] - px, qy = p[1] - py, qz = p[2] - Z0;
    const s = qx * dx + qy * dy, w = -qx * dy + qy * dx;
    const s2 = s * Math.cos(a) + qz * Math.sin(a), z2 = -s * Math.sin(a) + qz * Math.cos(a);
    return P(px + s2 * dx - w * dy, py + s2 * dy + w * dx, Z0 + z2);
  }
  const ringP = (r, z, n) => disc(r, z, n).map(xf);

  let last = "";
  function draw() {
    const key = tx.x.toFixed(2) + "," + ty.x.toFixed(2);
    if (key === last) return;
    last = key;
    const pts = ringP(R - 2, Z0, 40).concat(ringP(R, Z0 + 4, 40), ringP(R, Z0 + H - 8, 40), ringP(NR, Z0 + H, 40));
    body.setAttribute("d", poly(hull(pts)));
    shoulder.setAttribute("d", open(ringP(R - 1.5, Z0 + H - 8, 40).slice(0, 21)));
    lid.setAttribute("d", poly(hull(ringP(LR, Z0 + H, 40).concat(ringP(LR, Z0 + H + 6, 40)))));
    lidTop.setAttribute("d", poly(ringP(LR - 2, Z0 + H + 6, 40)));
    const zt = Z0 + H + 6;
    slot.setAttribute("d", poly([[-7, 7, zt], [7, -7, zt], [7.6, -6.4, zt], [-6.4, 7.6, zt]].map(xf)));
    const cp = [];
    for (let i = 0; i <= 16; i++) { const t = (i / 16) * Math.PI, c = 8 * Math.cos(t); cp.push(xf([c * 0.7071 + 0.3, -c * 0.7071 + 0.3, zt + 8 * Math.sin(t)])); }
    coin.setAttribute("d", poly(cp));
  }

  const B = register(stage, (dt) => {
    const m = stepS(tx, dt) | stepS(ty, dt);
    draw();
    return !!m;
  });
  bag.add(B.unregister);

  let on = false;
  function aim(p) {
    const [x, y] = p ? unproj(C, p[0], p[1], 0) : [0, 0];
    const d = Math.hypot(x, y);
    on = !!p && d < 110;
    if (!on) { tx.t = REST[0]; ty.t = REST[1]; } else {
      const amt = MAX * clamp(d / 40, 0, 1) / Math.max(d, 1e-3);
      tx.t = x * amt; ty.t = y * amt;
    }
    body.classList.toggle("hi", on);
    coin.classList.toggle("hi", !on);
    read.textContent = on ? Math.round(Math.hypot(tx.t, ty.t)) + "°" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { MAX = v; }, destroy: bag.dispose };
}

hairline({
  name: "tipjar",
  means: "A tip jar with a coin in its lid: the pointer on the counter tips the jar toward it, further the further away.",
  rules: [3, 5, 8],
  range: [8, 22, 30],
  tour: [[233, 276], [99, 233], [200, 170], null],
  mount,
});
