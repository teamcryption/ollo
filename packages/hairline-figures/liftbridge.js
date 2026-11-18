/**
 * Lift bridge: a truss span hung between two tall towers, with counterweights
 * riding outside them on cables over the tower tops. The pointer over the
 * bridge raises the whole span straight up, level, while the counterweights
 * sink. At rest the span sits just above its seats, bright. The slider is how
 * high it lifts.
 */
const {
  Cam, fit, facing, prism, proj, rings, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 96, Wd = 22, TW = 14, TH = 84, REST = 10, DK = 5, TR = 11;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-TW - 12, -2, 0], [L + TW + 12, Wd + 2, 0], [-TW - 12, Wd + 2, 0], [L + TW + 12, -2, 0], [-TW, 0, TH + 4], [L + TW, Wd, TH + 4]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b) => { const [ring, inner] = rings(x0, y0, x1, y1, r, b); const s = solid(g); return (z0, z1) => put(s, prism(P, front, ring, inner, z0, z1)); };
  // far counterweight, far tower, cables, span, near tower, near counterweight
  const cwA = box(-TW - 11, 5, -TW - 2, Wd - 5, 1.5, 1);
  box(-TW, -1, 0, Wd + 1, 2, 1.2)(0, TH);
  const cab = mk("path", { class: "nf lo" }, g);
  const deck = box(1, 0, L - 1, Wd, 1.5, 1.2);
  const truss = mk("path", { class: "nf" }, g);
  box(L, -1, L + TW, Wd + 1, 2, 1.2)(0, TH);
  const cwB = box(L + TW + 2, 5, L + TW + 11, Wd - 5, 1.5, 1);
  // the deck's bright silhouette is the rest mark and the answer
  g.querySelectorAll(".sil")[2].classList.add("hi");

  const th = tween(REST);
  let last = NaN;
  function draw(h) {
    if (h === last) return;
    last = h;
    deck(h, h + DK);
    const top = h + DK + TR;
    let t = "";
    for (const y of [1, Wd - 1]) {
      t += seg(P(3, y, top), P(L - 3, y, top));
      for (let i = 0; i <= 8; i++) {
        const x = 3 + (i * (L - 6)) / 8;
        t += seg(P(x, y, h + DK), P(x, y, top));
        if (i < 8) t += seg(P(x, y, i < 4 ? top : h + DK), P(x + (L - 6) / 8, y, i < 4 ? h + DK : top));
      }
    }
    truss.setAttribute("d", t);
    const cw = TH - 14 - (h - REST) * 0.9;
    cwA(cw - 16, cw); cwB(cw - 16, cw);
    let c = "";
    for (const y of [3, Wd - 3]) {
      c += seg(P(-2, y, top), P(-2, y, TH)) + seg(P(-TW, y, TH), P(-TW - 6, y, TH)) + seg(P(-TW - 6, y, TH), P(-TW - 6, y, cw));
      c += seg(P(L + 2, y, top), P(L + 2, y, TH)) + seg(P(L + TW, y, TH), P(L + TW + 6, y, TH)) + seg(P(L + TW + 6, y, TH), P(L + TW + 6, y, cw));
    }
    cab.setAttribute("d", c);
  }
  const B = register(stage, (_dt, now) => { draw(tval(th, now)); return !tdone(th, now); });
  bag.add(B.unregister);

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(th, a < 0 ? REST : REST + 50 * lift, performance.now(), 0);
    read.textContent = a < 0 ? "rest" : "up " + Math.round(50 * lift);
    B.wake();
  }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    setActive(x > -TW - 14 && x < L + TW + 14 && y > -30 && y < Wd + 30 ? 1 : -1);
  }
  setActive(-1);
  bag.add(pointer(stage, { move, leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; if (act >= 0) { act = -2; setActive(1); } }, destroy: bag.dispose };
}

hairline({
  name: "liftbridge",
  means: "A truss span between two towers: the pointer over the bridge lifts the whole deck straight up while the counterweights sink.",
  rules: [1, 3, 4, 5],
  range: [0.3, 1, 1],
  tour: [[200, 204], [165, 190], [235, 222], null],
  mount,
});
