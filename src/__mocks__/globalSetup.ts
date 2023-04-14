import { tryber } from "@src/features/database";

expect.extend({
  toBeNow(received: number, precision: number = 0) {
    const current = new Date(`${received} GMT+0`).getTime() / 10000;
    const now = new Date().getTime() / 10000;
    const message = () =>
      `expected ${received} to be now : the difference is ${current - now}`;
    return { message, pass: Math.abs(current - now) < precision };
  },
});

export {};
beforeAll(async () => {
  await tryber.create();
});

afterAll(async () => {
  await tryber.drop();
  await tryber.destroy();
});
