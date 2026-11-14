/**
 * Cash drawer: a till's body with its drawer in front. When the pointer is
 * over the till the drawer slides out toward us and its trays of notes and
 * coins show; when it leaves, the drawer slides home. At rest the drawer
 * stands a little ajar, bright. The slider is the delay before it opens.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X0 = 0, X1 = 52, Y0 = 0, Y1 = 40, Z1 = 22, DZ0 = 3, DZ1 = 12, OUT = 28, REST = 5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let delay = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[X0, Y0, 0], [X1, Y1 + OUT, 0], [X1, Y0, 0], [X0, Y1 + OUT, 0], [X0, Y0, Z1], [X1, Y0, Z1]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const body = solid(g);
  { const [r, i] = rings(X0, Y0, X1, Y1, 4, 1.4); put(body, prism(P, front, r, i, 0, Z1)); }
  // the drawer's opening on the body's front, and the key lock above it
  mk("path", { class: "nf lo", d: seg(P(X0 + 2, Y1, DZ1 + 2), P(X1 - 2, Y1, DZ1 + 2)) + seg(P(X1 - 8, Y1, 16), P(X1 - 8, Y1, 18)) }, body.g);
  const drawer = solid(g), trays = mk("path", { class: "nf lo" }, g);
  drawer.sil.classList.add("hi");
  const out = tween(REST);
  let last = NaN;

  function draw(o) {
    if (o === last) return;
    last = o;
    const yb = Y1 - 3, yf = Y1 + o;
    const [r, i] = rings(X0 + 3, yb, X1 - 3, yf, 2, 1);
    put(drawer, prism(P, front, r, i, DZ0, DZ1));
    // the trays: five bins across the back, a long well for notes in front
    let d = "";
    if (o > 6) {
      const ym = Math.max(Y1, yf - 12);
      for (let k = 1; k < 5; k++) { const x = X0 + 3 + k * (X1 - X0 - 6) / 5; d += seg(P(x, Y1, DZ1), P(x, ym, DZ1)); }
      d += seg(P(X0 + 4, ym, DZ1), P(X1 - 4, ym, DZ1));
    }
    d += seg(P(X0 + 20, yf, DZ1 - 4), P(X1 - 20, yf, DZ1 - 4));
    trays.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => { draw(tval(out, now)); return !tdone(out, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, Z1 / 2);
    return x > X0 - 4 && x < X1 + 4 && y > Y0 - 4 && y < Y1 + 6;
  }
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(out, a ? OUT : REST, performance.now(), a ? clamp(delay, 0, 400) : 0);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { delay = v; }, destroy: bag.dispose };
}

hairline({
  name: "cashdrawer",
  means: "A till's cash drawer: over the till, the drawer slides out and shows its trays of coins and notes.",
  rules: [1, 4, 5, 8],
  range: [0, 100, 300],
  tour: [[227, 129], [215, 120], [238, 195], null],
  mount,
});
