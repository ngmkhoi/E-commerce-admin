import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductFrom";
import axios from "axios";
import {useRouter } from "next/router";
import { useState } from "react";

export default function NewProduct(){
    return (
        //Gọi lại Layout từ components tái sử dụng code
        <Layout>
            <h1>Thêm sản phẩm mới!</h1>
            <ProductForm/>
        </Layout>
    )
}