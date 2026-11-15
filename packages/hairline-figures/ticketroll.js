/**
 * Ticket roll: a raffle ticket dispenser, a box with a roll turning on its
 * side and a strip of tickets running out of its slot along the table. The
 * pointer pulls the strip out to it and the roll turns as it pays out. At
 * rest a short strip hangs out, bright.
 */
const { Cam, clamp, fit, hull, poly, proj, seg, unproj, tdone, tset, tval, tween, disposer, mk, pointer, register, solid } = HL;

const BX = 24, BY = 22, BZ = 26, Y0 = 4, Y1 = 18, TK = 9, MAX = 56, REST = 16;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 4.6);
  fit(C, [[0, 0, 0], [BX + MAX, BY, 0], [0, BY, BZ], [BX + MAX, 0, 0], [BX, 0, BZ], [0, 0, BZ]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const strip = solid(g);
  strip.cr.setAttribute("class", "nf lo");
  const box = solid(g);
  const c = [[0, 0], [BX, 0], [BX, BY], [0, BY]];
  box.sil.setAttribute("d", poly(hull(c.map(([x, y]) => P(x, y, 0)).concat(c.map(([x, y]) => P(x, y, BZ))))));
  box.cr.setAttribute("class", "nf lo");
  const wheel = mk("path", { class: "nf lo" }, box.g);
  const ring = (r, a0) => { const q = []; for (let i = 0; i < 28; i++) { const a = a0 + (i / 28) * Math.PI * 2; q.push(P(11 + r * Math.cos(a), BY, 14 + r * Math.sin(a))); } return q; };
  box.cr.setAttribute("d", poly(c.map(([x, y]) => P(x, y, BZ))) + seg(P(BX, BY, 0), P(BX, BY, BZ)) + poly([P(BX, Y0, 2), P(BX, Y1, 2), P(BX, Y1, 4), P(BX, Y0, 4)]));
  const len = tween(REST);

  function draw(L) {
    const x1 = BX + L, z = 0.3;
    strip.sil.setAttribute("d", poly([P(BX, Y0, 3), P(BX, Y1, 3), P(x1, Y1, z), P(x1, Y0, z)]));
    let d = "";
    for (let x = x1 - TK; x > BX + 1; x -= TK) d += seg(P(x, Y0, z), P(x, Y1, z));
    strip.cr.setAttribute("d", d);
    const a = -L / 8;
    let w = poly(ring(9, a)) + poly(ring(3, a));
    for (let k = 0; k < 3; k++) { const b = a + (k * 2 * Math.PI) / 3; w += seg(P(11 + 3 * Math.cos(b), BY, 14 + 3 * Math.sin(b)), P(11 + 9 * Math.cos(b), BY, 14 + 9 * Math.sin(b))); }
    wheel.setAttribute("d", w);
  }
  let last = NaN;
  const B = register(stage, (_dt, now) => {
    const L = tval(len, now);
    if (L !== last) { last = L; draw(L); }
    return !tdone(len, now);
  });
  bag.add(B.unregister);

  // the hit: the pointer on the table, a fixed plane; the strip runs out to its x
  let act = -2;
  function setActive(on, x) {
    const L = on ? clamp(Math.max(x - BX, 34), 12, MAX * reach) : REST;
    tset(len, L, performance.now(), 0);
    strip.sil.classList.add("hi");
    read.textContent = on ? Math.round(L / TK) + " tix" : "rest";
    act = on;
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    return [x > -4 && x < BX + MAX + 6 && y > -6 && y < BY + 8, x];
  }
  setActive(false, 0);
  bag.add(pointer(stage, { move: (p) => setActive(...hit(p)), leave: () => setActive(false, 0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "ticketroll",
  means: "A raffle ticket dispenser: the pointer pulls the strip of tickets out to it and the roll turns as it pays out.",
  rules: [1, 3, 5, 6],
  range: [0.6, 1, 1],
  tour: [[285, 254], [250, 230], [306, 266], null],
  mount,
});
