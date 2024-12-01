import request from 'supertest';
import app from '../src/app';
import { USERS, ACTIVE_TOKENS, BLOGS } from '../src/db/memoryDB';
import { hashingPassword } from '../src/utils /hashPassword';
import { generateToken } from '../src/utils /GeneratorLogic';


describe("authentication", ()=>{
    beforeEach(()=>{
        USERS.length = 0;
        ACTIVE_TOKENS.clear();
    })

    //Signup test cases
    it("should return 201, on creation of a new user", async()=>{
        const response = await request(app)
            .post('/test/signup')
            .send({name: "Chirag", email: "abc@gmail.com", password: "12345"});

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('JWT_Token');
        expect(USERS.length).toBe(1);
    })

    it("it should return 400 if fields are missing", async()=>{
        const response = await request(app)
             .post('/test/signup')
             .send({name: "Chirag", password: "12345"});

        expect(response.status).toBe(400);
        expect(response.body.msg).toBe('please provide all the details');
    })

    it("it should return 409 if the user is already present ", async()=>{
        USERS.push({name:"Chirag", id: "123", email: "abc@gmail.com", hashedPassword: "hashed_password"});
        const response = await request(app)
            .post('/test/signup')
            .send({name: "Chirag", email: "abc@gmail.com", password: "123"});

        expect(response.status).toBe(409);
        expect(response.body.msg).toBe("user is already exists please login");
    } )

    //login test cases with nested describe
    describe("login tests",()=>{
        beforeEach( async()=>{
            const hashedPassword = await hashingPassword("12345")
            USERS.push({
                name: "Chirag",
                id: "123",
                email: "abc@gmail.com",
                hashedPassword: hashedPassword
            });
        });

        it("should return statusCode 200, on correct credentials", async()=>{
            const response = await request(app)
                .post('/test/login')
                .send({
                    email: "abc@gmail.com",
                    password: "12345"
                });
            
            expect(response.status).toBe(200);
            expect(response.body.msg).toBe("Login Succussful, token is valid for 1 hour");
            expect(response.body).toHaveProperty("newToken");
        })

        it("shoud retun status code 401, on wrong credentials", async()=>{
            const response = await request(app)
                .post('/test/login')
                .send({
                    email: "abc@gmail.com",
                    password: "wrongPassword"
                });

            expect(response.status).toBe(401);
            expect(response.body.msg).toBe("Wrong email or password");
        });

        it("shoud retun status code 400, on missing one or more fields", async()=>{
            const response = await request(app)
                .post('/test/login')
                .send({
                    password: "wrongPassword",
                });

            expect(response.status).toBe(400);
            expect(response.body.msg).toBe("please provide all the details");
        });

        it("shoud retun status code 404, if user not found", async()=>{
            const response = await request(app)
                .post('/test/login')
                .send({
                    email: "abcdefg@gmail.com",
                    password: "wrongPassword",
                });

            expect(response.status).toBe(404);
            expect(response.body.msg).toBe("user not found");
        });

        afterAll(()=>{
            console.log("All login test completed");
        });
        
    });



describe("authentication", () => {
    let hashedPassword: string;
    let name: string;
    let id: string;
    let email: string;
    let token: string;

    beforeEach(async () => {

        name = "chirag";
        id = "1234";
        email = "abc@gmail.com";
        hashedPassword = await hashingPassword("12345");
        token = await generateToken(name, email, id);

        USERS.push({
            name,
            id,
            email,
            hashedPassword,
        });
        ACTIVE_TOKENS.set(id, token);
        console.log("generated token:", token);
    });

    it("token is correct, next function will be called", async () => {
        const response = await request(app)
            .get('/test/home')
            .set('Authorization', `Bearer ${token}`); 

        expect(response.status).toBe(200);
        expect(response.body.msg).toBe("Your Blogs");
        expect(response.body).toHaveProperty('data');

    });

    it("should return status 401, token not provided", async()=>{
        const response = await request(app)
            .get('/test/home')
        
        expect(response.status).toBe(401);
        expect(response.body.msg).toBe("Unauthorized, Token not provided.. Please Create Account or login");
    })
});

describe("testing home route", ()=>{
    let hashedPassword: string;
    let name: string;
    let id: string;
    let email: string;
    let token: string;

    beforeEach(async () => {

        name = "chirag";
        id = "1234";
        email = "abc@gmail.com";
        hashedPassword = await hashingPassword("12345");
        token = await generateToken(name, email, id);

        USERS.push({
            name,
            id,
            email,
            hashedPassword,
        });
        ACTIVE_TOKENS.set(id, token);
        BLOGS.set(email,[{blog_id: "123", title: "testing", description: "test", createdAt: new Date() , userId: id }])

    });

    it("should return 200, and it shows all the blogs", async ()=>{
        const response = await request(app)
            .get('/test/home')
            .set('Authorization', `Bearer ${token}`); 

        expect(response.status).toBe(200);
        expect(response.body.msg).toBe("Your Blogs");
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('name');
        expect(response.body.data).toHaveProperty('email');
    });


});

    describe("tesing newblog route", ()=>{
        let hashedPassword: string;
        let name: string;
        let id: string;
        let email: string;
        let token: string;

        beforeEach(async()=>{
            name = "chirag-"+Math.random();
            id = "1234";
            email = "abc@gmail.com";
            hashedPassword = await hashingPassword("12345");
            token = await generateToken(name, email, id);
    
            USERS.push({
                name,
                id,
                email,
                hashedPassword,
            });
            ACTIVE_TOKENS.set(id, token);
            BLOGS.clear();
        })

        it("should return 201, on new blog succussfully created", async()=>{
            const response = await request(app)
                .post('/test/newblog')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: "First Title",
                    description: "First Description"
                })
            
            expect(response.status).toBe(201);
            expect(response.body.msg).toBe("New Blog Created Succussfully");
            expect(response.body).toHaveProperty('blog');
            expect(response.body.blog).toHaveProperty('name');
            expect(response.body.blog.name).toHaveProperty('title');
            expect(response.body.blog.name).toHaveProperty('description');
            expect(response.body.blog.name).toHaveProperty('createdAt');
        })
    })
    afterAll(() => {
        console.log("All tests completed");
    });
})