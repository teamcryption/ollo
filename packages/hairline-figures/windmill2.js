/**
 * Tower windmill: a tapering stone tower, its cap, and four lattice sails on
 * the windshaft. The pointer's side turns the sails on a spring; at rest they
 * stand a little off the cross, the lead sail bright. The slider is how far
 * one sweep turns them.
 */
const { Cam, fit, proj, facing, circ, ringAt, run, hull, poly, open, seg, clamp, spring, stepS, disposer, mk, solid, put, prism, register, pointer } = HL;

const RB = 22, RT = 12, HT = 84, LS = 54, WS = 10, REST = 0.3;
const S2 = Math.SQRT1_2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.95);
  const hx = 13 * S2, hz = HT + 6;
  const W = (u, w, a) => {
    const c = Math.cos(a), s = Math.sin(a), e = u * c - w * s, z = u * s + w * c;
    return [hx + 4 + e * S2, hx + 4 - e * S2, hz + z];
  };
  fit(C, [[-RB, -RB, 0], [RB, RB, 0], W(-LS - 2, 0, 0), W(LS + 2, 0, 0), W(0, -LS - 2, 0), W(0, LS + 2, 0)], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const foot = circ(RB, 48), top = circ(RT, 48), inner = circ(RT - 1.4, 48);
  const tower = solid(g);
  tower.sil.setAttribute("d", poly(hull(ringAt(P, foot, 0).concat(ringAt(P, top, HT)))));
  tower.cr.setAttribute("d", open(ringAt(P, run(inner, front), HT)));
  mk("path", { class: "lo nf", d: poly([P(RB * 0.7, RB * 0.7, 0), P(RB * 0.7, RB * 0.7, 14), P(RB * 0.5 + 3, RB * 0.9 - 3, 14), P(RB * 0.5 + 3, RB * 0.9 - 3, 0)].map((q, i) => q)) }, g);
  put(solid(g), prism(P, front, circ(RT + 2, 48), circ(RT + 0.6, 48), HT, HT + 4));
  const cap = solid(g);
  cap.sil.setAttribute("d", poly(hull(ringAt(P, circ(RT + 1, 32), HT + 4).concat(ringAt(P, circ(4, 16), HT + 14)))));
  mk("path", { class: "nf sil", d: seg(P(hx * 0.4, hx * 0.4, hz), P(hx + 4, hx + 4, hz)) }, g);
  const sails = [];
  for (let i = 0; i < 4; i++) {
    const s = { frame: mk("path", { class: "sil", d: "" }, g), lat: mk("path", { class: "lo nf", d: "" }, g) };
    sails.push(s);
  }
  const stock = mk("path", { class: "nf sil", d: "" }, g);
  const hub = mk("path", { class: "sil", d: "" }, g);
  const sp = spring(REST, { k: 90, c: 14 });
  let drawn = NaN;
  function draw() {
    const a0 = sp.x;
    if (Math.abs(a0 - drawn) < 1e-4) return;
    drawn = a0;
    let st = "";
    sails.forEach((s, i) => {
      const a = a0 + (i * Math.PI) / 2;
      s.frame.setAttribute("d", poly([W(12, 0, a), W(LS, 0, a), W(LS, WS, a), W(12, WS, a)].map(P0)));
      let l = "";
      for (let u = 18; u < LS; u += 6) l += seg(P0(W(u, 0, a)), P0(W(u, WS, a)));
      l += seg(P0(W(12, WS / 2, a)), P0(W(LS, WS / 2, a)));
      s.lat.setAttribute("d", l);
      st += seg(P0(W(0, 0, a)), P0(W(LS + 1, 0, a)));
    });
    stock.setAttribute("d", st);
    const h = []; for (let k = 0; k < 16; k++) h.push(P0(W(3.5 * Math.cos((k / 16) * 6.283), 3.5 * Math.sin((k / 16) * 6.283), 0)));
    hub.setAttribute("d", poly(h));
  }
  function P0(q) { return P(q[0], q[1], q[2]); }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  const cx = P(0, 0, hz)[0];
  function set(on, x) {
    sp.t = on ? REST - clamp((x - cx) / 70, -1, 1) * 1.25 * value : REST;
    sails.forEach((s, i) => s.frame.classList.toggle("hi", on || i === 0));
    read.textContent = on ? (sp.t < REST ? "cw" : "ccw") : "rest";
    B.wake();
  }
  bag.add(pointer(stage, { move: (p) => set(true, p[0]), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  set(false);
  return { set: (v) => { value = v; }, destroy: bag.dispose };
}

hairline({
  name: "windmill2",
  means: "A tower windmill: the pointer's side turns its four lattice sails on the windshaft, and the sails light as they turn.",
  rules: [1, 3, 5],
  range: [0.4, 1, 1.5],
  tour: [[272, 102], [130, 120], [250, 160], null],
  mount,
});
