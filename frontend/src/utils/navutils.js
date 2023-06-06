import { Route, Routes, useNavigate } from 'react-router-dom';

const Navigate = (path) => {
  const nav = useNavigate();
  nav({path});
}

export default Navigate;