export const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }
  try {
    const text = await response.text();
    
    if (text.trim() === '') {
      return;
  }
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Error parsing JSON: ${error.message}`);
  }
};
