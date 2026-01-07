import axios from 'axios';
import { useEffect, useState } from 'react';

const API_URL = "https://jsonplaceholder.typicode.com/comments";
function Comments() {
    //Create a state to store the data from URL
    const[comments, setComments] = useState([]);
    
    //Create state to store the values from the input fields
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [body, setBody] = useState();

    //Create state to store the edit values
    const [editId, setEditId] =useState(null);

   
    //useEffect runs when the component is loaded
    useEffect( () => {
        axios.get(API_URL).then(res => {setComments(res.data.slice(0,5));}
    )
    },[]);
    
    //Function to Comment-Add new comments
    const addComments =() => {
        //Validate the values
        if(!name || !email || !body)
        {
            alert("Fields should not be empty...");
            return;
        }
        axios.post(API_URL, 
            {
                name,email,body,postID:1
            }
        )
        .then(res => {
            setComments([...comments,res.data]);

            setName("");
            setEmail("");
            setBody("");

            alert("Comment Added Successfully");
        } );
    };

    const startEdit =(comment) => {
        setEditId(comment.id);
        setName(comment.name);
        setEmail(comment.email);
        setBody(comment.body);
    };

    const UpdateComment = () => {
        axios.patch(`${API_URL}/${editId}`,
            {
            name,
            email,
            body,
            postID:1
    })
    .then(() => {
        setComments(
            comments.map(p => 
                p.id === editId ? {...p,name,email,body} : p
            )
        );
        alert("Comments Updated Successfully...")
    });
   
    };

    const cancelEdit =() => {
        setEditId(null);
        setName("");
        setBody("");
        setEmail("");
    };

    const deletePost = (id) =>{
        if(!window.confirm("Delete this comment?")) return;

        axios.delete(`${API_URL}/${id}`)
        .then(() => {
            setComments(comments.filter(p => p.id !== id));
            alert("Comments Deleted (Mock)");
        }
        );
    };
    return(
        <div>
            <h1>COMMENTS LIST</h1>
            <table className='table table-bordered'>
                <thead>
                    <td>Comments ID</td>
                    <td>Name</td>
                    <td>Email</td>
                    <td>Body</td>
                    <td>Action</td>
                </thead>
                <tbody>
                    {comments.map(comment=>(
                        <tr key={comment.id}>
                            <td>{comment.id}</td>
                            <td>{comment.name}</td>
                            <td>{comment.email}</td>
                            <td>{comment.body}</td>
                            <td>
                                <button className='btn btn-warning' onClick={() => startEdit(comment)}>Edit</button>{" "}
                                <button className='btn btn-danger' onClick={() => deletePost(comment.id)}>Delete</button>
                            </td>
                        </tr>
                    )

                    )}
                </tbody>
                <tfoot>
                    <tr>
                        <td></td>
                        <td>
                            <input className='form-control'
                            placeholder='Enter Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            />
                        </td>
                        <td>
                            <input className='form-control'
                            placeholder='Enter email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        </td>
                        <td>
                            <input className='form-control'
                            placeholder='Enter body'
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            />
                        </td>
                        <td>
                            {editId ? 
                            (
                                <>
                                <button className='btn btn-success' onClick={UpdateComment}>Update</button>
                                <button className='btn btn-danger' onClick={cancelEdit}>Cancel</button>
                                </>
                            )
                            :
                            (<button className='btn btn-primary' onClick={addComments}>Add</button>)
                            }
                        </td>
                       
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

export default Comments