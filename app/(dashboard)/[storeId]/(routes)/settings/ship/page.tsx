import prismadb from "@/lib/prismadb";
import ShippingPolicyForm from "./components/ship-form";

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
            <ShippingPolicyForm 
            initialData={Store}/>
        </div>
    );
  };
  
  export default ShippingPolicyPage;