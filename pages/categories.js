import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({swal}){
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);
    useEffect(() => {
       fetchCategories();
    },[]);
    function fetchCategories(){
        axios.get('/api/categories').then(result =>{
            setCategories(result.data);
        }); 
    }

    async function saveCategory(ev){
        ev.preventDefault();
        const data = {name,parentCategory};
        if(editedCategory){
            data._id = editedCategory._id;
            await axios.put('/api/categories', data)
            setEditedCategory(null);
        }else{
            await axios.post('/api/categories', data)
        }
        setName('');
        fetchCategories();
    }

    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
    }

    return(
        <Layout>
            <h1>Danh mục sản phẩm</h1>
            <label>
                {editedCategory ? `Chỉnh sửa danh mục ${editedCategory.name}` : 'Tạo danh mục sản phẩm'}
            </label>
            <form onSubmit={saveCategory} className="flex gap-1">
                <input className="mb-0" 
                type="text" 
                placeholder={'Loại sản phẩm'}
                onChange={ev => setName(ev.target.value)} 
                value={name}/>
                <select
                  className="mb-0"
                  onChange={ev => setParentCategory(ev.target.value)}
                  value={parentCategory}>
                    <option value="">Danh mục</option>
                    {categories.length > 0 && categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                </select>
                <button type='submit' className="btn-primary py-1">Lưu</button>
            </form>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Loại sản phẩm</td>
                        <td>Danh mục sản phẩm</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map
                    (category => (
                        <tr>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <td>
                                <button onClick={() => editCategory(category)} class="btn btn-primary mr-1">
                                    Chỉnh sửa
                                </button>
                                <button 
                                onClick={() => deleteCategory(category)}
                                class="btn btn-primary">
                                    Xoá
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}

export default withSwal(({swal}, ref) => (
    <Categories
        swal={swal}
    />
))