import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaStar, FaClock, FaFire, FaUsers } from 'react-icons/fa'

const Recipes = () => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await axios.get('https://dummyjson.com/recipes?limit=12', {
          signal: controller.signal
        })
        setRecipes(res.data.recipes)
        setError(null)
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError('Failed to load recipes. Please try again.')
          console.error(err)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    return () => controller.abort()
  }, [])

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center bg-light" style={{minHeight: '100vh'}}>
      <div className="text-center">
        <div className="spinner-border text-warning" style={{width: '3rem', height: '3rem'}} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading delicious recipes...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="container py-5">
      <div className="alert alert-danger text-center">{error}</div>
    </div>
  )

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold">🍳 Recipe Collection</h1>
          <p className="text-muted lead">Click any recipe to view full details</p>
        </div>

        {/* Recipe Cards Grid */}
        <div className="row g-4">
          {recipes.map((rec) => (
            <div className="col-xl-3 col-lg-4 col-md-6" key={rec.id}>
              <div 
                className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden recipe-card"
                style={{cursor: 'pointer', transition: 'all 0.3s ease'}}
                onClick={() => setSelectedRecipe(rec)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Image for every recipe */}
                <div className="position-relative">
                  <img 
                    src={rec.image} 
                    className="card-img-top" 
                    alt={rec.name}
                    style={{height: '220px', objectFit: 'cover'}}
                  />
                  <span className="badge bg-dark position-absolute top-0 end-0 m-2 fs-6">
                    <FaStar className="text-warning me-1" size={12} />
                    {rec.rating}
                  </span>
                  <span className="badge bg-white text-dark position-absolute bottom-0 start-0 m-2">
                    {rec.difficulty}
                  </span>
                </div>
                
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold mb-2">{rec.name}</h5>
                  
                  <div className="mb-2">
                    {rec.mealType.map((type, idx) => (
                      <span key={idx} className="badge bg-warning-subtle text-warning-emphasis me-1 mb-1">
                        {type}
                      </span>
                    ))}
                  </div>

                  <div className="d-flex justify-content-between text-muted small mt-auto pt-2">
                    <span><FaClock className="me-1" />{rec.prepTimeMinutes + rec.cookTimeMinutes} min</span>
                    <span><FaUsers className="me-1" />{rec.servings}</span>
                    <span><FaFire className="me-1" />{rec.caloriesPerServing} cal</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal with full recipe details + image */}
        {selectedRecipe && (
          <>
            <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
              <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content border-0 rounded-4">
                  <div className="modal-header border-0 pb-0">
                    <h3 className="modal-title fw-bold">{selectedRecipe.name}</h3>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setSelectedRecipe(null)}
                    ></button>
                  </div>
                  
                  {/* Large image in modal */}
                  <img 
                    src={selectedRecipe.image} 
                    className="w-100" 
                    alt={selectedRecipe.name}
                    style={{maxHeight: '350px', objectFit: 'cover'}}
                  />
                  
                  <div className="modal-body p-4">
                    <div className="d-flex flex-wrap gap-2 mb-4">
                      <span className="badge bg-warning text-dark fs-6 px-3 py-2">
                        <FaStar className="me-1" /> {selectedRecipe.rating} Rating
                      </span>
                      <span className="badge bg-primary fs-6 px-3 py-2">
                        <FaClock className="me-1" /> {selectedRecipe.prepTimeMinutes + selectedRecipe.cookTimeMinutes} min
                      </span>
                      <span className="badge bg-success fs-6 px-3 py-2">
                        <FaUsers className="me-1" /> Serves {selectedRecipe.servings}
                      </span>
                      <span className="badge bg-danger fs-6 px-3 py-2">
                        <FaFire className="me-1" /> {selectedRecipe.caloriesPerServing} cal
                      </span>
                    </div>

                    <div className="mb-3">
                      {selectedRecipe.tags.map((tag, idx) => (
                        <span key={idx} className="badge bg-secondary-subtle text-secondary-emphasis me-2 mb-2">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="row g-4">
                      <div className="col-md-5">
                        <h5 className="fw-bold text-primary mb-3">Ingredients</h5>
                        <ul className="list-group list-group-flush">
                          {selectedRecipe.ingredients.map((ing, idx) => (
                            <li key={idx} className="list-group-item px-0 py-2 border-0">
                              <span className="text-primary me-2">•</span>{ing}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="col-md-7">
                        <h5 className="fw-bold text-primary mb-3">Instructions</h5>
                        <ol className="ps-3">
                          {selectedRecipe.instructions.map((step, idx) => (
                            <li key={idx} className="mb-3">{step}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Recipes