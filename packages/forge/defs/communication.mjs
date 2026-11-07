import { R, C, L, A, poly, D } from '../src/geo.mjs';
import { icon, body, line, accent } from '../src/dsl.mjs';

const HANDSET = 'M8.3 3.8 6.1 4.4A2 2 0 0 0 4.6 6.6c.8 6.8 6 12 12.8 12.8a2 2 0 0 0 2.2-1.5l.6-2.2a1.5 1.5 0 0 0-.9-1.8l-2.6-1.1a1.5 1.5 0 0 0-1.7.4l-1.1 1.3a11 11 0 0 1-4.4-4.4L10.8 9a1.5 1.5 0 0 0 .4-1.7L10.1 4.7a1.5 1.5 0 0 0-1.8-.9Z';
const BUBBLE = 'M7 4.5h10A3 3 0 0 1 20 7.5v7a3 3 0 0 1-3 3h-6l-4 3v-3a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3Z';

export default {
  category: 'communication',
  icons: [
    // The Figma mail is the base; only its variants are drawn here.
    icon('mail', 'Mail', ['email', 'envelope', 'inbox', 'message'], [body(R(3.5, 5.5, 17, 13, 3)), line('M7.5 9.5l3.3 2.4c.7.5 1.7.5 2.4 0l3.3-2.4')], { extend: true, badges: ['add', 'remove', 'check', 'close', 'alert'] }),
    icon('mail-open', 'Mail Open', ['email', 'read', 'opened', 'envelope', 'message'], [body('M3.5 10.3 10.8 5a2 2 0 0 1 2.4 0l7.3 5.3v7.2a2.5 2.5 0 0 1-2.5 2.5h-12a2.5 2.5 0 0 1-2.5-2.5Z'), line('M4 10.7l6.8 4.6c.7.5 1.7.5 2.4 0l6.8-4.6')], { noAccent: true, badges: ['check'] }),
    icon('phone', 'Phone', ['call', 'telephone', 'contact', 'mobile'], [body(HANDSET), accent(A(13.2, 10.8, 3, -90, 0))], { anim: 'wiggle', badges: ['add', 'check', 'close'] }),
    icon('phone-call', 'Phone Call', ['calling', 'ringing', 'incoming', 'telephone'], [body(HANDSET), accent(A(13.2, 10.8, 3, -90, 0)), line(A(13.2, 10.8, 6.2, -90, 0))], { anim: 'wiggle' }),
    icon('phone-off', 'Phone Off', ['hang up', 'end call', 'decline', 'mute'], [body(HANDSET), line(L(4.5, 4.5, 19.5, 19.5), { cover: true })], { anim: 'wiggle', noAccent: true }),
    icon('message', 'Message', ['chat', 'comment', 'bubble', 'conversation', 'text'], [body(BUBBLE), line(L(8, 9, 16, 9)), accent(L(8, 12.5, 12.5, 12.5))], { badges: ['add', 'check', 'alert'] }),
    icon('message-dots', 'Message Typing', ['chat', 'typing', 'reply', 'bubble', 'thinking'], [body(BUBBLE), line(D(8.5, 11)), accent(D(12, 11)), line(D(15.5, 11))]),
    icon('messages', 'Messages', ['chats', 'conversation', 'discussion', 'thread', 'forum'], [body('M6.5 3.5h6a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3H8l-3 2.2v-2.7A3 3 0 0 1 3.5 9.5v-3a3 3 0 0 1 3-3Z'), body('M11.5 10h6a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3v2.5l-3-2.5h-3a3 3 0 0 1-3-3v-3a3 3 0 0 1 3-3Z', { cover: true }), accent(L(11.5, 14.5, 17.5, 14.5))]),
    icon('inbox', 'Inbox', ['mail', 'tray', 'received', 'messages'], [body('M4 13.5 6.3 6.3A2.5 2.5 0 0 1 8.7 4.5h6.6a2.5 2.5 0 0 1 2.4 1.8L20 13.5v4A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5Z'), line('M4.2 13.5H8.5l1.2 2h4.6l1.2-2h4.3'), accent(L(9.5, 9.5, 14.5, 9.5))], { badges: ['check', 'alert'] }),
    icon('send', 'Send', ['paper plane', 'submit', 'message', 'share', 'deliver'], [body(poly([[20, 4], [13.5, 20], [11, 13], [4, 10.5]], 1.2, true)), accent(L(12.6, 11.4, 15.2, 8.8))], { anim: { preset: 'nudge', dir: [0.7, -0.7], dist: 2 } }),
    icon('at-sign', 'At Sign', ['email', 'mention', 'address', 'username'], [line(C(12, 12, 3.2)), line('M15.2 12v1.3a2.3 2.3 0 0 0 4.6 0V12A7.8 7.8 0 1 0 16.6 18.3')], { noAccent: true }),
    icon('megaphone', 'Megaphone', ['announce', 'broadcast', 'marketing', 'campaign', 'loud'], [body('M4 10a1.5 1.5 0 0 1 1.5-1.5H8l8.5-4v15l-8.5-4H5.5A1.5 1.5 0 0 1 4 14Z'), accent(L(19.8, 10, 19.8, 14)), line('M8.5 16.5l.9 3.3a1 1 0 0 0 1 .7h.5a1 1 0 0 0 1-1.2l-.6-2.3', { cover: true })], { anim: 'wiggle' }),
    icon('video-call', 'Video Call', ['camera', 'meeting', 'conference', 'stream', 'record'], [body(R(3.5, 6.5, 12, 11, 2.5)), body(poly([[17.5, 10.5], [20.5, 8.5], [20.5, 15.5], [17.5, 13.5]], 1, true)), accent(L(7, 10, 9.5, 10))], { badges: ['add', 'close'] }),
    icon('mic', 'Microphone', ['record', 'voice', 'audio', 'speak', 'podcast'], [body(R(9, 3.5, 6, 11, 3)), line('M6 11.5a6 6 0 0 0 12 0'), line(L(12, 17.5, 12, 20.5)), accent(L(12, 7, 12, 9.5))], { anim: 'pulse', variants: [{ name: 'mic-off', title: 'Microphone Off', tags: ['mute', 'silent', 'disabled', 'no audio'], els: [body(R(9, 3.5, 6, 11, 3)), line('M6 11.5a6 6 0 0 0 12 0'), line(L(12, 17.5, 12, 20.5)), line(L(4.5, 4.5, 19.5, 19.5), { cover: true })], noAccent: true }] }),
    icon('voicemail', 'Voicemail', ['tape', 'recording', 'message', 'audio'], [line(C(7, 12, 3.2)), line(C(17, 12, 3.2)), line(L(7, 15.2, 17, 15.2))], { noAccent: true }),
    icon('broadcast', 'Broadcast', ['signal', 'live', 'radio', 'stream', 'wireless'], [body(C(12, 12, 1.8)), line(A(12, 12, 5, -140, -40)), line(A(12, 12, 5, 40, 140)), accent(A(12, 12, 8.5, -135, -45)), line(A(12, 12, 8.5, 45, 135))], { anim: 'pulse' }),
    icon('contact-card', 'Contact Card', ['vcard', 'id', 'profile', 'business card', 'person'], [body(R(3, 5, 18, 14, 2.5)), line(C(8.5, 10.5, 2)), line('M5.5 16a3.2 3.2 0 0 1 6 0'), accent(L(14, 10, 18, 10)), line(L(14, 13.5, 17, 13.5))]),
  ],
};
