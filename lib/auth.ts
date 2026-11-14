

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
const client = new MongoClient(process.env.BETTER_AUTH_DB as string);
const db = client.db("job-website");
export const auth = betterAuth({

emailAndPassword: { 
    enabled: true, 
  },
  user:{
    additionalFields:{
      role:{
        type:["seeker", "recruiter", "admin"],
        input:true,
        defaultValue:"seeker",
      }
    }
  },
   socialProviders: {
    google: {
      clientId: process.env.BETTER_AUTH_GOOGLE_URL as string,
      clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET as string,
    },
  },
  databaseHooks:{
    user:{
      create:{
        before:async (user)=>({
          data:{
            ...user,
            role:user.role=== "recruiter"? "recruiter":"seeker",
          },
        }),
      },
    },
  },

  database: mongodbAdapter(db),
});
