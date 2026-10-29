import request from "supertest";
import app, { server } from "../app.js";


afterAll(() => {
  server.close();
});
describe("API Tests", () => {

  test("GET / should return the addition app", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("text/html");
    expect(response.text).toContain("Add two numbers.");
    expect(response.text).toContain('id="addition-form"');
  });

  test("GET /styles.css should serve the responsive app styles", async () => {
    const response = await request(app).get("/styles.css");

    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("text/css");
    expect(response.text).toContain("prefers-reduced-motion");
  });

  test("GET /user-vault/health should return health status", async () => {
    const response = await request(app).get("/user-vault/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.env).toBe("preview");
  });

  test("GET /user-vault/user/123 should return user", async () => {
    const response = await request(app).get("/user-vault/user/123");

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe("123");
    expect(response.body.name).toBe("John Doe");
  });

//   test("POST /user-vault/user should create user", async () => {
//     const response = await request(app)
//       .post("/user-vault/user")
//       .send({
//         name: "Paveja",
//         role: "QA"
//       });

//     expect(response.statusCode).toBe(201);
//     expect(response.body.success).toBe(true);
//     expect(response.body.user.name).toBe("Paveja");
//   });

//   test("POST /user-vault/user should fail when fields missing", async () => {
//     const response = await request(app)
//       .post("/user-vault/user")
//       .send({
//         name: "Paveja"
//       });

//     expect(response.statusCode).toBe(400);
//     expect(response.body.success).toBe(false);
//   });

});