// import Navbar from "@/components/navbar";
// import prismadb from "@/lib/prismadb";
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

// export const dynamic = "force-dynamic";

// export default async function DashboardLayout({
//     children, 
//     params
// }:{
//     children: React.ReactNode; 
//     params: {storeId: string}
// }) {
//     const { userId } = auth();

//     if(!userId){
//         redirect('/sign-in');
//     }

//     const store = await prismadb.store.findFirstOrThrow({
//         where: {
//             id: params.storeId,
//             userId
//         }
//     });

//     if(!store) {
//         redirect('/');
//     }

//     return(
//         <>
//             <Navbar />
//             {children}
//         </>
//     );
// };

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1>Dashboard test</h1>
      {children}
    </div>
  );
}