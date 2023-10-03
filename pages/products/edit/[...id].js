import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductFrom";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductPage(){
    const [productInfo, setProductInfo] = useState(null);
    const router = useRouter();
    const {id} = router.query;
    useEffect(() => {
        if(!id){
            return;
        }
        //Lấy và trả data sản phẩm theo ID sản phẩm
        axios.get('/api/products?id='+id).then(response => {
            setProductInfo(response.data);
        });
    }, [id]);
    return(
        <Layout>
            <h1>Chỉnh sửa sản phẩm</h1>
            {/* //If productInfo được tải lên thì mới hiển thị form */}
            {productInfo && (
            <ProductForm {...productInfo}/>
            )}
        </Layout>
    );
}