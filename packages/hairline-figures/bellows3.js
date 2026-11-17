/**
 * Toasting fork: a long fork with a turned grip, a telescoping shaft and a
 * three-tined head holding a slice of bread. At rest the shaft is drawn in,
 * the head bright. The pointer over the fork slides the shaft out, carrying
 * the head and the bread away towards the fire. The slider is the reach.
 *
 * The pattern: one part answering a hover, hit on the ground plane.
 */
const { Cam, fit, hull, poly, open, seg, proj, unproj, tween, tset, tval, tdone, disposer, mk, pointer, register, solid } = HL;

const Z = 12, G = 30, S1 = 46, E0 = 8;
const tube = (x0, x1, r, n = 16) => { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; o.push([x0, r * Math.cos(t), Z + r * Math.sin(t)], [x1, r * Math.cos(t), Z + r * Math.sin(t)]); } return o; };
const slab = (x, w, h, d) => [[x, -w, Z - h], [x, w, Z - h], [x, w, Z + h], [x, -w, Z + h], [x + d, -w, Z - h], [x + d, w, Z - h], [x + d, w, Z + h], [x + d, -w, Z + h]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.7);
  const far = G + S1 + 60 + 34;
  fit(C, [[0, -14, Z - 14], [far, 14, Z + 14], [0, 14, Z + 14], [far, -14, Z - 14], [0, 0, 0], [far, 0, 0]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const grip = solid(g), rings_ = mk("path", { class: "nf lo" }, grip.g);
  grip.sil.setAttribute("d", poly(hull(tube(0, G, 4.2).concat(tube(2, G - 2, 4.8)).map((p) => P(...p)))));
  rings_.setAttribute("d", [8, 15, 22].map((x) => open(tube(x, x, 4.6).filter((_, i) => i % 2 === 0).slice(0, 9).map((p) => P(...p)))).join(""));
  const outer = solid(g);
  outer.sil.setAttribute("d", poly(hull(tube(G, G + S1, 2).map((p) => P(...p)))));
  const inner = solid(g), head = solid(g), tines = mk("path", { class: "nf" }, head.g), bread = solid(g);
  head.sil.classList.add("hi");
  const tw = tween(E0);
  let last = NaN;

  function draw(e) {
    if (e === last) return;
    last = e;
    const x0 = G + S1 - 6, x1 = G + S1 + e, hx = x1 + 3;
    inner.sil.setAttribute("d", poly(hull(tube(x0, x1, 1.3).map((p) => P(...p)))));
    head.sil.setAttribute("d", poly(hull(slab(x1, 9, 1.2, 3).map((p) => P(...p)))));
    tines.setAttribute("d", [-8, 0, 8].map((y) => seg(P(hx, y, Z), P(hx + 22, y, Z))).join(""));
    bread.sil.setAttribute("d", poly(hull(slab(hx + 12, 13, 13, 4).map((p) => P(...p)))));
    bread.cr.setAttribute("d", poly([[-11, -11], [11, -11], [11, 9], [7, 12], [-7, 12], [-11, 9]].map(([y, z]) => P(hx + 16.2, y, Z + z))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const hit = ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, Z); return x > -6 && x < G + S1 + E0 + 40 && Math.abs(y) < 22; };
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? reach : E0, performance.now(), 0);
    read.textContent = on ? "reach" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "bellows3",
  means: "A toasting fork with a telescoping shaft: under the pointer the shaft slides out, carrying the bread away.",
  rules: [1, 4, 5, 8],
  range: [30, 50, 60],
  tour: [[66, 95], [140, 130], [210, 166], null],
  mount,
});
