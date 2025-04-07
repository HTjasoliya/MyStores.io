import React, { useEffect, useState } from "react";

const AllStores = ({ className }) => {

  const [stores, setStores] = useState([])
  const [inputValue, setInputValue] = useState()
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search))
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites')) || {};
    } catch {
      return {};
    }
  });

  // function for fetch stores data from api
  const fetchStores = async () => {
    try {

      const params = new URLSearchParams(searchParams)
      params.set('_page', page)
      params.set('_limit', 10)

      const res = await fetch(`http://localhost:3001/stores?${params.toString()}`)
      const data = await res.json()

      // console.log('data---', data)
      console.log('data---', params, res)

      setStores(prev => page === 1 ? data : [...prev, ...data])
      setHasMore(data.length === 10)

    } catch (error) {
      console.error('Error fetching stores:', error);
    }

  }



  // Handle URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      setSearchParams(new URLSearchParams(window.location.search));
      setPage(1);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('urlUpdate', handleUrlChange);
  }, []);

  // funtion for Infinite scroll 
  useEffect(() => {
    const handleScroll = () => {
      if (hasMore &&
        window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
        setPage(prev => prev + 1);
      }

    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore]);


  useEffect(() => {
    fetchStores()
  }, [page, searchParams])

  // function for update parameter
  const updateParams = (updates) => {
    const params = new URLSearchParams(window.location.search)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    window.history.pushState({}, '', `?${params.toString()}`);
    window.dispatchEvent(new Event('urlUpdate'));
  }

  // function for Search hendle 
  const handleSearch = (e) => {
    setInputValue(e.target.value)
    updateParams({ name_like: e.target.value || '' });
  };


  // shop status filter handler
  const handleStatusFilter = (status) => {
    const currentStatus = searchParams.get('status');
    updateParams({ status: currentStatus === status ? '' : status });
  };

  // function for handle short
  const handleSort = (e) => {
    const sortValue = e.target.value;
    updateParams({ _sort: sortValue });
  };

  // 3 filter handler (cashback, promoted, sharable)
  const ckeckFilter = (flt) => {
    const currentValue = searchParams.get(flt);
    updateParams({ [flt]: currentValue === '1' ? '' : '1' });
  };

  // function for alphabet filter
  const handleAlphabetFilter = (ltr) => {
    // console.log('ltr-------',ltr)
    const curruntParam = searchParams.get('name_like')
    const newValue = curruntParam === `^${ltr}` ? '' : `^${ltr}`
    console.log('newValue-----', newValue)
    updateParams({ name_like: newValue });
  }


  // functin for set favorite button
  const toggleFavorite = (storeId) => {
    const newFavorites = { ...favorites };
    newFavorites[storeId] = !newFavorites[storeId];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  // function for display cashback info
  const getCashBack = (store) => {
    if (!store.cashback_enabled) {
      return "no Cashback awailable"
    }

    const amount = parseFloat(store.cashback_amount).toFixed(2)
    let text = store.rate_type === "upto" ? "Up to" : "Flat"

    if (store.amount_type == "fixed") {
      text += ` ${amount}$`
    } else if (store.amount_type == "percent") {
      text += ` ${amount}%`
    }

    return `${text} Cashback`
  }

  // Get current filter states
  const currentSort = searchParams.get('_sort') || '';
  const currentStatus = searchParams.get('status') || '';
  const currentLetter = searchParams.get('name_like')?.replace('^', '') || '';

  return (<>
    <div className={`${className} h-fit min-h-[] p-4 border-[1px] border-slate-600 rounded-xl mt-[10px] m-2`}>
      <div className="p-4">
        <h2 className="text-lg font-bold text-slate-800 mb-5 border-b-[1px] border-slate-400">Stores</h2>

        <input
          type="text"
          placeholder="Search stores..."
          className="w-full p-2 border rounded mb-4"
          value={inputValue}
          onChange={handleSearch}
        />
        {/* <input
          type="text"
          placeholder="Search stores..."
          className="w-full p-2 border rounded mb-4"
          value={searchParams.get('name_like')?.replace('^', '') || ''}
          onChange={handleSearch}
        /> */}

        <div className="flex gap-2 items-center mb-2">
          <p className="font-bold text-slate-700">Status: </p>
          {['publish', 'draft', 'trash'].map(status => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`px-3 py-1 rounded capitalize ${currentStatus === status
                ? 'bg-slate-900 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
                }`}
            >
              {status}
            </button>
          ))}

          <div className="pl-5 ml-5 border-l">
            <select
              className="p-2 border rounded "
              value={currentSort}
              onChange={handleSort}
            >
              <option value="">Sort By</option>
              <option value="name">Name</option>
              <option value="featured">Featured</option>
              <option value="clicks">Popularity</option>
              <option value="cashback_amount">Cashback</option>
            </select>
          </div>
        </div>


        <div className="flex flex-wrap gap-4 mb-2">
          {['cashback_enabled', 'is_promoted', 'is_sharable'].map(filter => (
            <button
              key={filter}
              onClick={() => ckeckFilter(filter)}
              className={`px-3 py-1 rounded ${searchParams.get(filter) === '1'
                ? 'bg-slate-900 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
                }`}
            >
              {filter.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
          {[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map(letter => (
            <button
              key={letter}
              onClick={() => handleAlphabetFilter(letter)}
              className={`w-8 h-8 rounded ${currentLetter === letter
                ? 'bg-slate-700 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
                }`}
            >
              {letter}
            </button>
          ))}
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
          {
            stores.map((store => (
              <div
                key={store.id}
                className="border rounded-lg cursor-pointer p-4 relative"
                onClick={() => window.open(store.homepage, '_blank')}
              >

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(store.id);
                  }}
                  className="absolute top-2 right-2 p-2 hover:scale-110 "
                >
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="26" height="26" viewBox="0 0 48 48">
                    {favorites[store.id] ? <path fill="#575656" d="M37,43l-13-6l-13,6V9c0-2.2,1.8-4,4-4h18c2.2,0,4,1.8,4,4V43z"></path> :
                      <path fill="#ccc" d="M37,43l-13-6l-13,6V9c0-2.2,1.8-4,4-4h18c2.2,0,4,1.8,4,4V43z"></path>}
                  </svg>
                </button>

                <div className="w-full h-24 mb-4 flex items-center justify-center rounded-lg">
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="max-h-20 max-w-[160px] object-contain" />
                </div>
                <div className="h-20 flex flex-col items-center justify-center bg-slate-200 rounded-lg">
                  <h3 className="text-base font-bold mb-2 text-center">{store.name}</h3>
                  <p className="text-center text-sm text-gray-600 mb-2">
                    {getCashBack(store)}
                  </p>
                </div>



              </div>
            )))
          }

        </div>
        {!hasMore && (
          <div className="text-center text-gray-500 py-4">
            No more stores to load
          </div>
        )}
      </div>
    </div>

  </>);
};

export default AllStores;
