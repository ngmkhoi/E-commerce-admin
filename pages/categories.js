import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";
import handle from "./api/categories";
import { set } from "mongoose";

function Categories({swal}){
    const [editedCategory, setEditedCategory] = useState(null);
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([]);

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
        const data = {
            name,
            parentCategory,
            properties:properties.map(p=> ({
                name:p.name,
                value:p.value.split(',')
            })),
        };
        if(editedCategory){
            data._id = editedCategory._id;
            await axios.put('/api/categories', data)
            setEditedCategory(null);
        }else{
            await axios.post('/api/categories', data)
        }
        setName('');
        setParentCategory('');
        setProperties([]); 
        fetchCategories();
    }

    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(
            categories.properties.map(({name,values}) => ({
            name,
            values:values.join(',')
            }))
            );
    }

    function deleteCategory(category){
        swal.fire({
          title: 'Xoá danh mục',
          text: `Bạn có muốn xoá ${category.name}?`,
          showCancelButton: true,
          cancelButtonText: 'Huỷ',
          confirmButtonText: 'Đồng ý',
          confirmButtonColor: 'blue',
          reverseButtons: true,
        }).then(async result => {
          if (result.isConfirmed) {
            const {_id} = category;
            await axios.delete('/api/categories?_id='+_id);
            fetchCategories();
          }
        });
      }
    
    function addProperty(){
        setProperties(prev => {
            return [...prev, {name: '', values: ''}];
        });
    }

    function handlePropertyNameChange(property,index, newName){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        });
    }

    function handlePropertyValuesChange(property,index, newValues){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        });
    }

    function removeProperty(indexToRemove){
        setProperties(prev => {
            return [...prev].filter((p,pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    }

    return(
        <Layout>
            <h1>Danh mục sản phẩm</h1>
            <label>
                {editedCategory ? `Chỉnh sửa danh mục ${editedCategory.name}` : 'Tạo danh mục sản phẩm'}
            </label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input
                    type="text" 
                    placeholder={'Loại sản phẩm'}
                    onChange={ev => setName(ev.target.value)} 
                    value={name}/>
                    <select
                    onChange={ev => setParentCategory(ev.target.value)}
                    value={parentCategory}>
                        <option value="">Danh mục</option>
                        {categories.length > 0 && categories.map(category => (
                        <option key={category._id} value={category._id}>{category.name}</option>
                            ))}
                    </select>
                </div>

                <div className="mb-2">
                    <label className="block">Thuộc tính sản phẩm</label>
                    <button 
                    onClick={addProperty}
                    type="button" 
                    className="btn-primary text-sm mb-2">Thêm thuộc tính</button>
                    {properties.length > 0 && properties.map((property,index) => (
                        <div className='flex gap-1 mb-2'>
                            <input 
                            type="text" 
                            value={property.name} 
                            className="mb-0"
                            onChange={ev => handlePropertyNameChange(index ,property, ev.target.value)}
                            placeholder="Thuộc tính sản phẩm(vd: màu)"/>
                            <input 
                            type="text" 
                            value={property.values}
                            className="mb-0"
                            onChange={ev => handlePropertyValuesChange(index,property, ev.target.value)} 
                            placeholder="Giá trị sản phẩm"/>
                            <button 
                            onClick={() => removeProperty(index)}
                            type="button" 
                            className="btn-default">
                                Xoá
                            </button>
                        </div>
                    ))}
                </div>  
                
                <div className="flex gap-1">
                    {editedCategory && (
                        <button 
                        type="button"
                        className="btn-default"
                        onClick={() => {
                        setEditedCategory(null);
                        setName('');
                        setParentCategory('');
                        setProperties([]);
                        }}
                        >
                        Huỷ
                        </button>
                    )}
                    <button 
                    type='submit' 
                    className="btn-primary py-1">Lưu
                    </button>
                </div>

            </form>
            {!editedCategory && (
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
            )}
        </Layout>
    );
}

export default withSwal(({swal}, ref) => (
    <Categories
        swal={swal}
    />
))