/**
 * Button badge press: a base plate with a die cup, a post at the back and a
 * long lever pivoting on the post. A ram hangs from the lever over the die.
 * The pointer pulls the handle down by how low it stands: the lever swings
 * down and drives the ram into the die. At rest the lever is raised and the
 * die cup's rim is bright. The slider is how far the lever swings.
 *
 * The pattern: one lever on a spring (aim).
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rad, rings, ringAt, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PX = 13, PY = 20, PZ = 62, L = 82, RX = 38, RAM = 38, REST = 35, KR = 5;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 2.25);
  const tip = (a) => [PX + L * Math.cos(rad(a)), PY, PZ + L * Math.sin(rad(a))];
  const t0 = tip(REST), t1 = tip(REST - 60);
  fit(C, [[0, 0, 0], [56, 40, 0], [56, 0, 0], [0, 40, 0], [t0[0], PY, t0[2] + KR], [t1[0] + KR, PY, t1[2] - KR], [PX, PY, PZ + 6]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [br, bi] = rings(0, 0, 56, 40, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, 4));
  const [cr, ci] = rings(PX - 6, PY - 7, PX + 6, PY + 7, 4, 1.4);
  put(solid(g), prism(P, front, cr, ci, 4, PZ + 4));
  const die = solid(g);
  put(die, prism(P, front, disc(RX, PY, 11), disc(RX, PY, 8.5), 4, 12));
  die.sil.classList.add("hi");
  const ram = solid(g), rod = mk("path", { class: "lo nf" }, g);
  const lever = mk("path", { class: "sil" }, g), lcr = mk("path", { class: "lo nf" }, g);
  const knob = mk("path", { class: "sil" }, g);
  const pin = mk("path", { class: "nf" }, g);

  const sp = spring(0);
  let last = NaN;
  function draw(f) {
    if (f === last) return;
    last = f;
    const a = rad(REST - swing * f), ca = Math.cos(a), sa = Math.sin(a);
    const at = (s, t, w) => P(PX + s * ca - t * sa, PY + w, PZ + s * sa + t * ca);
    const pts = [];
    for (const s of [-4, L]) for (const w of [-3.5, 3.5]) for (let i = 0; i < 12; i++) {
      const q = (i / 12) * Math.PI * 2;
      pts.push(at(s + 3 * Math.cos(q), 3 * Math.sin(q), w));
    }
    lever.setAttribute("d", poly(hull(pts)));
    lcr.setAttribute("d", open([at(2, 2.2, -1.5), at(L - 4, 2.2, -1.5)]));
    const kc = [PX + L * ca, PY, PZ + L * sa], kp = [];
    for (let i = 0; i <= 6; i++) {
      const t = (i / 6) * Math.PI - Math.PI / 2;
      kp.push(...ringAt(P, disc(kc[0], kc[1], KR * Math.cos(t) + 0.01, 20), kc[2] + KR * Math.sin(t)));
    }
    knob.setAttribute("d", poly(hull(kp)));
    const top = PZ + (RX - PX) * Math.tan(a);
    put(ram, prism(P, front, disc(RX, PY, 7.5), disc(RX, PY, 5.5), top - RAM, top - 6));
    rod.setAttribute("d", seg(P(RX, PY, top - 6), P(RX, PY, top)));
    pin.setAttribute("d", poly(hull(ringAt(P, disc(PX, PY, 2.4, 16), PZ + 3).concat(ringAt(P, disc(PX, PY, 2.4, 16), PZ + 6)))));
    const on = f > 0.02;
    die.sil.classList.toggle("hi", !on);
    lever.classList.toggle("hi", on);
    knob.classList.toggle("hi", on);
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  function aim(p) {
    const y0 = P(...tip(REST))[1], y1 = P(...tip(REST - swing))[1];
    const f = p ? clamp((p[1] - y0) / (y1 - y0), 0, 1) : 0;
    sp.t = f;
    read.textContent = p ? Math.round(f * swing) + "°" : "rest";
    B.wake();
  }
  draw(0);
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { swing = v; last = NaN; draw(sp.x); }, destroy: bag.dispose };
}

hairline({
  name: "buttonpress",
  means: "A badge button press: the pointer pulls the lever handle down, and the ram drives into the die cup.",
  rules: [1, 3, 5, 8],
  range: [25, 50, 60],
  tour: [[270, 100], [289, 202], [280, 150], null],
  mount,
});
