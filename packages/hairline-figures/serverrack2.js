/**
 * Rack shelf: an open four-post rack with a fixed unit low and high and a
 * shelf between them carrying a server. The pointer over the rack slides the
 * shelf out toward the reader on its rails. At rest the shelf stands a little
 * out, bright. The slider is how far it travels.
 */
const { Cam, clamp, facing, fit, prism, proj, rings, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const WX = 44, DY = 40, H = 66, REST = 9;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[0, 0, -3], [WX, DY + 34, -3], [WX, 0, H], [0, DY + 34, 18], [0, 0, H]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (el, x0, y0, x1, y1, z0, z1, r = 1.2, b = 0.7) => { const [a, i] = rings(x0, y0, x1, y1, r, b); put(el, prism(P, front, a, i, z0, z1)); };
  const post = (x, y) => box(solid(g), x, y, x + 3, y + 3, 0, H, 0.8, 0.5);

  box(solid(g), -1, -1, WX + 1, DY + 1, -3, 0, 2, 1);
  post(0, 0); post(WX - 3, 0);
  box(solid(g), 3, 2, WX - 3, DY - 2, 4, 12);
  box(solid(g), 3, 2, WX - 3, DY - 2, 48, 56);
  post(0, DY - 3);
  const shelf = solid(g), srv = solid(g), lines = mk("path", { class: "nf lo" }, srv.g);
  post(WX - 3, DY - 3);
  const sp = spring(REST);
  function draw(y) {
    box(shelf, 3, y, WX - 3, y + DY - 2, 20, 22, 1, 0.5);
    box(srv, 6, y + 4, WX - 6, y + DY - 4, 22, 36, 1.5, 0.8);
    const f = y + DY - 4, L = (z) => seg(P(9, f, z), P(WX - 16, f, z));
    lines.setAttribute("d", L(26) + L(29) + L(32) + seg(P(WX - 11, f, 27), P(WX - 11, f, 31)));
  }
  draw(REST);
  const R = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(R.unregister);

  let act = null;
  function set(on) {
    if (on === act) return;
    act = on;
    sp.t = on ? clamp(12 + 22 * reach, 12, 34) : REST;
    shelf.sil.classList.toggle("hi", true);
    read.textContent = on ? "out" : "rest";
    R.wake();
  }
  set(false);
  const bx = [[0, 0, 0], [WX, 0, H], [0, DY + 30, 0], [WX, DY, 0], [0, 0, H]].map((q) => P(...q));
  const X0 = Math.min(...bx.map((q) => q[0])), X9 = Math.max(...bx.map((q) => q[0])), Y0 = Math.min(...bx.map((q) => q[1])), Y9 = Math.max(...bx.map((q) => q[1]));
  function hit([sx, sy]) { return sx > X0 && sx < X9 && sy > Y0 && sy < Y9; }
  bag.add(pointer(stage, { move: (p) => set(hit(p)), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act) { act = null; set(true); } }, destroy: bag.dispose };
}

hairline({
  name: "serverrack2",
  means: "An open server rack: the pointer slides the middle shelf and its server out toward the reader on its rails.",
  rules: [1, 3, 5, 6],
  range: [0, 0.6, 1],
  tour: [[214, 147], [170, 175], [229, 60], null],
  mount,
});
