export const validateEmail = (email: string): string | null => {
  if (!email) return "Campo obrigatório.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Email inválido.";
  return null;
};

export const validatePassword = (password: string, minLength = 8): string | null => {
  if (!password) return "Campo obrigatório.";
  if (password.length < minLength) return `Senha deve ter no mínimo ${minLength} caracteres.`;
  return null;
};

export const validateRequired = (value: string, fieldName?: string): string | null => {
  if (!value || value.trim() === "") return fieldName ? `${fieldName} é obrigatório.` : "Campo obrigatório.";
  return null;
};

export const validateUrl = (url: string): string | null => {
  if (!url) return null; // URL is optional
  try {
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(url)) return "URL inválida. Use https:// ou http://";
    return null;
  } catch {
    return "URL inválida.";
  }
};

export const validateRating = (rating: number): string | null => {
  if (rating === undefined || rating === null) return "Campo obrigatório.";
  if (rating < 0 || rating > 10) return "Nota deve estar entre 0 e 10.";
  return null;
};
