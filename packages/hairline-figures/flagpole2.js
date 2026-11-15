/**
 * Feather flag: a tall feather banner on a bent pole, stood in a round
 * weighted base. The pointer is the wind's other end: the flag turns round
 * its pole on a spring to stream toward it. At rest it streams to the left,
 * bright. The slider is how quickly it follows.
 */
const { Cam, circ, facing, fit, poly, prism, proj, seg, unproj, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;
const H = 100, W = 52, B = 30, REST = (135 * Math.PI) / 180;
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));
const SHAPE = (() => {
  const s = [[0, B]];
  for (let i = 0; i <= 12; i++) { const t = i / 12, u = 1 - t; s.push([2 * u * t * W + t * t * W, u * u * H + 2 * u * t * H + t * t * (H - 40)]); }
  s.push([W * 0.92, H - 52], [W * 0.78, B + 4], [W * 0.7, B]);
  return s;
})();

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.4);
  const d = W * 0.71;
  fit(C, [[-14, -14, 0], [14, 14, 0], [0, 0, H + 2], [-d, d, H], [d, -d, H], [d, d, B], [-d, -d, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(14, 40), circ(12.6, 40), 0, 5));
  const flag = mk("path", { class: "sil" }, g);
  const pole = mk("path", { class: "nf sil" }, g);
  pole.setAttribute("d", seg(P(0, 0, 5), P(0, 0, H)));
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    if (Math.abs(sp.x - drawn) < 1e-4) return;
    drawn = sp.x;
    const c = Math.cos(sp.x), s = Math.sin(sp.x);
    flag.setAttribute("d", poly(SHAPE.map(([u, z]) => P(u * c, u * s, z))));
  }
  const L = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(L.unregister);
  flag.classList.add("hi");
  function aim(over) {
    const a = over ? Math.atan2(over[1], over[0]) : REST;
    sp.t = sp.t + wrap(a - sp.t);
    read.textContent = over ? String(Math.round(((a * 180) / Math.PI + 360) % 360)).padStart(3, "0") + "°" : "rest";
    L.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y); aim(r < 8 || r > 120 ? null : [x, y]); },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "flagpole2",
  means: "A feather flag on a weighted base: the flag turns round its pole to stream toward the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[302, 238], [98, 238], [250, 295], null],
  mount,
});
