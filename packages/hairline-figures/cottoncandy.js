/**
 * Candy floss: a floss machine, a wide round tub with the spinner head in
 * its middle and a stick of floss held over it. The pointer over the tub
 * winds the floss: the cloud swells on its stick and rises out of the tub.
 * At rest a small cloud sits low, bright. The slider is how big it grows.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, unproj,
} = HL;

const R = 40, H = 22, REST = 0.25;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let big = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [0, 0, H + 76], [-28, -28, H + 48], [28, 28, H + 20]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the tub: a wall, its rim, and the spinner head inside
  put(solid(g), prism(P, front, disc(0, 0, R), disc(0, 0, R - 3), 0, H));
  mk("path", { d: poly(ringAt(P, disc(0, 0, R - 3), H)), class: "nf lo" }, g);
  put(solid(g), prism(P, front, disc(0, 0, 9, 24), disc(0, 0, 7, 24), H - 6, H + 2));
  const stick = mk("path", { class: "nf" }, g), cloud = solid(g);
  cloud.sil.classList.add("hi");
  const s = tween(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const r = 8 + 20 * t, cz = H + 10 + 26 * t, pts = [];
    for (let i = 0; i <= 8; i++) {
      const a = (i / 8) * Math.PI, rr = r * Math.sin(a) + 0.5;
      pts.push(...ringAt(P, disc(0, 0, rr, 28), cz - r * 0.9 * Math.cos(a)));
    }
    cloud.sil.setAttribute("d", poly(hull(pts)));
    const wisp = [];
    for (let i = 0; i <= 10; i++) { const a = -0.6 + (i / 10) * 2.2; wisp.push(P(r * 0.7 * Math.cos(a), r * 0.7 * Math.sin(a), cz + r * 0.25 - i * r * 0.05)); }
    cloud.cr.setAttribute("d", "M" + wisp.map((p) => p.join(",")).join("L"));
    stick.setAttribute("d", seg(P(0, 0, H - 2), P(0, 0, cz)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(s, now)); return !tdone(s, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(s, on ? big : REST, performance.now(), 0);
    read.textContent = on ? "spin" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => {
    const [x, y] = unproj(C, sx, sy, H);
    return Math.hypot(x, y) < R + 8;
  };
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { big = v; if (act) { tset(s, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "cottoncandy",
  means: "A floss machine: the pointer over the tub winds the floss, and the cloud on its stick swells and rises out of the tub.",
  rules: [1, 5, 6, 8],
  range: [0.6, 0.85, 1],
  tour: [[200, 189], [232, 205], [168, 198], null],
  mount,
});
