import React from "react";
import { OrderForm } from "./OrderForm";
import MockNextRouter from "@/lib/test/mockRouter";
import { MockedProvider } from "@apollo/client/testing";
import { ThemeProvider } from "@/lib/providers/ThemeProvider";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

describe("<OrderForm />", () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
  });
  beforeEach(function () {
    cy.fixture("order").then((order) => {
      this.order = order;
    });
  });
  it("should render", function () {
    cy.mount(
      <MockNextRouter>
        <MockedProvider mocks={[]} addTypename={false}>
          <ThemeProvider>
            <OrderForm order={this.order} />
          </ThemeProvider>
        </MockedProvider>
      </MockNextRouter>
    );
  });

  it("should throw error when user clicks save + no description", function () {
    cy.mount(
      <MockNextRouter>
        <MockedProvider mocks={[]} addTypename={false}>
          <ThemeProvider>
            <OrderForm order={this.order} />
          </ThemeProvider>
        </MockedProvider>
      </MockNextRouter>
    );

    cy.get("textarea").type("{selectAll}{backspace}");
    cy.get("button[type='submit']").click();
    cy.contains("Description must be 2-1000 characters long");
  });
});
