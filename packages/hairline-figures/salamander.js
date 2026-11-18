/**
 * Salamander grill: a kitchen salamander, a low base with a grill rack on it,
 * a post at the back and a heavy heating head that rides up and down the
 * post above the rack. The pointer over the grill lifts the head up the post
 * and slides the rack forward to serve. At rest the head hangs low over the
 * rack, bright. The slider is how high the head lifts.
 *
 * The pattern: one part slides on a guide; the hit is the rest pose's box.
 */
const {
  Cam, clamp, fit, facing, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 60, Y1 = 40, BZ = 5, PZ = 64, HT = 11, REST_H = 17, TZ = 3, SLIDE = 0.35;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2.55);
  const box = [[0, 0, 0], [X1, 0, 0], [0, Y1 + 12, 0], [X1, Y1 + 12, 0], [0, 0, PZ], [X1, Y1, PZ], [X1, 0, PZ], [0, Y1, PZ]];
  fit(C, box, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the base, the post at the back
  const [br, bi] = rings(0, 0, X1, Y1, 5, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const [pr, pi] = rings(21, 0, 39, 8, 3, 1);
  put(solid(g), prism(P, front, pr, pi, BZ, PZ));
  mk("path", { class: "nf lo", d: seg(P(30, 8, BZ + 8), P(30, 8, PZ - 6)) }, g);

  // the rack, which slides forward
  const tray = solid(g), bars = mk("path", { class: "nf lo" }, g);
  // the head, painted last: it hangs in front of the post and over the rack
  const head = solid(g), hd = mk("path", { class: "nf" }, g);
  head.sil.classList.add("hi");

  let lastT = NaN;
  function drawTray(d) {
    if (d === lastT) return;
    lastT = d;
    const [tr, ti] = rings(6, 11 + d, X1 - 6, Y1 - 2 + d, 3, 1.2);
    put(tray, prism(P, front, tr, ti, BZ, BZ + TZ));
    let b = "";
    for (let x = 12; x <= X1 - 12; x += 6) b += seg(P(x, 13 + d, BZ + TZ), P(x, Y1 - 4 + d, BZ + TZ));
    b += seg(P(14, Y1 + 1 + d, BZ + 1.5), P(X1 - 14, Y1 + 1 + d, BZ + 1.5));
    bars.setAttribute("d", b);
  }
  let lastH = NaN;
  function drawHead(h) {
    if (h === lastH) return;
    lastH = h;
    const [hr, hi] = rings(2, 4, X1 - 2, Y1 + 1, 5, 1.6);
    put(head, prism(P, front, hr, hi, h, h + HT));
    const z = h + HT / 2, y = Y1 + 3.5;
    let d = seg(P(14, y, z), P(X1 - 14, y, z)) + seg(P(14, Y1 + 1, z), P(14, y, z)) + seg(P(X1 - 14, Y1 + 1, z), P(X1 - 14, y, z));
    for (let x = 12; x <= X1 - 12; x += 6) d += seg(P(x, 12, h + HT), P(x, 20, h + HT));
    hd.setAttribute("d", d);
  }

  const hz = tween(REST_H), ty = tween(0);
  const B = register(stage, (_dt, now) => {
    drawTray(tval(ty, now));
    drawHead(tval(hz, now));
    return !tdone(hz, now) || !tdone(ty, now);
  });
  bag.add(B.unregister);

  // the hit: the screen box of the grill's rest pose, which never moves
  const sp = box.map((p) => P(...p));
  const bx = [Math.min(...sp.map((p) => p[0])), Math.max(...sp.map((p) => p[0])), Math.min(...sp.map((p) => p[1])), Math.max(...sp.map((p) => p[1]))];
  const hit = ([x, y]) => x > bx[0] - 4 && x < bx[1] + 4 && y > bx[2] - 4 && y < bx[3] + 4;

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    const now = performance.now(), L = clamp(lift, 0, 34);
    tset(hz, on ? REST_H + L : REST_H, now, 0);
    tset(ty, on ? L * SLIDE : 0, now, on ? 60 : 0);
    read.textContent = on ? "up " + Math.round(L) : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "salamander",
  means: "A kitchen salamander grill: over it, the heating head rides up its post and the rack slides forward to serve.",
  rules: [1, 4, 5, 8],
  range: [14, 26, 34],
  tour: [[207, 171], [178, 230], [240, 75], null],
  mount,
});
