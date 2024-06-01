// import { NextResponse} from "next/server";
// import { withAuth } from "next-auth/middleware";

// export default withAuth(
//     function middleware(request) {
//         if(request.nextUrl.pathname.startsWith('/dashboard') && request.nextauth.token?.role!=="professor"){
//             return NextResponse.redirect(new URL("/signIn",request.url));
//         }else if(request.nextUrl.pathname.startsWith('/student') && request.nextauth.token?.role!=="student"){
//             return NextResponse.redirect(new URL("/signIn",request.url));
//         }
//     },
//     {
//         callbacks:{
//             authorized({token}){
//                 return !!token;
//             },
//         }
//     }
// );

export const config = {matcher:["/"]}

export default function middleware(){
    
}