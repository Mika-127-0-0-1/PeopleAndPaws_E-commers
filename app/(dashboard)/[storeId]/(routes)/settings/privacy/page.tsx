import prismadb from "@/lib/prismadb";
import PrivacyPolicyForm from "./components/privacy-form";


const PrivacyPolicyPage = async ({
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
        <PrivacyPolicyForm 
        initialData={Store}
        />
      </div>
    );
  };
  
  export default PrivacyPolicyPage;