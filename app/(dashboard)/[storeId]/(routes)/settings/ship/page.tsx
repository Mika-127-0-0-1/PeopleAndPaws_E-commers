import prismadb from "@/lib/prismadb";
import ShippingPolicyForm from "./components/ship-form";
import HtmlLegend from "@/components/htmllegend";

const ShippingPolicyPage= async ({
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
            <ShippingPolicyForm 
            initialData={Store}/>
        </div>
    );
  };
  
  export default ShippingPolicyPage;