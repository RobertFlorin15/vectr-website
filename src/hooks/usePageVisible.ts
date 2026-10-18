import { useSyncExternalStore } from 'react';

function subscribe(cb: () => void) {
  document.addEventListener('visibilitychange', cb);
  return () => document.removeEventListener('visibilitychange', cb);
}

export function usePageVisible() {
  return useSyncExternalStore(
    subscribe,
    () => !document.hidden,
    () => true,
  );
}
