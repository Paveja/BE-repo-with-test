import request from "supertest";
import app, { server } from "../app.js";

afterAll(() => {
  server.close();
});

describe("addition calculator", () => {
  test("GET / serves the calculator page", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toMatch(/text\/html/);
    expect(response.text).toContain("Quick addition");
  });

  test("POST /api/add returns the sum for valid finite numbers", async () => {
    const response = await request(app)
      .post("/api/add")
      .send({ firstNumber: 12.5, secondNumber: -3 });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ success: true, sum: 9.5 });
  });

  test("POST /api/add rejects missing values", async () => {
    const response = await request(app)
      .post("/api/add")
      .send({ firstNumber: 10 });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.fields).toEqual(["secondNumber"]);
  });

  test("POST /api/add rejects non-numeric values", async () => {
    const response = await request(app)
      .post("/api/add")
      .send({ firstNumber: "12", secondNumber: null });

    expect(response.statusCode).toBe(400);
    expect(response.body.fields).toEqual(["firstNumber", "secondNumber"]);
  });

  test("POST /api/add rejects non-finite numbers", async () => {
    const response = await request(app)
      .post("/api/add")
      .set("Content-Type", "application/json")
      .send('{"firstNumber":1e309,"secondNumber":2}');

    expect(response.statusCode).toBe(400);
    expect(response.body.fields).toEqual(["firstNumber"]);
  });

  test("POST /api/add returns a safe error for malformed JSON", async () => {
    const response = await request(app)
      .post("/api/add")
      .set("Content-Type", "application/json")
      .send("{");

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "Send a valid JSON request body.",
    });
  });
});

describe("legacy service routes", () => {
  test("GET /user-vault/health returns health status", async () => {
    const response = await request(app).get("/user-vault/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("GET /user-vault/user/:id returns a sample user", async () => {
    const response = await request(app).get("/user-vault/user/123");

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe("123");
    expect(response.body.name).toBe("John Doe");
  });
});