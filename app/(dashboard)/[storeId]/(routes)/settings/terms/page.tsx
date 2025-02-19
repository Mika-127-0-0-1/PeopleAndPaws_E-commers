import prismadb from "@/lib/prismadb";
import TermsPolicyForm from "./components/terms-form";


const TermsPolicyPage= async ({
  params
}: {
  params: {storeId: string}
}) => {
  const Store = await prismadb.store.findUnique({
    where: {
        id: params.storeId
    }
  });
  
    return (
      <div className="p-10">
        <TermsPolicyForm 
        initialData={Store}
        />
      </div>
    );
  };
  
  export default TermsPolicyPage;