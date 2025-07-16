import prismadb from "@/lib/prismadb";
import TermsPolicyForm from "./components/terms-form";
import HtmlLegend from "@/components/htmllegend";


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
        <HtmlLegend />
        <TermsPolicyForm 
        initialData={Store}
        />
      </div>
    );
  };
  
  export default TermsPolicyPage;