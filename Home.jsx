import React, { useState, useEffect } from 'react';  
import './Home.css';  
import axios from 'axios';  

function Home() {  
  const [popup, setPopup] = useState(false);  
  const [notes, setNotes] = useState([]);  
  
  const [Details, setDetails] = useState({  
    id: '',  
    title: '',  
    description: ''  
  });  
  
  const [isEditing, setIsEditing] = useState(false);  
  
  useEffect(() => {  
    fetchNotes();  
  }, []);  
  
  async function fetchNotes() {  
    const response = await axios.get(  
      'http://localhost:5000/notes',  
      {  
        headers: {  
          Authorization: `Bearer ${localStorage.getItem("token")}`  
        }  
      }  
    );  
  
    console.log('Notes fetched:', response.data);  
  
    setNotes(response.data);  
  }  
  
  function handleClick() {  
    setDetails({  
      id: '',  
      title: '',  
      description: ''  
    });  
  
    setIsEditing(false);  
    setPopup(true);  
  }  
  
  function handleChange(event) {  
    const { name, value } = event.target;  
  
    setDetails((prev) => ({  
      ...prev,  
      [name]: value  
    }));  
  }  
  
  async function handleClickSubmit(event) {  
    event.preventDefault();  
  
    console.log('Submit clicked');  
    console.log('Details:', Details);  
  
    if (!Details.title.trim() || !Details.description.trim()) {  
      console.log('Title or description is empty');  
      return;  
    }  
  
    if (isEditing) {  
      const response = await axios.put(  
        `http://localhost:5000/note/${Details.id}`,  
        {  
          title: Details.title,  
          description: Details.description  
        },  
        {  
          headers: {  
            Authorization: `Bearer ${localStorage.getItem("token")}`  
          }  
        }  
      );  
  
      console.log('Update response:', response.data);  
  
    } else {  
      const response = await axios.post(  
        'http://localhost:5000/notes',  
        {  
          title: Details.title,  
          description: Details.description  
        },  
        {  
          headers: {  
            Authorization: `Bearer ${localStorage.getItem("token")}`  
          }  
        }  
      );  
  
      console.log('Add response:', response.data);  
    }  
  
    await fetchNotes();  
  
    setDetails({  
      id: '',  
      title: '',  
      description: ''  
    });  
  
    setIsEditing(false);  
    setPopup(false);  
  }  
  
  async function deleteNote(id) {  
    const response = await axios.delete(  
      `http://localhost:5000/note/${id}`,  
      {  
        headers: {  
          Authorization: `Bearer ${localStorage.getItem("token")}`  
        }  
      }  
    );  
  
    console.log('Delete response:', response.data);  
  
    await fetchNotes();  
  }  
  
  function editNote(note) {  
    setDetails({  
      id: note.id,  
      title: note.title,  
      description: note.description  
    });  
  
    setIsEditing(true);  
    setPopup(true);  
  }  
  
  function closePopup() {  
    setPopup(false);  
  
    setDetails({  
      id: '',  
      title: '',  
      description: ''  
    });  
  
    setIsEditing(false);  
  }  
  
  return (  
    <div className="HomePage">  
  
      <div className="action-bar">  
        <button  
          className="create-btn"  
          onClick={handleClick}  
        >  
          Add Note  
        </button>  
      </div>  
  
      <div className="notes-container">  
        {notes.map((note) => (  
          <div  
            className="card"  
            key={note.id}  
          >  
            <h3 className="card-title">  
              {note.title}  
            </h3>  
  
            <p className="card-description">  
              {note.description}  
            </p>  
  
            <div className="card-buttons">  
  
              <button  
                className="edit-btn"  
                onClick={() => editNote(note)}  
              >  
                Edit  
              </button>  
  
              <button  
                className="delete-btn"  
                onClick={() => deleteNote(note.id)}  
              >  
                Delete  
              </button>  
  
            </div>  
          </div>  
        ))}  
      </div>  
  
      {popup && (  
        <div className="Home-Overlay">  
  
          <div className="Form">  
  
            <button  
              className="Close-Button"  
              onClick={closePopup}  
            >  
              &times;  
            </button>  
  
            <form  
              className="Note-Form"  
              onSubmit={handleClickSubmit}  
            >  
  
              <h2>  
                {isEditing ? 'Edit Note' : 'Add New Note'}  
              </h2>  
  
              <input  
                type="text"  
                placeholder="Title"  
                name="title"  
                value={Details.title}  
                onChange={handleChange}  
                required  
              />  
  
              <input  
                type="text"  
                placeholder="Description"  
                name="description"  
                value={Details.description}  
                onChange={handleChange}  
                required  
              />  
  
              <button  
                type="submit"  
                className="submit-btn"  
              >  
                {isEditing ? 'Update' : 'Submit'}  
              </button>  
  
            </form>  
  
          </div>  
  
        </div>  
      )}  
  
    </div>  
  );  
}  
  
export default Home;  
      