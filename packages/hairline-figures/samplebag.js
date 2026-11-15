/**
 * Tote bag: a branded tote standing on a low step, its two handles flopped
 * over at rest. The pointer turns the bag to face it and the handles swing
 * up to stand. The front handle is the bright mark.
 * The slider is how far the bag turns.
 *
 * The pattern: one part turning to face the pointer (officechairs).
 */
const { Cam, facing, fit, hull, open, poly, prism, proj, rings, spring, stepS, clamp, rad, disposer, mk, pointer, put, register, solid } = HL;

const BW = 22, BD = 6, BH = 46, SZ = 6, HR = 10, HH = 22, REST = -28;
const FACES = [[4, 5, 7, 6], [0, 2, 3, 1], [1, 3, 7, 5], [0, 4, 6, 2], [2, 6, 7, 3], [0, 1, 5, 4]];
const area = (q) => { let s = 0; for (let i = 0; i < q.length; i++) { const a = q[i], b = q[(i + 1) % q.length]; s += a[0] * b[1] - b[0] * a[1]; } return s; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[-34, -34, 0], [34, 34, 0], [34, -34, 0], [-34, 34, 0], [0, 0, SZ + BH + HH + 4]], 200, 165);
  const P = proj(C), front = facing(C);
  const SG = Math.sign(area([P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1)]));
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-34, -24, 34, 24, 8, 1.6);
  put(solid(g), prism(P, front, sr, si, 0, SZ));
  const back = mk("path", { class: "nf" }, g);
  const sil = mk("path", { class: "sil" }, g), faces = mk("path", { class: "nf" }, g), logo = mk("path", { class: "nf lo" }, g);
  const fore = mk("path", { class: "nf" }, g);
  const yaw = spring(REST), lift = spring(0);

  function draw() {
    const c = Math.cos(rad(yaw.x)), s = Math.sin(rad(yaw.x));
    const W = (x, y, z) => P(x * c - y * s, x * s + y * c, SZ + z);
    const pts = [];
    for (let i = 0; i < 8; i++) pts.push(W(i & 1 ? BW : -BW, i & 2 ? BD : -BD, i & 4 ? BH : 0));
    sil.setAttribute("d", poly(hull(pts)));
    let fd = "", ld = "";
    FACES.forEach((f, k) => {
      const q = f.map((i) => pts[i]);
      if (area(q) * SG <= 0) return;
      fd += poly(q);
      if (k >= 4) {
        const m = [0, 1].map((j) => q.reduce((a, p) => a + p[j], 0) / 4);
        ld += poly(q.map((p) => [m[0] + (p[0] - m[0]) * 0.45, m[1] + (p[1] - m[1]) * 0.35]));
      }
    });
    faces.setAttribute("d", fd);
    logo.setAttribute("d", ld);
    const handle = (side, phi) => {
      const out = [], sp = Math.sin(rad(phi)), cp = Math.cos(rad(phi));
      for (let i = 0; i <= 16; i++) {
        const a = Math.PI * (i / 16), u = -HR * Math.cos(a), h = HH * Math.sin(a);
        out.push(W(u, side * (BD + h * sp), BH + h * cp));
      }
      return open(out);
    };
    const t = lift.x;
    back.setAttribute("d", handle(-1, 75 - 70 * t));
    fore.setAttribute("d", handle(1, 80 - 72 * t));
  }

  const B = register(stage, (dt) => {
    const a = stepS(yaw, dt), b = stepS(lift, dt);
    draw();
    return a || b;
  });
  bag.add(B.unregister);

  const cx = P(0, 0, 0)[0];
  function aim(p) {
    if (!p) { yaw.t = REST; lift.t = 0; read.textContent = "rest"; }
    else {
      const t = clamp((p[0] - cx) / 110, -1, 1);
      yaw.t = -45 + t * reach; lift.t = 1;
      read.textContent = Math.round(yaw.t) + "°";
    }
    fore.classList.add("hi");
    B.wake();
  }
  aim(null);
  draw();
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "samplebag",
  means: "A branded tote bag on a step: it turns to face the pointer and its flopped handles swing up to stand.",
  rules: [1, 3, 4, 5],
  range: [20, 50, 80],
  tour: [[120, 150], [290, 150], [200, 110], null],
  mount,
});
