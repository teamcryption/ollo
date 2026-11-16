/**
 * Smart speaker: a round speaker with grille bands and a light ring cap. The
 * pointer over it lifts the ring cap clear of the body, as if it were being
 * turned up. At rest the cap sits a little raised, bright. The slider is how
 * high it lifts.
 */
const { Cam, circ, clamp, facing, fit, prism, proj, ringAt, run, open, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const R0 = 24, H = 40, CAP = 12, REST = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.15);
  fit(C, [[-R0, -R0, 0], [R0, R0, 0], [R0, -R0, H + CAP + 26], [-R0, R0, 0], [-R0, -R0, H + CAP + 26]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const ring = circ(R0, 48), inner = circ(R0 - 1.5, 48), top = circ(R0 - 1, 48), ti = circ(R0 - 3, 48), dial = circ(9, 32), di = circ(7.6, 32);

  const body = solid(g), bands = mk("path", { class: "nf lo" }, body.g);
  put(body, prism(P, front, ring, inner, 0, H));
  bands.setAttribute("d", [8, 14, 20, 26, 32].map((z) => open(ringAt(P, run(ring, front), z))).join(""));
  const cap = solid(g), knob = solid(g);
  const sp = spring(REST);
  function draw(u) {
    put(cap, prism(P, front, top, ti, H + u, H + u + CAP));
    put(knob, prism(P, front, dial, di, H + u + CAP, H + u + CAP + 3));
  }
  draw(REST);
  const L = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(L.unregister);

  let act = null;
  function set(on) {
    if (on === act) return;
    act = on;
    sp.t = on ? clamp(12 + 14 * reach, 12, 26) : REST;
    cap.sil.classList.add("hi");
    read.textContent = on ? "up" : "rest";
    L.wake();
  }
  set(false);
  const bx = [[-R0, -R0, 0], [R0, R0, 0], [R0, -R0, H + CAP], [-R0, R0, 0], [-R0, -R0, H + CAP]].map((q) => P(...q));
  const X0 = Math.min(...bx.map((q) => q[0])), X9 = Math.max(...bx.map((q) => q[0])), Y0 = Math.min(...bx.map((q) => q[1])), Y9 = Math.max(...bx.map((q) => q[1]));
  function hit([sx, sy]) { return sx > X0 && sx < X9 && sy > Y0 && sy < Y9; }
  bag.add(pointer(stage, { move: (p) => set(hit(p)), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (x) => { reach = x; if (act) { act = null; set(true); } }, destroy: bag.dispose };
}

hairline({
  name: "speakerbox",
  means: "A smart speaker: the pointer lifts its light ring cap clear of the grille body.",
  rules: [1, 3, 5, 6],
  range: [0, 0.6, 1],
  tour: [[200, 121], [200, 180], [170, 150], null],
  mount,
});
