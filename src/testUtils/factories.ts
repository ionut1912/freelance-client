export const buildToken = (role?: string) => {
  const claims = role
    ? { "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": role }
    : {};
  return `h.${Buffer.from(JSON.stringify(claims)).toString("base64url")}.s`;
};

export const buildProfile = (overrides: object = {}) => ({
  id: 7,
  bio: "Experienced person",
  image: "data:image/png;base64,AAAA",
  isVerified: true,
  user: {
    id: 3,
    username: "ana",
    email: "ana@example.com",
    phoneNumber: "0712345678",
  },
  address: {
    id: 1,
    country: "Romania",
    city: "Cluj",
    street: "Main",
    streetNumber: "1",
    zipCode: "400000",
  },
  ...overrides,
});
