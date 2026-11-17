/**
 * SD card slot: a small card reader with an SD card sitting in its front
 * slot, partly out. At rest the card stands a little proud, bright. The
 * pointer over the reader ejects the card: it slides out of the slot until
 * only its notched end stays inside. The slider is how far it slides.
 *
 * The pattern: one part sliding out of a body.
 */
const {
  Cam, fit, hull, poly, prism, proj, rings, rrect, seg, clamp, lerp, tween, tset, tval, tdone, fillet,
  disposer, mk, pointer, put, register, solid, facing, unproj,
} = HL;

const RW = 46, RD = 26, RH = 15, YF = RD;
const CX0 = 7, CX1 = 39, CL = 44, CT = 2.6, CZ = 6.2, REST = 15;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 4.3);
  fit(C, [[0, 0, 0], [RW, 0, 0], [0, RD + CL, 0], [RW, RD + CL, 0], [0, 0, RH], [RW, RD, RH]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [rr, ri] = rings(0, 0, RW, RD, 6, 1.8);
  put(solid(g), prism(P, front, rr, ri, 0, RH));
  // the slot on the front face, and a status light on the top
  mk("path", { d: poly(rrect(CX0 - 2, CZ - 1.2, CX1 + 2, CZ + CT + 1.2, 1.2, 3).map((q) => P(q.u, YF, q.v))), class: "nf lo" }, g);
  mk("path", { d: poly(rrect(RW - 12, RD - 7, RW - 8, RD - 5, 1, 2).map((q) => P(q.u, q.v, RH))), class: "nf lo" }, g);

  const card = solid(g);
  card.sil.classList.add("hi");
  const ribs = mk("path", { class: "nf lo" }, g);
  const out = tween(REST);
  let last = NaN;
  function draw(o) {
    if (o === last) return;
    last = o;
    const y1 = YF + o, y0 = y1 - CL, cut = 6;
    // footprint with the notched corner at the inner end, clipped at the slot
    const raw = [[CX0, y0], [CX1 - cut, y0], [CX1, y0 + cut], [CX1, y1], [CX0, y1]];
    const fp = fillet(raw, [1.2, 1.2, 1.2, 2, 2], 3).map(([x, y]) => [x, Math.max(y, YF)]);
    const pts = fp.map(([x, y]) => P(x, y, CZ)).concat(fp.map(([x, y]) => P(x, y, CZ + CT)));
    const inner = fp.map(([x, y]) => [clamp(x, CX0 + 1.4, CX1 - 1.4), y < y1 - 1 ? y : y1 - 1.4]);
    put(card, { sil: poly(hull(pts)), crease: poly(inner.map(([x, y]) => P(x, y, CZ + CT))) });
    let d = "";
    for (let k = 0; k < 4; k++) { const yy = y1 - 3.5 - k * 2.2; if (yy > YF + 1) d += seg(P(CX0 + 9, yy, CZ + CT), P(CX1 - 9, yy, CZ + CT)); }
    ribs.setAttribute("d", d);
  }
  const B = register(stage, (_dt, now) => { draw(tval(out, now)); return !tdone(out, now); });
  bag.add(B.unregister);

  let on = null;
  const far = () => lerp(REST + 6, CL - 4, reach);
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(out, v ? far() : REST, performance.now(), 0);
    read.textContent = v ? "eject" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [x, y] = unproj(C, sx, sy, 0);
      setOn(x > -24 && x < RW + 8 && y > -24 && y < RD + CL + 6);
    },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = clamp(v, 0, 1); if (on) { tset(out, far(), performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "sdcard",
  means: "An SD card in a reader's slot: the pointer ejects the card, sliding it out until only its notched end stays in.",
  rules: [1, 3, 5, 6],
  range: [0.2, 0.8, 1],
  tour: [[197, 152], [180, 200], [194, 262], null],
  mount,
});
