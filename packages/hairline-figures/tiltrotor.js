/**
 * Tiltrotor: a twin-rotor aircraft whose engine nacelles pivot at the
 * wingtips. At rest the nacelles lean forward, rotors almost upright for
 * cruise; the pointer over the aircraft tilts them up into hover, the rotor
 * discs turning flat overhead. The slider is how far they tilt.
 */
const {
  Cam, fit, hull, poly, proj, rings, prism, facing, rad, seg, tset, tval, tdone, tween, unproj,
  disposer, mk, pointer, register, solid, put,
} = HL;

const PX = 66, PZ = 26, WY = 64, RR = 32, A0 = 18;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.45);
  const ax = (a) => [Math.cos(rad(a)), Math.sin(rad(a))];
  const disc = (y, a, R, off) => {
    const [c, s] = ax(a), cx = PX + off * c, cz = PZ + off * s, out = [];
    for (let i = 0; i < 28; i++) { const t = (i / 28) * Math.PI * 2; out.push([cx - R * Math.sin(t) * s, y + R * Math.cos(t), cz + R * Math.sin(t) * c]); }
    return out;
  };
  const ext = [];
  for (const y of [-WY, WY]) for (const a of [0, 100]) ext.push(...disc(y, a, RR, 24));
  ext.push([0, 0, 0], [140, 0, 0], [6, 0, 44]);
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1, parent) => { const s = solid(parent); const [rg, inn] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, rg, inn, z0, z1)); return s; };
  // one engine: nacelle body, rotor disc and three blades
  const engine = (y) => {
    const e = mk("g", {}, g);
    return { y, nac: mk("path", { class: "sil" }, e), cap: mk("path", { class: "nf lo" }, e), rot: mk("path", { class: "nf" }, e), bl: mk("path", { class: "nf lo" }, e) };
  };
  const far = engine(-WY);
  // tail: twin fins on a stabiliser, then fuselage, wing
  box(2, -6, 26, 6, 3, 1.2, 8, 30, g);
  const finA = box(4, -26, 18, -23, 1.5, 0.6, 26, 46, g);
  box(4, -26, 20, 26, 3, 1, 26, 29, g);
  box(0, -11, 142, 11, 10, 2, 6, 28, g);
  box(118, -9, 138, 9, 7, 1.6, 28, 32, g);
  box(56, -WY, 76, WY, 4, 1.4, 28, 31, g);
  box(4, 23, 18, 26, 1.5, 0.6, 26, 46, g);
  const near = engine(WY);
  void finA;
  const tw = tween(A0);
  let last = NaN;
  function drawEngine(E, a) {
    const [c, s] = ax(a), body = [];
    for (const off of [-12, 20]) body.push(...disc(E.y, a, 7, off).map((p) => P(...p)));
    E.nac.setAttribute("d", poly(hull(body)));
    E.cap.setAttribute("d", poly(disc(E.y, a, 5, 20).map((p) => P(...p))));
    const rim = disc(E.y, a, RR, 24);
    E.rot.setAttribute("d", poly(rim.map((p) => P(...p))));
    const hub = P(PX + 24 * c, E.y, PZ + 24 * s);
    let d = "";
    for (const i of [3, 12, 22]) d += seg(hub, P(...rim[i]));
    E.bl.setAttribute("d", d);
  }
  function draw(a) {
    if (a === last) return;
    last = a;
    drawEngine(far, a);
    drawEngine(near, a);
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? A0 + maxA : A0, performance.now(), 0);
    near.rot.classList.toggle("hi", true);
    far.rot.classList.toggle("hi", on);
    read.textContent = on ? "tilt " + Math.round(A0 + maxA) + "°" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 28);
    return (x > -4 && x < 146 && Math.abs(y) < 14) || (x > 40 && x < 96 && Math.abs(y) < WY + 12);
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { maxA = v; if (act) { tset(tw, A0 + v, performance.now(), 0); read.textContent = "tilt " + Math.round(A0 + v) + "°"; } B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "tiltrotor",
  means: "A tiltrotor aircraft: the pointer tilts both wingtip nacelles up from cruise into hover, the rotor discs turning flat.",
  rules: [1, 3, 5, 6],
  range: [40, 72, 82],
  tour: [[154, 199], [196, 172], [232, 160], null],
  mount,
});
