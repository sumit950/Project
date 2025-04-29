export const fetchProducts = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/products");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};
