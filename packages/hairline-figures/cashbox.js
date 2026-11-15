/**
 * Cash box: a metal box with a hinged lid and a coin tray of four wells.
 * When the pointer is over the box the lid swings open on its back hinge and
 * the coin stack in the well under the pointer rises, bright. At rest the
 * lid stands a little ajar, bright. The slider is the delay before it opens.
 */
const {
  Cam, circ, facing, fit, hull, poly, prism, proj, rad, rings, ringAt, rrect, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 92, Y1 = 54, H = 26, T = 4, W = 3, FL = H - 17, REST = 16, OPEN = 104;
const HS = [5, 9, 4, 7];
const disc = (x, y, r, n = 22) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let delay = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, 0, 0], [X1, Y1, 0], [X1, 0, 0], [0, Y1, 0], [0, -14, H + Y1 + 2], [X1, -14, H + Y1 + 2]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the well: tray floor, dividers and coin stacks, painted before the body that frames them
  const well = mk("g", {}, g);
  const fl = rrect(W, W, X1 - W, Y1 - W, 3, 4);
  mk("path", { class: "lo", d: poly(ringAt(P, fl, FL)) }, well);
  const cw = (X1 - 2 * W) / 4;
  let dv = "";
  for (let k = 1; k < 4; k++) { const x = W + k * cw; dv += seg(P(x, W, FL), P(x, Y1 - W, FL)) + seg(P(x, W, FL), P(x, W, FL + 12)); }
  mk("path", { class: "nf lo", d: dv }, well);
  const stacks = HS.map((h, k) => {
    const s = solid(well), x = W + (k + 0.5) * cw, y = Y1 / 2 + (k % 2 ? 4 : -3);
    return { s, x, y, h, z: tween(h), last: NaN };
  });

  // the body, with the opening cut through its top
  const [br, bi] = rings(0, 0, X1, Y1, 4, 1.4);
  const bp = prism(P, front, br, bi, 0, H);
  mk("path", { class: "sil", "fill-rule": "evenodd", d: bp.sil + " " + poly(ringAt(P, rrect(W, W, X1 - W, Y1 - W, 3, 4), H)) }, g);
  mk("path", { class: "nf lo", d: seg(P(X1 / 2 - 6, Y1, H - 6), P(X1 / 2 + 6, Y1, H - 6)) }, g);

  // the lid, turning about its back edge
  const lidG = mk("g", {}, g), lid = solid(lidG);
  const lo = rrect(0, 0, X1, Y1, 4, 4), li = rrect(2, 2, X1 - 2, Y1 - 2, 3, 4);
  const L = (q, d, a) => P(q.u, q.v * Math.cos(a) - d * Math.sin(a), H + 0.4 + q.v * Math.sin(a) + d * Math.cos(a));
  const ang = tween(REST);
  let lastA = NaN;

  function drawLid(deg) {
    if (deg === lastA) return;
    lastA = deg;
    const a = rad(deg), face = deg < 39 ? T : 0;
    lid.sil.setAttribute("d", poly(hull(lo.map((q) => L(q, 0, a)).concat(lo.map((q) => L(q, T, a))))));
    lid.cr.setAttribute("d", poly(li.map((q) => L(q, face, a))));
    lid.cr.setAttribute("class", "nf lo");
  }
  function drawStack(st, h) {
    if (h === st.last) return;
    st.last = h;
    put(st.s, prism(P, front, disc(st.x, st.y, 6.5), disc(st.x, st.y, 5), FL, FL + h));
  }

  const B = register(stage, (_dt, now) => {
    drawLid(tval(ang, now));
    let moving = !tdone(ang, now);
    for (const st of stacks) { drawStack(st, tval(st.z, now)); if (!tdone(st.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = stacks.map((st) => P(st.x, st.y, H)[0]);
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    if (x < -10 || x > X1 + 10 || y < -40 || y > Y1 + 10) return -1;
    let best = 0;
    mids.forEach((m, k) => { if (Math.abs(m - sx) < Math.abs(mids[best] - sx)) best = k; });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), was = act;
    act = a;
    tset(ang, a < 0 ? REST : OPEN, now, a >= 0 && was < 0 ? delay : 0);
    stacks.forEach((st, k) => {
      tset(st.z, k === a ? 15 : st.h, now, a >= 0 ? Math.abs(k - a) * 40 : 0);
      st.s.sil.classList.toggle("hi", k === a);
    });
    lid.sil.classList.toggle("hi", a < 0);
    read.textContent = a < 0 ? "rest" : "well " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { delay = v; }, destroy: bag.dispose };
}

hairline({
  name: "cashbox",
  means: "A cash box with a hinged lid: over it the lid swings open and the coin stack in the well under the pointer rises.",
  rules: [1, 4, 5, 6],
  range: [0, 60, 200],
  tour: [[150, 196], [190, 202], [236, 214], null],
  mount,
});
