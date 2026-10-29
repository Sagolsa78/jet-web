'use client';

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/918882579628"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 text-sm font-medium text-white shadow-[0_8px_30px_rgba(11,35,63,0.18)] transition-transform hover:scale-105"
    >
      <span className="material-symbols-outlined text-xl">chat</span>
      <span className="hidden sm:inline">Chat with Concierge</span>
    </a>
  );
}
