/**
 * Driveway gate: a barred sliding gate on a ground track between two posts.
 * The pointer's place along the drive slides the gate open past the far
 * post, on a spring. At rest the gate stands a little ajar and the latch on
 * the near post is bright. The slider is how far the gate can travel.
 *
 * The pattern: one continuous value from the pointer's screen x, mapped
 * against fixed rest points, so the moving gate never shifts the hit.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 70, GY0 = -6, GY1 = -2.5, REST = 12, H = 50;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let travel = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-4, -10, 0], [154, -10, 0], [154, 8, 0], [-4, 8, 0], [0, 0, H + 6], [150, -6, H]], 200, 168);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const track = mk("path", { class: "dash" }, g);
  track.setAttribute("d", seg(P(-2, (GY0 + GY1) / 2, 0), P(152, (GY0 + GY1) / 2, 0)));
  const [tr, ti] = rings(-2, GY0 - 1, 152, GY1 + 1, 1, 0.5);
  put(solid(g), prism(P, front, tr, ti, 0, 1.2));

  // gate: two rails, two stiles and bars; redrawn when its offset changes
  const gg = mk("g", {}, g);
  const BARS = [];
  for (let x = 10; x < L - 4; x += 8) BARS.push(x);
  const parts = [];
  const add = (x0, x1, z0, z1) => { const el = solid(gg); parts.push({ el, x0, x1, z0, z1 }); return el; };
  const bottom = add(0, L, 3, 8);
  add(0, 4, 8, 46);
  BARS.forEach((x) => add(x, x + 1.8, 8, 44));
  add(L - 4, L, 8, 46);
  const top = add(0, L, 44, 49);
  const wheels = mk("path", { class: "nf lo" }, gg);

  let lastO = null;
  function drawGate(o) {
    const k = o.toFixed(2);
    if (k === lastO) return;
    lastO = k;
    const ox = 6 + o;
    for (const p of parts) {
      const w = Math.min(p.x1 - p.x0, GY1 - GY0);
      const [r, i] = rings(ox + p.x0, GY0, ox + p.x1, GY1, Math.min(1.2, w / 2), Math.min(0.6, w / 3));
      put(p.el, prism(P, front, r, i, p.z0, p.z1));
    }
    const wh = (x) => seg(P(ox + x - 3, GY1, 1.5), P(ox + x + 3, GY1, 1.5));
    wheels.setAttribute("d", wh(10) + wh(L - 10));
  }

  // posts stand in front of the gate's line
  const post = (x0) => { const [r, i] = rings(x0, -1, x0 + 7, 6, 1.6, 0.8); const el = solid(g); put(el, prism(P, front, r, i, 0, H + 4)); return el; };
  post(-1);
  const near = post(76);
  const latch = mk("circle", { class: "dot", r: 3 }, g);
  const lp = P(76, 2.5, 30); latch.setAttribute("cx", lp[0]); latch.setAttribute("cy", lp[1]);

  const s = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(s, dt); drawGate(s.x); return m; });
  bag.add(B.unregister);
  drawGate(REST);

  // hit: pointer's screen x against the fixed track ends
  const a = P(0, 0, 0)[0], b = P(150, 0, 0)[0];
  const A0 = P(0, 0, 0), A1 = P(150, 0, H);
  function move([sx, sy]) {
    const inside = sy > Math.min(A0[1], A1[1]) - 40 && sy < Math.max(A0[1], A1[1]) + 40 && sx > a - 20 && sx < b + 20;
    if (!inside) return leave();
    const t = clamp((sx - a) / (b - a - 40), 0, 1);
    s.t = t * travel;
    top.sil.classList.add("hi"); bottom.sil.classList.add("hi");
    latch.setAttribute("class", "dot off");
    read.textContent = "open " + Math.round((t * travel / L) * 100) + "%";
    B.wake();
  }
  function leave() {
    s.t = REST;
    top.sil.classList.remove("hi"); bottom.sil.classList.remove("hi");
    latch.setAttribute("class", "dot");
    read.textContent = "rest";
    B.wake();
  }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { travel = v; }, destroy: bag.dispose };
}

hairline({
  name: "gatepost",
  means: "A sliding driveway gate between two posts: move along the drive and the gate rolls open past the far post.",
  rules: [1, 3, 5, 8],
  range: [30, 66, 70],
  tour: [[90, 115], [200, 168], [293, 216], null],
  mount,
});
