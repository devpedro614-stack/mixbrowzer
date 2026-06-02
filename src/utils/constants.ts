export const MUSIC_GENRES = [
  "Pop",
  "Rock",
  "Hip-Hop",
  "Eletrônico",
  "Jazz",
  "Clássico",
  "Sertanejo",
  "Samba",
  "Reggae",
  "K-pop",
  "Indie",
  "Metal",
  "Funk",
  "Forró",
  "R&B",
  "Soul",
  "Blues",
  "Country",
  "Pagode",
  "Bossa Nova",
  "Outros",
];

export const APP_NAME = "MixBrowzer";

export const ITEMS_PER_PAGE = 10;

export const MESSAGES = {
  success: {
    musicAdded: "Música adicionada com sucesso!",
    musicUpdated: "Música atualizada com sucesso!",
    musicDeleted: "Música deletada com sucesso!",
    login: "Login realizado com sucesso!",
    signup: "Conta criada com sucesso!",
    resetLink: "Link de recuperação enviado para seu email!",
    passwordReset: "Senha redefinida com sucesso!",
  },
  error: {
    loginFailed: "Email ou senha incorretos.",
    emailExists: "Email já cadastrado.",
    passwordMismatch: "As senhas não coincidem.",
    generic: "Erro ao processar requisição. Tente novamente.",
    tokenExpired: "Token expirado ou inválido.",
    loadFailed: "Falha ao carregar dados.",
    deleteFailed: "Falha ao deletar música.",
  },
  validation: {
    invalidEmail: "Email inválido.",
    passwordMinLength: "Senha deve ter no mínimo 8 caracteres.",
    required: "Campo obrigatório.",
    invalidUrl: "URL inválida.",
    ratingRange: "Nota deve estar entre 0 e 10.",
    nameMinLength: "Nome deve ter no mínimo 3 caracteres.",
    passwordMinLengthLogin: "Senha deve ter no mínimo 6 caracteres.",
  },
};
