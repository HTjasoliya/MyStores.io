import { useState, useEffect } from "react";

const Categories = ({ className }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));

  // this is for fetch categories
  useEffect(() => {
    fetch('http://localhost:3001/categories')
      .then(res => res.json())
      .then(data => setCategories(data.slice(0, 10))); 
  }, []);
  
  useEffect(() => {
    const handleUrlChange = () => setSearchParams(new URLSearchParams(window.location.search));
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // function for handle cetegories
  const handleCategory = (catId) => {
    const params = new URLSearchParams(window.location.search);
    if (catId === selectedCategory) {
      params.delete('cats');
      setSelectedCategory('');
      // console.log('catId----',catId)
    } else {
      params.set('cats', catId);
      setSelectedCategory(catId);
      // console.log('catId----',catId)
    }
    window.history.pushState({}, '', `?${params.toString()}`);
    window.dispatchEvent(new Event('urlUpdate'));
  };

  return (
    <div className={`${className} h-fit p-4 border-[1px] border-slate-500 rounded-xl mt-[10px] m-2`}>
      <div className="p-4">
        <h2 className="text-lg font-bold text-slate-800 mb-5 border-b-[1px] border-slate-400">Categories</h2>
        <div className="flex flex-col gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategory(category.id)}
              className={`text-left p-2 rounded ${
                selectedCategory === category.id
                  ? 'bg-gray-500 '
                  : 'hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;