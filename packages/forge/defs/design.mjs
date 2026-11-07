import { R, C, L, poly, D, rotateD } from '../src/geo.mjs';
import { icon, body, line, accent, turnEls } from '../src/dsl.mjs';

const NIB = poly([[12, 20.5], [6.5, 13], [9, 6], [15, 6], [17.5, 13]], 1, true);
const FLIP = [body(poly([[9.5, 6], [9.5, 18], [3.5, 18]], 0.8, true)), line(poly([[14.5, 6], [14.5, 18], [20.5, 18]], 0.8, true)), line(L(12, 3.5, 12, 4.5)), line(L(12, 11.5, 12, 12.5)), line(L(12, 19.5, 12, 20.5))];
const ALIGN = [line(L(4, 3.5, 4, 20.5)), body(R(7, 6, 11, 4, 1.2)), accent(R(7, 14, 7, 4, 1.2))];

export default {
  category: 'design',
  icons: [
    icon('pen-tool', 'Pen Tool', ['vector', 'bezier', 'path', 'draw', 'anchor'], [body(NIB), line(L(12, 19.8, 12, 14.6)), line(C(12, 13, 1.5)), accent(L(9, 3.5, 15, 3.5))], { badges: ['add', 'remove'] }),
    icon('brush', 'Brush', ['paint', 'art', 'draw', 'stroke', 'creative'], [body('M4.5 20c.3-2.6 1.6-4.8 4-4.8a2.4 2.4 0 0 1 2.4 2.4c0 1.9-1.8 3-4.3 2.6Z'), line(L(10.4, 14.1, 19.5, 5)), accent(D(17, 13.5))], { anim: 'wiggle' }),
    icon('palette', 'Palette', ['colour', 'color', 'paint', 'art', 'theme'], [body('M12 3.5a8.5 8.5 0 0 0 0 17c1.2 0 1.8-.8 1.8-1.8 0-1.4-1-1.7-1-2.9 0-1 .8-1.8 1.8-1.8h2.2a3.7 3.7 0 0 0 3.7-3.7C20.5 6.6 16.7 3.5 12 3.5Z'), line(D(7.5, 11.5)), line(D(9, 7.5)), line(D(13.2, 6.8)), accent(D(16.6, 9.6))], { anim: 'wiggle' }),
    icon('color-picker', 'Colour Picker', ['eyedropper', 'pipette', 'sample', 'color', 'colour'], [body('M14.5 4.8a2.4 2.4 0 0 1 3.4 0l1.3 1.3a2.4 2.4 0 0 1 0 3.4l-2 2-4.7-4.7Z'), line('M13.4 8.9 6.2 16.1a2 2 0 0 0-.6 1.4v.9h.9a2 2 0 0 0 1.4-.6l7.2-7.2'), line(L(11.5, 5.9, 18.1, 12.5)), accent(D(4, 20.2))]),
    icon('crop', 'Crop', ['trim', 'cut', 'resize', 'image', 'frame'], [line('M7 3.5V15a2 2 0 0 0 2 2h11.5'), line('M3.5 7H15a2 2 0 0 1 2 2v11.5')], { noAccent: true }),
    icon('frame', 'Frame', ['artboard', 'canvas', 'board', 'layout'], [line(L(8, 3.5, 8, 20.5)), line(L(16, 3.5, 16, 20.5)), line(L(3.5, 8, 20.5, 8)), line(L(3.5, 16, 20.5, 16))], { noAccent: true }),
    icon('bezier-curve', 'Bezier Curve', ['vector', 'path', 'curve', 'node', 'handle'], [line('M6.5 16.5C8 10 16 14 17.5 7.5'), body(R(3.5, 15.5, 3, 3, 0.8)), body(R(17.5, 5, 3, 3, 0.8)), accent(D(7.5, 7))]),
    icon('ruler', 'Ruler', ['measure', 'size', 'scale', 'length', 'dimension'], [body(rotateD(R(3.5, 9, 17, 6, 1.5), -45)), line(rotateD(L(7, 9.2, 7, 11.5), -45)), line(rotateD(L(10, 9.2, 10, 11), -45)), line(rotateD(L(13, 9.2, 13, 11.5), -45)), line(rotateD(L(16, 9.2, 16, 11), -45))], { noAccent: true }),
    icon('eraser', 'Eraser', ['erase', 'rubber', 'clear', 'delete', 'remove'], [body(poly([[10, 20], [4.5, 14.5], [13.5, 5.5], [20, 12], [12, 20]], 0.8, true)), line(L(8.5, 10.5, 15, 17)), accent(L(15.5, 20, 20.5, 20))]),
    icon('paint-bucket', 'Paint Bucket', ['fill', 'bucket', 'paint', 'colour', 'color'], [body(poly([[11, 3.5], [19, 11.5], [13, 17.5], [5, 9.5]], 1, true)), line(L(6.8, 11.3, 17.2, 11.3)), accent('M19.6 15.2c.8 1.2 1.3 2 1.3 2.7a1.3 1.3 0 0 1-2.6 0c0-.7.5-1.5 1.3-2.7Z')], { anim: 'wiggle' }),
    icon('shapes', 'Shapes', ['geometry', 'circle', 'square', 'objects', 'elements'], [body(C(8.5, 8.5, 5)), body(R(11, 11, 9.5, 9.5, 2), { cover: true })], { noAccent: true }),
    icon('blend', 'Blend', ['mask', 'opacity', 'overlap', 'mix', 'intersect'], [body(C(9, 12, 5.5)), line(C(15, 12, 5.5))], { noAccent: true }),
    icon('aspect-ratio', 'Aspect Ratio', ['resize', 'proportion', 'dimension', 'scale'], [body(R(3.5, 6, 17, 12, 2.5)), line(poly([[7, 12], [7, 9.5], [9.5, 9.5]], 0.4)), accent(poly([[14.5, 14.5], [17, 14.5], [17, 12]], 0.4))]),
    icon('flip-horizontal', 'Flip Horizontal', ['mirror', 'reflect', 'flip', 'symmetry'], FLIP, { noAccent: true, variants: [{ name: 'flip-vertical', title: 'Flip Vertical', tags: ['mirror', 'reflect', 'flip', 'vertical'], els: turnEls(FLIP, 90) }] }),
    icon('align-object-left', 'Align Left', ['align', 'objects', 'left', 'arrange', 'layout'], ALIGN, { dir: 'left', turns: { top: 90, right: 180, bottom: -90 } }),
    icon('distribute-horizontal', 'Distribute Horizontal', ['spacing', 'distribute', 'arrange', 'even'], [line(L(4, 3.5, 4, 20.5)), line(L(20, 3.5, 20, 20.5)), body(R(9.5, 7, 5, 10, 1.2))], { noAccent: true, variants: [{ name: 'distribute-vertical', title: 'Distribute Vertical', tags: ['spacing', 'distribute', 'arrange', 'vertical'], els: turnEls([line(L(4, 3.5, 4, 20.5)), line(L(20, 3.5, 20, 20.5)), body(R(9.5, 7, 5, 10, 1.2))], 90) }] }),
  ],
};
