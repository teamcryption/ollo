/**
 * Kayak rack: an outdoor rack of two posts on feet, with a top beam and an
 * arm out from each post for every tier, holding four kayaks stacked one over
 * another, each with its cockpit. Two paddles lean on the end of the beam.
 * The pointer picks a kayak: it slides out along its arms toward the reader,
 * and the kayaks above and below ease out a little, staggered from it. At
 * rest the second kayak is part way out, bright. The slider is the stagger.
 *
 * The pattern: a single column; the pick is the kayak whose resting axis on
 * screen is nearest the pointer.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const ZS = [6, 22, 38, 54], A = 38, B = 6.5, PX = 20, TOP = 66, OUT = 22, FAV = 1;
const REST = [0, 8, 2, 0], NEAR = [OUT, 6, 2, 0.5];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-A, 4, 0], [52, 40, 0], [52, 0, TOP + 4], [-A, 16 + OUT + B, ZS[3] + 7], [-24, 0, TOP + 4], [-A, -2, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 1.2, b = 0.6) => {
    const [ring, inner] = rings(x0, y0, x1, y1, r, b), s = solid(g);
    put(s, prism(P, front, ring, inner, z0, z1));
    return s;
  };

  // the frame, far to near: posts, beam, feet
  for (const x of [-PX, PX]) box(x - 2, 0, x + 2, 4, 0, TOP);
  box(-PX - 4, 0, 52, 4, TOP, TOP + 4);
  for (const x of [-PX, PX]) box(x - 2.5, 4, x + 2.5, 32, 0, 3, 1.4, 0.8);

  const ring = (z, k, dy) => Array.from({ length: 40 }, (_, i) => {
    const t = (i / 40) * Math.PI * 2, s = Math.sin(t);
    return P(A * k * Math.cos(t), 16 + dy + B * k * s * (0.55 + 0.45 * Math.abs(s)), z);
  });
  const kayaks = ZS.map((z, k) => {
    const arms = mk("g", {}, g);
    for (const x of [-PX, PX]) {
      const [r, i] = rings(x - 1.5, 4, x + 1.5, 28, 1, 0.5), s = solid(arms);
      put(s, prism(P, front, r, i, z - 3, z));
    }
    const kg = mk("g", {}, g);
    const sil = mk("path", { class: "sil" }, kg), deck = mk("path", { class: "nf lo" }, kg);
    return { k, z, arms, kg, sil, deck, y: tween(REST[k]), last: "" };
  });

  // two paddles leaning on the end of the beam: a shaft and a blade at each end
  const pg = mk("g", {}, g);
  for (const [x, y0] of [[44, 34], [49, 30]]) {
    const a = [x, y0, 0], b = [x - 1, 4, TOP], L = Math.hypot(...b.map((v, i) => v - a[i]));
    const d = b.map((v, i) => (v - a[i]) / L);
    mk("path", { class: "nf sil", d: seg(P(...a), P(...b)) }, pg);
    for (const t of [7, L - 7]) {
      const pts = Array.from({ length: 20 }, (_, i) => {
        const q = (i / 20) * Math.PI * 2, c = a.map((v, j) => v + d[j] * (t + 6 * Math.cos(q)));
        return P(c[0] + 2.6 * Math.sin(q), c[1], c[2]);
      });
      mk("path", { class: "sil", d: poly(hull(pts)) }, pg);
    }
  }

  function draw(s, y) {
    const key = y.toFixed(2);
    if (key === s.last) return;
    s.last = key;
    s.sil.setAttribute("d", poly(hull(ring(s.z, 0.86, y).map((p, i) => [p[0], p[1]]).concat(ring(s.z + 8, 1, y)))));
    const cp = Array.from({ length: 24 }, (_, i) => {
      const t = (i / 24) * Math.PI * 2;
      return P(-4 + 9 * Math.cos(t), 16 + y + 4 * Math.sin(t), s.z + 8);
    });
    s.deck.setAttribute("d", poly(cp) + seg(P(-A + 6, 16 + y, s.z + 8), P(-14, 16 + y, s.z + 8)) + seg(P(7, 16 + y, s.z + 8), P(A - 6, 16 + y, s.z + 8)));
  }

  // paint by depth toward the camera: arms and kayaks, bottom up, a kayak slid out comes forward
  let painted = "";
  const B2 = register(stage, (_dt, now) => {
    let moving = false;
    const items = [];
    for (const s of kayaks) {
      const y = tval(s.y, now);
      draw(s, y);
      if (!tdone(s.y, now)) moving = true;
      items.push([16 * 0.61 + (s.z - 1.5) * 0.5, s.arms], [(16 + y) * 0.61 + (s.z + 3) * 0.5, s.kg]);
    }
    items.sort((a, b) => a[0] - b[0]);
    const key = items.map((i) => i[0].toFixed(1)).join();
    if (key !== painted) { painted = key; for (const [, el] of items) g.appendChild(el); g.appendChild(pg); }
    return moving;
  });
  bag.add(B2.unregister);

  /** The kayak whose resting axis on screen is nearest the pointer; -1 off the rack. */
  const axes = ZS.map((z) => [P(-A, 16, z + 4), P(A, 16, z + 4)]);
  function hit([sx, sy]) {
    let best = -1, bd = 13;
    axes.forEach(([a, b], k) => {
      if (sx < a[0] - 4 || sx > b[0] + 4) return;
      const d = Math.abs(sy - (a[1] + ((b[1] - a[1]) * (sx - a[0])) / (b[0] - a[0])));
      if (d < bd) { bd = d; best = k; }
    });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    kayaks.forEach((s, k) => {
      tset(s.y, a < 0 ? REST[k] : NEAR[Math.abs(k - a)], now, from < 0 ? 0 : Math.abs(k - from) * stag);
      s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "kayak " + (ZS.length - a);
    B2.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "kayakrack",
  means: "Four kayaks stacked on a rack: the one under the pointer slides out toward the reader, and the ones beside it ease out a little.",
  rules: [1, 2, 5, 8],
  range: [0, 40, 80],
  tour: [[200, 93], [200, 127], [200, 195], null],
  mount,
});
