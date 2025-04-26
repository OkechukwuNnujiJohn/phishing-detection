export const checkUrl = async (url) => {
  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/combined-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  return response.json();
};
