/**
 * Ticket machine: a station kiosk on a plinth, a screen and a row of four
 * fare buttons on its front, and a ticket slot below them. The pointer picks
 * a fare button by where it is along the row: that button presses in and a
 * ticket feeds out of the slot, longer for a farther zone. At rest the last
 * ticket peeks from the slot, bright. The slider is the feed's delay.
 *
 * The pattern: one of many in a single row; the hit is the nearest resting
 * button centre by screen x, inside the kiosk's screen box.
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, ringAt, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 40, Y1 = 26, Z0 = 4, Z1 = 74, BZ = [40, 47], BD = 3, BX0 = 6, BW = 5.5, BS = 7.5, N = 4;
const TZ = 22, TX = [9, 31], REST = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let delay = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[-3, -3, 0], [X1 + 3, -3, 0], [X1 + 3, Y1 + 3, 0], [-3, Y1 + 3, 0], [0, 0, Z1], [X1, Y1 + 28, TZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const plinth = solid(g);
  { const [r, i] = rings(-3, -3, X1 + 3, Y1 + 3, 3, 1.4); put(plinth, prism(P, front, r, i, 0, Z0)); }
  const body = solid(g);
  { const [r, i] = rings(0, 0, X1, Y1, 4, 1.6); put(body, prism(P, front, r, i, Z0, Z1)); }
  // the screen and the ticket slot, drawn on the front face (y = Y1)
  const face = (x0, z0, x1, z1, r) => poly(rrect(x0, z0, x1, z1, r, 4).map((s) => P(s.u, Y1, s.v)));
  mk("path", { class: "nf lo", d: face(6, 52, 34, 68, 2) + face(5, 32, 35, 36, 1) + face(TX[0] - 1, TZ - 1.4, TX[1] + 1, TZ + 1.6, 0.8) }, body.g);

  const buttons = [];
  for (let k = 0; k < N; k++) {
    const x0 = BX0 + k * BS;
    buttons.push({ k, x0, s: solid(g), d: tween(BD), last: NaN, cx: P(x0 + BW / 2, Y1 + BD, (BZ[0] + BZ[1]) / 2)[0] });
  }
  const ticket = solid(g), tl = tween(REST);
  let tLast = NaN;

  function drawButton(b, d) {
    if (d === b.last) return;
    b.last = d;
    const [r, i] = rings(b.x0, Y1 - 0.5, b.x0 + BW, Y1 + d, 1.4, Math.min(0.6, d / 2.5));
    put(b.s, prism(P, front, r, i, BZ[0], BZ[1]));
  }
  function drawTicket(l) {
    if (l === tLast) return;
    tLast = l;
    const [r, i] = rings(TX[0], Y1 - 1, TX[1], Y1 + l, 1, 0.5);
    put(ticket, prism(P, front, r, i, TZ - 0.4, TZ + 0.4));
  }

  const B = register(stage, (_dt, now) => {
    buttons.forEach((b) => drawButton(b, tval(b.d, now)));
    drawTicket(tval(tl, now));
    return buttons.some((b) => !tdone(b.d, now)) || !tdone(tl, now);
  });
  bag.add(B.unregister);

  // the hit: inside the kiosk's screen box, then the nearest resting button by screen x
  const box = [[0, 0, Z1], [X1, 0, Z1], [X1, Y1, Z0], [0, Y1, Z0], [X1, Y1, Z1], [0, Y1, Z1]].map((p) => P(...p));
  const bx = [Math.min(...box.map((p) => p[0])), Math.max(...box.map((p) => p[0]))];
  const by = [Math.min(...box.map((p) => p[1])), Math.max(...box.map((p) => p[1]))];
  function hit([sx, sy]) {
    if (sx < bx[0] || sx > bx[1] || sy < by[0] || sy > by[1]) return -1;
    let best = 0;
    buttons.forEach((b) => { if (Math.abs(b.cx - sx) < Math.abs(buttons[best].cx - sx)) best = b.k; });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    buttons.forEach((b, k) => {
      tset(b.d, k === a ? 0.8 : BD, now, 0);
      b.s.sil.classList.toggle("hi", k === a);
    });
    tset(tl, a < 0 ? REST : 12 + a * 5, now, a < 0 ? 0 : delay);
    ticket.sil.classList.toggle("hi", a < 0);
    read.textContent = a < 0 ? "rest" : "zone " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { delay = v; }, destroy: bag.dispose };
}

hairline({
  name: "ticketmachine",
  means: "A station ticket machine: the fare button under the pointer presses in and a ticket feeds out, longer for a farther zone.",
  rules: [1, 4, 5, 8],
  range: [0, 120, 240],
  tour: [[145, 149], [181, 167], [194, 174], null],
  mount,
});
