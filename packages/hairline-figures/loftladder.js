/**
 * Loft ladder: a hatch in the ceiling with its door hanging half open. The
 * pointer on the floor below calls the ladder down: the door swings to its
 * full angle and the ladder slides out of its end, one section for a far
 * pointer, all three when the pointer stands at the foot. At rest the door
 * hangs ajar, bright. The slider is the door's open angle.
 *
 * The pattern: one part swinging, a second sliding out of it.
 */
const {
  Cam, fit, open, poly, proj, rings, prism, facing, rrect, ringAt, unproj, rad, clamp,
  tween, tset, tval, tdone, disposer, mk, pointer, put, register, solid, seg,
} = HL;

const H = 70, DL = 40, DW = 24, REST = 34;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let ang = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-14, -14, 0], [70, 40, 0], [70, -14, 0], [-14, 40, 0], [-10, -8, H], [50, 32, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-14, -14, 70, 40, 8, 2);
  put(solid(g), prism(P, front, fr, fi, -4, 0));
  // the hatch: its trim and its opening, in the ceiling line
  mk("path", { d: poly(ringAt(P, rrect(-8, -6, DL + 8, DW + 6, 4, 4), H)), class: "nf lo" }, g);
  mk("path", { d: poly(ringAt(P, rrect(0, 0, DL, DW, 1, 2), H)), class: "nf" }, g);
  const door = mk("path", { class: "sil" }, g), doorT = mk("path", { class: "nf lo" }, g);
  const rungs = mk("path", { class: "nf lo" }, g), rails = mk("path", { class: "nf sil" }, g);

  const a = tween(REST), e = tween(0);
  let last = "";
  function draw(A, E) {
    const key = A.toFixed(2) + "," + E.toFixed(2);
    if (key === last) return;
    last = key;
    const c = Math.cos(rad(A)), s = Math.sin(rad(A));
    const at = (t, y, dz = 0) => P(t * c, y, H - t * s + dz);
    door.setAttribute("d", poly([at(0, 1), at(0, DW - 1), at(DL, DW - 1), at(DL, 1)]));
    doorT.setAttribute("d", open([at(DL, 1), at(DL, 1, -1.6), at(DL, DW - 1, -1.6), at(DL, DW - 1)]));
    let rd = "", rr = "";
    const end = DL + E;
    for (const y of [5, DW - 5]) rr += open([at(DL * 0.35, y, 1), at(end, y, 1)]);
    for (let t = DL * 0.35 + 6; t < end - 1; t += 9) rd += seg(at(t, 5, 1), at(t, DW - 5, 1));
    rails.setAttribute("d", rr);
    rungs.setAttribute("d", rd);
  }

  const B = register(stage, (_dt, now) => {
    draw(tval(a, now), tval(e, now));
    return !(tdone(a, now) && tdone(e, now));
  });
  bag.add(B.unregister);

  const foot = () => [H / Math.tan(rad(ang)), DW / 2];
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (x < -14 || x > 70 || y < -14 || y > 40) return -1;
    const [fx, fy] = foot(), d = Math.hypot(x - fx, y - fy);
    return d < 18 ? 3 : d < 34 ? 2 : 1;
  }

  let act = -2;
  function setActive(k) {
    if (k === act) return;
    act = k;
    const now = performance.now(), full = H / Math.sin(rad(ang)) - DL;
    tset(a, k < 0 ? REST : ang, now, 0);
    tset(e, k < 0 ? 0 : clamp(full * k / 3, 0, full), now, k < 0 ? 0 : 90);
    door.classList.toggle("hi", k < 0);
    rails.classList.toggle("hi", k >= 0);
    read.textContent = k < 0 ? "rest" : k + "/3";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { ang = v; last = ""; act = -2; setActive(-1); }, destroy: bag.dispose };
}

hairline({
  name: "loftladder",
  means: "A ceiling hatch with its door ajar: the pointer on the floor swings it open and slides the ladder down, section by section.",
  rules: [1, 3, 5, 8],
  range: [52, 60, 68],
  tour: [[113, 216], [284, 237], [220, 236], null],
  mount,
});
