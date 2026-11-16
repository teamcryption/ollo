/**
 * Drive enclosure: a low aluminium sleeve with a vent band and a light, and
 * a drive that slides out of its open end. The pointer over the enclosure
 * draws the drive out toward the reader. At rest it shows a hand's width,
 * bright. The slider is how far it travels.
 */
const { Cam, clamp, facing, fit, prism, proj, rings, seg, spring, stepS, disposer, mk, pointer, put, register, solid, flatDot, place } = HL;

const L = 46, D = 34, H = 16, REST = 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.8);
  fit(C, [[0, 0, 0], [L + 44, D, 0], [L + 44, 0, H], [0, D, 0], [0, 0, H]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (el, x0, y0, x1, y1, z0, z1, r = 1.5, b = 0.8) => { const [a, i] = rings(x0, y0, x1, y1, r, b); put(el, prism(P, front, a, i, z0, z1)); };

  const sleeve = solid(g), vents = mk("path", { class: "nf lo" }, sleeve.g);
  box(sleeve, 0, 0, L, D, 0, H, 3, 1.4);
  let v = ""; for (let k = 0; k < 7; k++) v += seg(P(8 + k * 3.2, D, 5), P(8 + k * 3.2, D, 11));
  vents.setAttribute("d", v);
  const led = mk("circle", { class: "dot m", r: 1.6 }, g); place(led, P(34, D, 8));
  const drv = solid(g), lab = mk("path", { class: "nf lo" }, drv.g), tab = solid(g);
  const sp = spring(REST);
  function draw(u) {
    const x1 = L + u;
    box(drv, L - 1, 3, x1, D - 3, 3, H - 3, 1, 0.5);
    box(tab, x1, 12, x1 + 3, D - 12, 6, H - 6, 0.8, 0.4);
    lab.setAttribute("d", u > 14 ? seg(P(L + 5, 7, H - 3), P(x1 - 5, 7, H - 3)) + seg(P(x1 - 5, 7, H - 3), P(x1 - 5, D - 7, H - 3)) : "");
  }
  draw(REST);
  const R = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(R.unregister);

  let act = null;
  function set(on) {
    if (on === act) return;
    act = on;
    sp.t = on ? clamp(16 + 26 * reach, 16, 42) : REST;
    drv.sil.classList.add("hi");
    read.textContent = on ? "out" : "rest";
    R.wake();
  }
  set(false);
  const bx = [[0, 0, 0], [L + 40, D, 0], [L + 40, 0, H], [0, D, 0], [0, 0, H]].map((q) => P(...q));
  const X0 = Math.min(...bx.map((q) => q[0])), X9 = Math.max(...bx.map((q) => q[0])), Y0 = Math.min(...bx.map((q) => q[1])), Y9 = Math.max(...bx.map((q) => q[1]));
  function hit([sx, sy]) { return sx > X0 && sx < X9 && sy > Y0 && sy < Y9; }
  bag.add(pointer(stage, { move: (p) => set(hit(p)), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (x) => { reach = x; if (act) { act = null; set(true); } }, destroy: bag.dispose };
}

hairline({
  name: "ssdenclosure",
  means: "A drive enclosure: the pointer draws the drive out of the sleeve's open end toward the reader.",
  rules: [1, 3, 5, 6],
  range: [0, 0.6, 1],
  tour: [[205, 149], [160, 120], [230, 170], null],
  mount,
});
