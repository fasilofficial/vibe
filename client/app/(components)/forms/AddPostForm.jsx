"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";

import { useSelector, useDispatch } from "react-redux";
import {
  useAddCommentMutation,
  useAddPostMutation,
} from "@/app/(redux)/slices/post/postApiSlice";
// import { setPost } from "@/app/(redux)/slices/data/dataSlice";

const AddPostForm = () => {
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLocationListVisible, setIsLocationListVisible] = useState(false);

  const [addPost] = useAddPostMutation();

  const { userInfo } = useSelector((state) => state.auth);

  // const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleLocationChange = async (e) => {
    const locationQuery = e.target.value;
    setLocation(locationQuery);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${locationQuery}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await response.json();

      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!caption || !location || !tags || !image) {
      toast.error("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "z0o48jjp");
    formData.append("cloud_name", "fasils");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/fasils/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      const imageUrl = data.secure_url;

      const newPost = {
        caption,
        location,
        tags: tags.split(",").map((tag) => tag.toLowerCase().trim()),
        imageUrl,
        creator: userInfo._id,
      };

      const res = await addPost(newPost).unwrap();

      console.log(res);

      // dispatch(setPost(res));

      setLoading(false);

      router.push("/");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4"
    >
      <Toaster />
      <div className="mb-4">
        <label
          htmlFor="caption"
          className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
        >
          Caption:
        </label>
        <input
          type="text"
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="dark:bg-gray-600 dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="location"
          className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
        >
          Location:
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={handleLocationChange}
          onFocus={() => setIsLocationListVisible(true)}
          onBlur={() => setIsLocationListVisible(false)}
          autoComplete="false"
          className="dark:bg-gray-600 dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none focus:shadow-outline"
        />
        {isLocationListVisible && (
          <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-4/6">
            {locations.slice(0, 4).map((location) => (
              <li
                key={location.place_id}
                onClick={() => handleLocationSelect(location)}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
              >
                {location.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="tags"
          className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
        >
          Tags:
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="dark:bg-gray-600 dark:text-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="image"
          className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
        >
          Image:
        </label>
        <input
          type="file"
          id="image"
          onChange={handleImageChange}
          className="dark:bg-gray-600 dark:text-white appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />

        <img
          src={
            image
              ? URL.createObjectURL(image)
              : "https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg"
          }
          alt="Selected"
          className="mt-2"
          style={{ maxWidth: "200px", maxHeight: "200px" }}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {loading ? "Uploading..." : "Submit"}
      </button>
    </form>
  );
};

export default AddPostForm;
