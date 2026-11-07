import { R, C, L, poly, D, star, gear, mirrorD } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const LOBE = 'M12 5a3 3 0 0 0-5.5 1.5A3 3 0 0 0 4.5 11a3 3 0 0 0 1 4.5A3 3 0 0 0 9 19.5a3 3 0 0 0 3-1.5Z';
const BUBBLE = 'M3.5 6.5A2.5 2.5 0 0 1 6 4h12a2.5 2.5 0 0 1 2.5 2.5v8A2.5 2.5 0 0 1 18 17h-8l-4.5 3.5V17H6a2.5 2.5 0 0 1-2.5-2.5Z';

export default {
  category: 'ai',
  icons: [
    icon('robot', 'Robot', ['bot', 'ai', 'assistant', 'automation', 'android'], [body(R(4.5, 8, 15, 11, 3)), line(L(12, 8, 12, 5.5)), line(D(12, 4)), line(D(9, 12.5)), line(D(15, 12.5)), accent(L(10, 16, 14, 16))], { anim: 'wiggle', badges: ['check', 'alert'] }),
    icon('brain', 'Brain', ['mind', 'intelligence', 'think', 'ai', 'neural'], [body(LOBE), body(mirrorD(LOBE)), line(L(12, 5.2, 12, 17.8))], { noAccent: true, anim: 'pulse' }),
    icon('ai-chat', 'AI Chat', ['assistant', 'chatbot', 'ai', 'conversation', 'generate'], [body(BUBBLE), accent(star(12, 10.5, 3.2, 1.1, 4, 0.3))], { anim: 'pulse' }),
    icon('neural-network', 'Neural Network', ['ai', 'model', 'nodes', 'deep learning', 'graph'], [body(C(5.5, 6, 2)), body(C(5.5, 18, 2)), body(C(12, 12, 2)), body(C(18.5, 6, 2)), body(C(18.5, 18, 2)), line(L(7.1, 7.2, 10.4, 10.8)), line(L(7.1, 16.8, 10.4, 13.2)), line(L(13.6, 10.8, 16.9, 7.2)), line(L(13.6, 13.2, 16.9, 16.8))], { noAccent: true }),
    icon('prompt', 'Prompt', ['ai', 'input', 'command', 'generate', 'ask'], [body(R(3, 6, 18, 12, 2.5)), line(poly([[6.5, 10], [8.5, 12], [6.5, 14]], 0.4)), line(L(10.5, 14, 13.5, 14)), accent(star(16.5, 11, 2.4, 0.8, 4, 0.2))]),
    icon('automation', 'Automation', ['workflow', 'auto', 'process', 'ai', 'power'], [body(gear(12, 12, 8.5, 6.8, 8, 0.6)), accent(poly([[12.8, 8.5], [10.5, 12.3], [13.5, 11.7], [11.2, 15.5]], 0.3))], { anim: 'spin' }),
    icon('waveform', 'Waveform', ['voice', 'audio', 'speech', 'ai', 'sound'], [line(L(4, 10.5, 4, 13.5)), line(L(8, 8, 8, 16)), line(L(12, 4.5, 12, 19.5)), line(L(16, 8, 16, 16)), accent(L(20, 10.5, 20, 13.5))], { anim: 'pulse' }),
  ],
};
