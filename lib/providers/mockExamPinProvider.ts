export async function mockExamPinProvider(examType: string) {
  await new Promise((res) => setTimeout(res, 2000));

  return {
    status: "success",
    pin: `${examType}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(
      1000 + Math.random() * 9000
    )}`,
    serial: `SERIAL-${Date.now()}`,
    providerRef: `EXAM-MOCK-${Date.now()}`,
  };
}