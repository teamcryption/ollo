/**
 * Playground roundabout: a round deck on a low hub, a centre pole and six
 * hand bars that rise from the rim and bend in to the pole. The pointer over
 * the deck spins it: the bright bar swings round towards the pointer on a
 * spring. At rest the deck sits a little turned, one bar bright. The slider is
 * how far the deck turns towards the pointer.
 *
 * The pattern: a continuous aim on one angle; the hit is on the deck's plane,
 * which never moves.
 */
const {
  Cam, circ, facing, fit, prism, proj, open, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 40, DZ = 8, N = 6, REST = 0.35, FAV = 0;
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.9);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([R * Math.cos(a), R * Math.sin(a), 0], [R * Math.cos(a), R * Math.sin(a), DZ + 3]); }
  ext.push([0, 0, DZ + 34]);
  fit(C, ext, 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(12, 32), circ(10.5, 32), 0, DZ));
  put(solid(g), prism(P, front, circ(R, 64), circ(R - 2.2, 64), DZ, DZ + 3));
  const lines = mk("path", { class: "nf lo" }, g);
  const far = mk("g", {}, g);
  put(solid(g), prism(P, front, circ(3, 20), circ(2.2, 20), DZ + 3, DZ + 30));
  const near = mk("g", {}, g);
  const bars = [];
  for (let k = 0; k < N; k++) bars.push({ k, el: mk("path", { class: "nf sil" }, far), side: far });

  const sp = spring(REST);
  let drawn = NaN;
  function draw() {
    const a0 = sp.x;
    if (Math.abs(a0 - drawn) < 1e-4) return;
    drawn = a0;
    const T = DZ + 3, d = [];
    for (let k = 0; k < N; k++) {
      const a = a0 + (k / N) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a), b = a + Math.PI / N;
      const r1 = R - 3;
      bars[k].el.setAttribute("d", open([P(r1 * c, r1 * s, T), P(r1 * c, r1 * s, T + 13), P(9 * c, 9 * s, T + 24), P(3 * c, 3 * s, T + 24)]));
      const side = c + s > 0 ? near : far;
      if (side !== bars[k].side) { side.appendChild(bars[k].el); bars[k].side = side; }
      d.push(open([P(5 * Math.cos(b), 5 * Math.sin(b), T), P((R - 3) * Math.cos(b), (R - 3) * Math.sin(b), T)]));
    }
    lines.setAttribute("d", d.join(""));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    let pick = FAV;
    if (over) {
      const pa = Math.atan2(over[1], over[0]);
      sp.t = REST + amt * wrap(pa - REST);
      let bd = Infinity;
      for (let k = 0; k < N; k++) { const dd = Math.abs(wrap(sp.t + (k / N) * Math.PI * 2 - pa)); if (dd < bd) { bd = dd; pick = k; } }
      if (amt > 0.6) pick = FAV;
    } else sp.t = REST;
    bars.forEach((b) => b.el.classList.toggle("hi", b.k === pick));
    read.textContent = over ? "bar " + (pick + 1) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], DZ + 3), r = Math.hypot(x, y);
      over = r > R + 6 || r < 4 ? null : [x, y];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { amt = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "roundabout",
  means: "A playground roundabout: the deck spins its bright hand bar round towards the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[163, 127], [122, 185], [270, 200], null],
  mount,
});
