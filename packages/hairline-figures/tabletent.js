/**
 * Table tent: a folded card standing on a café table. The pointer turns the
 * tent to face it and the card swings open wider, its printed panels coming
 * round. At rest the tent stands half-closed, turned, bright.
 * The slider is how far it turns.
 *
 * The pattern: one part turning to face the pointer (officechairs).
 */
const { Cam, facing, fit, hull, poly, prism, proj, rings, spring, stepS, clamp, rad, disposer, mk, pointer, put, register, solid } = HL;

const L = 26, TZ = 8, HT = 44, REST = -28, W0 = 9, W1 = 20;
const FACES = [[0, 1, 5, 4], [3, 4, 5, 2], [1, 2, 5], [0, 4, 3]];
const area = (q) => { let s = 0; for (let i = 0; i < q.length; i++) { const a = q[i], b = q[(i + 1) % q.length]; s += a[0] * b[1] - b[0] * a[1]; } return s; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-44, -44, 0], [44, 44, 0], [44, -44, 0], [-44, 44, 0], [0, 0, TZ + HT + 4]], 200, 160);
  const P = proj(C), front = facing(C);
  const SG = Math.sign(area([P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1)]));
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-42, -42, 42, 42, 14, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));
  const sil = mk("path", { class: "sil" }, g), faces = mk("path", { class: "nf" }, g), prints = mk("path", { class: "nf lo" }, g);
  const yaw = spring(REST), w = spring(W0);

  function draw() {
    const c = Math.cos(rad(yaw.x)), s = Math.sin(rad(yaw.x)), ww = w.x, h = Math.sqrt(Math.max(HT * HT - ww * ww, 1));
    const loc = [[-L, -ww, 0], [L, -ww, 0], [L, ww, 0], [-L, ww, 0], [-L, 0, h], [L, 0, h]];
    const pts = loc.map(([x, y, z]) => P(x * c - y * s, x * s + y * c, TZ + z));
    sil.setAttribute("d", poly(hull(pts)));
    let fd = "", pd = "";
    FACES.forEach((f, k) => {
      const q = f.map((i) => pts[i]);
      if (area(q) * SG <= 0) return;
      fd += poly(q);
      if (k < 2) {
        const m = [0, 1].map((j) => q.reduce((a, p) => a + p[j], 0) / 4);
        pd += poly(q.map((p) => [m[0] + (p[0] - m[0]) * 0.6, m[1] + (p[1] - m[1]) * 0.5]));
      }
    });
    faces.setAttribute("d", fd);
    prints.setAttribute("d", pd);
  }

  const B = register(stage, (dt) => {
    const a = stepS(yaw, dt), b = stepS(w, dt);
    draw();
    return a || b;
  });
  bag.add(B.unregister);

  const cx = P(0, 0, 0)[0];
  function aim(p) {
    if (!p) { yaw.t = REST; w.t = W0; read.textContent = "rest"; }
    else {
      const t = clamp((p[0] - cx) / 110, -1, 1);
      yaw.t = REST + 28 + t * reach; w.t = W1;
      read.textContent = Math.round(yaw.t) + "°";
    }
    sil.classList.add("hi");
    B.wake();
  }
  aim(null);
  draw();
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "tabletent",
  means: "A folded table tent on a café table: it turns to face the pointer and swings open wider.",
  rules: [1, 3, 4, 5],
  range: [20, 50, 80],
  tour: [[120, 150], [290, 150], [200, 110], null],
  mount,
});
