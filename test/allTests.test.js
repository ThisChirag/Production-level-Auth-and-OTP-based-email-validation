"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const memoryDB_1 = require("../src/db/memoryDB");
describe("authentication", () => {
    beforeEach(() => {
        memoryDB_1.USERS.length = 0;
        memoryDB_1.ACTIVE_TOKENS.clear();
    });
    it("should return 201, on creation of a new user", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/test/signup')
            .send({ name: "Chirag", email: "abc@gmail.com", password: "12345" });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('JWT_Token');
        expect(memoryDB_1.USERS.length).toBe(1);
    });
    it("it should return 400 if fields are missing", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/test/signup')
            .send({ name: "Chirag", password: "12345" });
        expect(response.status).toBe(400);
        expect(response.body.msg).toBe('please provide all the details');
    });
    it("it should return 409 if the user is already present ", async () => {
        memoryDB_1.USERS.push({ name: "Chirag", id: "123", email: "abc@gmail.com", hashedPassword: "hashed_password" });
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/test/signup')
            .send({ name: "Chirag", email: "abc@gmail.com", password: "123" });
        expect(response.status).toBe(409);
        expect(response.body.msg).toBe("user is already exists please login");
    });
    afterAll(() => {
        console.log("All tests completed");
    });
});
