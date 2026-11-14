/**
 * Tyre changer: a garage machine, a cabinet with a turntable on top, a tyre
 * lying flat on it, and a column whose arm holds the mount head over the
 * back bead. The pointer turns the tyre: its valve swings round to face the
 * pointer, the lugs and sidewall ribs turning with it, and the mount head
 * presses down onto the bead. At rest the valve sits at a quarter turn,
 * bright. The slider is how far the head presses.
 *
 * The pattern: one part turning to face the pointer (spin).
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, rings, ringAt, seg, stepS, spring, tset, tval, tdone, tween, unproj,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const CX = 40, CY = 32, TR = 26, TZ0 = 33, TZ1 = 45, REST = 135;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const rad = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let press = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[0, 0, 0], [70, 58, 0], [70, 0, 0], [0, 58, 0], [4, 4, 70], [44, 6, 70]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1, parent = g) => put(solid(parent), prism(P, front, ...rings(x0, y0, x1, y1, r, b), z0, z1));

  box(0, 0, 70, 58, 6, 2, 0, 30);
  box(4, 3, 16, 15, 4, 1.5, 30, 68);
  put(solid(g), prism(P, front, disc(CX, CY, 22), disc(CX, CY, 20.5), 30, TZ0));
  const tyre = solid(g);
  put(tyre, prism(P, front, disc(CX, CY, TR, 48), disc(CX, CY, TR - 2, 48), TZ0, TZ1));
  mk("path", { d: poly(ringAt(P, disc(CX, CY, 16, 40), TZ1)), class: "nf" }, g);
  mk("path", { d: poly(ringAt(P, disc(CX, CY, 14.5, 40), TZ1 - 3)), class: "nf lo" }, g);
  const ribs = mk("path", { class: "nf lo" }, g);
  const hub = mk("path", { class: "nf" }, g);
  const nuts = [0, 1, 2, 3, 4].map(() => flatDot(g, C, 1.3, "dot off"));
  const valve = solid(g);
  const head = solid(g), bar = solid(g);
  box(4, 5, 46, 13, 3, 1.2, 66, 71);

  const rot = spring(REST), drop = tween(0);
  let lastA = NaN, lastD = NaN;
  function draw(a, d) {
    if (a !== lastA) {
      lastA = a;
      let s = "";
      for (let i = 0; i < 12; i++) {
        const t = rad(a + 15 + i * 30), c = Math.cos(t), n = Math.sin(t);
        s += seg(P(CX + 18.5 * c, CY + 18.5 * n, TZ1), P(CX + 23.5 * c, CY + 23.5 * n, TZ1));
      }
      ribs.setAttribute("d", s);
      hub.setAttribute("d", poly(ringAt(P, disc(CX, CY, 6.5, 24), TZ1 - 1)));
      nuts.forEach((el, i) => { const t = rad(a + i * 72); place(el, P(CX + 4 * Math.cos(t), CY + 4 * Math.sin(t), TZ1 - 1)); });
      const vx = CX + 17.2 * Math.cos(rad(a)), vy = CY + 17.2 * Math.sin(rad(a));
      put(valve, prism(P, front, disc(vx, vy, 1.4, 12), disc(vx, vy, 0.8, 12), TZ1 - 2, TZ1 + 3.5));
    }
    if (d !== lastD) {
      lastD = d;
      const z = TZ1 + 6 - d;
      put(head, prism(P, front, ...rings(35, 4, 45, 14, 3, 1.2), z, z + 5));
      put(bar, prism(P, front, ...rings(38, 7.5, 42, 11.5, 2, 0.8), z + 5, 66));
    }
  }

  const B = register(stage, (dt, now) => {
    const m = stepS(rot, dt);
    draw(rot.x, tval(drop, now));
    return m || !tdone(drop, now);
  });
  bag.add(B.unregister);

  let on = null;
  function aim(p) {
    const [x, y] = unproj(C, p[0], p[1], TZ1), dx = x - CX, dy = y - CY;
    const hitT = Math.hypot(dx, dy) < TR + 8;
    const now = performance.now();
    if (hitT) {
      const th = (Math.atan2(dy, dx) * 180) / Math.PI;
      rot.t = th + 360 * Math.round((rot.t - th) / 360);
      read.textContent = String(Math.round(((th % 360) + 360) % 360)).padStart(3, "0") + "°";
    } else {
      rot.t = REST + 360 * Math.round((rot.t - REST) / 360);
      read.textContent = "rest";
    }
    if (hitT !== on) {
      on = hitT;
      tset(drop, hitT ? press : 0, now, 0);
      tyre.sil.classList.toggle("hi", hitT);
    }
    B.wake();
  }
  valve.sil.classList.add("hi");
  read.textContent = "rest";
  draw(REST, 0);
  bag.add(pointer(stage, { move: aim, leave: () => aim([-999, -999]) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { press = v; if (on) { tset(drop, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "tyrechanger",
  means: "A tyre on a changer's turntable: it turns so its valve faces the pointer, and the mount head presses onto the bead.",
  rules: [1, 3, 5, 8],
  range: [0, 5, 6],
  tour: [[237, 164], [135, 144], [244, 130], null],
  mount,
});
