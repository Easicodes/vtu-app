export async function mockDataProvider() {
  await new Promise((res) => setTimeout(res, 2000));

  return {
    status: "success",
    message: "Data bundle delivered",
    providerRef: `DATA-MOCK-${Date.now()}`,
  };
}