/**
 * Keypads: a row of four access posts, each a rounded pillar carrying a
 * keypad head with a three-by-three grid of keys on its top. The pointer
 * picks a post by where it is along the row: its head rises to meet the hand,
 * the others rise a little, staggered from it. At rest the heads stand at
 * uneven heights and the second one is bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); pick by the posts'
 * resting centres on screen x.
 */
const {
  Cam, clamp, facing, fit, poly, prism, proj, rings, ringAt, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 30, HW = 9, PW = 4, BASE = 26, REST = [6, 12, 2, 8], FAV = 1, LIFT = 24, BUMP = 6, HD = 7;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.4);
  const XL = (N - 1) * STEP;
  fit(C, [[-HW - 4, -HW - 4, 0], [XL + HW + 4, HW + 4, 0], [XL + HW + 4, -HW - 4, 0], [-HW - 4, HW + 4, 0], [0, -HW, BASE + LIFT + HD], [XL, HW, BASE + LIFT + HD]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the floor strip the posts are set in
  const floor = solid(g);
  const [fr, fi] = rings(-HW - 4, -HW - 4, XL + HW + 4, HW + 4, 8, 1.6);
  put(floor, prism(P, front, fr, fi, 0, 2));

  const posts = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP;
    const post = solid(g), head = solid(g);
    const keys = mk("path", { class: "nf lo" }, head.g);
    posts.push({ k, x, post, head, keys, pr: rings(x - PW, -PW, x + PW, PW, 3, 1), hr: rings(x - HW, -HW, x + HW, HW, 3.5, 1.2), z: tween(REST[k]), last: NaN, cx: P(x, 0, BASE)[0] });
  }

  function draw(p, lift) {
    if (lift === p.last) return;
    p.last = lift;
    const top = BASE + lift;
    put(p.post, prism(P, front, p.pr[0], p.pr[1], 2, top));
    put(p.head, prism(P, front, p.hr[0], p.hr[1], top, top + HD));
    let d = "";
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const u = p.x - 5.6 + i * 4.2, v = -5.6 + j * 4.2;
      d += poly(ringAt(P, rrect(u - 1.5, v - 1.5, u + 1.5, v + 1.5, 0.8, 2), top + HD));
    }
    p.keys.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    posts.forEach((p) => { draw(p, tval(p.z, now)); if (!tdone(p.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: the post whose resting centre is nearest the pointer's screen x
  const lo = P(-HW - 6, 0, 0)[0], hi = P(XL + HW + 6, 0, 0)[0];
  function hit([sx, sy]) {
    if (sx < lo || sx > hi || sy < 40 || sy > 290) return -1;
    let best = 0;
    posts.forEach((p, i) => { if (Math.abs(p.cx - sx) < Math.abs(posts[best].cx - sx)) best = i; });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    posts.forEach((p, k) => {
      const z = a < 0 ? REST[k] : k === a ? LIFT : clamp(BUMP - 2 * Math.abs(k - a), 0, BUMP);
      tset(p.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      p.head.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "pad " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "keypads",
  means: "A row of access keypads on posts: the keypad under the pointer rises to meet the hand, the others rise a little after it.",
  rules: [1, 2, 4, 5],
  range: [0, 45, 90],
  tour: [[175, 124], [276, 196], [124, 119], null],
  mount,
});
