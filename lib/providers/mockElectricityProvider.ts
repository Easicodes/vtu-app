export async function mockElectricityProvider() {
  await new Promise((res) => setTimeout(res, 2000));

  return {
    status: "success",
    message: "Electricity token generated",
    token: `PHCN-${Math.floor(Math.random() * 1000000000)}`,
    providerRef: `ELEC-MOCK-${Date.now()}`,
  };
}