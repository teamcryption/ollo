/**
 * KVM switch: a desktop switch box with four big select keys along its
 * top and a socket strip on its back. The pointer picks a key by where it
 * is along the box: that key presses down flush, the keys beside it rock
 * up after it, staggered by distance. At rest one key sits pressed and
 * bright, the others at uneven heights. The slider is the stagger.
 */
const {
  Cam, clamp, facing, fit, poly, prism, proj, rings, rrect, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, L = 84, D = 34, H = 12, X0 = 6, STEP = 19, KW = 15, KY0 = 9, KY1 = 27;
const REST = [7, 1, 5, 9], FAV = 1, UP = 11;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[0, 0, 0], [L, D, 0], [L, 0, 0], [0, D, 0], [0, 0, H + UP], [L, 0, H + UP]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, L, D, 6, 1.5);
  const body = solid(g);
  put(body, prism(P, front, br, bi, 0, H));
  let wells = "";
  for (let k = 0; k < N; k++) { const x = X0 + k * STEP; wells += poly(rrect(x - 1, KY0 - 1, x + KW + 1, KY1 + 1, 3, 3).map((q) => P(q.u, q.v, H))); }
  // the near face: a status light under each key
  for (let k = 0; k < N; k++) { const x = X0 + k * STEP + KW / 2; wells += seg(P(x - 2, D, 6), P(x + 2, D, 6)); }
  mk("path", { class: "nf lo", d: wells }, body.g);

  const keys = [];
  for (let k = 0; k < N; k++) keys.push({ k, x: X0 + k * STEP, el: solid(g), h: tween(REST[k]), last: NaN });
  function draw(s, h) {
    if (h === s.last) return;
    s.last = h;
    const [r, i] = rings(s.x, KY0, s.x + KW, KY1, 3.5, 1.3);
    put(s.el, prism(P, front, r, i, H - 1, H + h));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    keys.forEach((s) => { draw(s, tval(s.h, now)); if (!tdone(s.h, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: the pointer on the box's top plane, which never moves; nearest key along x
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    if (x < -4 || x > L + 4 || y < -6 || y > D + 4) return -1;
    return clamp(Math.round((x - X0 - KW / 2) / STEP), 0, N - 1);
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    keys.forEach((s, k) => {
      const v = a < 0 ? REST[k] : k === a ? 1 : clamp(UP + 2 - 3 * Math.abs(k - a), 3, UP);
      tset(s.h, v, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      s.el.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "pc " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "kvm",
  means: "A four-port KVM switch: the select key under the pointer presses down flush, the keys beside it rock up after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[136, 132], [217, 173], [257, 193], null],
  mount,
});
