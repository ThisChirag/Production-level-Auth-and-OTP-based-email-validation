
interface User {
    name: string
    id: any
    email: any
    hashedPassword: any
}
interface Blog {
    blog_id: string
    title: string,
    description: string,
    createdAt: Date,
    userId: string
}

export const USERS: User[] = [];
export const BLOGS = new Map<string, Array<Blog>>();
export const ACTIVE_TOKENS = new Map<string,string>();


// prefer map than an object, if the cotent are dynamic;
 // method do declare a map: const TODOS = new Map<string, Array<{ TodoId: number; Title: string; Description: string; Completed: boolean }>>()
// export const TODOS = new Map();
   