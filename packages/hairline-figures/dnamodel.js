/**
 * DNA model: a double helix on a stand, two backbones wound round one axis
 * with a ladder of rungs between them. The pointer's height sets the twist:
 * the helix winds on its spring to follow it, and the rung nearest the
 * pointer is bright. At rest the helix holds a turn and a half, one rung lit.
 * The slider is how far the twist can go, in half turns.
 *
 * The pattern: one value on a spring; the hit is the rungs' resting centres
 * on the axis, which never move.
 */
const { Cam, circ, clamp, facing, fit, open, prism, proj, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const R = 22, Z0 = 14, H = 104, N = 12, TW0 = 3 * Math.PI, FAV = 4, STEPS = 96;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-32, -32, 0], [32, 32, 0], [-32, 32, 0], [32, -32, 0], [-R, R, Z0 + H + 2], [R, -R, Z0 + H + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const ring = (r) => circ(r, 32);
  put(solid(g), prism(P, front, ring(32), ring(30.6), 0, 5));
  put(solid(g), prism(P, front, ring(3.2), ring(2.2), 5, Z0));
  const back = mk("path", { class: "nf lo" }, g);
  const rungs = Array.from({ length: N }, (_, k) => ({ k, z: Z0 + ((k + 0.5) / N) * H, el: mk("path", { class: "nf" }, g) }));
  const frontP = mk("path", { class: "nf sil" }, g);
  const tw = spring(TW0, { eps: 0.002 });
  let drawn = NaN;

  const pt = (th, z) => [R * Math.cos(th), R * Math.sin(th), z];
  const isFront = (th) => Math.cos(th) + Math.sin(th) > 0;
  function draw() {
    const t = tw.x;
    if (Math.abs(t - drawn) < 1e-4) return;
    drawn = t;
    let fd = "", bd = "";
    for (const off of [0, Math.PI]) {
      let run = [], side = null;
      const flush = () => { if (run.length > 1) { if (side) fd += open(run); else bd += open(run); } };
      for (let i = 0; i <= STEPS; i++) {
        const z = Z0 + (i / STEPS) * H, th = off + t * (i / STEPS), f = isFront(th);
        const p = P(...pt(th, z));
        if (side !== null && f !== side) { run.push(p); flush(); run = [p]; } else run.push(p);
        side = f;
      }
      flush();
    }
    frontP.setAttribute("d", fd); back.setAttribute("d", bd);
    for (const r of rungs) { const th = t * ((r.z - Z0) / H); r.el.setAttribute("d", seg(P(...pt(th, r.z)), P(...pt(th + Math.PI, r.z)))); }
  }
  const B = register(stage, (dt) => { const m = stepS(tw, dt); draw(); return m; });
  bag.add(B.unregister);

  const mids = rungs.map((r) => P(0, 0, r.z)), top = mids[N - 1][1], bot = mids[0][1];
  let act = -2;
  function setActive(a, sy) {
    tw.t = a < 0 ? TW0 : TW0 + amt * Math.PI * clamp((bot + top - 2 * sy) / (bot - top), -1, 1);
    if (a !== act) {
      act = a;
      rungs.forEach((r) => r.el.classList.toggle("hi", r.k === (a < 0 ? FAV : a)));
      read.textContent = a < 0 ? "rest" : "rung " + (a + 1);
    }
    B.wake();
  }
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[1] - sy); if (d < bd) { bd = d; best = k; } });
    return Math.abs(sx - mids[0][0]) < 46 && bd < 12 ? best : -1;
  }
  setActive(-1, 0);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p), p[1]), leave: () => setActive(-1, 0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act >= 0) B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "dnamodel",
  means: "A DNA double helix on a stand: it twists to follow the pointer's height, the rung nearest the pointer bright.",
  rules: [1, 4, 5, 8],
  range: [0.25, 0.75, 1],
  tour: [[200, 190], [200, 98], [200, 140], null],
  mount,
});
