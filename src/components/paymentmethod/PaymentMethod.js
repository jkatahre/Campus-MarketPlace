import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function PaymentMethod({ products }) {
    const navigate = useNavigate();
    const { productIndex } = useParams();
    const product = products?.[Number(productIndex)];
    const [method, setMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!product) {
        return (
            <div className="p-8 text-center">
                <p>Product not found.</p>
                <button onClick={() => navigate('/')} className="text-blue-600 underline">Back to products</button>
            </div>
        );
    }

    const handlePayment = (event) => {
        event.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex justify-center items-center p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Checkout</h2>
                        <p className="text-sm text-gray-500">Secure Payment</p>
                    </div>
                    <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600" aria-label="Close checkout">Close</button>
                </div>

                <div className="px-6 py-4 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded overflow-hidden bg-white border border-gray-200">
                            <img src={product.uploadImage} alt={product.itemName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 line-clamp-1">{product.itemName}</p>
                            <p className="text-xs text-gray-500">{product.catagary}</p>
                        </div>
                    </div>
                    <p className="text-xl font-bold text-indigo-700">₹{product.price}</p>
                </div>

                <div className="p-6 overflow-y-auto">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Select Payment Method</p>
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {['card', 'upi', 'cash'].map((paymentMethod) => (
                            <button key={paymentMethod} type="button" onClick={() => setMethod(paymentMethod)} className={`py-2 px-1 text-sm font-medium rounded-lg border ${method === paymentMethod ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600'}`}>
                                {paymentMethod.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handlePayment} className="space-y-4">
                        {method === 'card' && (
                            <div className="space-y-3">
                                <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="MM/YY" className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                                    <input type="password" placeholder="CVV" className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                                </div>
                                <input type="text" placeholder="Card Holder Name" className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                            </div>
                        )}
                        {method === 'upi' && (
                            <input type="text" placeholder="username@okhdfcbank" className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                        )}
                        {method === 'cash' && (
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                                <h4 className="font-semibold text-gray-800">Cash on Pickup</h4>
                                <p className="text-sm text-gray-600 mt-1">Please pay ₹{product.price} directly to {product.sellername} when you meet.</p>
                            </div>
                        )}
                        <button type="submit" disabled={isProcessing || isSuccess} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed">
                            {isProcessing ? 'Processing...' : isSuccess ? 'Payment Confirmed' : method === 'cash' ? 'Confirm Order' : `Pay ₹${product.price}`}
                        </button>
                    </form>
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 text-center"><p className="text-xs text-gray-400">Payments are secure and encrypted.</p></div>
            </div>
        </div>
    );
}

export default PaymentMethod;
