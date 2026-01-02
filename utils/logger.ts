export const logError = async (_message: string, _error?: unknown) => {
  if (typeof fetch !== 'function' || !process.env.NEXT_PUBLIC_ERROR_ENDPOINT) {
    return;
  }

  try {
    await fetch(process.env.NEXT_PUBLIC_ERROR_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: _message,
        error: typeof _error === 'object' ? JSON.stringify(_error) : String(_error),
        timestamp: new Date().toISOString(),
      }),
      keepalive: true,
    });
  } catch {
    // Intentionally swallow errors to avoid surfacing them to users.
  }
};
