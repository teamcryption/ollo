/**
 * Garden arch: one rose arch, two posts under a round top, a low gate between
 * them. The pointer over it swings the gate open on its hinge. At rest the
 * gate stands just ajar, its frame bright.
 */
const { Cam, fit, open, poly, proj, facing, prism, rings, rad, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const Y = 44, H = 84, GW = 80, GH = 46, REST = 12, OPEN = 80;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-6, -Y - 4, 0], [GW, -Y, 0], [6, Y + 4, 0], [0, 0, H + Y + 6], [0, -Y, H + Y]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const post = (y) => { const [r, i] = rings(-3.5, y - 3.5, 3.5, y + 3.5, 3, 1); put(solid(g), prism(P, front, r, i, 0, H)); };
  post(-Y);
  const arc = (r) => { const o = []; for (let i = 0; i <= 24; i++) { const a = Math.PI * (i / 24); o.push(P(0, -r * Math.cos(a), H + r * Math.sin(a))); } return o; };
  mk("path", { d: poly(arc(Y + 3.5).concat(arc(Y - 3.5).reverse())), class: "sil" }, g);
  const rungs = []; for (let k = 1; k < 8; k++) { const a = Math.PI * (k / 8); rungs.push(open([P(0, -(Y - 3.5) * Math.cos(a), H + (Y - 3.5) * Math.sin(a)), P(0, -(Y + 3.5) * Math.cos(a), H + (Y + 3.5) * Math.sin(a))])); }
  mk("path", { d: rungs.join(" "), class: "nf lo" }, g);
  post(Y);
  const gate = mk("path", { class: "sil" }, g), bars = mk("path", { class: "nf lo" }, g);
  const sp = spring(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return; last = deg;
    const a = rad(deg), w = GW - 6;
    const at = (t, z) => P(t * w * Math.sin(a), -Y + 4 + t * w * Math.cos(a), z);
    gate.setAttribute("d", poly([at(0, 6), at(1, 6), at(1, GH), at(0.5, GH + 8), at(0, GH)]));
    const b = [];
    for (let k = 1; k < 8; k++) b.push(open([at(k / 8, 9), at(k / 8, GH - 2 + 8 * (1 - Math.abs(k / 8 - 0.5) * 2))]));
    b.push(open([at(0.02, 26), at(0.98, 26)]));
    bars.setAttribute("d", b.join(" "));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const pts = [P(0, -Y, 0), P(0, Y, 0), P(0, 0, H + Y), P(0, -Y, H), P(0, Y, H)];
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  const x0 = Math.min(...xs) - 8, x1 = Math.max(...xs) + 8, y0 = Math.min(...ys) - 6, y1 = Math.max(...ys) + 10;
  let act = false;
  const target = () => REST + (OPEN - REST) * (0.4 + 0.6 * amt);
  function setA(on) {
    sp.t = on ? target() : REST;
    gate.classList.toggle("hi", true);
    read.textContent = on ? "open " + Math.round(sp.t) + "°" : "rest";
    act = on; B.wake();
  }
  setA(false);
  bag.add(pointer(stage, { move: (p) => setA(p[0] > x0 && p[0] < x1 && p[1] > y0 && p[1] < y1), leave: () => setA(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act) { sp.t = target(); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "gazebo",
  means: "A garden rose arch with a low gate between its posts: the pointer over it swings the gate open on its hinge.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[146, 220], [210, 222], [146, 120], null],
  mount,
});
