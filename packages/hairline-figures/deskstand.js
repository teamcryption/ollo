/**
 * Book end: four books standing loose on a desk with a sliding L-shaped
 * book end beside them. The pointer over the row slides the book end in,
 * and the books close up against each other, staggered from it. At rest the
 * book end stands out, bright.
 */
const { Cam, facing, fit, prism, proj, rings, unproj, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = [7, 9, 6, 8], H = [40, 46, 36, 42], D = 26;
const REST = [0, 12, 27, 38], PACK = [0, 7.6, 17.2, 23.8], E0 = 58, E1 = 32.6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let step = value;
  const C = Cam(45, 0.5, 3.05);
  fit(C, [[-2, 0, 0], [E0 + 6, D, 0], [-2, 0, 46], [E0 + 4, 0, 52], [E0 + 6, D, 0]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (el, x0, y0, x1, y1, r, b, z0, z1) => { const [ri, ii] = rings(x0, y0, x1, y1, r, b); put(el, prism(P, front, ri, ii, z0, z1)); };

  const books = W.map((w, k) => ({ w, h: H[k], el: solid(g), x: tween(REST[k]), last: "" }));
  const end = { up: solid(g), foot: solid(g), x: tween(E0), last: "" };
  function drawBook(b, x) { const key = x.toFixed(2); if (key === b.last) return; b.last = key; box(b.el, x, 0, x + b.w, D, 1.4, 0.7, 0, b.h); }
  function drawEnd(x) {
    const key = x.toFixed(2); if (key === end.last) return; end.last = key;
    box(end.up, x, 1, x + 3, D - 1, 1.2, 0.6, 0, 52);
    box(end.foot, x - 14, 2, x + 3, D - 2, 1.2, 0.6, 0, 2);
  }
  const B = register(stage, (_dt, now) => {
    let m = false;
    books.forEach((b) => { drawBook(b, tval(b.x, now)); if (!tdone(b.x, now)) m = true; });
    drawEnd(tval(end.x, now)); if (!tdone(end.x, now)) m = true;
    return m;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 24);
    return x > -4 && x < E0 + 8 && y > -24 && y < D + 24 ? 1 : 0;
  }
  let act = -1;
  function setActive(a) {
    if (a === act) return; act = a;
    const now = performance.now();
    tset(end.x, a ? E1 : E0, now, 0);
    books.forEach((b, k) => tset(b.x, a ? PACK[k] : REST[k], now, (books.length - k) * step));
    end.up.sil.classList.toggle("hi", !a);
    books[3].el.sil.classList.toggle("hi", !!a);
    read.textContent = a ? "slide" : "rest";
    B.wake();
  }
  setActive(0);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { step = v; }, destroy: bag.dispose };
}

hairline({
  name: "deskstand",
  means: "Four loose books and a book end: the end slides in and the books close up against it, one after another.",
  rules: [1, 2, 5, 8],
  range: [0, 40, 80],
  tour: [[125, 127], [172, 150], [215, 225], null],
  mount,
});
