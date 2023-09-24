import {Product} from "@/models/Product";
import {mongooseConnect} from "@/lib/mongoose";

export default async function handle(req, res) {
    const {method} = req;
    //Kết nối data base
    await mongooseConnect();

    //Phương thức GET theo id product cụ thể
    if(method === 'GET'){
        if(req.query?.id) {
            //tìm sản phẩm theo id
            res.json(await Product.findOne({_id:req.query.id}));
        }else{
            //không có id thì trả về ds sản phẩm
            res.json(await Product.find());
        }
    }

    //Phương thức POST sản phẩm
    if(method === 'POST'){
        const{title,description,price,images} = req.body;
        const productDoc = await Product.create({
            title,description,price,images
        })
        //trả dữ liệu sau khi nhập
        res.json(productDoc);
    }

    //Phương thức PUT
    if (method === 'PUT') {
        const {title,description,price,images,_id} = req.body;
        await Product.updateOne({_id}, {title,description,price,images});
        res.json(true);
      }

    //Phương thức DELETE
    if(method === 'DELETE') {
        if(req.query?.id){
            await Product.deleteOne({_id:req.query?.id});
            res.json(true);
        }
    }
}