export async function mockTvProvider() {
  await new Promise((res) => setTimeout(res, 2000));

  return {
    status: "success",
    message: "TV subscription activated",
    providerRef: `TV-MOCK-${Date.now()}`,
  };
}