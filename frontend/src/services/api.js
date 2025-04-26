export const checkUrl = async (url) => {
  const response = await fetch('http://127.0.0.1:5000/api/check-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  return response.json();
};
