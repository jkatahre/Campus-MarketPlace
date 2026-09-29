import React from 'react'
import { useNavigate } from 'react-router-dom'

function Card({ products }) {
  const navigate = useNavigate()
  if (!products || products.length === 0) {
    return (
      <div>
        <img className='mx-auto items-center' src="src/Assets/no-products.png" alt="No products" />
        <p className="text-center">No products listed yet!</p>
      </div>
      
    ) 
      
  }

  console.log(products)
  return (
    <div className='flex flex-wrap m-2'>

      {products.map((item, index) => (
        <div
          key={index}
          className='shadow-lg h-80 w-80 m-7 p-3 cursor-pointer'
          onClick={() => { navigate(`/productInfo/${index}`) }}>
          <div className="h-56 w-72 overflow-hidden rounded-md">
            <img className='' src={item.uploadImage} alt={item.itemName} />
          </div>
          <div>
            <h5>{item.itemName}</h5>
            <h4 className='text-blue-500'>Price: ₹{item.price}</h4>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Card
