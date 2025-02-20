export const REQUEST_TIMEOUT_DELAY = 3000;

export async function fetchTimeout(
  url: string,
  options = {},
  timeout = REQUEST_TIMEOUT_DELAY
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(url, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);

  return response;
}
