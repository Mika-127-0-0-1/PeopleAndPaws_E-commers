import prismadb from "@/lib/prismadb";
import PrivacyPolicyForm from "./components/privacy-form";
import HtmlLegend from "@/components/htmllegend";


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
        <HtmlLegend />
        <PrivacyPolicyForm 
        initialData={Store}
        />
      </div>
    );
  };
  
  export default PrivacyPolicyPage;