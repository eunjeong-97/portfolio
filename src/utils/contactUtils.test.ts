import { describe, it, expect } from "vitest";
import { isValidEmail } from "./contactUtils";

describe("isValidEmail", () => {
  it("accepts a standard email address", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
  });

  it("accepts an email with subdomains", () => {
    expect(isValidEmail("user@mail.example.co.kr")).toBe(true);
  });

  it("accepts an email with plus addressing", () => {
    expect(isValidEmail("user+tag@example.com")).toBe(true);
  });

  it("accepts an email with dots in the local part", () => {
    expect(isValidEmail("first.last@example.com")).toBe(true);
  });

  it("rejects an empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });

  it("rejects a string with no @ sign", () => {
    expect(isValidEmail("notanemail.com")).toBe(false);
  });

  it("rejects a string with no domain after @", () => {
    expect(isValidEmail("user@")).toBe(false);
  });

  it("rejects a string with no TLD (no dot in domain)", () => {
    expect(isValidEmail("user@domain")).toBe(false);
  });

  it("rejects a string with a space in the local part", () => {
    expect(isValidEmail("us er@example.com")).toBe(false);
  });

  it("rejects a string with a space in the domain", () => {
    expect(isValidEmail("user@exam ple.com")).toBe(false);
  });

  it("rejects a string with @ as the first character", () => {
    expect(isValidEmail("@example.com")).toBe(false);
  });

  it("rejects a string with multiple @ signs", () => {
    expect(isValidEmail("user@@example.com")).toBe(false);
  });

  it("rejects a plain word with no special characters", () => {
    expect(isValidEmail("notanemail")).toBe(false);
  });
});
