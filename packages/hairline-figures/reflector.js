/**
 * Reflector disc: a round fold-out reflector on a light stand. The pointer
 * tilts the disc on its yoke, from leaning to near flat, as a photographer
 * angles the bounce. At rest the disc leans, its rim bright. The slider is
 * the reach.
 */
const { Cam, fit, hull, poly, open, proj, seg, clamp, lerp, spring, stepS, mk, pointer, register, disposer } = HL;

const R = 40, HUB = 58, REST = 0.2;
const disc = (r, off, a, n = 48) => { const o = [], c = Math.cos(a), s = Math.sin(a); for (let i = 0; i < n; i++) { const q = (i / n) * 2 * Math.PI, u = r * Math.cos(q), v = r * Math.sin(q); o.push([u + off * 0, v * c - off * s, HUB + v * s + off * c]); } return o; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-R, -R, 0], [R, R, 0], [-R, -R, HUB + R], [R, R, HUB + R]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  for (const a of [0.5, 2.6, 4.7]) mk("path", { d: seg(P(0, 0, 14), P(18 * Math.cos(a), 18 * Math.sin(a), 0)), class: "nf" }, g);
  mk("path", { d: seg(P(0, 0, 0), P(0, 0, HUB - 4)), class: "nf" }, g);
  const back = mk("path", { class: "sil hi" }, g), face = mk("path", { class: "nf lo" }, g), fold = mk("path", { class: "nf lo" }, g);
  const hub = mk("path", { class: "nf" }, g);

  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const a = lerp(1.25, 0.2, t), pr = (pts) => pts.map((p) => P(...p));
    back.setAttribute("d", poly(hull(pr(disc(R, -1.5, a)).concat(pr(disc(R, 1.5, a))))));
    face.setAttribute("d", poly(pr(disc(R - 2.5, 1.5, a))));
    const d = disc(R - 2.5, 1.5, a, 8);
    fold.setAttribute("d", open([P(...d[1]), P(...d[5])]) + open([P(...d[3]), P(...d[7])]));
    hub.setAttribute("d", poly(hull(pr(disc(4, 1.5, a, 16)).concat(pr(disc(4, 4, a, 16))))));
  }
  const sp = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  draw(REST);
  read.textContent = "rest";
  bag.add(pointer(stage, {
    move: ([sx]) => { const t = reach * lerp(0.6, 1, clamp((sx - 120) / 160, 0, 1)); sp.t = t; read.textContent = Math.round(lerp(72, 11, t)) + "°"; B.wake(); },
    leave: () => { sp.t = REST; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "reflector",
  means: "A round fold-out reflector on a stand: the pointer tilts the disc on its yoke to angle the bounce.",
  rules: [3, 5, 8, 9],
  range: [0.5, 0.75, 1],
  tour: [[200, 115], [255, 100], [160, 135], null],
  mount,
});
