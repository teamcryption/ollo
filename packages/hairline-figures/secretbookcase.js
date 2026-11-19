/**
 * Secret bookcase: a bookcase set flush in a wall, its shelves full of
 * books, one book tipped forward as the lever. The pointer on the bookcase
 * swings it out on a pivot at its right edge, showing the doorway behind it
 * into the hidden room. At rest the case is shut and the
 * tipped book is bright. The slider is how far the case swings.
 *
 * The pattern: one part swinging; the hit is the rest pose's outline.
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 56, H = 100, TOP = 114, D = 10, PW = 22, REST = 0;
const SH = [3, 27, 51, 75, 97];
const BOOKS = [[2.2, 18], [3, 20], [2.4, 16], [3.4, 21], [2, 17], [2.8, 19], [3, 15], [2.4, 20], [3.6, 18], [2.6, 21], [2.2, 17], [3.2, 19]];
const xf = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: W + q.u * c + q.v * s, v: 2 - q.u * s + q.v * c, nu: q.nu * c + q.nv * s, nv: -q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-PW - 4, -18, -3], [W + PW + 4, -18, -3], [W + PW + 4, 24, -3], [-PW - 4, 24, -3], [-PW, 2, TOP], [W + PW, -8, TOP], [W - 46, 46, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 1.2, b = 0.6, par = g) => { const [rr, i] = rings(x0, y0, x1, y1, r, b); const s = solid(par); put(s, prism(P, front, rr, i, z0, z1)); return s; };
  box(-PW - 4, -18, W + PW + 4, 24, -3, 0, 5, 2);
  box(-PW, -8, 0, 2, 0, TOP);
  box(0, -8, W, 2, H, TOP);
  const cg = mk("g", {}, g);
  const body = solid(cg);
  const shelves = mk("path", { class: "nf lo" }, cg), books = mk("path", { class: "nf" }, cg), lever = mk("path", { class: "nf" }, cg);
  box(W, -8, W + PW, 2, 0, TOP);
  const CASE = rings(-W + 0.4, -D + 2, 0, 0, 1.2, 0.6);
  const ang = tween(REST);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    put(body, prism(P, front, xf(CASE[0], a), xf(CASE[1], a), 0, H - 0.4));
    const c = Math.cos(a), s = Math.sin(a);
    const F = (u, z, v = 0.05) => P(W + u * c + v * s, 2 - u * s + v * c, z);
    let sd = poly([F(-W + 3, 3), F(-3, 3), F(-3, 97), F(-W + 3, 97)]);
    for (const z of SH.slice(1, -1)) sd += open([F(-W + 3, z), F(-3, z)]);
    shelves.setAttribute("d", sd);
    let bd = "", ld = "";
    for (let k = 0; k < 4; k++) {
      let u = -W + 4 + (k % 2) * 3, i = k * 3;
      while (true) {
        const [w, h] = BOOKS[i++ % BOOKS.length];
        if (u + w > -4) break;
        const z0 = SH[k] + 0.6, hh = Math.min(h, SH[k + 1] - SH[k] - 2);
        if (k === 1 && i % BOOKS.length === 5) ld = poly([F(u, z0), F(u + w, z0), F(u + w + 4, z0 + hh, 3), F(u + 4, z0 + hh, 3)]);
        else bd += poly([F(u, z0), F(u + w, z0), F(u + w, z0 + hh), F(u, z0 + hh)]);
        u += w + 0.5;
      }
    }
    books.setAttribute("d", bd);
    lever.setAttribute("d", ld);
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  const outline = hull([[0, -8, 0], [W, -8, 0], [W, 2, 0], [0, 2, 0], [0, -8, H], [W, -8, H], [W, 2, H], [0, 2, H]].map((p) => P(...p)));
  function inside([x, y]) {
    let s = 0;
    for (let i = 0; i < outline.length; i++) {
      const a = outline[i], b = outline[(i + 1) % outline.length], cr = (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]);
      if (cr !== 0) { if (s && Math.sign(cr) !== s) return false; s = Math.sign(cr); }
    }
    return true;
  }
  let on = null;
  function setOpen(o) {
    if (o === on) return;
    on = o;
    tset(ang, o ? max * Math.PI / 180 : REST, performance.now(), 0);
    body.sil.classList.toggle("hi", o);
    lever.classList.toggle("hi", !o);
    read.textContent = o ? Math.round(max) + "°" : "rest";
    B.wake();
  }
  setOpen(false);
  bag.add(pointer(stage, { move: (p) => setOpen(inside(p)), leave: () => setOpen(false) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { max = v; if (on) { on = null; setOpen(true); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "secretbookcase",
  means: "A bookcase set in a wall: the pointer swings it out on its pivot to open the doorway to a hidden room.",
  rules: [1, 4, 5, 8],
  range: [35, 70, 85],
  tour: [[181, 115], [201, 166], [214, 200], null],
  mount,
});
