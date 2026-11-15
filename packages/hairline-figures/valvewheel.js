/**
 * Valve wheel: a gate valve on a flanged pipe, its bonnet, the threaded stem
 * and the hand wheel on top. The pointer's screen x is how far the valve is
 * open: the wheel turns and climbs the stem as it opens. At rest it sits a
 * third open, the knob on the rim bright; when the pointer turns it, the rim
 * takes the bright. The slider is how many turns the full travel takes.
 *
 * The pattern: a continuous input (screen x, which never moves) on one spring.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, ringAt, run, open, seg, spring, stepS,
  clamp, disposer, mk, pointer, put, register, solid,
} = HL;

const WR = 24, Z0 = 50, LIFT = 22, REST = 0.3;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[-46, -14, 0], [46, 14, 0], [-46, 14, 22], [46, -14, 22], [-WR, -WR, Z0 + LIFT + 9], [WR, WR, Z0 + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  let turns = value;

  // pipe, flanges, body, bonnet: far to near
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  box(-46, -12, -40, 12, 3, 1, 0, 22);
  box(-40, -8, 40, 8, 4, 1.2, 3, 19);
  box(-14, -14, 14, 14, 5, 1.5, 0, 28);
  box(40, -12, 46, 12, 3, 1, 0, 22);
  box(-8, -8, 8, 8, 3, 1.2, 28, 40);
  for (const [x, y] of [[-43, -9], [-43, 9], [43, -9], [43, 9]]) mk("path", { class: "nf lo", d: seg(P(x, y, 22), P(x, y, 22.6)) + seg(P(x - 1, y, 22), P(x + 1, y, 22)) }, g);

  const stem = solid(g);
  const wg = mk("g", {}, g);
  const spokes = mk("path", { class: "nf sil", d: "" }, wg);
  const hub = solid(wg);
  const rim = solid(wg);
  rim.sil.classList.add("nf");
  const rimFront = mk("path", { class: "nf lo", d: "" }, wg);
  const knob = solid(wg);
  const O = circ(WR, 56), I = circ(WR - 3, 56);

  const sp = spring(REST, { k: 100, c: 18 });
  let drawn = NaN, active = false;
  function draw() {
    const t = sp.x;
    if (Math.abs(t - drawn) < 1e-4) return;
    drawn = t;
    const z = Z0 + LIFT * t, a = t * Math.PI * 2 * turns;
    put(stem, prism(P, front, circ(1.8, 16), null, 40, z + 1));
    let d = "";
    for (let k = 0; k < 4; k++) {
      const b = a + (k * Math.PI) / 2, c = Math.cos(b), s = Math.sin(b);
      d += seg(P(4 * c, 4 * s, z + 1.5), P((WR - 2) * c, (WR - 2) * s, z + 1.5));
    }
    spokes.setAttribute("d", d);
    put(hub, prism(P, front, circ(4.5, 24), circ(3.3, 24), z, z + 4));
    put(rim, prism(P, front, O, I, z, z + 3));
    rimFront.setAttribute("d", open(ringAt(P, run(O, front), z + 3)));
    const kc = Math.cos(a + 0.4) * (WR - 1.5), ks = Math.sin(a + 0.4) * (WR - 1.5);
    put(knob, prism(P, front, disc(kc, ks, 2.2, 16), disc(kc, ks, 1.4, 16), z + 3, z + 10));
    // the knob is painted behind the rim when it stands on the far side
    if (kc + ks < 0) rim.g.before(knob.g); else rimFront.after(knob.g);
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function mark() {
    rim.sil.classList.toggle("hi", active);
    knob.sil.classList.toggle("hi", !active);
    read.textContent = active ? Math.round(sp.t * 100) + "%" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { active = true; sp.t = clamp((p[0] - 90) / 220, 0, 1); mark(); },
    leave: () => { active = false; sp.t = REST; mark(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw(); mark();
  return { set: (v) => { turns = v; drawn = NaN; draw(); }, destroy: bag.dispose };
}

hairline({
  name: "valvewheel",
  means: "A gate valve: the pointer's x opens it, and the hand wheel turns and climbs its stem; the rim is bright while it turns.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.5],
  tour: [[140, 180], [300, 150], [235, 118], null],
  mount,
});
