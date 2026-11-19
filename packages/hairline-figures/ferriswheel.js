/**
 * Ferris wheel: a spoked wheel on an A-frame stand over a round platform,
 * six pods hanging level from its rim. The pointer's place across the frame
 * turns the wheel on a spring; the pods swing round with it and stay upright.
 * One pod is bright, the one being boarded. The slider is how far it turns.
 *
 * The pattern: one continuous value from the pointer (spring).
 */
const {
  Cam, fit, facing, prism, proj, rings, rrect, seg, poly, spring, stepS, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 40, HW = 4, CZ = R + 18, NP = 6, NS = 12, PR = 4.5, PH = 8, REST = 0.35, Q = Math.SQRT1_2;
// local u runs across the wheel's face, w along its axle
const W = (u, w, z) => [(u + w) * Q, (w - u) * Q, z];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [W(-R - 6, 0, 0), W(R + 6, 0, 0), W(0, -34, 0), W(0, 34, 0), W(0, 0, CZ + R + 2)], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const BR = 34;
  put(solid(g), prism(P, front, rrect(-BR, -BR, BR, BR, BR, 14), rrect(-BR + 1.6, -BR + 1.6, BR - 1.6, BR - 1.6, BR - 1.6, 14), 0, 3));
  const legs = (w) => seg(P(...W(-26, w, 3)), P(...W(0, w, CZ))) + seg(P(...W(26, w, 3)), P(...W(0, w, CZ)));
  const loop = (w, r) => { const o = []; for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2; o.push(P(...W(r * Math.cos(a), w, CZ + r * Math.sin(a)))); } return o; };
  mk("path", { d: legs(-HW - 4), class: "nf" }, g);
  const far = mk("path", { class: "nf lo" }, g);
  far.setAttribute("d", poly(loop(-HW, R)));
  const farSp = mk("path", { class: "nf lo" }, g);
  const hang = mk("path", { class: "nf lo" }, g);
  const pods = [];
  for (let k = 0; k < NP; k++) pods.push(solid(g));
  const near = mk("path", { class: "nf sil" }, g);
  near.setAttribute("d", poly(loop(HW, R)) + poly(loop(HW, R * 0.62)));
  const nearSp = mk("path", { class: "nf" }, g);
  mk("path", { d: legs(HW + 4) + seg(P(...W(0, -HW - 4, CZ)), P(...W(0, HW + 4, CZ))), class: "nf" }, g);
  const hub = solid(g);
  pods[0].sil.classList.add("hi");

  const sp = spring(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    let fs = "", ns = "", hs = "";
    for (let i = 0; i < NS; i++) {
      const a = t + (i / NS) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
      fs += seg(P(...W(0, -HW, CZ)), P(...W(R * c, -HW, CZ + R * s)));
      ns += seg(P(...W(0, HW, CZ)), P(...W(R * c, HW, CZ + R * s)));
    }
    farSp.setAttribute("d", fs); nearSp.setAttribute("d", ns);
    for (let k = 0; k < NP; k++) {
      const a = t + (k / NP) * Math.PI * 2, u = R * Math.cos(a), z = CZ + R * Math.sin(a);
      const [x, y] = W(u, 0, 0);
      hs += seg(P(...W(u, -HW, z)), P(...W(u, HW, z))) + seg(P(...W(u, 0, z)), P(...W(u, 0, z - 2)));
      const [r, i] = rings(x - PR, y - PR, x + PR, y + PR, PR, 1);
      put(pods[k], prism(P, front, r, i, z - 2 - PH, z - 2));
    }
    hang.setAttribute("d", hs);
    put(hub, { sil: poly(loop(HW + 1, 3.2)), crease: "" });
  }

  const B = register(stage, (dt) => { const mv = stepS(sp, dt); draw(sp.x); return mv; });
  bag.add(B.unregister);
  function move([sx]) {
    const u = clamp((sx - 200) / 150, -1, 1);
    sp.t = REST - u * Math.PI * (0.35 + 0.65 * reach);
    read.textContent = "turn " + Math.round(u * (0.35 + 0.65 * reach) * 180) + "°";
    B.wake();
  }
  bag.add(pointer(stage, { move, leave: () => { sp.t = REST; read.textContent = "rest"; B.wake(); } }));
  read.textContent = "rest";
  draw(REST);
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "ferriswheel",
  means: "A Ferris wheel on its stand: the pointer's place across the frame turns the wheel on a spring, its pods swinging round upright.",
  rules: [3, 5, 8],
  range: [0, 0.5, 1],
  tour: [[291, 166], [78, 129], [322, 129], null],
  mount,
});
