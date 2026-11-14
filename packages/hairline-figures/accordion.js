/**
 * Accordion: two wooden ends with a pleated bellows between them. The
 * pointer's x pulls the ends apart or squeezes them together, the pleats
 * fanning evenly as the bellows opens. At rest it is half open and the
 * keyboard end is bright. The slider is how far it can open.
 *
 * The pattern: one continuous value on a spring (stretch).
 */
const {
  Cam, fit, facing, hull, poly, open, prism, proj, rings, clamp, lerp, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const D = 22, H = 44, T = 10, NF = 9, WMIN = 30, REST = 70, WMAX = 110;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let wmax = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-WMAX / 2 - T, -2, 0], [WMAX / 2 + T, D + 2, 0], [-WMAX / 2 - T, D + 2, H + 4], [WMAX / 2 + T, -2, H + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const left = solid(g), lstrap = mk("path", { class: "nf lo" }, g);
  const bel = mk("path", { class: "sil" }, g), folds = mk("path", { class: "nf lo" }, g), edges = mk("path", { class: "nf" }, g);
  const right = solid(g), keys = mk("g", {}, g);
  const kdots = [];
  for (let i = 0; i < 5; i++) kdots.push(mk("circle", { r: 1.6, class: i === 2 ? "dot m" : "dot off" }, keys));
  const W = spring(REST);
  let last = NaN;

  function draw(w) {
    if (w === last) return;
    last = w;
    const xl = -w / 2, xr = w / 2;
    const [lr, li] = rings(xl - T, -2, xl, D + 2, 3, 1.4);
    put(left, prism(P, front, lr, li, 0, H + 4));
    lstrap.setAttribute("d", open([P(xl - T, D + 2, 8), P(xl - T * 0.5, D + 2, H - 4)]).replace(/Z$/, ""));
    const pts = [], fd = [], top = [], bot = [], back = [];
    for (let i = 0; i <= NF; i++) {
      const x = lerp(xl, xr, i / NF), e = i % 2 ? 3 : 0.6;
      const a = P(x, D - e, e), b = P(x, D - e, H - e), c = P(x, e, H - e), d0 = P(x, e, e);
      pts.push(a, b, c, d0);
      if (i > 0 && i < NF) fd.push("M" + a.join(",") + "L" + b.join(",") + "L" + c.join(","));
      top.push(b); bot.push(a); back.push(c);
    }
    bel.setAttribute("d", poly(hull(pts)));
    folds.setAttribute("d", fd.join(""));
    edges.setAttribute("d", [top, bot, back].map((r) => "M" + r.map((q) => q.join(",")).join("L")).join(""));
    edges.setAttribute("class", "nf lo");
    const [rr, ri] = rings(xr, -2, xr + T, D + 2, 3, 1.4);
    put(right, prism(P, front, rr, ri, 0, H + 4));
    kdots.forEach((k, i) => { const q = P(xr + T * 0.5, D + 2, 10 + i * 7); k.setAttribute("cx", q[0]); k.setAttribute("cy", q[1]); });
  }

  const B = register(stage, (dt) => { const m = stepS(W, dt); draw(W.x); return m; });
  bag.add(B.unregister);
  draw(REST);

  let on = false;
  function setOn(o) {
    on = o;
    right.sil.classList.toggle("hi", !o);
    bel.classList.toggle("hi", o);
  }
  setOn(false);
  read.textContent = "rest";
  bag.add(pointer(stage, {
    move: ([sx]) => {
      const w = lerp(WMIN, wmax, clamp((sx - 70) / 260, 0, 1));
      W.t = w; setOn(true);
      read.textContent = Math.round((100 * (w - WMIN)) / (WMAX - WMIN)) + "%";
      B.wake();
    },
    leave: () => { W.t = REST; setOn(false); read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { wmax = v; }, destroy: bag.dispose };
}

hairline({
  name: "accordion",
  means: "An accordion's bellows: the pointer's x pulls the two ends apart or squeezes them shut, the pleats fanning evenly.",
  rules: [1, 3, 5, 8],
  range: [70, 90, 110],
  tour: [[130, 150], [286, 169], [272, 195], null],
  mount,
});
