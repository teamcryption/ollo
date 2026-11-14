/**
 * Bus charger: an electric bus parked beside a charging mast, the mast's arm
 * reaching over its roof with a pantograph hanging from it. When the pointer
 * is over the bus the pantograph drops onto the roof and the read-out says
 * it is charging; when it leaves, the head rises back to its parked height.
 * At rest the head hangs a little low, bright. The slider is the delay.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, ringAt, open, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX0 = 0, BX1 = 64, BY0 = 0, BY1 = 22, BZ0 = 4, BZ1 = 26, MX = 32, MY = -16, ARMZ = 50, REST = 41, DOWN = 27.2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let delay = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[BX0, MY - 3, 0], [BX1, BY1, 0], [BX1, BY0, 0], [BX0, BY1, 0], [MX, MY, ARMZ + 3], [BX0, BY0, BZ1]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the mast, behind the bus, and its arm reaching out over the roof
  const mast = solid(g);
  { const [r, i] = rings(MX - 3, MY - 3, MX + 3, MY + 3, 2, 0.8); put(mast, prism(P, front, r, i, 0, ARMZ + 3)); }
  // the bus: one rounded body on its wheels, windows and door along the near side
  const wheels = mk("g", {}, g);
  [10, 52].forEach((wx) => {
    const w = solid(wheels), [r, i] = rings(wx - 5, BY1 - 4, wx + 5, BY1 - 0.5, 2.4, 0.7);
    put(w, prism(P, front, r, i, 0, BZ0 + 2));
  });
  const bus = solid(g);
  { const [r, i] = rings(BX0, BY0, BX1, BY1, 5, 1.4); put(bus, prism(P, front, r, i, BZ0, BZ1)); }
  let win = "";
  for (let k = 0; k < 6; k++) {
    const x0 = 6 + k * 9, x1 = x0 + 7;
    win += open([P(x0, BY1, 15), P(x1, BY1, 15), P(x1, BY1, 22), P(x0, BY1, 22), P(x0, BY1, 15)]);
  }
  win += seg(P(BX1 - 3, BY1, 8), P(BX1 - 3, BY1, 22)) + seg(P(BX0 + 2, BY1, 11), P(BX1 - 2, BY1, 11));
  mk("path", { class: "nf lo", d: win }, bus.g);
  // the roof rails the head lands on
  const rails = open(ringAt(P, rings(MX - 6, 5, MX + 6, 17, 1, 0.5)[0], BZ1));
  mk("path", { class: "nf lo", d: rails }, bus.g);
  const arm = solid(g);
  { const [r, i] = rings(MX - 2.5, MY - 2, MX + 2.5, 13, 1.2, 0.6); put(arm, prism(P, front, r, i, ARMZ, ARMZ + 3)); }
  const legs = mk("path", { class: "nf lo" }, g);
  const head = solid(g);
  const hz = tween(REST);
  let last = NaN;

  function draw(z) {
    if (z === last) return;
    last = z;
    const [r, i] = rings(MX - 5, 4, MX + 5, 18, 1, 0.5);
    put(head, prism(P, front, r, i, z, z + 1.6));
    const k = (z + 1.6 + ARMZ) / 2;
    legs.setAttribute("d", seg(P(MX - 1.5, 6, ARMZ), P(MX - 1.5, 11, k)) + seg(P(MX - 1.5, 11, k), P(MX - 1.5, 6, z + 1.6))
      + seg(P(MX + 1.5, 6, ARMZ), P(MX + 1.5, 11, k)) + seg(P(MX + 1.5, 11, k), P(MX + 1.5, 6, z + 1.6)));
  }
  head.sil.classList.add("hi");

  const B = register(stage, (_dt, now) => { draw(tval(hz, now)); return !tdone(hz, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, BZ1 / 2);
    return x > BX0 - 4 && x < BX1 + 4 && y > BY0 - 8 && y < BY1 + 4;
  }
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(hz, a ? DOWN : REST, performance.now(), a ? clamp(delay, 0, 400) : 0);
    read.textContent = a ? "chg" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { delay = v; }, destroy: bag.dispose };
}

hairline({
  name: "buscharger",
  means: "An electric bus under a charging mast: over the bus, the pantograph drops onto its roof to charge.",
  rules: [1, 4, 5, 8],
  range: [0, 100, 300],
  tour: [[203, 150], [160, 150], [245, 225], null],
  mount,
});
