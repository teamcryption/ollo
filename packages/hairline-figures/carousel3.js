/**
 * Carousel: a round deck, a centre column, a striped cone canopy, and six
 * horses on brass poles round the ring. The pointer's place across the frame
 * turns the deck on a spring; the horses ride round and rise and fall on
 * their poles as they go, the canopy's ribs turning with them. One horse is
 * bright. The slider is how far the deck turns.
 *
 * The pattern: one continuous value from the pointer (spring), with depth
 * order re-sorted as parts pass round the centre.
 */
const {
  Cam, fit, facing, prism, proj, rrect, seg, poly, hull, spring, stepS, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const RD = 40, DZ = 4, RH = 28, N = 6, CH = 46, RC = 42, AP = 78, REST = 0.3, NR = 12;
const big = (r) => rrect(-r, -r, r, r, r, 14);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-RC, -RC, 0], [RC, RC, 0], [RC, -RC, 0], [-RC, RC, 0], [0, 0, AP + 3]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, big(RD), big(RD - 1.6), 0, DZ));
  const mid = mk("g", {}, g);
  const col = solid(mid);
  put(col, prism(P, front, big(5), big(4), DZ, CH));
  const circle = (cx, cy, r, z) => { const o = []; for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; o.push(P(cx + r * Math.cos(a), cy + r * Math.sin(a), z)); } return o; };
  const horses = [];
  for (let k = 0; k < N; k++) {
    const h = { k, g: mk("g", {}, g) };
    h.pole = mk("path", { class: "nf" }, h.g);
    h.body = solid(h.g); h.head = solid(h.g);
    h.top = mk("path", { class: "nf" }, h.g);
    horses.push(h);
  }
  const canopy = mk("g", {}, g);
  const skirt = solid(canopy), cone = solid(canopy);
  put(skirt, prism(P, front, big(RC), big(RC - 1.6), CH, CH + 5));
  const fin = solid(canopy);
  put(fin, prism(P, front, big(2), big(1.2), AP, AP + 3));
  horses[0].body.sil.classList.add("hi"); horses[0].head.sil.classList.add("hi");

  const sp = spring(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const list = [];
    horses.forEach((h) => {
      const a = t + (h.k / N) * Math.PI * 2, cx = RH * Math.cos(a), cy = RH * Math.sin(a);
      const tx = -Math.sin(a), ty = Math.cos(a), z = 11 + 4 * Math.sin(2 * t + h.k * 2.1);
      const r0 = [cx - 5 * tx, cy - 5 * ty], r1 = [cx + 5 * tx, cy + 5 * ty], hd = [cx + 7 * tx, cy + 7 * ty];
      h.pole.setAttribute("d", seg(P(cx, cy, DZ), P(cx, cy, z)));
      h.top.setAttribute("d", seg(P(cx, cy, z + 8), P(cx, cy, CH)));
      const bodyPts = circle(...r0, 3.4, z).concat(circle(...r1, 3.4, z), circle(...r0, 3.4, z + 8), circle(...r1, 3.4, z + 8));
      put(h.body, { sil: poly(hull(bodyPts)), crease: "" });
      put(h.head, { sil: poly(hull(circle(...hd, 2.4, z + 6).concat(circle(...hd, 2.4, z + 16)))), crease: "" });
      list.push([cx + cy, h.g]);
    });
    list.push([0.01, mid]);
    list.sort((p, q) => p[0] - q[0]).forEach(([, el]) => canopy.before(el));
    let ribs = "";
    for (let i = 0; i < NR; i++) {
      const a = t + (i / NR) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
      if (front({ nu: c, nv: s })) ribs += seg(P(RC * c, RC * s, CH + 5), P(2 * c, 2 * s, AP));
    }
    put(cone, { sil: poly(hull(circle(0, 0, RC, CH + 5).concat(circle(0, 0, 2, AP)))), crease: ribs });
    fin.g.remove(); canopy.append(fin.g);
  }

  const B = register(stage, (dt) => { const mv = stepS(sp, dt); draw(sp.x); return mv; });
  bag.add(B.unregister);
  function move([sx]) {
    const u = clamp((sx - 200) / 150, -1, 1);
    sp.t = REST + u * Math.PI * (0.35 + 0.65 * reach);
    read.textContent = "turn " + Math.round(u * (0.35 + 0.65 * reach) * 180) + "°";
    B.wake();
  }
  bag.add(pointer(stage, { move, leave: () => { sp.t = REST; read.textContent = "rest"; B.wake(); } }));
  read.textContent = "rest";
  draw(REST);
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "carousel3",
  means: "A carousel: the pointer's place across the frame turns the deck on a spring, its horses riding round and rising on their poles.",
  rules: [3, 5, 6, 8],
  range: [0, 0.5, 1],
  tour: [[246, 207], [70, 215], [330, 215], null],
  mount,
});
