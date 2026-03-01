// Demo Cart Model
export const getCart = () => ({ items: [], itemCount: 0, total: 0 });
export const addItem = (item) => ({ success: true, item });
