// // // write a function to create a users table in your database.
// // import { Client } from 'pg'
 
// // const client = new Client({
// //   connectionString: "postgresql://postgres:mysecretpassword@localhost/postgres"
// //   //   host: 'my.database-server.com',
// // //   port: 5334,
// // //   database: 'database-name',
// // //   user: 'database-user',
// // //   password: 'secretpassword!!',
// // })

// // export async function createUsersTable() {
// //     await client.connect()
// //     const result = await client.query(`
// //         CREATE TABLE users (
// //             id SERIAL PRIMARY KEY,
// //             username VARCHAR(50) UNIQUE NOT NULL,
// //             email VARCHAR(255) UNIQUE NOT NULL,
// //             password VARCHAR(255) NOT NULL,
// //             created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
// //         );
// //     `)
// //     console.log(result)
// // }

// import { Client } from "pg";

// const client = new Client({
//   connectionString: "postgresql://postgres:mysecretpassword@localhost/postgres"
// })


// export async function insertData() {
//     await client.connect();

//     const result = await client.query(`
//         INSERT INTO users (username, email, password)
//         VALUES ("testing", "abc@gmail.com", "testing")
//         `)

//     console.log(result);
// }

import { Client } from "pg";

const client = new Client({
  connectionString: "postgresql://postgres:mysecretpassword@localhost/postgres",
})


async function createTable(){
    try{
        const result = await client.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
            `);
            console.log("Users table created:", result.command);
    } 
    catch(error){
        console.log(`Error Occured: ${error}`);
    }
    finally{
        console.log("ran succussfully");
    }
}

 async function insertingData(){
    try{

        const result = await client.query(`
        INSERT INTO users (username, email, password)
        VALUES ('testing', 'abc@gmail.com', 'testing')
        RETURNING *; -- Return the inserted row for debugging
            `);
    }catch(error){
        console.log(`Error occurd ${error}`)
    }finally{
        console.log(`function completed succussfully`)
    }
}

export async function creatingAndInserting(){
    try{
        await client.connect();
        await createTable();
        await insertingData();

    }
    finally{
        await client.end();
    }
}



