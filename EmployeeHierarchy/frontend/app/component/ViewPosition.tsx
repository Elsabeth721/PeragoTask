"use client"
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPositionsPagination } from '../api/positionApi';
import { keepPreviousData } from '@tanstack/react-query';

const PositionsList = () => {
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, error, isLoading } = useQuery({
    queryKey: ['positions', page],
    queryFn: () => fetchPositionsPagination(page, limit),
    placeholderData: keepPreviousData,
    retry: false, 
  });

  // console.log("Pagination Data:", data);
  // console.log("Total Pages:", data?.meta?.totalPages);
  // console.log("Current Page:", page);
  // console.log("Data Length:", data?.data?.length);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Positions</h2>
      <ul>
        {data && data.data.map((pos) => (
          <li key={pos.id}>{pos.name}</li>
        ))}
      </ul>

      <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
      <span> Page {page} of {data && data.meta.totalPages} </span>
      <button 
        disabled={page >= (data?.meta?.totalPages || 1)}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default PositionsList;