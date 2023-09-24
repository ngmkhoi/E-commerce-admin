import axios from "axios";
import {useRouter } from "next/router";
import { useState } from "react";

export default function ProductForm({
    //truyền các tham số vào function
    _id,
    title:existingTitle,
    description:existingDescription,
    price:existingPrice,
    images:existingImages,
}){
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || []);
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();
    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {
          title,description,price,images
        };
        if (_id) {
          //Edit sản phẩm dựa trên id được truyền vào
          await axios.put('/api/products', {...data,_id});
        } else {
          //Nếu k có id thành method POST
          await axios.post('/api/products', data);
        }
        setGoToProducts(true);
      }
      if (goToProducts) {
        router.push('/products');
      }
      //Function up ảnh sp
      async function uploadImages(ev) {
        const files = ev.target?.files;
        if(files?.length > 0){
          const data = new FormData();
          for(const file of files){
            data.append('file', file);
          }
          const res = await axios.post('/api/upload', data);
          //tạo mảng mới gồm ảnh cũ và mới
          setImages(oldImages => {
            return [...oldImages, ...res.data.links];
          });
          console.log(res.data);
        }
      }
    return(
            <form onSubmit={saveProduct}>
              {/* Nhập tên sản phẩm */}
            <label>Tên sản phẩm</label>
            <input type="text" placeholder="Nhập tên sản phẩm" 
            value={title} 
            onChange={ev => setTitle(ev.target.value)}/>

            {/* Thêm ảnh sản phẩm */}
            <label>
              Ảnh sản phẩm
            </label>
            <div className="mb-2 flex flex-wrap gap-2">
              {!!images?.length && images?.map(link => (
                <div key={link} className="h-24">
                  <img src={link} className="rounded-lg" alt=""/>
                </div>
              ))}
              <label className="w-24 h-24 text-center cursor-pointer flex items-center
               justify-center text-sm gap-1 text-gray-400 rounded-lg bg-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <div>Upload</div>
              <input type="file" onChange={uploadImages} className="hidden"/>
              </label>
            </div>
            
            {/* Thêm mô tả sản phẩm */}
            <label>Mô tả sản phẩm</label>
            <textarea type="text" placeholder="Nhập mô tả sản phẩm" 
            value={description} 
            onChange={ev => setDescription(ev.target.value)}/>

            {/* Thêm giá tiền sản phẩm */}
            <label>Giá tiền sản phẩm</label>
            <input type="number" placeholder="Nhập giá sản phẩm" 
            value={price} 
            onChange={ev => setPrice(ev.target.value)}/>

            <button type="submit" class="btn-primary ">Lưu sản phẩm</button>
            </form>
    )
}