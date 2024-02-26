"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const FileUploader = () => {
  const [fileUrl, setFileUrl] = useState("");
  const [file, setFile] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
   
      setFile(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".svg"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex justify-center items-center flex-col cursor-pointer rounded-xl"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <>
          <div className="flex border justify-center p-5 lg:p-10 w-full">
            <img src={fileUrl} className="w-80 " />
          </div>
          <h2>Click or drag photo to replace</h2>
        </>
      ) : (
        <div className="py-6 rounded-xl flex flex-col justify-center items-center bg-slate-400 w-full">
          <h2>FILE UPLOAD SVG</h2>
          {/* width 96, height 77 */}
          <h3 className="mb-2 mt-6">Drag photo here</h3>
          <p className="mb-6">SVG, PNG, JPG</p>
          <button type="button" className="border p-2">
            Select from computer
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
