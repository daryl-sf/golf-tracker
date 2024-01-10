import { faker } from "@faker-js/faker";

describe("smoke tests", () => {
  it("should allow you to register and login", () => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
    };
    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.visitAndCheck("/");
    cy.findByRole("link", { name: /sign up/i }).click();

    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText(/password/i).type(loginForm.password);
    cy.findByRole("button", { name: /create account/i }).click();

    cy.findByRole("link", { name: /rounds in the book/i }).click();
    // cy.findByRole("button", { name: /logout/i }).click();
    // cy.findByRole("link", { name: /log in/i });
  });

  it("should allow you to make a round", () => {
    const testRound = {
      course: faker.lorem.words(3),
      date: faker.date.past().toISOString().split("T")[0],
      tee: faker.lorem.words(1),
    };
    cy.login();
    cy.visitAndCheck("/");

    cy.findByRole("link", { name: /lets golf/i }).click();

    cy.findByRole("textbox", { name: /course/i }).type(testRound.course);
    cy.get("input[type=date]").type(testRound.date);
    cy.findByRole("textbox", { name: /tee/i }).type(testRound.tee);
    cy.findByRole("button", { name: /submit/i }).click();

    // cy.findByRole("button", { name: /delete/i }).click();

    // cy.findByText("No notes yet");
  });
});
