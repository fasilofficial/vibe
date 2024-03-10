"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { useSelector, useDispatch } from "react-redux";
import {
  useEditPostMutation,
  useGetPostMutation,
} from "@/redux/slices/post/postApiSlice";
import { updatePost } from "@/redux/slices/data/dataSlice";

const page = ({ params: { postId } }) => {
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState("");

  //   const [image, setImage] = useState(null);
  //   const [imageUrl, setImageUrl] = useState();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLocationListVisible, setIsLocationListVisible] = useState(false);

  const [editPost] = useEditPostMutation();
  const [getPost] = useGetPostMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEditPost = async () => {
      const res = await getPost(postId).unwrap();

      setCaption(res.data.caption);
      setLocation(res.data.location);
      setTags(res.data.tags.toString());

      //   setImageUrl(data.imageUrl);
    };

    fetchEditPost();
  }, []);

  //   const handleImageChange = (e) => {
  //     const file = e.target.files[0];
  //     setImage(file);
  //   };

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

    const newPost = {
      caption,
      location,
      tags: tags.split(",").map((tag) => tag.toLowerCase().trim()),
    };

    try {
      const res = await editPost({ newPost, postId }).unwrap();
      if (res.data) {
        dispatch(updatePost({ postId, updatedPost: res.data }));
        toast.success(res?.message);
      }
    } catch (error) {
      console.error("Error editing post:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
      router.push("/profile");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4"
    >
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
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline"
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
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {loading ? "Uploading..." : "Submit"}
      </button>
      <Link
        href="/profile"
        className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Back
      </Link>
    </form>
  );
};

export default page;
