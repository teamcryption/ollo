/**
 * Keyboard stand: a synth keyboard on an X stand, two scissor frames under
 * it. The pointer's height says how high to play: the scissors open, their
 * feet draw in, and the keyboard rises; low, they spread and it sinks. At
 * rest the stand sits low and the black keys are bright. The slider is how
 * far the scissors may open.
 *
 * The pattern: a continuous value (a spring on one angle) read from the
 * pointer's screen height against fixed bands, never the moving parts.
 */
const {
  Cam, clamp, fit, facing, hull, open, poly, proj, rad, rings, ringAt, run, seg, spring, stepS,
  disposer, mk, pointer, register,
} = HL;

const LB = 64, FX = 30, KX = 48, KY = 13, KH = 6, A0 = rad(40), SPAN = rad(32), AMAX = rad(78);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  const hiZ = LB * Math.sin(AMAX) + KH, sp = (LB / 2) * Math.cos(A0);
  fit(C, [[-KX, -sp, 0], [KX, sp, 0], [KX, -sp, 0], [-KX, sp, 0], [-KX, -KY, hiZ], [KX, KY, hiZ]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const far = mk("path", { class: "nf sil" }, g), near = mk("path", { class: "nf sil" }, g);
  const kb = mk("path", { class: "sil" }, g), cr = mk("path", { class: "nf lo" }, g);
  const whites = mk("path", { class: "nf lo" }, g), blacks = mk("path", { class: "nf" }, g);
  const [ring, inner] = rings(-KX, -KY, KX, KY, 3, 1.4);
  const a = spring(A0);
  let last = NaN, over = false, lastT = null;

  function frame(x, an) {
    const s = (LB / 2) * Math.cos(an), h = LB * Math.sin(an);
    return seg(P(x, -s, 0), P(x, s, h)) + seg(P(x, s, 0), P(x, -s, h)) + seg(P(x, -s - 4, 0), P(x, -s + 4, 0)) + seg(P(x, s - 4, 0), P(x, s + 4, 0));
  }

  function draw() {
    const an = a.x;
    if (an === last) return;
    last = an;
    const h = LB * Math.sin(an), z1 = h + KH;
    far.setAttribute("d", frame(-FX, an));
    near.setAttribute("d", frame(FX, an));
    kb.setAttribute("d", poly(hull(ringAt(P, ring, h).concat(ringAt(P, ring, z1)))));
    cr.setAttribute("d", open(ringAt(P, run(inner, front), z1)));
    let w = "", b = "";
    for (let i = 0; i <= 26; i++) {
      const x = -KX + 6 + i * ((2 * KX - 12) / 26);
      w += seg(P(x, -1, z1), P(x, KY - 2, z1));
      if ([0, 1, 3, 4, 5].includes(i % 7) && i < 26) b += seg(P(x + 1.6, -1, z1), P(x + 1.6, 5, z1));
    }
    whites.setAttribute("d", w + seg(P(-KX + 6, -1, z1), P(KX - 6, -1, z1)));
    blacks.setAttribute("d", b);
  }

  const B = register(stage, (dt) => { const m = stepS(a, dt); draw(); return m; });
  bag.add(B.unregister);

  // fixed bands: the stand's rest footprint on screen, top to bottom
  const yTop = P(0, 0, hiZ)[1], yBot = P(0, 0, 0)[1];
  function target(sy) { return clamp((yBot - sy) / (yBot - yTop), 0, 1); }

  function retarget(t) {
    lastT = t;
    over = t !== null;
    a.t = over ? Math.min(AMAX, A0 + t * SPAN * reach) : A0;
    blacks.setAttribute("class", over ? "nf" : "nf hi");
    kb.setAttribute("class", over ? "sil hi" : "sil");
    read.textContent = over ? `h ${Math.round(LB * Math.sin(a.t) + KH)}` : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { retarget(Math.abs(p[0] - 200) > 150 ? null : target(p[1])); },
    leave: () => retarget(null),
  }));
  bag.add(() => svg.replaceChildren());
  retarget(null);
  return { set: (v) => { reach = v; retarget(lastT); }, destroy: bag.dispose };
}

hairline({
  name: "keytar",
  means: "A synth keyboard on an X stand: the pointer's height opens the scissor frames and the keyboard rises or sinks with them.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1.4],
  tour: [[200, 108], [200, 200], [200, 88], null],
  mount,
});
