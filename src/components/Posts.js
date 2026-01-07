import axios from 'axios';
import { useEffect, useState } from "react"
import 'bootstrap/dist/css/bootstrap.min.css';

//Mock API URL
const API_URL = "https://jsonplaceholder.typicode.com/posts"
function Posts() {
    //Create a state to store the data from URL
    const[posts, setPosts] = useState([]);

    //Create state to store the values from the input fields
    const [title , setTitle] = useState("");
    const [body, setBody] = useState();

    //Create state to store the edit values
    const [editId,setEditId]=useState(null);

//useeffect runs when the component is loaded
    useEffect( () => {
        axios.get(API_URL).then(res => {setPosts(res.data.slice(0,5));}
    )
    },[]);

    //Function to POST - Add new post
    const addPost =() => {
        //Validate the values
        if(!title || !body){
            alert("Fields should not be empty.....");
            return;
        }
        //Send the data to URL
        axios.post(API_URL,
            {
                title, body, userId:1
            }
        )
        .then(res=>{
            setPosts([...posts,res.data]);

            //Clear the form input fields
            setTitle("");
            setBody("");

            alert("Post Added Successfully...");
        });
    };

    //Start Edit Function
    const startEdit = (post) => {
        //To store the selected id
        setEditId(post.id);
        //Fill the input fields with the selected id
        setTitle(post.title);
        setBody(post.body);

    };

    //Update posts - PUT Operation
    const UpdatePost = () =>{
          axios.patch(`${API_URL}/${editId}`,{
            title,body,userId:1
          })
          .then(() => {
            setPosts(
                posts.map(p => 
                    p.id === editId ? {...p,title,body} : p
                )
            );
            alert("Post Updated Successfully...")
          });
          cancelEdit();
          alert("Post Updated (Mock)");
    };

    //Function to cancelEdit
    const cancelEdit = () => {
        setEditId(null);
        setTitle("");
        setBody("");
    };

    //Function to Delete the Post
    const deletePost =(id) => {
        if(!window.confirm("Delete this post?")) return;

        axios.delete(`${API_URL}/${id}`)
        .then(() =>{
            setPosts(posts.filter(p => p.id !== id));
            alert("Post Deleted (Mock)");
        }
        );
    };
    return(
            <div>
            <h1>POST LIST</h1>
            <table className='table table-bordered'>
                <thead>
                    
                        <td>User ID</td>
                        <td>Title</td>
                        <td>Body</td> 
                        <td>Action</td>
                </thead>
                <tbody>
                    {posts.map(post => (
                        <tr key={post.id}>
                            <td>{post.id}</td>
                            <td>{post.title}</td>
                            <td>{post.body}</td>
                            <td>
                                <button className='btn btn-warning' onClick={() => startEdit(post)}>Edit</button>{" "}
                                <button className='btn btn-danger' onClick={() => deletePost(post.id)} >Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td></td>
                        <td>
                            <input className='form-control' 
                            placeholder='Enter Title'  
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)}
                            />
                        </td>
                         <td>
                            <input className='form-control' 
                            placeholder='Enter Body' 
                            value={body}
                            onChange={(e)=> setBody(e.target.value)} 
                            />
                        </td>
                        <td>
                           {editId ? 
                           (
                           <>
                              <button className='btn btn-success' onClick={UpdatePost} >Update</button>
                              <button className='btn btn-danger' onClick={cancelEdit}>Cancel</button>
                           </>
                           ) 
                           : 
                           ( <button className='btn btn-primary' onClick={addPost}>Add</button>)}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

export default Posts