export const buildToken = (role?: string) => {
  const claims = role
    ? { "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": role }
    : {};
  return `h.${Buffer.from(JSON.stringify(claims)).toString("base64url")}.s`;
};
