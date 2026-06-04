export async function mockAirtimeProvider() {
  await new Promise((res) => setTimeout(res, 2000));

  return {
    status: "success",
    message: "Airtime delivered",
    providerRef: `MOCK-${Date.now()}`,
  };
}