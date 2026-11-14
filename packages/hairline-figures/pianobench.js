/**
 * Sheet music stand: a tilted desk on a tripod post, five loose pages on it.
 * The pointer's place across the desk picks a page: the pages before it lie
 * turned to the left, the pages after it to the right, and the picked page
 * stands up mid-turn, the rest following staggered from it. At rest one page
 * is half turned, bright. The slider is the stagger.
 */
const {
  Cam, circ, fit, facing, fillet, poly, prism, proj, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, W = 120, HD = 76, ZD = 92, TB = 0.38, FAV = 2, PW = W / 2 - 3, PV0 = 6, PV1 = HD - 3;
const sb = Math.sin(TB), cb = Math.cos(TB);
const D = (u, v, n = 0) => [u, -v * sb + n * cb, ZD + v * cb + n * sb];
const restT = (k) => (k < FAV ? Math.PI - 0.06 - 0.07 * k : k > FAV ? 0.06 + 0.07 * (N - 1 - k) : 1.25);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.45);
  fit(C, [D(0, 0), D(W, 0), D(0, HD), D(W, HD), D(W / 2, PV1, PW), [W / 2 - 40, 20, 0], [W / 2 + 40, 20, 0], [W / 2, -40, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const X = W / 2, Y = -10;
  const legs = mk("path", { class: "sil nf" }, g);
  const hub = [X, Y, 22], feet = [[X - 42, Y + 22, 0], [X + 40, Y + 26, 0], [X + 4, Y - 44, 0]];
  legs.setAttribute("d", feet.map((f) => seg(P(...hub), P(...f))).join(""));
  const pc = circ(2.6, 16).map((q) => ({ ...q, u: q.u + X, v: q.v + Y })), pi = circ(1.8, 16).map((q) => ({ ...q, u: q.u + X, v: q.v + Y }));
  put(solid(g), prism(P, front, pc, pi, 18, ZD - 6));
  mk("path", { d: seg(P(X, Y, ZD - 6), P(...D(X, 10))), class: "sil nf" }, g);
  const desk = [P(...D(0, 0)), P(...D(W, 0)), P(...D(W, HD)), P(...D(0, HD))];
  mk("path", { d: poly(fillet(desk, [2, 2, 3, 3])), class: "sil" }, g);
  mk("path", { d: seg(P(...D(3, 3)), P(...D(W - 3, 3))), class: "lo nf" }, g);
  const lip = [P(...D(-2, -1)), P(...D(W + 2, -1)), P(...D(W + 2, -1, 7)), P(...D(-2, -1, 7))];
  const pg = mk("g", {}, g);
  mk("path", { d: poly(fillet(lip, [1, 1, 1.5, 1.5])), class: "sil" }, g);

  const pages = [];
  for (let k = 0; k < N; k++) {
    const el = mk("path", { class: "sil" }, pg);
    pages.push({ k, el, t: tween(restT(k)), last: NaN, s: 0 });
  }
  function draw(p, t) {
    if (t === p.last) return false;
    p.last = t;
    const c = Math.cos(t), s = Math.sin(t), q = (r, v) => P(...D(X + 1 + r * c, v, 1 + r * s));
    p.el.setAttribute("d", poly(fillet([q(0, PV0), q(PW, PV0), q(PW, PV1), q(0, PV1)], [1, 1.5, 1.5, 1])));
    p.s = s;
    return true;
  }

  let order = "";
  const B = register(stage, (_dt, now) => {
    let moving = false, ch = false;
    for (const p of pages) { if (draw(p, tval(p.t, now))) ch = true; if (!tdone(p.t, now)) moving = true; }
    if (ch) {
      const srt = pages.slice().sort((a, b) => a.s - b.s), key = srt.map((p) => p.k).join("");
      if (key !== order) { order = key; srt.forEach((p) => pg.append(p.el)); }
    }
    return moving;
  });
  bag.add(B.unregister);

  const s0 = P(...D(0, HD / 2)), s1 = P(...D(W, HD / 2)), top = P(...D(W / 2, HD + 30))[1], bot = P(...D(W / 2, -10))[1];
  function hit([sx, sy]) {
    const u = (sx - s0[0]) / (s1[0] - s0[0]);
    if (u < -0.08 || u > 1.08 || sy < top || sy > bot + 30) return -1;
    return Math.max(0, Math.min(N - 1, Math.floor(u * N)));
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    pages.forEach((p, k) => {
      const v = a < 0 ? restT(k) : k < a ? Math.PI - 0.05 - 0.06 * k : k > a ? 0.05 + 0.06 * (N - 1 - k) : Math.PI / 2;
      tset(p.t, v, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      p.el.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "p " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "pianobench",
  means: "A sheet music stand with five loose pages: the pointer's place across the desk turns the pages to that one, standing it up.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[156, 71], [205, 96], [254, 121], null],
  mount,
});
