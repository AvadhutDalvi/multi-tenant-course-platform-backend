import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await api.post("/course/create", {
        title,
        description,
        price,
      });

      navigate("/dashboard/educator/my-courses");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Create Course</h1>

      <form onSubmit={handleCreate} className="space-y-6 max-w-lg">
        <input
          type="text"
          placeholder="Course Title"
          className="w-full p-3 border rounded-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          className="w-full p-3 border rounded-lg"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full p-3 border rounded-lg"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateCourse;