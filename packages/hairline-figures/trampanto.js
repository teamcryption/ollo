/**
 * Tram pantograph: a tram body with a roof deck, and on it a single-arm
 * pantograph, a lower arm and an upper arm meeting at a knee, carrying a
 * collector head across the roof under an overhead wire. At rest the
 * pantograph is folded down on the roof, its head bright. The pointer over
 * the tram raises it: the knee swings and the head climbs to the wire. The
 * slider is how high it reaches.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X0 = -40, X1 = 40, YW = 12, ZB = 24, ZR = 27, BX = -10, HX = -10, L = 26, REST = 7, WIRE = 75;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[X0, -YW, 0], [X1, YW, 0], [X0, YW, 0], [X1, -YW, 0], [-60, 0, WIRE], [56, 0, WIRE]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the wire, drawn behind everything
  mk("path", { class: "nf lo", d: seg(P(-60, 0, WIRE), P(56, 0, WIRE)) + seg(P(-60, 0, WIRE + 6), P(56, 0, WIRE + 6)) }, g);
  // the body and its windows, the roof deck
  const body = solid(g);
  const [r0, i0] = rings(X0, -YW, X1, YW, 8, 1.4);
  put(body, prism(P, front, r0, i0, 0, ZB));
  let win = "";
  for (let k = 0; k < 5; k++) {
    const x = X0 + 8 + k * 13.5;
    win += poly([P(x, YW, 9), P(x + 10, YW, 9), P(x + 10, YW, 19), P(x, YW, 19)]);
  }
  win += seg(P(X0 + 4, YW, 5), P(X1 - 4, YW, 5));
  mk("path", { class: "nf lo", d: win }, body.g);
  const roof = solid(g);
  const [r1, i1] = rings(X0 + 6, -YW + 3, X1 - 6, YW - 3, 5, 1);
  put(roof, prism(P, front, r1, i1, ZB, ZR));
  const base = solid(g);
  const [r2, i2] = rings(BX - 4, -7, BX + 4, 7, 2, 0.8);
  put(base, prism(P, front, r2, i2, ZR, ZR + 3));

  const lower = mk("path", { class: "sil" }, g), lowerB = mk("path", { class: "sil" }, g);
  const upper = mk("path", { class: "sil" }, g);
  const head = solid(g);
  head.sil.classList.add("hi");
  const h = tween(REST);
  let last = NaN;

  function rod(A, B, w) {
    const a = P(...A), b = P(...B), pts = [];
    for (let i = 0; i < 12; i++) {
      const t = (i / 12) * Math.PI * 2;
      pts.push([a[0] + w * Math.cos(t), a[1] + w * Math.sin(t)], [b[0] + w * Math.cos(t), b[1] + w * Math.sin(t)]);
    }
    return poly(hull(pts));
  }
  function draw(H) {
    if (H === last) return;
    last = H;
    const z0 = ZR + 3, zh = z0 + H, a = Math.asin(clamp(H / (2 * L), 0, 1));
    const kx = BX + L * Math.cos(a), kz = z0 + H / 2;
    lowerB.setAttribute("d", rod([BX, -5, z0], [kx, -1, kz], 1.6));
    lower.setAttribute("d", rod([BX, 5, z0], [kx, 1, kz], 1.6));
    upper.setAttribute("d", rod([kx, 0, kz], [HX, 0, zh], 1.4));
    const [rh, ih] = rings(HX - 2.4, -17, HX + 2.4, 17, 1.6, 0.6);
    put(head, prism(P, front, rh, ih, zh, zh + 2.6));
  }

  const B = register(stage, (_dt, now) => { draw(tval(h, now)); return !tdone(h, now); });
  bag.add(B.unregister);

  // the hit: a fixed screen box around the tram and the space under the wire, from the rest pose
  const box = [P(X0, YW, 0), P(X1, YW, 0), P(X1, -YW, 0), P(-60, 0, WIRE), P(56, 0, WIRE), P(X0, -YW, ZB)];
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const bx0 = Math.min(...xs), bx1 = Math.max(...xs), by0 = Math.min(...ys), by1 = Math.max(...ys);
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(h, v ? WIRE - ZR - 3 - 2.6 - (41 - reach) : REST, performance.now(), 0);
    read.textContent = v ? "up " + Math.round(reach) : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setOn(sx > bx0 && sx < bx1 && sy > by0 && sy < by1),
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = clamp(v, 16, 41); if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "trampanto",
  means: "A tram's pantograph folded on its roof: the pointer over the tram raises the arms and the head climbs to the overhead wire.",
  rules: [1, 3, 5, 8],
  range: [16, 34, 41],
  tour: [[180, 165], [210, 150], [240, 175], null],
  mount,
});
