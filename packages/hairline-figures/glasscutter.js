/**
 * Glass cutter: a pen-shaped cutter leaning on a pane of glass, its small
 * wheel on the glass. The pointer drags it along the pane: where the pointer
 * stands across the pane, the cutter rolls to, scoring a line behind it.
 * At rest the wheel is bright. The slider is how far it may roll.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, clamp, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const disc = (x, y, r, n = 14) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const REST = -30, GL = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-55, -32, 0], [55, 32, 0], [-55, 0, 70], [55, 0, 70]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-52, -30, 52, 30, 4, 2);
  put(solid(g), prism(P, front, pr, pi, 0, GL));
  const score = mk("path", { class: "lo nf" }, g);
  const body = mk("path", { class: "sil" }, g), head = mk("path", { class: "sil" }, g);
  const ball = mk("path", { class: "sil" }, g), wheel = mk("path", { class: "sil" }, g);
  const rod = (a, b, r) => poly(hull(ringAt(P, disc(a[0], a[1], r), a[2]).concat(ringAt(P, disc(b[0], b[1], r), b[2]))));

  const pos = spring(REST);
  let last = NaN;
  function draw(x) {
    if (x === last) return;
    last = x;
    const z = GL + 4;
    const wpts = [];
    for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2; wpts.push(P(x + 4 * Math.cos(a), 0, z + 4 * Math.sin(a))); }
    wheel.setAttribute("d", poly(wpts));
    head.setAttribute("d", rod([x - 2, 0, z + 2], [x - 8, 0, z + 14], 4.2));
    body.setAttribute("d", rod([x - 8, 0, z + 14], [x - 30, 0, z + 58], 3.6));
    ball.setAttribute("d", rod([x - 30, 0, z + 58], [x - 33, 0, z + 64], 5.2));
    score.setAttribute("d", seg(P(-46, 0, GL), P(Math.max(-46, x), 0, GL)));
  }
  const B = register(stage, (dt) => { const m = stepS(pos, dt); draw(pos.x); return m; });
  bag.add(B.unregister);

  let on = null;
  function aim(p) {
    let w = null;
    if (p) { const q = unproj(C, p[0], p[1], 0); if (Math.abs(q[0]) < 70 && Math.abs(q[1]) < 50) w = q; }
    const x = w ? clamp(REST + (clamp(w[0], -46, 46) - REST) * reach, -46, 46) : REST;
    pos.t = x;
    const act = !!w;
    if (act !== on) {
      on = act;
      wheel.classList.toggle("hi", !act);
      for (const el of [body, head, ball]) el.classList.toggle("hi", act);
    }
    read.textContent = act ? Math.round(x + 46) + "mm" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "glasscutter",
  means: "A glass cutter leaning on a pane: it rolls along the glass to where the pointer stands, scoring a line behind it.",
  rules: [1, 3, 4, 5],
  range: [40, 100, 100],
  tour: [[265, 251], [150, 196], [230, 234], null],
  mount,
});
