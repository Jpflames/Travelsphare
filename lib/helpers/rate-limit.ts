type Entry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, Entry>();

export function limitByIp(ip: string, max = 60, windowMs = 60_000) {
  const now = Date.now();
  const current = store.get(ip);

  if (!current || current.resetAt < now) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return { limited: false, remaining: max - 1 };
  }

  if (current.count >= max) {
    return { limited: true, remaining: 0 };
  }

  current.count += 1;
  store.set(ip, current);
  return { limited: false, remaining: max - current.count };
}
