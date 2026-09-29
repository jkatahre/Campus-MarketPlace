import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { uploadImageToCloudinary } from "../../utils/cloudinary";
import { useAuth } from "../../context/AuthContext";

function Form({ addProduct }) {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [itemName, setItemName] = useState("");
    const [catagary, setCatagary] = useState("");
    const [sellername, setSellerName] = useState(currentUser?.name || "");
    const [discription, setDiscription] = useState("");
    const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || "");
    const [price, setPrice] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const generateDescription = async () => {
        if (!itemName.trim() || !catagary.trim()) {
            setError("Enter the item name and category first to generate a description.");
            return;
        }

        setError("");
        setIsGenerating(true);
        try {
            const response = await fetch("/api/generate-description", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemName, category: catagary }),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(data.error || `Description generation failed (${response.status}).`);
            }
            setDiscription(data.description);
        } catch (generateError) {
            setError(generateError.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const ListItem = async (e) => {
        e.preventDefault();
        setError("");

        if (!itemName || !discription || !price || !catagary || !sellername || !phoneNumber || !imageFile) {
            setError("Please fill out all fields and upload an image.");
            return;
        }

        try {
            setIsUploading(true);
            const imageUrl = await uploadImageToCloudinary(imageFile);
            addProduct({
                itemName,
                discription,
                price,
                catagary,
                sellername,
                phoneNumber,
                uploadImage: imageUrl,
                sellerId: currentUser.id,
                sellerEnrollment: currentUser.enrollmentNumber,
                sellerAvatar: currentUser.avatarUrl
            });

            alert("Item listed successfully!");
            navigate("/");
        } catch (uploadError) {
            setError(uploadError.message);
        } finally {
            setIsUploading(false);
        }
    };

    const uploadImageHandler = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            if (file.size > 10 * 1024 * 1024) {
                setError("Please choose an image smaller than 10 MB.");
                e.target.value = "";
                return;
            }

            setImageFile(file);
            setError("");
        } else if (file) {
            setError("Please select a valid image file.");
            e.target.value = "";
        }
    };

    if (!currentUser) {
        return <Navigate to="/Login" state={{ from: "/Form", message: "Please log in to sell an item." }} replace />;
    }

    return (
        <>
            <div className="p-9 flex items-center justify-center">

                <form onSubmit={ListItem} className="shadow-lg m-10 w-4/12">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold font-mono">List Your Item</h2>
                    </div>
                    <div className="flex flex-col p-2 m-1">
                        <label className=" m-1" htmlFor="itemName"> Item Name</label>
                        <input
                        value={itemName}
                        onChange={(e)=> setItemName(e.target.value)}
                        className="border-2 border-black/65  m-1" id="itemName" type="text" placeholder=" enter your item name" />

                    </div>
                    <div className="flex flex-col p-2 m-1">
                        <label className=" m-1" htmlFor="catagry">Catagary</label>
                        <input
                        value={catagary}
                        onChange={(e)=> setCatagary(e.target.value)}
                        className="border-2 border-black/65  m-1" id="catagry" type="text" placeholder=" item catagry" />
                    </div>

                    <div className="flex flex-col p-2 m-1">
                        <label className=" m-1" htmlFor="discription">Discription</label>
                        <div className="flex justify-center items-center">
                            <textarea
                            value={discription}
                            onChange={(e)=> setDiscription(e.target.value)}
                            rows={3} id="discription" className="flex border-2 border-black/65 w-11/12 m-1 resize-none"></textarea>
                            <button
                            type="button"
                            onClick={generateDescription}
                            disabled={isGenerating}
                            title="Generate a description from the item name and category"
                            className="rounded-sm shadow-lg bg-slate-100 p-1 disabled:opacity-50" >
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isGenerating ? "animate-pulse" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                {isGenerating ? "..." : "AI"}
                            </button>

                        </div>

                    </div>

                    <div className="flex flex-col p-2 m-1">
                        <label className=" m-1" htmlFor="name"> Your Name</label>
                        <input 
                        value={sellername}
                        onChange={(e)=> setSellerName(e.target.value)}
                        className="border-2 border-black/65  m-1" id="name" type="text" placeholder=" enter your name" />
                    </div>

                    <div className="flex flex-col p-2 m-1">
                        <label className=" m-1" htmlFor="name">Phone Number</label>
                        <input 
                        value={phoneNumber}
                        onChange={(e)=> setPhoneNumber(e.target.value)}
                        className="border-2 border-black/65  m-1" id="name" type="tel" placeholder=" eg :-xxxxxxxxxx " />
                    </div>

                    <div className="flex flex-col p-2 m-1">
                        <label className=" m-1" htmlFor="name">Price (₹)</label>
                        <input 
                        value={price}
                        onChange={(e)=> setPrice(e.target.value)}
                        className="border-2 border-black/65  m-1" id="name" type="tel" inputMode="numeric" maxLength={10} placeholder=" eg :- xxx/-" />
                    </div>

                    <div className="flex flex-col p-2 m-1">
                        <div className="">
                            <label className=" m-1" htmlFor="uplodeImg"> Uplode image</label>
                        </div>
                        <div className="flex text-center justify-center">
                            <div className="flex-col w-32 sm:w-36 md:w-48 aspect-video border-2 border-dashed border-gray-400 flex items-center justify-center rounded-lg cursor-pointer">
                                <input 
                                accept="image/*"
                                onChange={uploadImageHandler}
                                type="file" className="inset-0 opacity-0 cursor-pointer" />
                                <div>
                                    <svg width="54px" height="54px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="m 4 1 c -1.644531 0 -3 1.355469 -3 3 v 1 h 1 v -1 c 0 -1.109375 0.890625 -2 2 -2 h 1 v -1 z m 2 0 v 1 h 4 v -1 z m 5 0 v 1 h 1 c 1.109375 0 2 0.890625 2 2 v 1 h 1 v -1 c 0 -1.644531 -1.355469 -3 -3 -3 z m -5 4 c -0.550781 0 -1 0.449219 -1 1 s 0.449219 1 1 1 s 1 -0.449219 1 -1 s -0.449219 -1 -1 -1 z m -5 1 v 4 h 1 v -4 z m 13 0 v 4 h 1 v -4 z m -4.5 2 l -2 2 l -1.5 -1 l -2 2 v 0.5 c 0 0.5 0.5 0.5 0.5 0.5 h 7 s 0.472656 -0.035156 0.5 -0.5 v -1 z m -8.5 3 v 1 c 0 1.644531 1.355469 3 3 3 h 1 v -1 h -1 c -1.109375 0 -2 -0.890625 -2 -2 v -1 z m 13 0 v 1 c 0 1.109375 -0.890625 2 -2 2 h -1 v 1 h 1 c 1.644531 0 3 -1.355469 3 -3 v -1 z m -8 3 v 1 h 4 v -1 z m 0 0" fill="#2e3434" fill-opacity="0.34902"></path> </g></svg>
                                </div>
                                <span className="text-gray-500 text-sm">{imageFile ? imageFile.name : "Upload"}</span>
                            </div>
                        </div>
                    </div>

                    {error && <p className="px-3 text-center text-red-600" role="alert">{error}</p>}

                    <div className="w-full h-full flex justify-center items-center">
                        <button
                         type="submit"
                         disabled={isUploading}
                         className="bg-blue-500 m-1 w-11/12 flex p-3 rounded-lg box-border justify-center disabled:opacity-50">
                            {isUploading ? "Uploading image..." : "List Item"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Form;