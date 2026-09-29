import React from "react";
import { useNavigate, useParams } from "react-router-dom";

function ProductInfo({ products }) {
    const navigate = useNavigate();
    const { productIndex } = useParams();
    const product = products?.[Number(productIndex)];

    if (!product) {
        return (
            <div className="p-8 text-center">
                <p>Product not found.</p>
                <button onClick={() => navigate("/")} className="text-blue-600 underline">
                    Back to products
                </button>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
        // onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto relative animate-fade-in-up"
            >
                    <button
                        onClick={() => { navigate("/") }}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-3xl z-10"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                    <div className="grid md:grid-cols-2 gap-0">
                        <div className="w-full h-64 md:h-full">
                            <img src={product.uploadImage} alt={product.itemName} className="w-full h-full object-cover md:rounded-l-xl" />
                        </div>
                        <div className="p-8 flex flex-col">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.itemName}</h2>
                            <p className="text-gray-500 mb-4">{product.catagary}</p>
                            <p className="text-4xl font-extrabold text-indigo-600 mb-6">₹{product.price}</p>
                            <p className="text-gray-700 leading-relaxed mb-6 flex-grow">{product.discription}</p>

                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                                <h4 className="font-semibold text-gray-800 mb-2">Seller Information</h4>
                                <p className="text-gray-700"><strong>Name:</strong> {product.sellername}</p>
                                <p className="text-gray-700 mt-1"><strong>Phone:</strong></p>
                                <div className="mt-4 space-y-3">
                                    <button
                                        onClick={() => { navigate(`/paymentMethod/${productIndex}`) }}
                                        className="block w-full text-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    >
                                        Buy Now
                                    </button>

                                    <a
                                        href={`tel:${product.phoneNumber}`}
                                        className="block w-full text-center bg-white text-green-600 border border-green-500 font-bold py-3 px-4 rounded-lg hover:bg-green-50 transition-colors"
                                    >
                                        Call {product.sellername}
                                    </a>
                                </div>
                                {/* <a href={`tel:${products.phoneNumber}`} className="block w-full text-center mt-2 bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors">
                                    Call {products.sellername}
                                </a> */}
                            </div>
                        </div>
                    </div>
            </div>
        </div>

    );
}

export default ProductInfo;